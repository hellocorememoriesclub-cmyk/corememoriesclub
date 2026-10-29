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

// Display today's date using the club's India calendar; refresh across midnight and tab resumes.
(()=>{const fields=[...document.querySelectorAll('[data-today-highlight]')];if(!fields.length)return;function update(){const now=new Date();const formatter=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',day:'numeric',month:'short',year:'numeric'});const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const part=t=>parts.find(p=>p.type===t).value;fields.forEach(field=>{field.textContent=formatter.format(now);field.dateTime=part('year')+'-'+part('month')+'-'+part('day')})}let timer;function start(){clearInterval(timer);update();if(!document.hidden)timer=setInterval(update,1000)}document.addEventListener('visibilitychange',start);window.addEventListener('pageshow',start);window.addEventListener('pagehide',()=>clearInterval(timer));start()})();
