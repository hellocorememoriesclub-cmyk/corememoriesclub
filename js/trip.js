const menu=document.querySelector('#menu');const nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
const gallery=document.querySelector('.trip-gallery');
if(gallery){
 const track=gallery.querySelector('.gallery-track');
 const slides=Array.from(gallery.querySelectorAll('.gallery-slide'));
 const thumbs=Array.from(gallery.querySelectorAll('.gallery-thumb'));
 const counter=gallery.querySelector('[data-current-photo]');
 let current=0;
 function showPhoto(index){
  current=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>{slide.hidden=i!==current});
  thumbs.forEach((thumb,i)=>{if(i===current){thumb.setAttribute('aria-current','true')}else{thumb.removeAttribute('aria-current')}});
  counter.textContent=String(current+1);
 }
 gallery.querySelector('.gallery-prev').addEventListener('click',()=>showPhoto(current-1));
 gallery.querySelector('.gallery-next').addEventListener('click',()=>showPhoto(current+1));
 thumbs.forEach((thumb,index)=>thumb.addEventListener('click',()=>showPhoto(index)));
 track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();showPhoto(current+(event.key==='ArrowRight'?1:-1))}});
 let touchStart;
 track.addEventListener('touchstart',event=>{touchStart={x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}},{passive:true});
 track.addEventListener('touchend',event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart.x;const dy=event.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){showPhoto(current+(dx<0?1:-1))}touchStart=null},{passive:true});
 track.addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
 showPhoto(0);
}
