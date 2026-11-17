import '@videojs/html/video/player';
import '@videojs/html/ui/container';

const bundledAssets={
'next.png':new URL('./assets/next.png',import.meta.url).href,
'previous.png':new URL('./assets/previous.png',import.meta.url).href,
'play.png':new URL('./assets/play.png',import.meta.url).href,
'cc-thumb.png':new URL('./assets/cc-thumb.png',import.meta.url).href,
'seek-thumb.png':new URL('./assets/seek-thumb.png',import.meta.url).href,
'next-pressed.png':new URL('./assets/next-pressed.png',import.meta.url).href,
'chassis.png':new URL('./assets/chassis.png',import.meta.url).href,
'stop-pressed.png':new URL('./assets/stop-pressed.png',import.meta.url).href,
'previous-pressed.png':new URL('./assets/previous-pressed.png',import.meta.url).href,
'volume-thumb.png':new URL('./assets/volume-thumb.png',import.meta.url).href,
'cc-thumb-pressed.png':new URL('./assets/cc-thumb-pressed.png',import.meta.url).href,
'play-pressed.png':new URL('./assets/play-pressed.png',import.meta.url).href,
'seek-thumb-pressed.png':new URL('./assets/seek-thumb-pressed.png',import.meta.url).href,
'stop.png':new URL('./assets/stop.png',import.meta.url).href,
'fullscreen.png':new URL('./assets/fullscreen.png',import.meta.url).href,
'volume-thumb-pressed.png':new URL('./assets/volume-thumb-pressed.png',import.meta.url).href,
'fullscreen-pressed.png':new URL('./assets/fullscreen-pressed.png',import.meta.url).href
};
const sprites={play:[96,744,131,217],stop:[222,747,103,213],previous:[416,817,114,90],next:[529,817,110,90],fullscreen:[1231,619,99,100],cc:[1263,436,81,77],seek:[431,723,47,48],volume:[793,839,48,47]};
const fileFor=id=>['cc','seek','volume'].includes(id)?`${id}-thumb`:id;
const icons={
 play:'<path d="m8 5 11 7-11 7Z"/>',pause:'<path d="M7 5h4v14H7zM15 5h4v14h-4z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="1"/>',
 previous:'<path d="M4 5h3v14H4zM19 5v14L8 12z"/>',next:'<path d="M17 5h3v14h-3zM5 5l11 7-11 7z"/>',
 mute:'<path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 8q5 4 0 8M19 4q9 8 0 16" fill="none" stroke="currentColor" stroke-width="2"/>',
 muted:'<path d="M3 9h4l5-4v14l-5-4H3z"/><path d="m16 9 6 6m0-6-6 6" fill="none" stroke="currentColor" stroke-width="2"/>',
 fullscreen:'<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'
};
function setIcon(element,name){if(element.dataset.icon===name)return;element.dataset.icon=name;element.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name]}</svg>`}

const time=t=>`${Math.floor((t||0)/60)}:${String(Math.floor((t||0)%60)).padStart(2,'0')}`;
/** Mount a self-contained Video.js 10 skin. Does not modify the host's other children. */
export async function mountAquaDeck(host,options={}){
 if(!(host instanceof HTMLElement))throw new TypeError('host must be an HTMLElement');
 if(!options.src)throw new TypeError('src is required');
 await customElements.whenDefined('video-player');
 const abort=new AbortController(),signal=abort.signal;
 const listen=(el,type,fn)=>el.addEventListener(type,fn,{signal});
 const root=document.createElement('section');root.className='aqdk';root.setAttribute('aria-label',options.label||'AquaDeck video player');
 const player=document.createElement('video-player');player.className='aqdk-player';root.append(player);
 const stage=document.createElement('div');stage.className='aqdk-stage';player.append(stage);
 const art=document.createElement('div');art.className='aqdk-art';art.setAttribute('aria-hidden','true');stage.append(art);
 const asset=name=>options.assetBase?new URL(name,new URL(options.assetBase,document.baseURI)).href:bundledAssets[name];
 const base=document.createElement('img');base.src=asset('chassis.png');base.alt='';base.className='aqdk-base';art.append(base);
 const aperture=document.createElement('media-container');aperture.className='aqdk-screen';stage.append(aperture);
 const video=document.createElement('video');video.playsInline=true;video.preload='metadata';video.crossOrigin=options.crossOrigin||'anonymous';video.src=options.src;if(options.poster)video.poster=options.poster;aperture.append(video);
 for(const caption of options.captions||[]){const t=document.createElement('track');t.kind='captions';t.src=caption.src;t.srclang=caption.language||'en';t.label=caption.label||t.srclang;video.append(t)}
 const chapters=(options.chapters||[]).filter(c=>Number.isFinite(c.startTime)&&c.startTime>=0).map(c=>({...c})).sort((a,b)=>a.startTime-b.startTime);
 const controls=document.createElement('div');controls.className='aqdk-controls';player.append(controls);
 const help=document.createElement('p');help.className='aqdk-dock-label';help.textContent='PLAYER PREVIEW ABOVE · USE CONTROLS BELOW';controls.append(help);
 const notice=document.createElement('p');notice.className='aqdk-notice';notice.setAttribute('role','status');root.append(notice);
 const readout=document.createElement('output');readout.className='aqdk-time';root.append(readout);
 const buttons={},caps={},canvases=[];
 const make=(id,label)=>{const b=document.createElement('button');b.type='button';b.tabIndex=0;b.className=`aqdk-control aqdk-${id}`;b.setAttribute('aria-label',label);if(icons[id])setIcon(b,id);else b.textContent=label;controls.append(b);buttons[id]=b;return b};
 const makeRange=(id,label,max,step)=>{const input=document.createElement('input');input.type='range';input.tabIndex=0;input.min='0';input.max=String(max);input.step=String(step);input.className=`aqdk-control aqdk-${id}`;input.setAttribute('aria-label',label);controls.append(input);buttons[id]=input;return input};
 makeRange('seek','Video position',1,.01);make('play','Play');make('stop','Stop and rewind');make('previous','Previous chapter');make('next','Next chapter');make('mute','Mute');makeRange('volume','Volume',1,.01);make('cc','Captions');buttons.cc.setAttribute('role','switch');buttons.cc.setAttribute('aria-checked','false');make('fullscreen','Enter fullscreen');
 for(const[id,r]of Object.entries(sprites)){
  const cap=document.createElement('span');cap.className=`aqdk-cap aqdk-cap-${id}`;cap.style.cssText=`left:${r[0]/1449*100}%;top:${r[1]/1086*100}%;width:${r[2]/1449*100}%;height:${r[3]/1086*100}%;--aqdk-rest:url("${asset(fileFor(id)+'.png')}");--aqdk-pressed:url("${asset(fileFor(id)+'-pressed.png')}")`;
  if(!['seek','volume','cc'].includes(id)){const canvas=document.createElement('canvas');canvas.className='aqdk-optics';canvas.style.maskImage=`url("${asset(fileFor(id)+'.png')}")`;canvas.style.maskSize='100% 100%';cap.append(canvas);canvases.push(canvas)}
  if(id==='play'){const glyph=document.createElement('span');glyph.className='aqdk-play-glyph';cap.append(glyph)}
  art.append(cap);caps[id]=cap;
 }
 const muteGlyph=document.createElement('span');muteGlyph.className='aqdk-mute-glyph';art.append(muteGlyph);caps.mute=muteGlyph;
 const ccLabel=document.createElement('span');ccLabel.className='aqdk-cc-label';art.append(ccLabel);
 const actionBar=document.createElement('div');actionBar.className='aqdk-extra';root.append(actionBar);
 const opticsButton=document.createElement('button');opticsButton.type='button';opticsButton.textContent='Live reflections';opticsButton.setAttribute('aria-pressed','true');actionBar.append(opticsButton);
 const loopButton=document.createElement('button');loopButton.type='button';loopButton.textContent='Loop';loopButton.setAttribute('aria-pressed','false');actionBar.append(loopButton);
 host.append(root);
 if(chapters.length)player.store.addTextTrack({kind:'chapters',label:'Chapters',cues:chapters.map((c,i)=>({id:`chapter-${i}`,startTime:c.startTime,endTime:c.endTime??chapters[i+1]?.startTime??Number.MAX_SAFE_INTEGER,text:c.title}))});
 // Scoped traversal workaround; native Tab owns boundaries and everything outside.
 listen(root,'keydown',event=>{
  if(event.key!=='Tab'||event.altKey||event.ctrlKey||event.metaKey||event.defaultPrevented||event.target.closest('textarea,input:not([type=range]),[contenteditable=true]'))return;
  const all=[...root.querySelectorAll('button,input[type=range],a[href],summary')].filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  const i=all.indexOf(document.activeElement),next=i+(event.shiftKey?-1:1);
  if(i>=0&&next>=0&&next<all.length){event.preventDefault();all[next].focus()}
 });
 let disposed=false,frame=0,last=0;const motion=matchMedia('(prefers-reduced-motion: reduce)');let opticsEnabled=options.reflections!==false&&!motion.matches;
 const seek=t=>player.store.seek(Math.max(0,Math.min(Number.isFinite(video.duration)?video.duration:Number.MAX_SAFE_INTEGER,t)));
 function sync(){
  if(disposed)return;
  buttons.play.setAttribute('aria-label',video.paused?'Play':'Pause');setIcon(buttons.play,video.paused?'play':'pause');setIcon(caps.play.querySelector('.aqdk-play-glyph'),video.paused?'play':'pause');
  const muted=video.muted||video.volume===0;buttons.mute.setAttribute('aria-label',muted?'Unmute':'Mute');setIcon(buttons.mute,muted?'muted':'mute');setIcon(muteGlyph,muted?'muted':'mute');
  const duration=Number.isFinite(video.duration)?video.duration:0;buttons.seek.max=String(duration||1);buttons.seek.value=String(video.currentTime);buttons.seek.disabled=!duration;buttons.seek.setAttribute('aria-valuetext',`${time(video.currentTime)} of ${time(duration)}`);buttons.volume.value=String(muted?0:video.volume);buttons.volume.setAttribute('aria-valuetext',`${Math.round((muted?0:video.volume)*100)} percent`);
  caps.seek.style.left=`${(431+(duration?video.currentTime/duration:0)*649)/1449*100}%`;caps.volume.style.left=`${(793+(muted?0:video.volume)*303)/1449*100}%`;
  const on=[...video.textTracks].some(t=>t.kind==='captions'&&t.mode==='showing');buttons.cc.setAttribute('aria-checked',String(on));buttons.cc.textContent=on?'CC ON':'CC OFF';buttons.cc.disabled=!(options.captions||[]).length;root.classList.toggle('aqdk-captions-on',on);ccLabel.textContent=on?'ON':'OFF';
  buttons.previous.disabled=!chapters.some(c=>c.startTime<video.currentTime-.3);buttons.next.disabled=!chapters.some(c=>c.startTime>video.currentTime+.3);
  for(const[id,b]of Object.entries(buttons)){caps[id]?.classList.toggle('is-disabled',b.disabled)}
  readout.textContent=`${time(video.currentTime)} / ${time(duration)}`;
 }
 for(const[id,b]of Object.entries(buttons)){
  for(const[type,on]of [['pointerenter',true],['pointerleave',false]])listen(b,type,()=>caps[id]?.classList.toggle('is-hover',on));
  listen(b,'focus',()=>caps[id]?.classList.add('is-focus'));listen(b,'blur',()=>{caps[id]?.classList.remove('is-focus','is-pressed')});
  listen(b,'pointerdown',()=>{if(!b.disabled)caps[id]?.classList.add('is-pressed')});
  listen(b,'keydown',e=>{if((e.key===' '||e.key==='Enter')&&!b.disabled)caps[id]?.classList.add('is-pressed')});
 }
 const release=()=>Object.values(caps).forEach(c=>c.classList.remove('is-pressed'));listen(window,'pointerup',release);listen(window,'pointercancel',release);listen(window,'keyup',release);listen(window,'blur',release);
 listen(buttons.play,'click',()=>{Promise.resolve(video.paused?player.store.play():player.store.pause()).catch(()=>{notice.textContent='Playback was blocked. Try pressing Play again.'})});
 listen(buttons.stop,'click',async()=>{await player.store.pause();await seek(0);sync()});
 listen(buttons.previous,'click',()=>seek([...chapters].reverse().find(c=>c.startTime<video.currentTime-.3)?.startTime||0));listen(buttons.next,'click',()=>{const c=chapters.find(c=>c.startTime>video.currentTime+.3);if(c)seek(c.startTime)});
 listen(buttons.mute,'click',()=>{const silent=video.muted||video.volume===0;if(silent&&video.volume===0)video.volume=1;video.muted=!silent;sync()});listen(buttons.volume,'input',()=>{video.volume=Number(buttons.volume.value);video.muted=video.volume===0});listen(buttons.seek,'input',()=>seek(Number(buttons.seek.value)));
 listen(buttons.seek,'keydown',e=>{let t;switch(e.key){case'ArrowRight':case'ArrowUp':t=video.currentTime+5;break;case'ArrowLeft':case'ArrowDown':t=video.currentTime-5;break;case'Home':t=0;break;case'End':t=video.duration;break;case'PageUp':t=video.currentTime+10;break;case'PageDown':t=video.currentTime-10;break;default:return}e.preventDefault();if(Number.isFinite(t))seek(t)});
 listen(buttons.cc,'click',()=>{const tracks=[...video.textTracks].filter(t=>t.kind==='captions');const on=tracks.some(t=>t.mode==='showing');tracks.forEach((t,i)=>{t.mode=!on&&i===0?'showing':'hidden'});sync()});
 listen(buttons.fullscreen,'click',async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();notice.textContent=''}catch{notice.textContent='Fullscreen was not permitted by this browser.'}});listen(document,'fullscreenchange',()=>buttons.fullscreen.setAttribute('aria-label',document.fullscreenElement===root?'Exit fullscreen':'Enter fullscreen'));
 listen(loopButton,'click',()=>{video.loop=!video.loop;loopButton.setAttribute('aria-pressed',String(video.loop))});
 function setReflections(on){opticsEnabled=!!on;opticsButton.setAttribute('aria-pressed',String(opticsEnabled));root.classList.toggle('aqdk-static',!opticsEnabled)}listen(opticsButton,'click',()=>setReflections(!opticsEnabled));listen(motion,'change',()=>setReflections(!motion.matches));setReflections(opticsEnabled);
 for(const event of ['loadedmetadata','timeupdate','play','pause','volumechange','seeked','ended'])listen(video,event,sync);listen(video,'error',()=>{notice.textContent='Video could not load. Check the media URL and cross-origin policy.'});listen(video.textTracks,'change',sync);
 // Same-origin/CORS-enabled footage only. Reflections are optional, not player controls.
 function draw(now){if(disposed)return;if(opticsEnabled&&video.readyState>=2&&!document.hidden&&now-last>80){last=now;try{for(const canvas of canvases){const r=canvas.getBoundingClientRect();canvas.width=120;canvas.height=Math.max(1,Math.round(120*r.height/Math.max(r.width,1)));const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(0,canvas.height);ctx.scale(1,-1);ctx.drawImage(video,0,0,canvas.width,canvas.height);ctx.restore()}}catch{setReflections(false)}}frame=requestAnimationFrame(draw)}frame=requestAnimationFrame(draw);sync();
 return {root,player,video,seek,play:()=>player.store.play(),pause:()=>player.store.pause(),setReflections,dispose(){if(disposed)return;disposed=true;abort.abort();cancelAnimationFrame(frame);video.pause();video.removeAttribute('src');video.load();root.remove()}};
}
