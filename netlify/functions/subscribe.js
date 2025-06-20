// netlify/functions/subscribe.js

const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, email, cardNumber } = payload;
  if (!name || !email || !cardNumber) {
    return { statusCode: 400, body: 'Missing fields' };
  }

  const apiKey = process.env.FLODESK_API_KEY;
  const segmentId = '6837bb1f44c6f4a39a996561';  // your Flodesk segment ID

  const auth = Buffer.from(`${apiKey}:`).toString('base64');

  try {
    const response = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        first_name: name,
        custom_fields: { card_number: cardNumber.toString() },
        segment_ids: [segmentId]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return { statusCode: 500, body: `Server error: ${err.message}` };
  }
};