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


var states = {"beginning", "drawing", "playing"};
var currState = "beginning";

//var player = Array();

var Player = function(){
	this.center = {x: 10, y: 15};
	this.size = {x: 100, y: 100};
	this.points = Array();
};

var newPlayer = new Player();

var gameLoop = function(){
	if(currState == "beginning"){

	}
	if(currState = "drawing"){

	}
	if(currState = "playing"){
		
	}

};



drawCanvas.addEventListener("mousedown", function (e){
	gamectx.clearRect(0, 0, 600, 300);
	gamectx.font="30px Times New Roman";
	gamectx.strokeText("draw your player in the box.",16, 50);
	gamectx.fillStyle = "rgba(3, 4, 5, .3);"
	gamectx.fillRect(0, 0, 600, 300);
	gamectx.strokeStyle = "rgb(30, 50, 60);"
	gamectx.fillRect(475, 175, 100, 100);
	draw_time = true;
});

gameCanvas.addEventListener("mousemove", function (e){
	if (draw_time === true){
	
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
    	player.push([mouseX, mouseY]);

	}
}
});

gameCanvas.addEventListener("mouseup", function (e){
	draw_time = false;
	console.log("draw time over");
	for(var i = 0; i< player.length; i++){
		console.log(player[i]);
		var minX = 0;
		var minY = 0;
		
});


window.addEventListener("keydown", function (e){
	if(e.keyCode === 37){
		console.log("hi");
		newPlayer.center.x -=1;
		drawPlayer(newPlayer);
	}
		if(e.keyCode === 39){
		console.log("hi");
		newPlayer.center.x +=1;
		drawPlayer(newPlayer);
	}
});

var drawPlayer = function(player){
	gamectx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	gamectx.fillStyle="rgb(20, 20, 200);"
	gamectx.fillRect(player.center.x, player.center.y, player.size.x, player.size.y);
	
};


//set player position to be top left of littlebox
//before storing offset all the pixel coordinates from top left
//tiny fill rects


//state machine -> ?


//var statemachine = []
//state traversal

//set interval
//window[curentState]()


