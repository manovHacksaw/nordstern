from PIL import Image
import math

img = Image.open('/Users/manobendramandal/Desktop/code/nordstern/frontend/assets/2.png')
img = img.convert("RGBA")
datas = img.getdata()

bg_color = (238, 240, 252)
tolerance = 60  # generous tolerance since it's a generated image, might have gradients

newData = []
for item in datas:
    dist = math.sqrt((item[0] - bg_color[0])**2 + (item[1] - bg_color[1])**2 + (item[2] - bg_color[2])**2)
    if dist < tolerance:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)
img.save('/Users/manobendramandal/Desktop/code/nordstern/frontend/landing/public/logo.png', "PNG")
print("Done")
