export default async function handler(req,res){
  const {url}=req.query||{};
  if(!url)return res.status(400).json({error:'Missing Frame.io URL'});
  let target;
  try{target=new URL(url)}catch{return res.status(400).json({error:'Invalid Frame.io URL'});}
  const host=target.hostname.toLowerCase();
  if(host!=='frame.io'&&!host.endsWith('.frame.io')&&host!=='f.io')return res.status(400).json({error:'Only Frame.io share links are supported'});
  try{
    const ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36';
    const pageHeaders={'User-Agent':ua,'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8','Accept-Language':'en-US,en;q=0.9'};
    const r=await fetch(target.toString(),{redirect:'follow',headers:pageHeaders});
    if(!r.ok)throw new Error(`Frame.io share page returned ${r.status}`);
    const finalUrl=r.url||target.toString();
    const html=await r.text();
    const candidates=[];
    const add=x=>{if(!x)return;let v=String(x).replace(/\\u0026/g,'&').replace(/\\\//g,'/').replace(/&amp;/g,'&').replace(/\\"/g,'"');try{if(/^".*"$/.test(v))v=JSON.parse(v)}catch{};if(/^https?:\/\//i.test(v))candidates.push(v)};
    const patterns=[
      /<meta[^>]+(?:property|name)=["']og:video(?::secure_url)?["'][^>]+content=["']([^"']+)/ig,
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:video(?::secure_url)?["']/ig,
      /["'](?:downloadUrl|download_url|inline_url|inlineUrl|mediaUrl|media_url|sourceUrl|source_url|videoUrl|video_url|playbackUrl|playback_url)["']\s*:\s*["'](https?:[^"']+)["']/ig,
      /(?:downloadUrl|download_url|inline_url|inlineUrl|mediaUrl|media_url|sourceUrl|source_url|videoUrl|video_url|playbackUrl|playback_url)\\?[:=]\\?["'](https?:[^"']+)/ig,
      /https?:\\?\/\\?\/[^"'\s\\]+\.(?:mp4|mov|m4v)(?:\?[^"'\s\\]*)?/ig
    ];
    for(const re of patterns){let m;while((m=re.exec(html)))add(m[1]||m[0])}
    // Frame.io embeds signed media URLs in serialized application state on some V4 share pages.
    // Look for any signed media URL even when its JSON property name has changed.
    const urlMatches=html.match(/https?:\\?\/\\?\/[^"'\\s<>]+/ig)||[];
    for(const x of urlMatches){if(/\.(?:mp4|mov|m4v)(?:[?#]|$)/i.test(x)||/\b(?:media|video|download|stream|transcode)\b/i.test(x))add(x)}
    const unique=[...new Set(candidates)];
    const media=unique.find(x=>/\.(mp4|mov|m4v)(?:[?#]|$)/i.test(x))||unique.find(x=>/\b(?:media|video|download|stream|transcode)\b/i.test(x));
    if(!media)return res.status(422).json({error:'Frame.io did not expose a playable media URL. The share must be accessible and the asset must allow downloading/playback.'});
    const range=req.headers.range;
    const rr=await fetch(media,{redirect:'follow',headers:{'User-Agent':ua,'Referer':finalUrl,'Accept':'video/mp4,video/*;q=0.9,*/*;q=0.5',...(range?{Range:range}:{})}});
    if(!rr.ok)throw new Error(`Frame.io media returned ${rr.status}`);
    res.statusCode=rr.status;
    res.setHeader('Content-Type',rr.headers.get('content-type')||'video/mp4');
    for(const h of ['content-length','content-range','accept-ranges','etag','last-modified']){const v=rr.headers.get(h);if(v)res.setHeader(h,v)}
    if(rr.body&&res.send){const reader=rr.body.getReader();res.flushHeaders?.();const pump=async()=>{try{const {done,value}=await reader.read();if(done)return res.end();res.write(Buffer.from(value));await pump()}catch(e){res.end()}};return pump()}
    return res.status(502).json({error:'Unable to stream Frame.io video'});
  }catch(e){return res.status(502).json({error:e.message||'Unable to fetch Frame.io video'});}
}
