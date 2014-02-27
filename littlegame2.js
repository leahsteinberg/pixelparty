//TO DO:

//Make doodle bounce off of the blocks
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




var gameCanvas = document.getElementById("gamecanvas");
var gamectx = gameCanvas.getContext("2d");
var drawCanvas = document.getElementById("drawcanvas");
var drawctx = drawCanvas.getContext("2d");
var shapeCanvas = document.getElementById("shapecanvas");
var shapectx = shapeCanvas.getContext("2d");

gamectx.fillStyle = "rgba(3, 4, 5, .3);"
gamectx.fillRect(0, 0, 600, 300);
drawctx.fillStyle = "rgba(100, 100, 0, 1);"
drawctx.fillRect(0, 0, 100, 100);
shapectx.fillStyle = "rgba(50, 50, 0, 1);"
shapectx.fillRect(0, 0, 100, 100);

drawctx.font="20px Times New Roman";
drawctx.strokeText("draw",40, 40);
shapectx.font="20px Times New Roman";
shapectx.strokeText("transform",40, 40);

var states = ["beginning", "drawing", "playing"];
var currState = "beginning";
var subStates = ["square", "orig"];
var playState = "orig";
var transforming = false;


var Player = function(){
	this.center = {x: 10, y: 15};
	this.size = {x: 100, y: 100};
	this.points = Array();
	this.color = {r: 0, g: 0, b:0};
	this.v = {x:0, y:0};
	this.radius = 10;
	this.original = Array();
	this.square = Array();
};

var p = new Player();

var Block = function(){
	//// {}
	this.center = {x: 10, y: 15};
	this.status = "neutral";
	this.color = {r:0, g:0, b:0};
	this.v = {x:0, y:0};
	//this.distNext = {x:0, y:0};
	////return { }
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

};

setInterval(makeBlock, 3000);

var gameLoop = function(){
	if(currState === "beginning"){
	}
	if(currState === "drawing"){
		drawing();
	}
	if(currState === "playing"){
		if(transforming === true){
			var shapeMade = toShape();
			if(shapeMade === true){
				transforming = false;
			}
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
			playState = "orig";
		}
		transforming = true;
	}

});

/// DRAWING STATE FUNCTIONS

var drawing = function(){
	gamectx.clearRect(0, 0, 600, 300);
	gamectx.font="30px Times New Roman";
	gamectx.strokeText("draw your player in the box.",16, 50);
	gamectx.fillStyle = "rgba(3, 4, 5, .3);"
	gamectx.fillRect(0, 0, 600, 300);
	gamectx.strokeStyle = "rgb(30, 50, 60);"
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
	    		p.points.push([mouseX, mouseY]);
	    		p.original.push([mouseX, mouseY]);
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
			xAccum += p.points[i][0];
			yAccum += p.points[i][1];
			if(p.points[i][0]>xMax){
				xMax = p.points[i][0];
			}
			if(p.points[i][1]>yMax){
				yMax = p.points[i][1];
			}
		}
		p.center.x = Math.floor(xAccum/p.points.length);
		p.center.y = Math.floor(yAccum/p.points.length);
		p.radius = Math.floor(((xMax-p.center.x)+(yMax-p.center.y))/2);
		for(var i = 0; i<p.points.length; i++){
			p.points[i][0]-= p.center.x;
			p.points[i][1]-=p.center.y;
			p.original[i][0]-= p.center.x;
			p.original[i][1]-=p.center.y;
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
	}
	for(var i = 0; i<p.points.length/4; i++){
		// left Side
		p.square.push([-p.radius, Math.floor(-p.radius+(chunk)*i)]);
	}

	for(var i = 0; i<p.points.length/4; i++){
		// TOP
		/// TO DO .. theres prob overlap here in each quarter... thats why theres some doubled 
		p.square.push([Math.floor(-p.radius+(chunk)*i), -p.radius]);
	}

	for(var i = 0; i<p.points.length/4; i++){
		// BOTTOM
		/// TO DO .. theres prob overlap here in each quarter... thats why theres some doubled 

		p.square.push([Math.floor(-p.radius+(chunk)*i), p.radius]);
	}
	//for(var i = 0; i<square.length; i++){
		// TO DO make red.. to test the square
	//	gamectx.fillRect(square[i][0], square[i][1], 3, 3);
	//}
};


/// PLAYING STATE FUNCTIONS

var displayPlayer = function(){
	gamectx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	gamectx.fillStyle="rgba(3, 4, 5, 0.3);"
	gamectx.fillRect(0, 0, 600, 300);
	gamectx.fillStyle = "rgba(p.color.r, p.color.g, p.color.b, .9)";
	p.v.x*=.98;
	p.v.y*=.98;
	p.center.x+=p.v.x;
	p.center.y+=p.v.y;
	for(var i = 0; i<p.points.length; i++){
		gamectx.fillRect(p.center.x+p.points[i][0], p.center.y+p.points[i][1], 4,4);
	}
	gamectx.fillStyle = "rgba(0, 0, 0, .9)";
	console.log(arrayBlock.length);
	//for(var i = 0; i<arrayBlock.length; i++){
	//	arrayBlock[i].center.x+=arrayBlock[i].v.x;
	//	gamectx.fillRect(arrayBlock[i].center.x, arrayBlock[i].center.y, 5, 5);
	//}
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
	}
});

var checkBound = function(){
	for(var i = 0; i<p.points.length; i++){
		if(p.points[i][1]+ p.center.y >= 300){
			p.points[i][1] = 300-p.center.y;
			p.v.y-=.1;
		}
		if(p.points[i][1]+ p.center.y <= 0){
			p.points[i][1] = 0-p.center.y;
			p.v.y+=.1;
		}
		if(p.points[i][0]+ p.center.x >= 600){// issue here
			p.points[i][0] = 600-p.center.x;
			p.v.x-=.1;
		}
		if(p.points[i][0]+p.center.x<= 0){
			p.points[i][0] = 0-p.center.x;
			p.v.x+=.1;
		}
	}
};


var toShape = function(){
	/// Any incoming arrays should be relative to center..
	// here, add back the p.center
	var gotThere = true;
	if(playState === "square"){
		arrayPts = p.square;
	}
	else{
		arrayPts = p.original;
	}
	for(var i=0; i<p.points.length; i++){
		xMove = arrayPts[i][0]-(p.points[i][0]);
		if(Math.abs(xMove)>1){
			p.points[i][0]+=(xMove/18);
			gotThere = false;
		}
		yMove = arrayPts[i][1]-(p.points[i][1]);
			

		if(Math.abs(yMove)>1){
			p.points[i][1]+=(yMove/18);
			gotThere = false;
		}
	}
	return gotThere;
}




