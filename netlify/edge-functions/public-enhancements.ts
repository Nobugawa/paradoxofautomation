export default async (request: Request, context: any) => {
  const url = new URL(request.url);

  // Keep the private editorial Knowledge Graph untouched.
  if (url.pathname.startsWith('/knowledge-graph')) {
    return context.next();
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  if (html.includes('/translate.js')) {
    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  const enhanced = html.replace(
    /<\/body>/i,
    '<script src="/translate.js?v=1" defer></script></body>'
  );

  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(enhanced, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
