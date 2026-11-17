// Desktop chrome is independent of the media engine and its artwork.
const clock=document.querySelector('#desktop-clock');
function tick(){const now=new Date();clock.dateTime=now.toISOString();clock.textContent=new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(now)}
tick();setInterval(tick,30000);
const menu=document.querySelector('.start-menu');
menu.addEventListener('click',event=>{if(event.target.closest('a'))menu.open=false});
document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false});
menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus()}});
