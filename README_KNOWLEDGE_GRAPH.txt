PARADOX OF AUTOMATION — KNOWLEDGE GRAPH V1.1

PRIVATE PAGE
https://paradoxofautomation.com/knowledge-graph/

SECURITY
This package uses a Netlify Edge Function, not a client-side JavaScript password.
Set a Netlify environment variable named:
PROTECTED_PAGE_PASSWORD

Do NOT put the password in any HTML/JS file or in GitHub.

Netlify steps:
1. Deploy this complete folder/repository.
2. Netlify > Project configuration > Environment variables.
3. Add PROTECTED_PAGE_PASSWORD and choose your password as the value.
4. Redeploy the site.
5. Visit /knowledge-graph/ and enter the password.
6. The session lasts 24 hours. Use Log out to clear it.

MAINTENANCE MODEL
The visible page is only a renderer. The graph itself lives in one data file:
/knowledge-graph/data/knowledge-graph.json

That means routine maintenance should update the JSON rather than hand-editing the HTML.
The page automatically handles search, filtering, node counts, and relationships.

VERSION CONVENTION
The knowledge graph page shows POA KG V1.1 in the lower-right.
Existing site pages have also been stamped SITE V1.1 in the lower-right.

IMPORTANT
The Edge Function protects /knowledge-graph and everything beneath it, including the JSON data file.
The page also carries noindex/nofollow/noarchive metadata, but the password gate is the real protection.
