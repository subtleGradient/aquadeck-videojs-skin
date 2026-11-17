import './artwork.css';
import meta from '../public/art/coordinates.json';
export async function setupArtwork(){
 const deck=document.querySelector('.deck');
 const layer=deck.querySelector('.art-layer');
 const artUrl=file=>`${import.meta.env.BASE_URL}art/${file}`;
 for(const[name,r]of Object.entries(meta.sprites)){
 const id=name.replace('-thumb','');
 const cap=document.createElement('div');cap.className='art-cap art-'+id;cap.dataset.control=id;
 cap.style.cssText=`left:${r.x/1449*100}%;top:${r.y/1086*100}%;width:${r.width/1449*100}%;height:${r.height/1086*100}%;--cap-rest:url(${artUrl(r.file)});--cap-pressed:url(${artUrl(r.pressed)})`;
 const canvas=document.querySelector('#'+id+' .light-surface');if(canvas){canvas.style.maskImage=`url(${artUrl(r.file)})`;canvas.style.maskSize='100% 100%';cap.append(canvas)}
 if(id==='play'){for(const icon of document.querySelectorAll('#play svg'))cap.append(icon.cloneNode(true))}
 layer.append(cap);
 }
 const label=document.createElement('span');label.className='art-cc-label';layer.append(label);
 const muteFocus=document.createElement('span');muteFocus.className='art-mute-focus';layer.append(muteFocus);
 const muteCap=document.createElement('div');muteCap.className='art-mute-icon';for(const icon of document.querySelectorAll('#mute svg'))muteCap.append(icon.cloneNode(true));layer.append(muteCap);
 document.body.classList.add('artwork-mode');
 return function sync(v){
 layer.querySelector('.art-seek').style.left=((431+(v.currentTime/(v.duration||24))*649)/1449*100)+'%';
 layer.querySelector('.art-volume').style.left=((793+(v.muted?0:v.volume)*303)/1449*100)+'%';
 label.textContent=document.body.classList.contains('has-captions')?'ON':'OFF';
 };
}
