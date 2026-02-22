// functions/push-campaign.js
// Runs server-side on Netlify — API keys never reach the browser

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { storeId, campaignName, subject, preheader, senderName, senderEmail, replyTo, listIds, isVip } = payload;

  if (!storeId || !campaignName || !subject || !senderEmail) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: storeId, campaignName, subject, senderEmail' }) };
  }

  // API key is stored as a Netlify environment variable — never in the browser
  // Variable name format: KLAVIYO_KEY_US, KLAVIYO_KEY_UK, KLAVIYO_KEY_CZ, etc.
  const envKey = `KLAVIYO_KEY_${storeId.toUpperCase()}`;
  const apiKey = process.env[envKey];

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `No API key configured for store "${storeId}". Add environment variable ${envKey} in Netlify.` })
    };
  }

  try {
    const res = await fetch('https://a.klaviyo.com/api/campaigns/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'campaign',
          attributes: {
            name: campaignName,
            channel: 'email',
            audiences: {
              included: Array.isArray(listIds) ? listIds : (listIds ? [listIds] : []),
            },
            send_options: { use_smart_sending: true },
            tracking_options: { is_tracking_clicks: true, is_tracking_opens: true },
            send_strategy: { method: 'immediate' },
            message: {
              channel: 'email',
              content: {
                subject,
                preview_text: preheader || '',
                from_email: senderEmail,
                from_label: senderName || '',
                reply_to_email: replyTo || senderEmail,
              },
            },
          },
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.errors?.[0]?.detail || data?.errors?.[0]?.title || `Klaviyo error ${res.status}`;
      return { statusCode: res.status, body: JSON.stringify({ error: errMsg, klaviyoResponse: data }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        campaignId: data?.data?.id,
        campaignName,
        storeId,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${err.message}` }),
    };
  }
};
