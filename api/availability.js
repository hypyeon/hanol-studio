import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import pkg from 'square';

const { Client, Environment } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// SQUARE AVAILABILITY ROUTE
app.post('/api/availability', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const accessToken = process.env.SQ_ACCESS_TOKEN || process.env.VITE_SQ_ACCESS_TOKEN;
    const locationId = process.env.SQ_LOCATION_ID || process.env.VITE_SQ_LOCATION_ID;
    const isProduction = (process.env.ENVIRONMENT || process.env.NODE_ENV) === 'production';

    console.log('--- Incoming Availability Search ---');
    console.log('Access Token Present:', !!accessToken);
    console.log('Location ID:', locationId);
    console.log('Request Body:', req.body);

    if (!accessToken || !locationId) {
      console.error('SERVER CONFIG ERROR: Missing tokens in .env.local file.');
      return res.status(500).json({
        error: 'Missing Square credentials in environment configuration.',
      });
    }

    const { serviceIds, startRangeDate } = req.body || {};

    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({ error: 'serviceIds array is required.' });
    }

    if (!startRangeDate) {
      return res.status(400).json({ error: 'startRangeDate (YYYY-MM-DD) is required.' });
    }

    // Determine environment safely (fallback to string if Environment enum isn't loaded)
    const envSetting = Environment
      ? (isProduction ? Environment.Production : Environment.Sandbox)
      : (isProduction ? 'production' : 'sandbox');

    const client = new Client({
      accessToken: accessToken,
      environment: envSetting,
    });

    const startAt = `${startRangeDate}T00:00:00Z`;
    const endAt = `${startRangeDate}T23:59:59Z`;

    const segmentFilters = serviceIds.map((id) => ({
      serviceVariationId: id,
    }));

    const response = await client.bookingsApi.searchAvailability({
      query: {
        filter: {
          startAtRange: {
            startAt,
            endAt,
          },
          locationId: locationId,
          segmentFilters: segmentFilters,
        },
      },
    });

    const availabilities = response.result?.availabilities || [];

    const formattedSlots = availabilities.map((slot) => {
      const dateObj = new Date(slot.startAt);
      return {
        isoString: slot.startAt,
        timeLabel: dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
    });

    console.log(`Successfully found ${formattedSlots.length} available slots.`);
    return res.status(200).json({ slots: formattedSlots });

  } catch (error) {
    console.error('CRITICAL ERROR inside /api/availability:', error);
    const detail = error?.errors?.[0]?.detail || error?.message || 'Square availability request failed.';
    return res.status(500).json({ error: detail });
  }
});

app.listen(PORT, () => {
  console.log(`Express backend server running at http://localhost:${PORT}`);
});