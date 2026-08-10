export default async function handler(req,res){
  const {url}=req.query||{};
  if(!url)return res.status(400).json({error:'Missing Frame.io URL'});
  let target;try{target=new URL(url)}catch{return res.status(400).json({error:'Invalid Frame.io URL'});}
  if(!/^(www\.)?(frame\.io|app\.frame\.io)$/i.test(target.hostname)&&!target.hostname.endsWith('.frame.io'))return res.status(400).json({error:'Only Frame.io share links are supported'});
  try{
    const r=await fetch(target.toString(),{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0'}});
    if(!r.ok)throw new Error(`Frame.io page returned ${r.status}`);
    const html=await r.text();
    const candidates=[];
    const add=x=>{if(!x)return;try{x=JSON.parse('"'+x.replace(/\\"/g,'"')+'"')}catch{};if(/^https?:\/\//.test(x))candidates.push(x.replace(/&amp;/g,'&'))};
    for(const re of [/<meta[^>]+property=["']og:video(?::secure_url)?["'][^>]+content=["']([^"']+)/ig,/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:video(?::secure_url)?["']/ig,/"(?:downloadUrl|download_url|mediaUrl|media_url|sourceUrl|source_url|videoUrl|video_url)"\s*:\s*"(https?:[^"\\]+(?:mp4|mov|m4v)[^"\\]*)/ig]){let m;while((m=re.exec(html)))add(m[1])}
    const media=candidates.find(x=>/\.(mp4|mov|m4v)(?:[?#]|$)/i.test(x))||candidates[0];
    if(!media)return res.status(422).json({error:'This Frame.io share page does not expose a public video stream. The link may require login or download permission.'});
    const range=req.headers.range;
    const rr=await fetch(media,{headers:{...(range?{Range:range}:{}),Referer:target.toString(),'User-Agent':'Mozilla/5.0'},redirect:'follow'});
    if(!rr.ok)throw new Error(`Video fetch returned ${rr.status}`);
    res.statusCode=rr.status;res.setHeader('Content-Type',rr.headers.get('content-type')||'video/mp4');
    for(const h of ['content-length','content-range','accept-ranges']){const v=rr.headers.get(h);if(v)res.setHeader(h,v)}
    if(rr.body&&res.send){const reader=rr.body.getReader();res.flushHeaders?.();const pump=async()=>{const {done,value}=await reader.read();if(done)return res.end();res.write(Buffer.from(value));await pump()};return pump()}
    return res.status(502).json({error:'Unable to stream Frame.io video'});
  }catch(e){return res.status(502).json({error:e.message||'Unable to fetch Frame.io video'});}
}
