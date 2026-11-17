import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=new URL('../',import.meta.url);
const read=name=>fs.readFileSync(new URL(name,root),'utf8');
test('ESM package has public code, types, stylesheet and peer contract',()=>{const p=JSON.parse(read('package.json'));assert.equal(p.type,'module');assert.equal(p.license,'Apache-2.0');assert.equal(p.peerDependencies['@videojs/html'],'^10.4.0');for(const file of ['index.js','index.d.ts','style.css','LICENSE','README.md','NOTICE.md'])assert.ok(fs.existsSync(new URL(file,root)))});
test('All coordinate sprites and pressed variants exist and fit canvas',()=>{const m=JSON.parse(read('assets/coordinates.json'));for(const r of Object.values(m.sprites)){assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=m.width&&r.y+r.height<=m.height);for(const file of [r.file,r.pressed]){const bytes=fs.readFileSync(new URL('assets/'+file,root));assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes.readUInt32BE(16),r.width);assert.equal(bytes.readUInt32BE(20),r.height)}}});
test('No document-global selectors or injected IDs',()=>{const s=read('index.js');assert.ok(!s.includes('document.querySelector'));assert.ok(!s.includes('.id='));assert.ok(s.includes('abort.abort()'));assert.ok(s.includes('cancelAnimationFrame(frame)'));assert.ok(s.includes('root.remove()'))});
test('Captions down off and up on are explicit, with semantic state',()=>{const css=read('style.css'),js=read('index.js');assert.ok(css.includes('.aqdk-cap-cc{translate:0 3.7957cqw}'));assert.ok(css.includes('.aqdk-captions-on .aqdk-cap-cc{translate:0 0}'));assert.ok(js.includes("setAttribute('aria-checked',String(on))"));assert.ok(js.includes("setAttribute('role','switch')"))});
test('Disabled native controls cannot receive hover/pressed material styling',()=>{const css=read('style.css');assert.ok(css.includes('.aqdk-cap.is-pressed:not(.is-disabled)'));assert.ok(css.includes('.aqdk-cap.is-hover:not(.is-disabled)'));assert.ok(css.includes('input[type=range]:active:not(:disabled)::-webkit-slider-thumb'));assert.ok(css.includes('input[type=range]:active:not(:disabled)::-moz-range-thumb'));assert.ok(!css.includes('.aqdk-control:active{'))});
test('Unmute recovers audible volume after the slider reaches zero',()=>{
 const source=read('index.js');
 const body=source.match(/listen\(buttons\.mute,'click',\(\)=>\{(.*?)\}\);/)[1];
 const video={volume:0,muted:true};let synced=0;
 const click=new Function('video','sync',body);
 const sync=()=>synced++;
 click(video,sync);assert.equal(video.volume,1);assert.equal(video.muted,false);
 click(video,sync);assert.equal(video.muted,true);
 click(video,sync);assert.equal(video.muted,false);
 video.volume=.35;click(video,sync);click(video,sync);assert.equal(video.volume,.35);
 video.volume=0;video.muted=false;click(video,sync);assert.equal(video.volume,1);assert.equal(video.muted,false);
 assert.equal(synced,6);
});

test('Small mounts retain the artwork control layer without a separate dock',()=>{
 const css=read('style.css'),js=read('index.js');
 assert.ok(css.includes('.aqdk-controls{position:absolute;inset:0}'));
 assert.ok(css.includes('min-width:0;min-height:0'));
 assert.ok(!css.includes('@container(max-width:760px)'));
 assert.ok(!js.includes('USE CONTROLS BELOW'));
});

test('Reduced motion follows OS only until an explicit reflection preference',()=>{
 const resolve=(preference,reduced)=>preference??!reduced;
 assert.equal(resolve(false,false),false);
 assert.equal(resolve(true,true),true);
 assert.equal(resolve(undefined,true),false);
 assert.equal(resolve(undefined,false),true);
 assert.ok(read('index.js').includes('applyReflections(reflectionPreference??!motion.matches)'));
});
test('Time readout is not a constantly announcing live region',()=>{
 assert.ok(read('index.js').includes("readout.setAttribute('aria-live','off')"));
});
test('Reflections skip unchanged paused frames and avoid unchanged canvas allocations',()=>{
 const source=read('index.js');
 assert.ok(source.includes('(reflectionDirty||video.currentTime!==lastVideoTime)'));
 assert.ok(source.includes('if(canvas.width!==120)canvas.width=120'));
 assert.ok(source.includes('if(canvas.height!==height)canvas.height=height'));
});
test('Fullscreen includes an iOS video fallback and native state labels',()=>{
 const source=read('index.js');
 assert.ok(source.includes('else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen()'));
 assert.ok(source.includes("listen(video,'webkitbeginfullscreen'"));
 assert.ok(source.includes("listen(video,'webkitendfullscreen'"));
});
test('CC state text has at least 4.5:1 contrast across the track gradient',()=>{
 const luminance=hex=>{const c=hex.match(/../g).map(h=>parseInt(h,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
 for(const background of ['74858d','8e969b','a2a6a9','969da1','6f838d'])assert.ok((luminance(background)+.05)/(luminance('06131b')+.05)>=4.5);
 assert.ok(read('style.css').includes('.aqdk-cc-label{color:#06131b}'));
});
