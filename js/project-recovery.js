(()=>{
  async function recover(){
    const grid=document.getElementById('project-grid');
    if(!grid||grid.children.length)return;
    try{
      const mod=await import('./projects.js');
      if(typeof mod.initProjects==='function')mod.initProjects();
    }catch(error){console.warn('[Portfolio] project recovery skipped',error)}
  }
  const run=()=>setTimeout(recover,1200);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
