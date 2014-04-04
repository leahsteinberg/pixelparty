//green - 10, 242, 157
//blue - 10, 203, 242
//pink - 223, 10, 242


//TO DO:

//Make doodle bounce off of the blocks
// make the blocks get deleted if they are off the screen
//make some blocks red and some blocks blue 
//set up point counter, logically and graphically
//make red blocks deplete points and blue blocks increase points
//make two modes, predominantly red, predominantly blue, switch every 10 s or so.
//make game begin on the draw mode
// get rid of draw button
// get rid of morph function, put that functionality in the space bar
// add a header that says what it is
// make the color scheme good
// make a new morph where they go off to the sides
// need to save array of points on the side, 
// set it up that you go to the outside then immediately to the original
// make the block shape better? and make the spacing good



var gameCanvas = document.getElementById("gamecanvas");
var gamectx = gameCanvas.getContext("2d");

var drawCanvas = document.getElementById("drawcanvas");
var drawctx = drawCanvas.getContext("2d");

var shapeCanvas = document.getElementById("shapecanvas");
var shapectx = shapeCanvas.getContext("2d");

gamectx.fillStyle = "rgba(255, 255, 255, 1);"
gamectx.fillRect(0, 0, 600, 300);



//drawctx.fillStyle = "rgba(100, 100, 0, 1);"
//drawctx.fillRect(0, 0, 100, 100);
//shapectx.fillStyle = "rgba(50, 50, 0, 1);"
//shapectx.fillRect(0, 0, 100, 100);

//drawctx.font="20px Times New Roman";
//drawctx.strokeText("draw",40, 40);
//shapectx.font="20px Times New Roman";
//shapectx.strokeText("transform",40, 40);

var states = ["drawing", "playing"];
var currState = "drawing";
var subStates = ["square", "orig", "dentOrig", "dentSquare"];
var playState = "orig";
var transforming = false;
var transformCounter = 0;

var totalPts = 0;

var Player = function(){
	this.center = {x: 10, y: 15};
	this.size = {x: 100, y: 100};
	this.points = Array();
	this.color = {r: 0, g: 0, b:0};
	this.v = {x:0, y:0};
	this.radius = 10;
	this.original = Array();
	this.square = Array();
	this.dentOrig = Array();
	this.dentSquare = Array();
};

var p = new Player();

var LittlePoint = function(x, y, vx, vy){
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
}

var Block = function(){
	this.center = {x: 10, y: 15};
	this.status = "neutral";
	this.color = {r:0, g:0, b:0};
	this.v = {x:0, y:0};
};

var arrayBlock = Array();

var makeBlock = function(){
	newBlock = new Block();
	newBlock.center.x = 600+Math.random()*1000;
	newBlock.center.y = Math.random()*300;
	newBlock.v.x = -0.5;
	newBlock.v.y = 0;
	newBlock.status = "neutral";
	arrayBlock.push(newBlock);
	//console.log("# of blocks: ");
	//console.log(arrayBlock.length);
};

setInterval(makeBlock, 1000);

var gameLoop = function(){
	
	//console.log(transforming);
	if(currState === "beginning"){
	}
	if(currState === "drawing"){
		drawing();
	}
	if(currState === "playing"){
		if(transforming === true){
			var shapeMade = toShape();
			transformCounter+=1;
			if(shapeMade === true){
				transforming = false;
				transformCounter = 0;
			}
		}
		else{
			checkSpread();
			//console.log("checked the spread");
		}
		checkBound();
		displayPlayer();
	}
};




setInterval(gameLoop, 16);



/// STATE-DETERMINING functions:


drawCanvas.addEventListener("mousedown", function (e){
		currState = "drawing";
});

shapeCanvas.addEventListener("mousedown", function (e){
	if(currState === "playing"){
		if(playState === "orig"){
			playState = "square";
		}
		else if(playState === "square"){
			playState = "dentOrig";
		}
		else if(playState === "dentOrig"){
			playState = "orig"
		}
		transforming = true;
	}

});

/// DRAWING STATE FUNCTIONS

var drawing = function(){
	gamectx.clearRect(0, 0, 600, 300);
	gamectx.font="30px Times New Roman";
	gamectx.fillText("draw your player in the box.",16, 50);
	gamectx.fillStyle = "rgba(255, 255, 255, 0);"
	gamectx.fillRect(0, 0, 600, 300);
	gamectx.fillStyle = "rgb(0, 0, 0);"
	//green - 10, 242, 157
//blue - 10, 203, 242
//pink - 223, 10, 242
	gamectx.fillStyle = "rgba(223, 10, 242, 1);"
	gamectx.fillRect(475, 175, 100, 100);
};

gameCanvas.addEventListener("mousemove", function (e){
	if(currState === "drawing"){
		var mouseX, mouseY;
	    if(e.offsetX) {
	        mouseX = e.offsetX;
	        mouseY = e.offsetY;
	    }
	    else if(e.layerX) {
	        mouseX = e.layerX;
	        mouseY = e.layerY;
	    }
	    if(e.which == 1){
	    	if(Math.abs(525-mouseX)<50 && Math.abs(225-mouseY)<50){
	    		/// absolute points here
	    		p.points.push(new LittlePoint(mouseX, mouseY, p.v.x, p.v.y));
	    		p.original.push([mouseX, mouseY]);
	    		p.dentOrig.push([mouseX, mouseY]);

	    	}
		}
	}

});

gameCanvas.addEventListener("mouseup", function (e){
	if(currState === "drawing"){
		var xAccum = 0;
		var yAccum = 0;
		var yMax = 0;
		var xMax = 0;
		for(var i = 0; i<p.points.length; i++){
			xAccum += p.points[i].x;
			yAccum += p.points[i].y;
			if(p.points[i].x>xMax){
				xMax = p.points[i].x;
			}
			if(p.points[i].y>yMax){
				yMax = p.points[i].y;
			}
		}
		// this should be absolute value
		p.center.x = Math.floor(xAccum/p.points.length);
		p.center.y = Math.floor(yAccum/p.points.length);
		p.radius = Math.floor(((xMax-p.center.x)+(yMax-p.center.y))/2);

		for(var i = 0; i<p.points.length; i++){
			// making the absolute points relative
			p.points[i].x-= p.center.x;
			p.points[i].y-=p.center.y;
			p.original[i][0]-= p.center.x;
			p.original[i][1]-=p.center.y;
			p.dentOrig[i][0]-=p.center.x;
			p.dentOrig[i][1]-=p.center.y;
		}
		currState = "playing";
		planSquare();
		}
});

var planSquare = function(){
	/// TO DO : MAKE THIS RELATIVE TO THE P.CENTER
	//var numPts = p.points.length;
	var chunk = 2*p.radius/(p.points.length/4);//
	for(var i = 0; i<p.points.length/4; i++){
		// Right Side
		p.square.push([p.radius, Math.floor(-p.radius+(chunk)*i)]);
		p.dentSquare.push([p.radius, Math.floor(-p.radius+(chunk)*i)]);

	}
	for(var i = 0; i<p.points.length/4; i++){
		// left Side
		p.square.push([-p.radius, Math.floor(-p.radius+(chunk)*i)]);
				p.dentSquare.push([-p.radius, Math.floor(-p.radius+(chunk)*i)]);

	}

	for(var i = 0; i<p.points.length/4; i++){
		// TOP
		/// TO DO .. theres prob overlap here in each quarter... thats why theres some doubled 
		p.square.push([Math.floor(-p.radius+(chunk)*i), -p.radius]);
				p.dentSquare.push([Math.floor(-p.radius+(chunk)*i), -p.radius]);

	}

	for(var i = 0; i<p.points.length/4; i++){
		// BOTTOM
		/// TO DO .. theres prob overlap here in each quarter... thats why theres some doubled 
		p.square.push([Math.floor(-p.radius+(chunk)*i), p.radius]);
		p.dentSquare.push([Math.floor(-p.radius+(chunk)*i), p.radius]);

	}
	
};


/// PLAYING STATE FUNCTIONS

var displayPlayer = function(){
	gamectx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		drawctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

	gamectx.fillStyle="rgba(255, 255, 255, 0);"
	gamectx.strokeStyle = "rgba(223, 10, 242, .5)";
	gamectx.strokeRect(0, 0, 600, 300);
	gamectx.fillRect(0, 0, 600, 300);
	

	//drawctx.strokeText
	//drawctx.font="20px Times New Roman";
	//drawctx.fillStyle = "rgba(223, 10, 242, 1)";
	//drawctx.fillText(totalPts,20, 30);

	//drawctx.strokeStyle = "rgba(223, 10, 242, 1);"
	//drawctx.strokeRect(0, 0, 100, 100);

	gamectx.fillStyle = "rgba(0, 0, 0, 1)";

	//green - 10, 242, 157
//blue - 10, 203, 242
//pink - 223, 10, 242

	p.v.x*=.98;
	p.v.y*=.98;
	p.center.x+=p.v.x;
	p.center.y+=p.v.y;
	for(var i = 0; i<p.points.length; i++){
	
		var velXDiff = (p.v.x-p.points[i].vx);
		if(Math.abs(velXDiff)> .1){

		//if(Math.abs(velXDiff)>    (Math.random())){
		p.points[i].vx += velXDiff/10;

		}
		else{
			p.points[i].vy = p.v.y;////!!!
		}

		var velYDiff = (p.v.y-p.points[i].vy);
				if(Math.abs(velYDiff)> .1){

		//if(Math.abs(velYDiff)>   (Math.random())){
		p.points[i].vy += velYDiff/10;
		}
		else{
			p.points[i].vy = p.v.y;////!!!
		}
		p.points[i].x += p.points[i].vx; //<-- changed this 
		p.points[i].y +=p.points[i].vy;  ///<-- changed this 

		gamectx.fillRect(p.center.x+p.points[i].x, p.center.y+p.points[i].y, 4,4);
	}
	//pink - 223, 10, 242
	//green - 10, 242, 157

	gamectx.fillStyle = "rgba(244, 10, 240, 1)";
	for(var i = 0; i<arrayBlock.length; i++){
		arrayBlock[i].center.x+=arrayBlock[i].v.x;
		gamectx.fillRect(arrayBlock[i].center.x, arrayBlock[i].center.y, 5, 5);
		if(arrayBlock[i].x < -5){
			arrayBlock.pop();
			//console.log("should be deleting a block");
		}
	}
};

var checkSpread = function(){
	var xMin = 0;
	var xMax = 0;
	var yMin = 0;
	var yMax = 0;
	for(var i = 0; i<p.points.length; i++){
		if(p.points[i].x < xMin){
			xMin = p.points[i].x;
		}
		if(p.points[i].x>xMax){
			xMax = p.points[i].x;
		}
				if(p.points[i].y < yMin){
			yMin = p.points[i].y;
		}
				if(p.points[i].y>yMax){
			yMax = p.points[i].y;
		}
	}
	if((xMax-xMin)>125 || (yMax-yMin)>125){
		transforming = true;
	}

};

window.addEventListener("keydown", function (e){
	if(currState === "playing"){
		if(e.keyCode === 37){//left arrow
			p.v.x-=1.4;
		}
		if(e.keyCode === 39){// right arrow
			p.v.x+=1.4;
		}
		if(e.keyCode === 38){// up arrow
			p.v.y-=1.4;
		}
		if(e.keyCode === 40){// downarrow
			p.v.y+=1.4;
		}
		if(e.keyCode === 32){
			if(playState === "orig"){
				playState = "square";
			//console.log("square");

			}
			else if(playState === "square"){
				playState = "dentOrig";
				//console.log("dentorig");

			}
			else if(playState === "dentOrig"){
				playState = "dentSquare";
				//console.log("dentsquare");

			}
			else if(playState === "dentSquare"){
				playState = "orig";
				//console.log("in orig");
			}
			transforming = true;
		}

	}
});

var checkBound = function(){
	for(var i = 0; i<p.points.length; i++){
		if(p.points[i].y+ p.center.y >= 300){
			p.points[i].y = 299-p.center.y;
			if(playState === "dentOrig"){
				p.dentOrig[i].y = 299-p.center.y;

			}
			if(playState === "dentSquare"){
				p.dentSquare[i].y = 299-p.center.y;

			}
			p.v.y-=.1;

		}
		if(p.points[i].y+ p.center.y <= 0){
			p.points[i].y = 1-p.center.y;
			if(playState === "dentOrig"){
				p.dentOrig[i].y = 1-p.center.y;
				//console.log("should be denting");
			}
			//if(playState === "dentSquare"){
				//p.dentSquare[i].y = 0-p.center.y;
			//}
			p.v.y+=.1;
		}
		if(p.points[i].x+ p.center.x >= 600){// issue here
			p.points[i].x = 599-p.center.x;
			if(playState === "dentOrig"){
				p.dentOrig[i].x = 599-p.center.x;
			}
			if(playState === "dentSquare"){
				p.dentSquare[i].x = 599-p.center.x;

			}
			p.v.x-=.1;
		}
		if(p.points[i].x+p.center.x<= 0){
			p.points[i].x = 1-p.center.x;
			if(playState === "dentOrig"){
				p.dentOrig[i].y = 1-p.center.y;

			}
			if(playState === "dentSquare"){
				p.dentSquare[i].y = 1-p.center.y;

			}
			p.v.x+=.1;
		}
		for (var j = 0; j< arrayBlock.length; j++){

			if((Math.abs(arrayBlock[j].center.x-(p.points[i].x+p.center.x))<5) && (Math.abs(arrayBlock[j].center.y-(p.points[i].y+p.center.y))<5)){
				totalPts-=1;
				p.points[i].vx+= (-p.points[i].vx)*7 - Math.random()*8;
				p.points[i].vy+= (-p.points[i].vy)*7- (Math.random()-.5)*8;

			}

		}
	}
};


var toShape = function(){
	/// Any incoming arrays should be relative to center..
	// here, add back the p.center
	var gotThere = true;

	if(playState === "square"){
		var arrayPts = p.square;
		
	}
	else if(playState === "orig"){
		var arrayPts = p.original;
	}
	else if(playState === "dentOrig"){
		var arrayPts = p.dentOrig;
	}
	else{
		var arrayPts = p.dentSquare;
	}
	for(var i=0; i<p.points.length; i++){
		
		var xMove = arrayPts[i][0]-p.points[i].x;
		if(Math.abs(xMove)>1){
			p.points[i].x+=(xMove/18);
			gotThere = false;
		}
		var yMove = arrayPts[i][1]-p.points[i].y;
		
		if(Math.abs(yMove)>1){
			p.points[i].y+=(yMove/18);
			gotThere = false;
		}
	}
	if(transformCounter === 75){
		//console.log("TRANSFORM COUNTER ABOUVE 	55");
		gotThere = true;
	}
	return gotThere;
}