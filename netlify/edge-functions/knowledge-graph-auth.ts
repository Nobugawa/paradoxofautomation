const COOKIE = "poa_kg_session";
const MAX_AGE = 60 * 60 * 24;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}
async function tokenFor(password: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("paradox-of-automation-knowledge-graph:v1"));
  return bytesToHex(new Uint8Array(sig));
}
function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0; for (let i=0;i<a.length;i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0;
}
function getCookie(request: Request, name: string) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) { const [k,...rest] = part.trim().split("="); if (k === name) return decodeURIComponent(rest.join("=")); }
  return "";
}
function loginPage(error = "") {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Private | Paradox of Automation</title><style>:root{--p:#f4f0e7;--i:#0e0f11;--r:#d64b2a}*{box-sizing:border-box}body{margin:0;background:var(--p);color:var(--i);font-family:system-ui;min-height:100vh;display:grid;place-items:center;padding:24px}.box{width:min(100%,520px);border-top:5px solid var(--i);padding-top:28px}small{letter-spacing:.16em;text-transform:uppercase;color:#9f3118;font-weight:800}h1{font:700 clamp(2.8rem,8vw,4.8rem)/.95 Georgia,serif;letter-spacing:-.045em;margin:14px 0 16px}p{font:1.05rem/1.6 Georgia,serif;color:#49443c}form{display:flex;gap:8px;margin-top:24px}input{flex:1;min-width:0;border:1px solid var(--i);background:#fffdf8;padding:13px;font-size:1rem}button{background:var(--i);color:#fff;border:0;padding:13px 18px;font-weight:800}.err{color:#9f3118;font:700 .85rem system-ui;margin-top:12px}</style></head><body><main class="box"><small>Private Editorial System</small><h1>Knowledge Graph</h1><p>This page is restricted to the site owner.</p><form method="post"><input type="password" name="password" placeholder="Password" required autofocus><button>Enter</button></form>${error?`<div class="err">${error}</div>`:""}</main></body></html>`;
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const password = Deno.env.get("PROTECTED_PAGE_PASSWORD");
  if (!password) return new Response("This page is not yet configured. The site owner needs to set the PROTECTED_PAGE_PASSWORD environment variable.", { status: 503, headers: { "content-type":"text/plain; charset=utf-8", "cache-control":"no-store" } });

  if (url.searchParams.get("logout") === "1") {
    return new Response(null,{status:302,headers:{location:"/knowledge-graph/","set-cookie":`${COOKIE}=; Path=/knowledge-graph; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,"cache-control":"no-store"}});
  }

  const expectedToken = await tokenFor(password);
  const cookie = getCookie(request, COOKIE);
  if (cookie && constantTimeEqual(cookie, expectedToken)) return context.next();

  if (request.method === "POST") {
    const form = await request.formData();
    const submitted = String(form.get("password") || "");
    const [a,b] = await Promise.all([sha256(submitted), sha256(password)]);
    if (constantTimeEqual(a,b)) {
      const headers = new Headers({location:"/knowledge-graph/","cache-control":"no-store"});
      headers.append("set-cookie",`${COOKIE}=${expectedToken}; Path=/knowledge-graph; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Strict`);
      return new Response(null,{status:302,headers});
    }
    return new Response(loginPage("Incorrect password."),{status:401,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
  }

  return new Response(loginPage(),{status:401,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
};
