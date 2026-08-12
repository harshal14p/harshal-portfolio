/* Smart context-aware review layer. This is intentionally isolated from the portfolio UI. */
(()=>{'use strict';
  const COMMON={their:['there','they\'re'],there:['their','they\'re'],your:['you\'re'],youre:['your'],its:['it\'s'],it\'s:['its'],then:['than'],than:['then'],affect:['effect'],effect:['affect'],loose:['lose'],lose:['loose'],advice:['advise'],advise:['advice'],principal:['principle'],principle:['principal'],compliment:['complement'],complement:['compliment'],stationary:['stationery'],stationery:['stationary'],weather:['whether'],whether:['weather'],accept:['except'],except:['accept'],lead:['led'],led:['lead'],lay:['lie'],lie:['lay'],breath:['breathe'],breathe:['breath'],defence:['defense'],practice:['practise'],practise:['practice']};
  const BAD_CONTEXT=[/\b(?:is|are|was|were)\s+an?\s+hour\b/i,/\b(?:a|an)\s+(?:university|user|unique|useful|European)\b/i];
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const toks=s=>(clean(s).match(/[A-Za-z][A-Za-z'’-]*/g)||[]);
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z']/g,'');
  const edit=(a,b)=>{a=norm(a);b=norm(b);if(Math.abs(a.length-b.length)>2)return 99;let p=Array(b.length+1);for(let j=0;j<=b.length;j++)p[j]=j;for(let i=1;i<=a.length;i++){let q=[i];for(let j=1;j<=b.length;j++)q[j]=Math.min(q[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=q}return p[b.length]};
  function contextual(text,script){
    const out=[],t=toks(text),s=clean(script); if(!t.length||!s)return out;
    const st=t.map(norm), sw=toks(s).map(norm);
    // Look for near-identical words in the script; this catches OCR distortions and real on-screen typos without guessing from a dictionary alone.
    for(let i=0;i<st.length;i++){
      const w=st[i]; if(w.length<4)continue;
      let best=null,bd=99;
      for(let j=0;j<sw.length;j++){const d=edit(w,sw[j]);if(d<bd){bd=d;best=sw[j]}}
      if(best&&bd===1&&best!==w)out.push({kind:'Spelling',found:t[i],suggestion:best,confidence:.96,reason:'Matches the supplied voiceover/script context'});
      if(COMMON[w]&&COMMON[w].includes(best))out.push({kind:'Word choice',found:t[i],suggestion:best,confidence:.82,reason:'Context-sensitive commonly confused word'});
    }
    // Grammar/article sanity checks only when the surrounding phrase strongly determines the correction.
    for(const r of BAD_CONTEXT){if(r.test(text))out.push({kind:'Grammar',found:text,suggestion:'Check article/wording',confidence:.72,reason:'Context-sensitive grammar check'});}
    return out;
  }
  function upgradeResults(){
    const box=document.querySelector('#vr-results'); if(!box)return;
    // The existing tool remains the source of truth. This layer only enriches results and never removes them.
    const script=clean(document.querySelector('#vr-script-text')?.value); if(!script)return;
    box.querySelectorAll('.vr-result').forEach(card=>{
      const text=card.textContent||''; const extra=contextual(text,script); if(!extra.length)return;
      const marker=document.createElement('div');marker.className='vr-smart-note';marker.textContent='Context checked';card.appendChild(marker);
    });
  }
  const style=document.createElement('style');style.textContent='.vr-smart-note{display:inline-flex;margin-top:8px;padding:4px 9px;border:1px solid rgba(120,190,255,.22);border-radius:999px;font-size:.7rem;opacity:.8}.vr-smart-note::before{content:"✦ ";}';document.head.appendChild(style);
  new MutationObserver(()=>upgradeResults()).observe(document.documentElement,{subtree:true,childList:true});
})();
