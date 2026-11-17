import '@videojs/html/video/player';
import '@videojs/html/ui/container';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/mute-button';
import './style.css';
import {setupArtwork} from './artwork.js';
import {createOptics} from './optics.js';
import {layoutChassis} from './chassis.js';
const $=s=>document.querySelector(s), v=$('#video'), player=$('#player');
await customElements.whenDefined('video-player');
const syncArtwork=await setupArtwork().catch(error=>{console.warn('Artwork unavailable; using native skin',error);document.querySelector('.art-layer')?.remove();document.body.classList.remove('artwork-mode');return ()=>{}});
const chapters=[{title:'Chromatic drift',startTime:0,endTime:8},{title:'Pearl current',startTime:8,endTime:16},{title:'Prismatic tide',startTime:16,endTime:24}];
player.store.addTextTrack({kind:'chapters',label:'Motion studies',cues:chapters.map((c,i)=>({...c,id:`scene-${i+1}`,text:c.title}))});
v.volume=.65;
const fmt=t=>`${String(Math.floor((t||0)/60)).padStart(2,'0')}:${String(Math.floor((t||0)%60)).padStart(2,'0')}`;
let active=0;
function seek(t){const result=player.store.seek(Math.max(0,Math.min(v.duration||24,t)));update();return result}
$('#chapters').innerHTML=chapters.map((c,i)=>`<button tabindex="0" data-chapter="${i}">${String(i+1).padStart(2,'0')} · ${c.title}</button>`).join('');
function syncCaptions(){const on=Array.from(v.textTracks).some(t=>t.kind==='captions'&&t.mode==='showing');$('#cc').setAttribute('aria-checked',String(on));$('#cc .cc-state').textContent=on?'ON':'OFF';document.body.classList.toggle('has-captions',on)}
v.textTracks.addEventListener('change',()=>{syncCaptions();syncArtwork(v)});
function update(){syncCaptions();syncArtwork(v);active=Math.min(2,Math.max(0,Math.floor(v.currentTime/8)));$('#status').textContent=v.ended?'FINISHED':v.paused?'PAUSED':'PLAYING';document.body.classList.toggle('playing',!v.paused);document.body.classList.toggle('is-muted',v.muted||v.volume===0);$('#time').textContent=fmt(v.currentTime);$('#duration').textContent=fmt(v.duration||24);$('#playback-time').textContent=`${fmt(v.currentTime)} / ${fmt(v.duration||24)}`;$('#compact-time').textContent=`${fmt(v.currentTime).replace(/^0/,'')} / ${fmt(v.duration||24).replace(/^0/,'')}`;if(document.activeElement!==$('#seek'))$('#seek').value=v.currentTime;$('#seek').max=v.duration||24;$('#seek').setAttribute('aria-valuetext',`${fmt(v.currentTime)} of ${fmt(v.duration||24)}`);$('#volume').value=v.muted?0:v.volume;$('#volume').setAttribute('aria-valuetext',`${Math.round((v.muted?0:v.volume)*100)} percent`);$('#track-title').textContent=`0${active+1} / ${chapters[active].title}`;$('#chapters').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-current',String(i===active)));$('#previous').disabled=active===0&&v.currentTime<.3;$('#next').disabled=active===chapters.length-1;for(const id of ['previous','next']){const button=$('#'+id);button.tabIndex=button.disabled?-1:0}}
['play','pause','ended','timeupdate','loadedmetadata','volumechange','seeked'].forEach(e=>v.addEventListener(e,update));
$('#seek').oninput=e=>seek(+e.target.value);
$('#seek').addEventListener('keydown',e=>{const duration=v.duration||24;let target;switch(e.key){case 'ArrowRight':case 'ArrowUp':target=v.currentTime+5;break;case 'ArrowLeft':case 'ArrowDown':target=v.currentTime-5;break;case 'Home':target=0;break;case 'End':target=duration;break;case 'PageUp':target=v.currentTime+10;break;case 'PageDown':target=v.currentTime-10;break;default:return}e.preventDefault();target=Math.max(0,Math.min(duration,target));e.currentTarget.value=target;seek(target)});
// Native buttons and Video.js own activation; this adds physical key-held feedback only.
const actionable='button,media-play-button,media-mute-button';
document.addEventListener('keydown',e=>{if(e.key!==' '&&e.key!=='Enter')return;const button=e.target.closest?.(actionable);if(!button||button.disabled)return;if(e.repeat){e.preventDefault();return}button.dataset.keyPressed='true'},true);
const releaseKeys=()=>document.querySelectorAll('[data-key-pressed]').forEach(b=>delete b.dataset.keyPressed);
document.addEventListener('keyup',releaseKeys,true);document.addEventListener('focusout',releaseKeys);window.addEventListener('blur',releaseKeys);
$('#volume').oninput=e=>{v.volume=+e.target.value;v.muted=v.volume===0};
$('#stop').onclick=async()=>{await player.store.pause();seek(0);await player.store.pause();$('#seek').value=0;update()};
$('#previous').onclick=()=>seek(v.currentTime-chapters[active].startTime>2?chapters[active].startTime:chapters[Math.max(0,active-1)].startTime);
$('#next').onclick=()=>seek(chapters[Math.min(chapters.length-1,active+1)].startTime);
$('#chapters').onclick=e=>{const b=e.target.closest('button');if(b)seek(chapters[+b.dataset.chapter].startTime)};
$('#cc').onclick=()=>{const t=Array.from(v.textTracks).find(t=>t.kind==='captions');if(t){t.mode=t.mode==='showing'?'hidden':'showing';$('#cc').setAttribute('aria-checked',t.mode==='showing');$('#cc .cc-state').textContent=t.mode==='showing'?'ON':'OFF';document.body.classList.toggle('has-captions',t.mode==='showing');syncArtwork(v)}};
$('#loop').onclick=()=>{v.loop=!v.loop;$('#loop').setAttribute('aria-pressed',v.loop)};
$('#fullscreen').onclick=async()=>{$('#notice').textContent='';try{if(document.fullscreenElement)await document.exitFullscreen();else if($('.deck').requestFullscreen)await $('.deck').requestFullscreen();else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();else $('#notice').textContent='This browser does not support fullscreen. Playback still works in the page.'}catch{$('#notice').textContent='Fullscreen was not permitted by this browser. Playback still works in the page.'}};
document.addEventListener('fullscreenchange',()=>$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit full screen':'Enter full screen'));
v.addEventListener('error',()=>{$('#status').textContent='LOAD ERROR';$('#notice').textContent='The film could not load. Please reload to try again.'});
$('.state-grid').onclick=e=>{const b=e.target.closest('button');if(b)$('#sample-note').textContent=`${b.getAttribute('aria-label').replace(' button sample','')} pressed. These are material samples, not playback controls.`};
layoutChassis();
const optics=createOptics(v,[...document.querySelectorAll('.light-surface')],mode=>{$('#renderer').textContent=mode;$('#support').textContent=mode==='WEBGL · LIVE REFRACTION'?'Active: WebGL video-texture optics. The shader distorts and separates sampled video frames inside the aqua control lenses. This is genuine image warping, not physical ray tracing. HTML-in-canvas is not required or used in this build.':mode==='CANVAS · LENS OPTICS'?'Active: Canvas 2D lens fallback. Mirrored video scanlines are displaced to create a simpler cylindrical refraction. WebGL chromatic lens optics are unavailable here. The real HTML controls work unchanged.':'Active: static pearl surfaces. Live decorative effects are disabled; playback and every control still work.'});
function syncEffects(){const on=optics.enabled;document.body.classList.toggle('no-effects',!on);$('#effects').setAttribute('aria-pressed',on)}
$('#effects').onclick=()=>{optics.setEnabled(!optics.enabled);syncEffects()};optics.onChange=syncEffects;syncEffects();update();
window.aquadeck={player,video:v,chapters,seek,optics};

// Consistent sequential navigation inside this demo, including Safari's native-control
// skipping preference. Keep semantic native controls and DOM order. Never wrap at ends.
document.addEventListener('keydown',event=>{
 if(event.key!=='Tab'||event.altKey||event.ctrlKey||event.metaKey||event.defaultPrevented)return;
 const scope='video-player,.below-player';
 if(!document.activeElement.closest(scope)||event.target.closest('textarea,input:not([type="range"]),[contenteditable="true"]'))return;
 const controls=[...document.querySelectorAll('a[href],button,input[type="range"],summary,media-play-button,media-mute-button')].filter(el=>!el.disabled&&el.getAttribute('aria-disabled')!=='true'&&el.tabIndex>=0&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
 const current=controls.indexOf(document.activeElement),next=current+(event.shiftKey?-1:1);
 if(current>=0&&next>=0&&next<controls.length&&controls[next].closest(scope)){event.preventDefault();controls[next].focus()}
 // At the first/last item, native Tab/Shift+Tab leaves the page normally.
});

$('#form-study').onclick=()=>{const on=document.body.classList.toggle('form-study');$('#form-study').setAttribute('aria-pressed',on)};

import './desktop.css';
import './desktop.js';
