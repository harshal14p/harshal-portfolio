export default async function handler(req,res){
  const {url}=req.query||{};
  if(!url)return res.status(400).json({error:'Missing Frame.io URL'});
  let target;try{target=new URL(url)}catch{return res.status(400).json({error:'Invalid Frame.io URL'});}
  if(!target.hostname.toLowerCase().endsWith('frame.io'))return res.status(400).json({error:'Only Frame.io share links are supported'});
  try{
    const headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36','Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'};
    const r=await fetch(target.toString(),{redirect:'follow',headers});
    if(!r.ok)throw new Error(`Frame.io page returned ${r.status}`);
    const html=await r.text();
    const candidates=[];
    const add=x=>{if(!x)return;let v=String(x).replace(/\\u0026/g,'&').replace(/\\\//g,'/').replace(/&amp;/g,'&');try{v=JSON.parse('"'+v.replace(/\\"/g,'"')+'"')}catch{};if(/^https?:\/\//i.test(v))candidates.push(v)};
    const patterns=[
      /<meta[^>]+(?:property|name)=["']og:video(?::secure_url)?["'][^>]+content=["']([^"']+)/ig,
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:video(?::secure_url)?["']/ig,
      /["'](?:downloadUrl|download_url|mediaUrl|media_url|sourceUrl|source_url|videoUrl|video_url|playbackUrl|playback_url)["']\s*:\s*["'](https?:[^"']+)["']/ig,
      /https?:\\?\/\\?\/[^"'\s]+\.(?:mp4|mov|m4v)(?:\?[^"'\s]*)?/ig
    ];
    for(const re of patterns){let m;while((m=re.exec(html)))add(m[1]||m[0])}
    const media=candidates.find(x=>/\.(mp4|mov|m4v)(?:[?#]|$)/i.test(x))||candidates.find(x=>/video|media|download|stream/i.test(x))||candidates[0];
    if(!media)return res.status(422).json({error:'Frame.io did not expose a directly streamable video. Make the share link public and allow viewers to download the asset, then paste the share link again.'});
    const range=req.headers.range;
    const rr=await fetch(media,{redirect:'follow',headers:{'User-Agent':headers['User-Agent'],'Referer':target.toString(),...(range?{Range:range}:{})}});
    if(!rr.ok)throw new Error(`Frame.io video returned ${rr.status}`);
    res.statusCode=rr.status;res.setHeader('Content-Type',rr.headers.get('content-type')||'video/mp4');
    for(const h of ['content-length','content-range','accept-ranges','etag','last-modified']){const v=rr.headers.get(h);if(v)res.setHeader(h,v)}
    if(rr.body&&res.send){const reader=rr.body.getReader();res.flushHeaders?.();const pump=async()=>{try{const {done,value}=await reader.read();if(done)return res.end();res.write(Buffer.from(value));await pump()}catch(e){res.end()}};return pump()}
    return res.status(502).json({error:'Unable to stream Frame.io video'});
  }catch(e){return res.status(502).json({error:e.message||'Unable to fetch Frame.io video'});}
}
