import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
const manifest=JSON.parse(readFileSync('public/assets/sprites/manifest.json'));
test('all 14 control faces have five distinct actual RGBA state assets',()=>{assert.equal(Object.keys(manifest).length,70);for(const name of ['back','play','pause','stop','forward','fullscreen','cc-off','cc-on','loop-off','loop-on','sound-on','sound-off','seek','volume']){const hashes=new Set(),sizes=new Set();for(const state of ['normal','hover','pressed','focus','disabled']){const filename=`${name}-${state}.png`;const bytes=readFileSync(`public/assets/sprites/${filename}`);assert.equal(bytes[25],6);hashes.add(createHash('sha256').update(bytes).digest('hex'));sizes.add(manifest[filename].size.join(','))}assert.equal(hashes.size,5,`${name} must use genuinely distinct images`);assert.equal(sizes.size,1,`${name} states must keep stable registered dimensions`)}});
test('CSS selects images, not simulated glass or drawn symbols',()=>{const css=readFileSync('src/sprites.css','utf8');assert.doesNotMatch(css,/gradient|drop-shadow|<svg/);for(const state of ['normal','hover','pressed','focus','disabled'])assert.ok(css.includes(`--${state}:url(`))});
