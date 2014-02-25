var gameCanvas = document.getElementById("gamecanvas");
var gamectx = gameCanvas.getContext("2d");
var drawCanvas = document.getElementById("drawcanvas");
var drawctx = drawCanvas.getContext("2d");
var startCanvas = document.getElementById("startcanvas");
var startctx = startCanvas.getContext("2d");
gamectx.fillStyle = "rgba(3, 4, 5, .3);"
gamectx.fillRect(0, 0, 600, 300);
drawctx.fillStyle = "rgba(100, 100, 0, 1);"
drawctx.fillRect(0, 0, 100, 100);
startctx.fillStyle = "rgba(50, 50, 0, 1);"
startctx.fillRect(0, 0, 100, 100);


var states = ["beginning", "drawing", "playing"];
var currState = "beginning";
var makeShape = false;
//var player = points();

var Player = function(){
	this.center = {x: 10, y: 15};
	this.size = {x: 100, y: 100};
	this.points = Array();
	this.color = {r: 0, g: 0, b:0};
	this.v = {x:0, y:0};
	this.radius = 10;
};

var shape = new Array();

var p = new Player();

var gameLoop = function(){
	//console.log(currState);
	if(currState === "beginning"){

	}
	if(currState === "drawing"){
		drawing();

	}
	if(currState === "playing"){
		//console.log("playyyying");
		checkBound();
		if(makeShape === true){
			console.log("should be sliding over shape");
			toShape();
		}
		drawPlayer();

	}

};

setInterval(gameLoop, 16);
console.log(currState);

drawCanvas.addEventListener("mousedown", function (e){
	if(currState === "beginning"){
		console.log("switch to drawing");
		currState = "drawing";
	}
});

var drawing = function(){
	//console.log("in drawingg");
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
		console.log("pradius:");
	console.log(p.radius);
	console.log("pcenter x:");
	console.log(p.center.x);
		console.log("pcenter y:");
	console.log(p.center.y);

	for(var i = 0; i<p.points.length; i++){
		p.points[i][0]-= p.center.x;
		p.points[i][1]-=p.center.y;
	}
	currState = "playing";
	//drawPlayer();
	}
});




window.addEventListener("keydown", function (e){
	if(currState === "playing"){
	if(e.keyCode === 37){
		p.center.x -=3;
		p.v.x-=1;
	}
	if(e.keyCode === 39){
		p.center.x +=3;
		p.v.x+=1;
	}
	if(e.keyCode === 38){// up arrow
		p.center.y -=3;
		p.v.y-=1;
	}

	if(e.keyCode === 40){// downarrow
		p.center.y +=3;
		p.v.y+=1;
	}

	//drawPlayer();
}
});

var drawPlayer = function(){
	gamectx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	gamectx.fillStyle="rgba(3, 4, 5, 0.3);"
	gamectx.fillRect(0, 0, 600, 300);
	gamectx.fillStyle = "rgb(p.color.r, p.color.g, p.color.b)";
	var cornerX = p.center.x;
	var cornerY = p.center.y;
	for(var i = 0; i<p.points.length; i++){
		gamectx.fillRect(cornerX+p.points[i][0], cornerY+p.points[i][1], 3,3);
	}
	//gamectx.fillRect(player.center.x, p.center.y, player.size.x, player.size.y);
	if(makeShape === true){
		gamectx.fillStyle = "rgb(255, 0, 0)";

	for(var i = 0; i<shape.length; i++){
		gamectx.fillRect(shape[i][0], shape[i][1], 3, 3);
	}
}
};

var checkBound = function(){
	for(var i = 0; i<p.points.length; i++){
		if(p.points[i][1]+ p.center.y >= 295){
			//console.log("hit bottom");
			p.points[i][1] = 295-p.center.y;
		}
		if(p.points[i][1]+ p.center.y <= 5){
			//console.log("hit bottom");
			p.points[i][1] = 5-p.center.y;
		}
		if(p.points[i][0]+ p.center.x >= 595){// issue here
			p.points[i][0] = 595-p.center.x;
		}
		if(p.points[i][0]+p.center.x<= 5){
			p.points[i][0] = 5-p.center.x;
		}
	}
};


var planSquare = function(){

	console.log("in plan square");
	var numPts = p.points.length;
	//numPts+=(numPts%4);
	//gamectx.fillStyle = "rgb(255, 0, 0)"
	for(var i = 0; i<numPts/4; i++){
		// Right Side
		shape.push([p.center.x+p.radius, Math.floor(p.center.y-p.radius+(2*p.radius/((numPts/4)))*i)]);
	}
	for(var i = 0; i<numPts/4; i++){
		// left Side
		shape.push([p.center.x-p.radius, Math.floor(p.center.y-p.radius+(2*p.radius/((numPts/4)))*i)]);
	}

	for(var i = 0; i<numPts/4; i++){
		// TOP
		shape.push([Math.floor(p.center.x-p.radius+(2*p.radius/((numPts/4)))*i), p.center.y-p.radius]);
	}

	for(var i = 0; i<numPts/4; i++){
		// BOTTOM
		shape.push([Math.floor(p.center.x-p.radius+(2*p.radius/((numPts/4)))*i), p.center.y+p.radius]);
	}
	for(var i = 0; i<shape.length; i++){
		gamectx.fillRect(shape[i][0], shape[i][1], 3, 3);
	}
	makeShape = true;
	//shape = new Array;

};

//var makeCircle = 
// new goal --> SQUARE!!!
//easier! and a good place to start with!
// so we will divide the dots into 4 groups
// need to figure out a way to set end points, and then just set their speeds and have them slowly get there

// which are:
// RIGHT SIDE-
// X is p.center.x+radius, 
// Y is variable p.center.y+ (range -radius/2 -> radius) in increments of radius/.25#pts

// LEFT SIDE -
// X is p.center.x - radius,
// Y is variable p.center.y+(range -radius -> radius) in increments of radius/.25#pts


// TOP 
// X is variable p.center.x + (range -radius/2 -> radius) in increments of radius/.25#pts
// Y is p.center.y - radius

// BOTTOM 
// X is variable p.center.x + (range -radius/2 -> radius) in increments of radius/.25#pts
// Y is p.center.y + radius


// so then we have a function that takes in a list of tuples of locations
// and has them move there incrementally


var toShape = function(){
	var gotThere = true;
	//console.log("calling to shape");
	var xMove = 0;
	var yMove = 0;
	for(var i=0; i<p.points.length; i++){
		xMove = shape[i][0]-(p.points[i][0]+p.center.x);
		console.log("x move is:");
		console.log(xMove);
		if(Math.abs(xMove)>3){
			p.points[i][0]+=(xMove/18);
			gotThere = false;
		}
		yMove = shape[i][1]-(p.points[i][1]+p.center.y);
		//console.log("y move is:");
		//console.log(yMove);
		if(Math.abs(yMove)>3){
			p.points[i][0]+=(yMove/18);
			gotThere = false;
		}


		// if(p.points[i][0] < shape[i][0]){
		// 	console.log("p.points[i][0], before and after");
		// 	console.log(p.points[i][0]);
		// 	p.points[i][0]+=1;
		// 	console.log(p.points[i][0]);
		// 	gotThere = false;
		// }
		// else if(p.points[i][0]>shape[i][0]){
		// 	p.points[i][0]-=1;
		// 	gotThere = false;
		// }
		// if(p.points[i][1] < shape[i][1]){
		// 	p.points[i][1]+=1;
		// 	gotThere = false;

		// }
		// else if(p.points[i][1]>shape[i][1]){
		// 	p.points[i][1]-=1;
		// 	gotThere = false;
		// }
	}
	//drawPlayer();
	if(gotThere === true){
		makeShape = false;
		shape = new Array();
	}

	/// need to clear shape FUNCTION HERE
	/// TODO
}



startCanvas.addEventListener("mousedown", function(e){
	planSquare();
});

//each of them will have an end location
// their end location will be a circle
// figure out total length of circle (2pi r)
// divide that by # of points
// need to figure out their place in the circle...
//do I want a circle path and for each one their destination is... some length along that path?
//each of them will move at a certain velocity to their end location




//state machine -> ?


//var statemachine = []
//state traversal

//set interval
//window[curentState]()


