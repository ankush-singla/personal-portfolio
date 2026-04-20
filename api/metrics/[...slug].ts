export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  
  // Extract the path after /api/metrics
  // e.g., /api/metrics/e/ -> /e/
  const path = url.pathname.replace(/^\/api\/metrics/, '');
  
  // Construct the target PostHog URL
  const posthogUrl = `https://us.i.posthog.com${path}${url.search}`;

  // Clone headers and remove host to avoid SSL/Target mismatch
  const headers = new Headers(req.headers);
  headers.delete('host');

  try {
    const response = await fetch(posthogUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : null,
      redirect: 'follow',
    });

    const responseHeaders = new Headers(response.headers);
    // Ensure we allow CORS if needed
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('PostHog Proxy Error:', error);
    return new Response(JSON.stringify({ error: 'Proxy Error' }), { status: 500 });
  }
}
