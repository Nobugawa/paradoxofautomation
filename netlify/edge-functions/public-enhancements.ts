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

  let html = await response.text();

  // Clarify that this project's Paradox of Automation is distinct from
  // Lisanne Bainbridge's 1983 paper, "Ironies of Automation."
  if (url.pathname === '/the-paradox-of-automation.html' || url.pathname === '/the-paradox-of-automation') {
    const notice = `
<section aria-label="Terminology note" style="border-bottom:1px solid #c8c0b2;background:#ebe5d9;padding:22px 0;">
  <div style="width:min(calc(100% - 40px),760px);margin:auto;">
    <p style="margin:0;font:0.98rem/1.65 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#34322e;">
      <strong style="color:#0e0f11;">A note on terminology:</strong>
      This Paradox of Automation is distinct from Lisanne Bainbridge's 1983 paper <em>Ironies of Automation</em>. Bainbridge examined a human-factors problem: as systems become more automated, the remaining human operator may be left with harder monitoring and intervention tasks. The Paradox of Automation examined here is a macroeconomic feedback problem: automation can increase productive capacity while weakening the labor income and purchasing power on which demand depends.
    </p>
  </div>
</section>`;

    html = html.replace(/<article>/i, `${notice}\n<article>`);
  }

  // Add the translation helper to public HTML pages that do not already include it.
  if (!html.includes('/translate.js')) {
    html = html.replace(
      /<\/body>/i,
      '<script src="/translate.js?v=1" defer></script></body>'
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
