// netlify/functions/subscribe.js

const CARD_TO_SEGMENT = {
  1: '6851138013ae07b36eaa1f42',
  2: '68511892d44dc554226892a8',
  3: '6851189e3e5630e216b2f81a',
  4: '685118a99c7af958d61df58b',
  5: '685118c213ae07b36eaa1f52',
  6: '685118cb9ce8512c9a95f76a',
  7: '685119273e5630e216b2f81d',
  8: '6851193113ae07b36eaa1f56',
  9: '6851194a13ae07b36eaa1f57',
  10: '6851193c9b2c51483b3b2c6b',
  11: '685119675a0783be596ad3b7',
  12: '685119705a0783be596ad3b8',
  13: '6851197bd44dc554226892ae',
  14: '685119869c7af958d61df58d',
  15: '6851198e503530cb32b9541f',
  16: '685119963e5630e216b2f828',
  17: '685119a09ce8512c9a95f76f',
  18: '685119abdebf48a3fa99bd49',
  19: '685119b4503530cb32b95420',
  20: '685119bd503530cb32b95421',
  21: '685119c73e5630e216b2f829',
  22: '685119cf9ce8512c9a95f770',
  23: '685119d95a0783be596ad3b9',
  24: '685119e213ae07b36eaa1f5c',
  25: '685119ea9ce8512c9a95f771',
  26: '685119f25a0783be596ad3bb',
  27: '685119f9503530cb32b95422',
  28: '68511a01d44dc554226892b1',
  29: '68511a15503530cb32b95423',
  30: '68511a0adebf48a3fa99bd4c',
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, cardNumber } = JSON.parse(event.body);
    
    console.log('Received request:', { name, email, cardNumber });

    // Validate inputs
    if (!name || !email || !cardNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Get the segment ID for this card
    const segmentId = CARD_TO_SEGMENT[cardNumber];
    if (!segmentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid card number' }),
      };
    }

    // Get Flodesk API key from environment variable
    const FLODESK_API_KEY = process.env.FLODESK_API_KEY;
    if (!FLODESK_API_KEY) {
      console.error('FLODESK_API_KEY not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // First, create or update the subscriber
    const subscriberResponse = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(FLODESK_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        first_name: name,
      }),
    });

    if (!subscriberResponse.ok) {
      const error = await subscriberResponse.text();
      console.error('Flodesk subscriber error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create subscriber' }),
      };
    }

    const subscriber = await subscriberResponse.json();

    // Now add the subscriber to the segment
    const segmentResponse = await fetch('https://api.flodesk.com/v1/subscribers/add-to-segments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(FLODESK_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriber_id: subscriber.id,
        segment_ids: [segmentId],
      }),
    });

    if (!segmentResponse.ok) {
      const error = await segmentResponse.text();
      console.error('Flodesk segment error:', error);
      // Don't fail the whole request if segment addition fails
      // The subscriber was still created
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed!',
        cardNumber,
        segmentId,
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};