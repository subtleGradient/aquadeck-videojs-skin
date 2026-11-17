import '@videojs/html/video/player';
import '@videojs/html/ui/container';
const $=s=>document.querySelector(s),v=$('#video'),player=$('#player');
await customElements.whenDefined('video-player');
v.volume=.65;
const format=t=>`${Math.floor((t||0)/60).toString().padStart(2,'0')}:${Math.floor((t||0)%60).toString().padStart(2,'0')}`;
let dragging=false,buffering=false,captionsUnavailable=false;
const duration=()=>Number.isFinite(v.duration)?v.duration:24;
function seek(time){if(!Number.isFinite(v.duration)||v.error)return;player.store.seek(Math.max(0,Math.min(duration(),time)))}
function sync(){const paused=v.paused||v.ended;$('#play').textContent=paused?'▶':'Ⅱ';$('#play').setAttribute('aria-label',paused?'Play':'Pause');$('#play').title=paused?'Play':'Pause';$('#status').textContent=v.error?'LOAD ERROR':v.ended?'COMPLETE':paused?'PAUSED':buffering?'BUFFERING':'PLAYING';$('#time').textContent=`${format(v.currentTime)} / ${format(duration())}`;const ready=Number.isFinite(v.duration)&&!v.error;for(const id of ['seek','back','forward','stop'])$('#'+id).disabled=!ready;$('#seek').max=duration();if(!dragging)$('#seek').value=v.currentTime;$('#seek').setAttribute('aria-valuetext',`${format(v.currentTime)} of ${format(duration())}`);$('#volume').value=v.volume;$('#volume').setAttribute('aria-valuetext',`${Math.round(v.volume*100)} percent${v.muted?', muted':''}`);const silent=v.muted||v.volume===0;$('#mute').setAttribute('aria-pressed',silent);$('#mute').setAttribute('aria-label',silent?'Unmute':'Mute');$('#mute span').textContent=silent?'OFF':'ON';$('#loop').setAttribute('aria-pressed',v.loop);$('#loop span').textContent=v.loop?'ON':'OFF';const captions=[...v.textTracks].some(t=>t.kind==='captions'&&t.mode==='showing');$('#cc').setAttribute('aria-pressed',captions);$('#cc span').textContent=captionsUnavailable?'N/A':captions?'ON':'OFF'}
$('#play').onclick=async()=>{try{if(v.paused)await player.store.play();else await player.store.pause()}catch{$('#notice').textContent='Playback was blocked. Press Play to try again.'}};
$('#stop').onclick=async()=>{await player.store.pause();seek(0)};
$('#back').onclick=()=>seek(v.currentTime-10);$('#forward').onclick=()=>seek(v.currentTime+10);
$('#seek').onpointerdown=()=>dragging=true;for(const e of ['pointerup','pointercancel','blur'])window.addEventListener(e,()=>{dragging=false;sync()});
$('#seek').oninput=e=>seek(Number(e.target.value));$('#seek').onkeydown=e=>{let t;switch(e.key){case 'ArrowLeft':case 'ArrowDown':t=v.currentTime-5;break;case 'ArrowRight':case 'ArrowUp':t=v.currentTime+5;break;case 'Home':t=0;break;case 'End':t=duration();break;default:return}e.preventDefault();seek(t)};
$('#volume').oninput=e=>{v.volume=Number(e.target.value);v.muted=false};$('#mute').onclick=()=>{const silent=v.muted||v.volume===0;if(v.volume===0)v.volume=.65;v.muted=!silent;sync()};
$('#loop').onclick=()=>{v.loop=!v.loop;sync()};$('#cc').onclick=()=>{const t=[...v.textTracks].find(t=>t.kind==='captions');if(t)t.mode=t.mode==='showing'?'hidden':'showing';sync()};
$('#fullscreen').onclick=async()=>{$('#notice').textContent='';try{if(document.fullscreenElement)await document.exitFullscreen();else if($('.pod').requestFullscreen)await $('.pod').requestFullscreen();else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();else $('#notice').textContent='Fullscreen is not supported in this browser.'}catch{$('#notice').textContent='Fullscreen was blocked by this browser.'}};
document.addEventListener('fullscreenchange',()=>{const active=Boolean(document.fullscreenElement);$('#fullscreen').setAttribute('aria-label',active?'Exit fullscreen':'Enter fullscreen');$('#fullscreen').setAttribute('aria-pressed',active)});
for(const e of ['loadedmetadata','timeupdate','play','pause','ended','volumechange','seeked'])v.addEventListener(e,sync);
v.textTracks.addEventListener('change',sync);v.addEventListener('playing',()=>{buffering=false;$('#notice').textContent='';sync()});v.addEventListener('waiting',()=>{buffering=true;sync()});v.addEventListener('error',()=>{$('#notice').textContent='The video could not load. Reload the page to try again.';sync()});document.querySelector('track').addEventListener('error',()=>{captionsUnavailable=true;$('#cc').disabled=true;$('#cc').setAttribute('aria-label','Captions unavailable');$('#cc span').textContent='N/A'});sync();
window.biopod={player,video:v,seek};
