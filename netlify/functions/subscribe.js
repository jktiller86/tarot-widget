// netlify/functions/subscribe.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  // these headers allow any origin to POST, and let the browser send JSON
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 1) handle the browser’s preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // 2) reject anything that isn't a POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: 'Method Not Allowed'
    };
  }

  // 3) parse & validate the incoming JSON
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'Invalid JSON'
    };
  }

  const { name, email, cardNumber } = payload;
  if (!name || !email || !cardNumber) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'Missing fields'
    };
  }

  // 4) call Flodesk
  const apiKey = process.env.FLODESK_API_KEY;
  const segmentId = '6837bb1f44c6f4a39a996561';
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
      // forward Flodesk’s error
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: data })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: `Server error: ${err.message}`
    };
  }
};
