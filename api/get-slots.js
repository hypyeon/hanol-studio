import { SquareClient, SquareEnvironment } from 'square';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default async function handler(req, res) {
  const token = process.env.SQ_ACCESS_TOKEN;

  const locationId = process.env.SQ_LOCATION_ID;

  if (!token || !locationId) {
    return res.status(500).json({ 
      error: "Missing Credentials",
      help: "Check your SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in .env.local" 
    });
  }

  const serviceId = req.query.serviceId || req.body.serviceId;
  if (!serviceId) {
    return res.status(400).json({ error: "Missing serviceId in request body" });
  }

  const client = new SquareClient({
    token: token, 
    environment: SquareEnvironment.Sandbox,
  });

  try {
    let allAvailabilities = [];
    let startAt = new Date();

    // Loop 3 times to cover 3 months (~90 days), fetching 30 days per loop
    for (let i = 0; i < 3; i++) {
      const endAt = new Date(startAt);
      endAt.setDate(endAt.getDate() + 30);

      const response = await client.bookings.searchAvailability({
        query: {
          filter: {
            locationId: locationId,
            segmentFilters: [{ serviceVariationId: serviceId }],
            startAtRange: {
              startAt: startAt.toISOString(),
              endAt: endAt.toISOString()
            }
          }
        }
      });

      if (response.availabilities) {
        allAvailabilities = [...allAvailabilities, ...response.availabilities];
      }

      // Move the start window for the next loop
      startAt = new Date(endAt);
    }

    // --- Hanol Studio Specific Schedule Filtering ---
    const filteredSlots = allAvailabilities.filter(slot => {
      const date = new Date(slot.startAt);
      const day = date.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue... 
      const hours = date.getHours();
      const mins = date.getMinutes();

      // Create a time string in 24h format (e.g., "10:30" or "13:30")
      const timeStr = `${hours}:${mins.toString().padStart(2, '0')}`;

      // Rule 1: Tue - Sat (Days 2, 3, 4, 5, 6) -> 10:30 & 13:30
      if (day >= 2 && day <= 6) {
        return timeStr === "10:30" || timeStr === "13:30";
      }

      // Rule 2: Sunday (Day 0) -> 10:30 only
      if (day === 0) {
        return timeStr === "10:30";
      }

      // Rule 3: Monday (Day 1) -> Closed
      return false;
    });

    // Clean data of BigInts before sending to frontend
    const safeData = JSON.parse(
      JSON.stringify({ availabilities: filteredSlots }, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    console.log(`>>> [SERVER] Total slots found across 3 months: ${allAvailabilities.length}`);
    console.log(`>>> [SERVER] Slots matching Hanol schedule: ${filteredSlots.length}`);

    return res.status(200).json(safeData);

  } catch (error) {
    console.error(">>> [SERVER] Square API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}