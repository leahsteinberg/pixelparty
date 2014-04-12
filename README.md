# This is Pixel Party
## not a game, a diversion.
Draw a doodle that you control as little red dots come flying at you. Press space bar to turn your doodle into a square and press space bar again to get your original doodle back.
Throw the doodle into the wall to compact it down. Then when it hits a red dot, it'll explode. The red dots deform the doodle, but if it ever gets too far apart, the doodle will automatically get home.

I wrote this as I was learning Javascript. All of the animation is done from scratch using HTML 5 canvas

##### It is simple but addictive.

###How it works:
Multiple physics elements are going on here. When you draw the doodle, the center is recorded and used to move the doodle around. Pressing the arrows speeds up the doodle, but friction will slow it down. When the pixels get hit out of place, they fly away from whatever hit them. When the doodle re-coheres, either because the space bar was pressed or the pixels were too far away from eachother, they slowly move back into place, and the rate of their movement also changes, so at first they're moving quickly and then they slowly glide back.

I use game loop to accept user input and redraw the canvas. 

