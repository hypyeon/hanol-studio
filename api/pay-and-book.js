import { SquareClient, SquareEnvironment } from 'square';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.SQ_ACCESS_TOKEN;
  const locationId = process.env.SQ_LOCATION_ID;

  if (!token || !locationId) {
    return res.status(500).json({ 
      error: "Missing Credentials",
      help: "Check SQ_ACCESS_TOKEN and SQ_LOCATION_ID in .env.local" 
    });
  }

  const { sourceId, serviceVariationId, startAt, customerInfo, hasInsurance } = req.body;

  if (!sourceId || !serviceVariationId || !startAt || !customerInfo) {
    return res.status(400).json({ error: "Missing required booking or payment fields" });
  }

  const client = new SquareClient({
    token: process.env.SQ_ACCESS_TOKEN, // Production Access Token
    environment: SquareEnvironment.Production, // <-- Changed from Sandbox
  });

  // Deposit Logic: $100 base deposit + $15 optional insurance
  const depositAmount = hasInsurance ? 115 : 100;
  const amountInCents = BigInt(depositAmount * 100);

  try {
    // 1. Process Deposit Payment via Square Payments API
    const paymentResponse = await client.payments.create({
      sourceId, // Payment token generated on front-end by Web Payments SDK
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: amountInCents,
        currency: 'USD',
      },
      note: `Hanol Studio Deposit ($${depositAmount}) - Insurance: ${hasInsurance ? 'Yes ($15 Fee)' : 'No'}`,
      autocomplete: true,
    });

    const payment = paymentResponse.payment;

    // 2. Create Booking via Square Bookings API
    const bookingResponse = await client.bookings.create({
      booking: {
        locationId,
        startAt,
        customerNote: `${customerInfo.note || ''} | Deposit Paid: $${depositAmount} (Insurance: ${hasInsurance ? 'YES' : 'NO'})`.trim(),
        appointmentSegments: [
          {
            serviceVariationId,
            serviceVariationVersion: BigInt(1), // Set or omit based on catalog requirements
          },
        ],
        customerRequirement: {
          givenName: customerInfo.firstName,
          familyName: customerInfo.lastName,
          emailAddress: customerInfo.email,
          phoneNumber: customerInfo.phone,
        },
      },
    });

    const safeResponse = JSON.parse(
      JSON.stringify({
        success: true,
        paymentId: payment.id,
        booking: bookingResponse.booking,
      }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );

    return res.status(200).json(safeResponse);

  } catch (error) {
    console.error(">>> [SERVER] Booking or Payment Error:", error);
    return res.status(500).json({ error: error.message || "Failed to process booking" });
  }
}