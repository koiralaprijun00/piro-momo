// Tells Bing and other IndexNow search engines that pages changed, so they recrawl
// right away instead of waiting. Run after each deploy: npm run indexnow
//
// The key below is public by design: search engines check that
// https://piromomo.com/088fe6b9c396ffd3377976d6f91870b1.txt contains it, which proves you own the site.
const KEY = '088fe6b9c396ffd3377976d6f91870b1';
const HOST = 'piromomo.com';
const SITEMAP = `https://${HOST}/sitemap.xml`;

const sitemap = await fetch(SITEMAP).then((r) => {
  if (!r.ok) throw new Error(`Could not read ${SITEMAP}: ${r.status}`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error('No URLs found in the sitemap.');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

// 200 or 202 means accepted. 403 means the key file isn't live yet (deploy first).
console.log(`IndexNow: sent ${urlList.length} URLs, response ${response.status} ${response.statusText}`);
if (response.status >= 300) process.exitCode = 1;
