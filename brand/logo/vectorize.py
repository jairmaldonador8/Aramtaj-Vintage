import numpy as np, potrace, sys
from PIL import Image, ImageFilter
im=Image.open('original.png').convert('RGBA')
a=np.asarray(im.split()[3],dtype=np.float32)/255
rgb=np.asarray(im.convert('RGB'),dtype=np.float32).mean(axis=2)/255
cov=a*np.clip((rgb-0.55)/0.45,0,1)
c=Image.fromarray((cov*255).astype('uint8'))
S=4
big=c.resize((c.width*S,c.height*S),Image.LANCZOS).filter(ImageFilter.GaussianBlur(S*0.6))
mask=np.asarray(big)<=127
path=potrace.Bitmap(mask).trace(turdsize=40, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
f=lambda p:f"{p.x/S:.2f} {p.y/S:.2f}"
parts=[]
for curve in path:
    d=["M"+f(curve.start_point)]
    for seg in curve.segments:
        d.append(("L"+f(seg.c)+"L"+f(seg.end_point)) if seg.is_corner else ("C"+f(seg.c1)+" "+f(seg.c2)+" "+f(seg.end_point)))
    d.append("Z"); parts.append("".join(d))
bb=Image.fromarray(((cov>0.5)*255).astype('uint8')).getbbox(); x0,y0,x1,y1=bb
print('bbox',bb,'curves',len(path))
open('aramtaj-logo.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1-x0} {y1-y0}" fill="currentColor" role="img" aria-label="Aram Taj Vintage Bijoux"><path fill-rule="evenodd" d="{"".join(parts)}"/></svg>\n')
