"""Slice registered, illustrated state assets. No recoloring or material simulation."""
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
out=root/'public/assets/sprites';out.mkdir(exist_ok=True)
manifest={}
states=['normal','hover','pressed','focus','disabled']
plans=[('transport-states.png',['back','play','pause','stop','forward','fullscreen'],[124,350,575,800,1025,1250],[158,380,603,826,1050],225,200),('switch-states.png',['cc-off','cc-on','loop-off','loop-on','sound-on','sound-off'],[125,350,575,800,1025,1250],[173,379,589,795,1002],225,100),('thumb-states.png',['seek','volume'],[268,749],[165,466,766,1067,1368],None,None)]
for filename,names,xs,ys,w,h in plans:
 im=Image.open(root/'artwork-source'/filename).convert('RGBA')
 for col,(name,x) in enumerate(zip(names,xs)):
  width,height=(200,280) if name=='seek' else (260,200) if name=='volume' else (w,h)
  for state,y in zip(states,ys):
   box=(x-width//2,y-height//2,x+width//2,y+height//2)
   cell=im.crop(box);dest=f'{name}-{state}.png';cell.save(out/dest,optimize=True)
   manifest[dest]={'source':filename,'crop':box,'size':cell.size}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
