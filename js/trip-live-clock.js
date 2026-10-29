// Exact departure timers. These use an explicit India-time offset, not the viewer's time zone.
(()=>{
 const panels=[...document.querySelectorAll('[data-trip-live]')];if(!panels.length)return;
 const patterns={0:'ab cdef'.replace(/ /g,''),1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'};
 function digits(el,value){if(el.dataset.rendered===value)return;el.dataset.rendered=value;el.replaceChildren();for(const char of value){const digit=document.createElement('span');digit.className=/\d/.test(char)?'clock-digit':'clock-space';digit.setAttribute('aria-hidden','true');if(/\d/.test(char)){for(const segment of 'abcdefg'){const part=document.createElement('i');part.className='seg seg-'+segment+(patterns[char].includes(segment)?' on':'');digit.append(part)}}else digit.textContent=char;el.append(digit)}el.setAttribute('aria-label',value)}
 panels.forEach(panel=>digits(panel.querySelector('[data-start-digits]'),panel.dataset.startLabel));
 function tick(){const now=Date.now();panels.forEach(panel=>{const milliseconds=Date.parse(panel.dataset.tripLive)-now,total=Math.max(0,Math.floor(milliseconds/1000)),days=Math.floor(total/86400);digits(panel.querySelector('[data-live-days]'),String(days));panel.querySelector('[data-live-time]').textContent=milliseconds>0?String(Math.floor(total%86400/3600)).padStart(2,'0')+'h '+String(Math.floor(total%3600/60)).padStart(2,'0')+'m '+String(total%60).padStart(2,'0')+'s':milliseconds>-86400000?'Departure day':'Departure date passed';});}
 let timer;function start(){clearInterval(timer);tick();if(!document.hidden)timer=setInterval(tick,1000)}document.addEventListener('visibilitychange',start);window.addEventListener('pagehide',()=>clearInterval(timer));window.addEventListener('pageshow',start);start();
})();
