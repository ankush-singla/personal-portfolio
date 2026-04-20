export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
    });
  }

  // The path comes from the rewrite: /api/collect/:path* -> /api/proxy?path=:path*
  // If not present (direct call), we fallback to stripping /api/collect
  let path = url.searchParams.get('path') || '';
  if (!path) {
    path = url.pathname.replace(/^\/api\/collect/, '');
  }
  if (!path.startsWith('/')) path = '/' + path;

  const posthogUrl = `https://us.i.posthog.com${path}${url.search.replace(/path=[^&]*&?/, '')}`;

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
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy Error', details: String(error) }), { status: 500 });
  }
}
