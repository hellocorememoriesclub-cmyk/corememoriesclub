document.querySelectorAll('.inline-reel').forEach(card=>{
 const button=card.querySelector('.reel-play');
 const player=card.querySelector('.reel-player');
 const status=card.querySelector('.reel-status');
 button.addEventListener('click',()=>{
  const id=card.dataset.reelId;
  if(!/^[A-Za-z0-9_-]+$/.test(id))return;
  const frame=document.createElement('iframe');
  frame.src='https://www.instagram.com/reel/'+id+'/embed/?autoplay=1';
  frame.title=button.getAttribute('aria-label').replace('Play ','').replace(' here','');
  frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.setAttribute('tabindex','0');
  status.hidden=false;
  status.textContent='Loading Instagram player…';
  player.classList.add('is-loading');
  const timeout=setTimeout(()=>{status.textContent='If Instagram cannot load here, use the link below to view the reel.'},12000);
  frame.addEventListener('load',()=>{clearTimeout(timeout);status.hidden=true;player.classList.remove('is-loading')});
  frame.addEventListener('error',()=>{clearTimeout(timeout);status.hidden=false;status.textContent='Instagram could not load. Use the reel link below.'});
  button.hidden=true;
  player.append(frame);
  frame.focus();
 },{once:true});
});
