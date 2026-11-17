import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sprites=['play','pause','stop','mute','sound','cc','cc-on','fullscreen','thumb','track'];
const states=['normal','hover','pressed','focus','disabled'];
test('every control surface ships five distinct generated PNG states',()=>{
 for(const name of sprites){const hashes=new Set();for(const state of states){const data=readFileSync(new URL(`../public/buttons/${name}-${state}.png`,import.meta.url));assert.equal(data.subarray(1,4).toString(),'PNG');hashes.add(createHash('sha256').update(data).digest('hex'))}assert.equal(hashes.size,5,`${name}: duplicate state images`)}
});
test('sprite state artwork is used without CSS surface recreation',()=>{const css=readFileSync(new URL('../src/sprites.css',import.meta.url),'utf8');assert.match(css,/button:focus-visible::before/);assert.match(css,/button:disabled::before/);assert.match(css,/button\[data-key-pressed=true\]::before/);assert.doesNotMatch(css,/linear-gradient|radial-gradient/)});
