const https = require('https');

const ARTICLES = [
  {id:'previous-automation-pushed-workers-somewhere-else',title:'Previous Automation Pushed Workers Somewhere Else. What If AI Follows Them There?',summary:'Historical labor escape routes from farms to factories to offices and services; why cognitive and service work may be easier and cheaper to automate than messy physical work; cloud delivery, robotics, robotaxis, net job creation, and wage pressure.'},
  {id:'we-saw-the-automation-risk-60-years-ago',title:'In the Sixties, We Knew Automation Could Be a Serious Threat. Now That AI Is Here, Why Aren’t We More Prepared?',summary:'1960s U.S. concern about technological unemployment, government commissions, income-through-jobs, worker transition, safety nets, preparedness, and whether modern institutions are ready for larger AI labor disruption.'},
  {id:'ai-just-celebrated-its-70th-birthday',title:'AI Just Celebrated Its 70th Birthday. So Why Did I Just Find Out About It?',summary:'History of artificial intelligence from Turing and Dartmouth through government research, ARPA/DARPA, computing, robotics, transformers and ChatGPT. Focus is AI history and public awareness, not military applications.'},
  {id:'why-nobody-will-hit-the-brakes-on-ai',title:'Why Nobody Will Hit the Brakes on AI',summary:'Competition among companies, investors, workers and countries; incentives to accelerate AI; capital markets, herding, governance, coordination and the difficulty of unilateral restraint.'},
  {id:'production-without-consumption',title:'Production Without Consumption',summary:'Aggregate demand, labor income, purchasing power, consumer spending, goods and services, lower prices, and the risk that productive capacity grows while customers lose income.'},
  {id:'the-paradox-of-automation',title:'The Paradox of Automation',summary:'Core macroeconomic thesis: labor is both a firm cost and a source of system-wide purchasing power. Widespread labor replacement can weaken income, demand and the customer base even while productive capacity rises.'},
  {id:'the-missing-first-rung',title:'The Missing First Rung: How AI Could Break the Career Pipeline Before Mass Unemployment Arrives',summary:'Entry-level hiring, students, graduates, junior professional jobs, career pipelines, learning by doing, non-hiring and how fewer first jobs can weaken the future expert workforce.'},
  {id:'should-government-have-protected-the-luddites',title:'Should the Government Have Protected the Luddites? And What Does the Answer Mean for AI?',summary:'Historical displacement, the Luddites, government responsibility, worker livelihoods, transitions, retraining, obsolete jobs and when technological displacement becomes systemic.'},
  {id:'technology-has-always-replaced-human-labor',title:'Technology Has Always Replaced Human Labor. So What’s Different This Time?',summary:'Long history of technology replacing labor, movement from agriculture to industry and services, cognitive automation, new jobs, and whether past adaptation guarantees enough future human work.'},
  {id:'home',title:'AI Is Not the Problem. What We Choose to Do With It Is.',summary:'Ethical framing of AI deployment: useful and beneficial capabilities versus choices that eliminate livelihoods before society has decided how to manage the transition.'}
];

function postJSON(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({hostname, path, method:'POST', headers:{...headers,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}}, res => {
      let data='';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) return reject(new Error(`OpenAI ${res.statusCode}: ${data.slice(0,500)}`));
        resolve(data);
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return {statusCode:405,headers:{'Allow':'POST'},body:'Method Not Allowed'};
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return {statusCode:503,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Search is not configured yet.'})};

  let q='';
  try { q = String(JSON.parse(event.body || '{}').q || '').trim().slice(0,500); } catch (_) {}
  if (!q) return {statusCode:400,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Please enter a question.'})};

  const catalog = ARTICLES.map(a=>`ID: ${a.id}\nTITLE: ${a.title}\nSCOPE: ${a.summary}`).join('\n\n');
  const system = `You are the search librarian for the Paradox of Automation (POA) website. Your job is ONLY to decide whether the published POA library actually covers the user's question and which articles are relevant. Do not answer the outside-world factual question yourself. Be conservative and intellectually honest. Generic overlap such as the words AI, automation, technology, jobs, or government is NOT enough. A DIRECT match must substantially discuss the distinctive subject of the question. A RELATED match may discuss a genuinely adjacent concept, but must be labeled related. If the distinctive subject is absent, status must be not_covered. Example: a question about AI in combat or military roles is NOT covered merely because an AI-history article mentions DARPA; at most that history article could be related, and only if useful. Return no more than 3 matches. Reasons must be short and specific.\n\nPUBLISHED CATALOG:\n${catalog}`;

  const schema = {
    name:'poa_search_result',
    strict:true,
    schema:{
      type:'object',additionalProperties:false,
      properties:{
        status:{type:'string',enum:['covered','partly_covered','not_covered']},
        message:{type:'string'},
        matches:{type:'array',maxItems:3,items:{type:'object',additionalProperties:false,properties:{id:{type:'string'},relation:{type:'string',enum:['direct','related']},reason:{type:'string'}},required:['id','relation','reason']}}
      },
      required:['status','message','matches']
    }
  };

  const payload = JSON.stringify({
    model:'gpt-5.4-nano',
    reasoning_effort:'none',
    messages:[{role:'system',content:system},{role:'user',content:q}],
    response_format:{type:'json_schema',json_schema:schema}
  });

  try {
    const raw = await postJSON('api.openai.com','/v1/chat/completions',{'Authorization':`Bearer ${apiKey}`},payload);
    const parsed = JSON.parse(raw);
    const result = JSON.parse(parsed.choices?.[0]?.message?.content || '{}');
    const valid = new Set(ARTICLES.map(a=>a.id));
    result.matches = Array.isArray(result.matches) ? result.matches.filter(m=>valid.has(m.id)).slice(0,3) : [];
    return {statusCode:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(result)};
  } catch (err) {
    console.error(err);
    return {statusCode:500,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'AI search is temporarily unavailable. Please try again.'})};
  }
};