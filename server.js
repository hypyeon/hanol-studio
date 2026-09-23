import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import squarePkg from 'square';

// Destructure SquareEnvironment and SquareClient from SDK v35+
const { SquareClient, SquareEnvironment, Client, Environment } = squarePkg;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/availability', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const accessToken = process.env.SQ_ACCESS_TOKEN || process.env.VITE_SQ_ACCESS_TOKEN;
    const locationId = process.env.SQ_LOCATION_ID || process.env.VITE_SQ_LOCATION_ID;
    const isProduction = (process.env.ENVIRONMENT || process.env.NODE_ENV) === 'production';

    console.log('--- Incoming Availability Search ---');
    console.log('Access Token Present:', !!accessToken);
    console.log('Location ID:', locationId);

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

    // Resolve full base URL environment object
    const selectedEnv = SquareEnvironment
      ? (isProduction ? SquareEnvironment.Production : SquareEnvironment.Sandbox)
      : (Environment ? (isProduction ? Environment.Production : Environment.Sandbox) : (isProduction ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'));

    const ClientClass = SquareClient || Client || squarePkg.default || squarePkg;

    const client = new ClientClass({
      token: accessToken,
      accessToken: accessToken,
      environment: selectedEnv,
    });

    const startAt = `${startRangeDate}T00:00:00Z`;
    const endAt = `${startRangeDate}T23:59:59Z`;

    let availabilities = [];

    if (client.bookings) {
      const response = await client.bookings.searchAvailability({
        query: {
          filter: {
            startAtRange: {
              startAt,
              endAt,
            },
            locationId: locationId,
            segmentFilters: serviceIds.map((id) => ({
              serviceVariationId: id,
            })),
          },
        },
      });
      availabilities = response.availabilities || response.result?.availabilities || [];
    } else if (client.bookingsApi) {
      const response = await client.bookingsApi.searchAvailability({
        query: {
          filter: {
            startAtRange: {
              startAt,
              endAt,
            },
            locationId: locationId,
            segmentFilters: serviceIds.map((id) => ({
              serviceVariationId: id,
            })),
          },
        },
      });
      availabilities = response.result?.availabilities || [];
    }

    const formattedSlots = availabilities.map((slot) => {
      const slotTime = slot.startAt || slot.start_at;
      const dateObj = new Date(slotTime);
      return {
        isoString: slotTime,
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