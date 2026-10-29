/* Shared date, discovery and passport interactions. No enquiry is sent automatically. */
function departureDays(date, now=new Date()) {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const value=type=>Number(parts.find(part=>part.type===type).value);
 return Math.ceil((Date.parse(date+'T00:00:00Z')-Date.UTC(value('year'),value('month')-1,value('day')))/86400000);
}
document.querySelectorAll('[data-departure]').forEach(el=>{
 const days=departureDays(el.dataset.departure);
 el.textContent=days>0?days+' days to go':days===0?'Departure day':'Departure date passed';
});
const discovery=document.querySelector('[data-discovery]');
if(discovery){
 let filter='all';const search=discovery.querySelector('input');
 const apply=()=>{const term=search.value.trim().toLowerCase();let count=0;discovery.querySelectorAll('[data-trip-status]').forEach(card=>{const show=(filter==='all'||filter===card.dataset.tripStatus)&&card.textContent.toLowerCase().includes(term);card.hidden=!show;if(show)count++});discovery.querySelector('[data-results]').textContent=count+(count===1?' trip':' trips');discovery.querySelector('[data-empty]').hidden=count!==0};
 discovery.querySelectorAll('[data-status-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.statusFilter;discovery.querySelectorAll('[data-status-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));apply()}));search.addEventListener('input',apply);apply();
}
const passport=document.querySelector('[data-passport]');
if(passport){
 const pages=[...passport.querySelectorAll('[data-passport-page]')],steps=[...passport.querySelectorAll('[data-passport-step]')];let active=-1;
 function turn(index){index=Math.max(0,Math.min(pages.length-1,index));if(index===active)return;active=index;pages.forEach((p,i)=>p.hidden=i!==index);steps.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.querySelector('button').setAttribute('aria-pressed',String(i===index))});passport.querySelector('[data-passport-count]').textContent=(index+1)+' / '+pages.length;passport.querySelector('[data-passport-prev]').disabled=index===0;passport.querySelector('[data-passport-next]').disabled=index===pages.length-1;}
 function select(index){turn(index)}
 passport.querySelector('[data-passport-prev]').addEventListener('click',()=>select(active-1));passport.querySelector('[data-passport-next]').addEventListener('click',()=>select(active+1));steps.forEach((s,i)=>s.querySelector('button').addEventListener('click',()=>select(i)));
 passport.querySelector('[data-passport-book]').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(active+(e.key==='ArrowRight'?1:-1))}});
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(visible[0])turn(steps.indexOf(visible[0].target))},{rootMargin:'-25% 0px -35% 0px',threshold:[0,.25,.5,.75]});steps.forEach(s=>observer.observe(s))}turn(0);
}
document.querySelectorAll('[data-route]').forEach(route=>{
 const buttons=[...route.querySelectorAll('[data-route-stop]')];const days=[...document.querySelectorAll('.detail-body details')];
 function select(i){buttons.forEach((b,j)=>{b.setAttribute('aria-pressed',String(i===j));route.querySelectorAll('[data-map-pin]')[j].classList.toggle('is-active',i===j)});route.querySelector('[data-route-caption]').textContent=buttons[i].textContent;}
 buttons.forEach((button,i)=>{button.addEventListener('click',()=>{select(i);if(days[i]){days[i].open=true;days[i].scrollIntoView({block:'nearest',behavior:'smooth'})}});if(days[i])days[i].addEventListener('toggle',()=>{if(days[i].open)select(i)})});if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(visible[0]){const index=days.indexOf(visible[0].target);if(index<buttons.length)select(index)}},{rootMargin:'-20% 0px -50% 0px',threshold:[0,.5,1]});days.forEach(day=>observer.observe(day))}select(0);
});
// Keep the timeline's calendar marker current in the club's home time zone.
document.querySelectorAll('.roll-today time').forEach(el=>{el.textContent=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',day:'numeric',month:'short',year:'numeric'}).format(new Date())});

// Live departure clock: only use exact, approved departures in India time.
(()=>{
 const clock=document.querySelector('[data-next-departure]');if(!clock)return;
 const departures=[{date:'2027-03-20T00:00:00+05:30',title:'Caribbean Cruise + Ultra Miami',url:'caribbean-ultra-miami-2027.html'},{date:'2027-06-20T00:00:00+05:30',title:'Iceland Expedition',url:'iceland-expedition-2027.html'}];
 let timer;
 function tick(){
  const now=Date.now(),trip=departures.find(t=>Date.parse(t.date)>now);
  if(!trip){clock.querySelector('[data-next-title]').textContent='New journeys coming soon';clock.querySelector('[data-next-clock]').textContent='Stay tuned';clock.querySelector('[data-next-date]').textContent='2027';clock.href='trips.html';return;}
  const total=Math.max(0,Math.floor((Date.parse(trip.date)-now)/1000));
  const days=Math.floor(total/86400),hours=Math.floor(total%86400/3600),minutes=Math.floor(total%3600/60),seconds=total%60;
  clock.href=trip.url;clock.querySelector('[data-next-title]').textContent=trip.title;
  const date=new Date(trip.date);clock.querySelector('[data-next-date]').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'2-digit',month:'2-digit',day:'2-digit'}).format(date).split('/').reverse().join(' ');
  clock.querySelector('[data-next-clock]').textContent=days+'d '+String(hours).padStart(2,'0')+'h '+String(minutes).padStart(2,'0')+'m '+String(seconds).padStart(2,'0')+'s';
 }
 function start(){clearInterval(timer);tick();if(!document.hidden)timer=setInterval(tick,1000)}
 document.addEventListener('visibilitychange',start);window.addEventListener('pagehide',()=>clearInterval(timer));window.addEventListener('pageshow',start);start();
})();
