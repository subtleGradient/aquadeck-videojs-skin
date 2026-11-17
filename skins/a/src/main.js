import '@videojs/html/video/player';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/mute-button';
import './style.css';
const $=id=>document.getElementById(id), video=$('video'), player=$('player');
await customElements.whenDefined('video-player');
video.volume=.65;
const fmt=n=>Number.isFinite(n)?`${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`:'--:--';
let dragging=false;
function update(){const duration=Number.isFinite(video.duration)?video.duration:0;$('seek').disabled=!duration;$('stop').disabled=!duration;$('seek').max=duration||24;if(!dragging)$('seek').value=video.currentTime;$('seek').setAttribute('aria-valuetext',`${fmt(video.currentTime)} of ${fmt(duration)}`);$('time').textContent=`${fmt(video.currentTime)} / ${fmt(video.duration)}`;$('status').textContent=video.error?'ERROR':video.ended?'COMPLETE':video.paused?'STANDBY':'IN ORBIT';document.body.classList.toggle('playing',!video.paused);$('volume').value=video.muted?0:video.volume;$('volume').setAttribute('aria-valuetext',`${Math.round((video.muted?0:video.volume)*100)} percent`);$('sound').textContent=video.muted||!video.volume?'◖×':'◖))';}
for(const name of ['loadedmetadata','durationchange','timeupdate','volumechange','play','pause','ended','seeked'])video.addEventListener(name,update);
video.addEventListener('playing',()=>{$('notice').textContent='';update()});
video.addEventListener('waiting',()=>{$('status').textContent='BUFFERING'});
video.addEventListener('error',()=>{$('notice').textContent='The video could not load. Reload to try again.';update()});
$('seek').addEventListener('pointerdown',()=>dragging=true);
for(const event of ['pointerup','pointercancel','blur'])window.addEventListener(event,()=>{dragging=false;update()});
$('seek').oninput=e=>player.store.seek(Number(e.target.value));
$('seek').onkeydown=e=>{const d=video.duration;if(!Number.isFinite(d))return;let n;switch(e.key){case 'ArrowRight':case 'ArrowUp':n=video.currentTime+5;break;case 'ArrowLeft':case 'ArrowDown':n=video.currentTime-5;break;case 'Home':n=0;break;case 'End':n=d;break;case 'PageUp':n=video.currentTime+10;break;case 'PageDown':n=video.currentTime-10;break;default:return}e.preventDefault();player.store.seek(Math.max(0,Math.min(d,n)))};
$('volume').oninput=e=>{video.volume=Number(e.target.value);video.muted=video.volume===0};
$('stop').onclick=async()=>{await player.store.pause();player.store.seek(0)};
$('cc').onclick=()=>{const track=Array.from(video.textTracks).find(t=>t.kind==='captions');if(track)track.mode=track.mode==='showing'?'hidden':'showing'};
video.textTracks.addEventListener('change',()=>{$('cc').setAttribute('aria-pressed',Array.from(video.textTracks).some(t=>t.kind==='captions'&&t.mode==='showing'))});
$('full').onclick=async()=>{
 $('notice').textContent='';
 try{
  if(document.fullscreenElement){await document.exitFullscreen();return}
  const ship=document.querySelector('.ship');
  if(ship.requestFullscreen){
   try{await ship.requestFullscreen();return}catch(error){if(!video.webkitEnterFullscreen)throw error}
  }
  if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();
  else $('notice').textContent='Fullscreen is not supported by this browser.';
 }catch{$('notice').textContent='Fullscreen was not permitted. Playback still works here.'}
};
document.addEventListener('fullscreenchange',()=>$('full').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen'));
update();window.liquidOrbit={player,video};

// Preserve native activation while exposing a keyboard-held visual state.
const release=()=>document.querySelectorAll('[data-key-pressed]').forEach(button=>delete button.dataset.keyPressed);
document.addEventListener('keydown',event=>{
 if(event.key!==' '&&event.key!=='Enter')return;
 const button=event.target.closest?.('button,media-play-button,media-mute-button');
 if(button&&!button.disabled&&button.getAttribute('aria-disabled')!=='true')button.dataset.keyPressed='true';
});
document.addEventListener('keyup',release);
document.addEventListener('focusout',release);
window.addEventListener('blur',release);
