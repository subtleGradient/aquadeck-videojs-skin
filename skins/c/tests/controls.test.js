import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
async function setup(){
 const els=new Map();const element=()=>({attrs:{},listeners:{},setAttribute(k,v){this.attrs[k]=String(v)},addEventListener(k,v){this.listeners[k]=v}});
 const get=s=>{if(!els.has(s))els.set(s,element());return els.get(s)};
 const tracks=[{kind:'captions',mode:'hidden'}];tracks.addEventListener=()=>{};
 const video=Object.assign(get('#video'),{volume:.65,muted:false,duration:24,currentTime:0,paused:true,ended:false,textTracks:tracks});
 get('#player').store={play:async()=>{video.paused=false},pause:async()=>{video.paused=true},seek:t=>{video.currentTime=t}};
 const context={document:{querySelector:get,addEventListener(){},fullscreenElement:null},customElements:{whenDefined:async()=>{}},window:{addEventListener(){}},console};
 await vm.runInNewContext(`(async()=>{${readFileSync('src/main.js','utf8').replace(/^import .*;$/gm,'')}})()`,context);
 return {get,video};
}
test('zero-volume unmute actually restores audible playback',async()=>{const {get,video}=await setup();video.volume=0;video.muted=false;get('#mute').onclick();assert.equal(video.volume,.65);assert.equal(video.muted,false);get('#mute').onclick();assert.equal(video.muted,true)});
test('native controls use player and clamp seeks',async()=>{const {get,video}=await setup();await get('#play').onclick();assert.equal(video.paused,false);await get('#play').onclick();assert.equal(video.paused,true);video.currentTime=23;get('#forward').onclick();assert.equal(video.currentTime,24);await get('#stop').onclick();assert.equal(video.currentTime,0);get('#back').onclick();assert.equal(video.currentTime,0)});
test('keyboard seek and caption/loop state',async()=>{const {get,video}=await setup();get('#seek').onkeydown({key:'End',preventDefault(){}});assert.equal(video.currentTime,24);get('#cc').onclick();assert.equal(video.textTracks[0].mode,'showing');assert.equal(get('#cc').attrs['aria-pressed'],'true');get('#loop').onclick();assert.equal(video.loop,true)});
test('pre-metadata seek disabled and guarded',async()=>{const {get,video}=await setup();video.duration=NaN;video.listeners.loadedmetadata();assert.equal(get('#seek').disabled,true);get('#forward').onclick();assert.equal(video.currentTime,0)});
test('caption failure stays visibly unavailable',async()=>{const {get,video}=await setup();get('track').listeners.error();video.listeners.timeupdate();assert.equal(get('#cc').disabled,true);assert.equal(get('#cc span').textContent,'N/A')});
