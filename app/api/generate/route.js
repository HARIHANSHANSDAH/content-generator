export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch('http://203.57.85.248:5678/webhook/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('n8n response:', JSON.stringify(data));

    let content = '';

    // Handle different response formats
    if (typeof data === 'string') {
      content = data;
    } else if (data.content) {
      content = data.content;
    } else if (data.choices?.[0]?.message?.content) {
      content = data.choices[0].message.content;
    } else if (Array.isArray(data) && data[0]?.content) {
      content = data[0].content;
    } else if (Array.isArray(data) && data[0]?.choices?.[0]?.message?.content) {
      content = data[0].choices[0].message.content;
    } else {
      content = JSON.stringify(data);
    }

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.log('Error:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to generate content' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}