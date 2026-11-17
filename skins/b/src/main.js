import '@videojs/html/video/player';
import '@videojs/html/ui/container';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/mute-button';
import './style.css';
const $=s=>document.querySelector(s),video=$('#video'),player=$('#player');
await customElements.whenDefined('video-player');
const format=t=>Number.isFinite(t)?`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`:'00:00';
video.volume=.65;
let dragging=false;
const duration=()=>Number.isFinite(video.duration)?video.duration:24;
function sync(){
 document.body.classList.toggle('playing',!video.paused);document.body.classList.toggle('muted',video.muted||video.volume===0);
 $('#time').textContent=`${format(video.currentTime)} / ${format(duration())}`;
 $('#status').textContent=video.ended?'TRANSMISSION ENDED':video.paused?'READY / PAUSED':'RECEIVING';
 $('#seek').disabled=!Number.isFinite(video.duration);$('#seek').max=duration();if(!dragging)$('#seek').value=video.currentTime;
 $('#seek').setAttribute('aria-valuetext',`${format(video.currentTime)} of ${format(duration())}`);
 $('#volume').value=video.muted?0:video.volume;$('#volume').setAttribute('aria-valuetext',`${Math.round((video.muted?0:video.volume)*100)} percent`);
 const captions=Array.from(video.textTracks).some(t=>t.kind==='captions'&&t.mode==='showing');
 $('#captions').setAttribute('aria-pressed',String(captions));$('#captions span').textContent=captions?'ON':'OFF';
}
function seek(value){player.store.seek(Math.max(0,Math.min(duration(),value)));sync()}
$('#seek').addEventListener('pointerdown',()=>dragging=true);
for(const name of ['pointerup','pointercancel','blur'])window.addEventListener(name,()=>{dragging=false;sync()});
$('#seek').oninput=e=>seek(Number(e.target.value));
$('#seek').onkeydown=e=>{const delta={ArrowRight:5,ArrowUp:5,ArrowLeft:-5,ArrowDown:-5,PageUp:10,PageDown:-10};let target;if(e.key in delta)target=video.currentTime+delta[e.key];else if(e.key==='Home')target=0;else if(e.key==='End')target=duration();else return;e.preventDefault();seek(target)};
$('#volume').oninput=e=>{video.volume=Number(e.target.value);video.muted=video.volume===0};
$('#stop').onclick=async()=>{await player.store.pause();seek(0)};
$('#captions').onclick=()=>{const track=Array.from(video.textTracks).find(t=>t.kind==='captions');if(track)track.mode=track.mode==='showing'?'hidden':'showing';sync()};
video.textTracks.addEventListener('change',sync);
$('#loop').onclick=()=>{video.loop=!video.loop;$('#loop').setAttribute('aria-pressed',String(video.loop));$('#loop span').textContent=video.loop?'ON':'OFF'};
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('.gadget').requestFullscreen)await $('.gadget').requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else $('#notice').textContent='Fullscreen is unavailable in this browser. Playback still works here.'}catch{$('#notice').textContent='Fullscreen was not allowed by this browser. Playback still works here.'}};
document.addEventListener('fullscreenchange',()=>$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit full screen':'Enter full screen'));
for(const name of ['play','pause','ended','timeupdate','loadedmetadata','volumechange','seeked'])video.addEventListener(name,sync);
video.addEventListener('waiting',()=>$('#status').textContent='BUFFERING');
for(const name of ['playing','canplay'])video.addEventListener(name,()=>{$('#error').textContent='';sync()});
video.addEventListener('error',()=>{$('#error').textContent='Transmission interrupted. Reload to reconnect.';$('#status').textContent='LOAD ERROR'});
sync();window.nebula={video,player,seek};
