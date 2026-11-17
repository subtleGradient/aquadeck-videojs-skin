import {test} from 'node:test';
import assert from 'node:assert/strict';
import {activatePlayback} from '../src/transport.js';
test('play is called synchronously in the activation stack',()=>{let calls=0;const v={paused:true,ended:false,play(){calls++;return Promise.resolve()}};activatePlayback(v,()=>assert.fail());assert.equal(calls,1)});
test('playing toggles to pause exactly once',()=>{let pauses=0;activatePlayback({paused:false,ended:false,pause(){pauses++},play(){assert.fail()}},()=>assert.fail());assert.equal(pauses,1)});
test('rejected playback presents actionable feedback',async()=>{const messages=[];activatePlayback({paused:true,play:()=>Promise.reject(new Error('NotAllowedError'))},m=>messages.push(m));await Promise.resolve();assert.match(messages[0],/Tap Play/)});
test('synchronous media exceptions present feedback',()=>{let message;activatePlayback({paused:true,play(){throw new Error('NotSupportedError')}},m=>message=m);assert.match(message,/could not start/)});
test('ended video replays rather than pauses',()=>{let played=false;activatePlayback({paused:false,ended:true,play(){played=true}},()=>assert.fail());assert.equal(played,true)});
