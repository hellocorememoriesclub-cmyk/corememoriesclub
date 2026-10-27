const navigationButton=document.querySelector('#menu');
const navigation=document.querySelector('#nav');
if(navigationButton&&navigation){
 function closeNavigation(returnFocus=false){navigation.classList.remove('open');navigationButton.setAttribute('aria-expanded','false');navigationButton.setAttribute('aria-label','Open navigation');navigationButton.textContent='☰';if(returnFocus)navigationButton.focus()}
 navigationButton.addEventListener('click',()=>{const open=navigationButton.getAttribute('aria-expanded')!=='true';navigation.classList.toggle('open',open);navigationButton.setAttribute('aria-expanded',String(open));navigationButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigationButton.textContent=open?'✕':'☰'});
 navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeNavigation()));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigationButton.getAttribute('aria-expanded')==='true')closeNavigation(true)});
 document.addEventListener('click',event=>{if(!navigation.contains(event.target)&&!navigationButton.contains(event.target))closeNavigation()});
 window.matchMedia('(min-width: 761px)').addEventListener('change',()=>closeNavigation());
}
