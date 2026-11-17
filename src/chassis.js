// The enclosure is a deliberate asymmetric appliance silhouette. The display
// gets its own constant-width mounting bezel; the outer wall is free to sculpt.
export function layoutChassis(){
 const deck=document.querySelector('.deck'),svg=deck.querySelector('.chassis');let last='';
 function draw(){if(document.fullscreenElement===deck)return;const {width:w,height:h}=deck.getBoundingClientRect();
 const path=`M ${.18*w} ${.02*h} C ${.34*w} ${-.005*h} ${.54*w} ${.03*h} ${.76*w} ${.012*h} C ${.85*w} 0 ${.90*w} ${.035*h} ${.92*w} ${.13*h} L ${.925*w} ${.28*h} C ${.93*w} ${.34*h} ${.99*w} ${.36*h} ${.99*w} ${.46*h} C ${.995*w} ${.57*h} ${.95*w} ${.67*h} ${.92*w} ${.75*h} C ${.90*w} ${.82*h} ${.855*w} ${.86*h} ${.79*w} ${.88*h} L ${.43*w} ${.92*h} C ${.34*w} ${.93*h} ${.29*w} ${1.005*h} ${.17*w} ${.99*h} C ${.055*w} ${.98*h} ${-.005*w} ${.88*h} ${.018*w} ${.73*h} C ${.034*w} ${.63*h} ${.08*w} ${.57*h} ${.075*w} ${.48*h} L ${.075*w} ${.18*h} C ${.075*w} ${.075*h} ${.105*w} ${.03*h} ${.18*w} ${.02*h} Z`;
 if(path===last)return;last=path;const depth=w<560?8:15;svg.querySelector('.rear-base').setAttribute('transform',`translate(0 ${depth})`);svg.querySelector('.assembly-seam').setAttribute('transform',`translate(0 ${depth*.65})`);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.querySelectorAll('[data-outline]').forEach(p=>p.setAttribute('d',path));const clip=svg.querySelector('[data-chassis-clip]');clip.setAttribute('d',path);clip.setAttribute('transform',`scale(${1/w} ${1/h})`);window.dispatchEvent(new Event('aqua-layout'));
 }
 new ResizeObserver(draw).observe(deck);draw();document.addEventListener('fullscreenchange',draw);
}
