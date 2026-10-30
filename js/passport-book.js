(()=>{
 const scroll=document.querySelector('[data-book-scroll]');if(!scroll)return;
 const stage=scroll.querySelector('[data-book-stage]'),scene=scroll.querySelector('[data-book-scene]'),leaves=[...scroll.querySelectorAll('[data-book-leaf]')],spine=scroll.querySelector('.passport-spine');
 const prev=scroll.querySelector('[data-book-prev]'),next=scroll.querySelector('[data-book-next]'),label=scroll.querySelector('[data-book-label]'),count=scroll.querySelector('[data-book-count]'),bar=scroll.querySelector('[data-book-progress]');
 const names=JSON.parse(scroll.dataset.bookLabels);const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let frame=0,lastLabel=-1,position=0,start=0,step=0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function measure(){step=Math.max(window.innerHeight*.85,480);scroll.style.height=(stage.offsetHeight+leaves.length*step)+'px';start=window.scrollY+scroll.getBoundingClientRect().top-parseFloat(getComputedStyle(stage).top);render()}
 function render(){frame=0;position=clamp((window.scrollY-start)/step,0,leaves.length);const progress=reduced.matches?Math.round(position):position;
  const opening=clamp(progress,0,1);const coverScale=window.matchMedia('(max-width:760px)').matches?1+.35*(1-opening):1;scene.style.transform='translateX('+(-25*(1-opening))+'%) scale('+coverScale+')';spine.style.opacity=String(clamp(progress*2,0,1));
  leaves.forEach((leaf,i)=>{const turn=clamp(progress-i,0,1);leaf.style.transform='rotateY('+(-180*turn)+'deg)';leaf.classList.toggle('is-stamped',Math.abs(progress-i)<.12);leaf.style.zIndex=String(turn>.5?i+1:leaves.length-i+2);leaf.style.setProperty('--turn-shadow',String(Math.sin(turn*Math.PI)*.25));const current=Math.floor(progress+.001);const showFront=i===current;const showBack=i===current-1;leaf.querySelector('.passport-front').inert=!showFront;leaf.querySelector('.passport-front').setAttribute('aria-hidden',String(!showFront));leaf.querySelector('.passport-back').inert=!showBack;leaf.querySelector('.passport-back').setAttribute('aria-hidden',String(!showBack));});
  scroll.querySelector('.passport-paper').inert=position<leaves.length-.01;scroll.querySelector('.passport-paper').setAttribute('aria-hidden',String(position<leaves.length-.01));const index=Math.round(position);prev.disabled=position<.02;next.disabled=position>leaves.length-.02;bar.style.transform='scaleX('+(position/leaves.length)+')';if(index!==lastLabel){label.textContent=names[index];count.textContent=(index+1)+' / '+(leaves.length+1);lastLabel=index;}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render)}
 function turn(direction){const target=clamp(direction>0?Math.floor(position+.04)+1:Math.ceil(position-.04)-1,0,leaves.length);window.scrollTo({top:start+target*step,behavior:reduced.matches?'instant':'smooth'})}
 prev.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));scene.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();turn(event.key==='ArrowRight'?1:-1)}});
 let touch;scene.addEventListener('touchstart',event=>{const t=event.changedTouches[0];touch={x:t.clientX,y:t.clientY}},{passive:true});scene.addEventListener('touchend',event=>{if(!touch)return;const t=event.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)turn(dx<0?1:-1);touch=null},{passive:true});
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);reduced.addEventListener('change',schedule);measure();
})();
