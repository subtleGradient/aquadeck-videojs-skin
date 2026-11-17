from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]/'public/art'
rows=['normal','hover','pressed','focus','disabled']
for sheet,cols in [('transport-sheet.png',['play','pause','stop','sound','muted','fullscreen']),('auxiliary-sheet.png',['captions','loop','seek','volume'])]:
 im=Image.open(root/sheet).convert('RGBA'); w,h=im.size
 for row,state in enumerate(rows):
  for col,name in enumerate(cols):
   # Generated auxiliary objects do not follow the requested uniform grid.
   # Measured gutters prevent clipping the loop lens or including adjacent CC art.
   xs=[0,320,630,892,w] if sheet=='auxiliary-sheet.png' else [round(i*w/len(cols)) for i in range(len(cols)+1)]
   ys=[0,310,585,850,1130,h] if sheet=='auxiliary-sheet.png' else [round(i*h/5) for i in range(6)]
   tile=im.crop((xs[col],ys[row],xs[col+1],ys[row+1]))
   # Detect solid object bounds, retaining original alpha in the exported crop.
   bbox=tile.getchannel('A').point(lambda a:255 if a>160 else 0).getbbox()
   if bbox:tile=tile.crop((max(0,bbox[0]-3),max(0,bbox[1]-3),min(tile.width,bbox[2]+3),min(tile.height,bbox[3]+3)))
   tile.thumbnail((240,210),Image.Resampling.LANCZOS)
   out=Image.new('RGBA',(256,256));out.alpha_composite(tile,((256-tile.width)//2,(256-tile.height)//2));out.save(root/'sprites'/f'{name}-{state}.png')
print('Sliced 50 genuine generated-state sprites, alpha preserved.')
