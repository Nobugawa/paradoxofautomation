export default async (request: Request, context: any) => {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  if (!html.includes('/poa-ai-search.js')) {
    html = html.replace(
      /<\/body>/i,
      '<script src="/poa-ai-search.js?v=1" defer></script></body>'
    );
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
