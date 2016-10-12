// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/newHero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};

var ballReady = false;
var ballImage = new Image();
ballImage.onload = function(){
	ballReady = true;
}
ballImage.src = "images/BallBlue.jpg";

monsterImage.src = "images/newMonster.png";

// Game objects
var hero = {
	speed: 256,
	isAlive:true, // movement in pixels per second
	x: canvas.width / 2,
	y: canvas.height / 2
};
var enemies = [{x: 0, y: 0, speed: 1}];
var monstersCaught = 0;
var balls = [];


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



function reset(){
	// Throw the monster somewhere on the screen randomly
	for(let i = 0; i < enemies.length; i++){
		enemies[i].x = 16 + (Math.random() * (canvas.width - 64));
		enemies[i].y = 16 + (Math.random() * (canvas.height - 64));
		hero.y = canvas.height / 2;
		hero.x = canvas.width / 2;

	}
}
function gameOver() {
	hero.isAlive=false;
	ctx.fillStyle = "red";
	ctx.font = "40px Comic-sans";
	ctx.textAlign = "center";
	ctx.fillText("GAME OVER",250,150);
	ctx.fillStyle = "white";
	ctx.font = "20px Comic-sans ";
	//ctx.textAlign = "center";
	ctx.fillText("press space to restart",250,200);
}
// Update game objects
function update(modifier){

	if(hero.y>1)
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if(hero.y<canvas.height-40)
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if(hero.x>1)
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if(hero.x<canvas.width-40)
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	fire();
	enemyAI();
	moveEnemy();
	moveBullets();
	collistionEnemyWithBullets();
	lookingForCollisions();
	
}

function fire(){
	let ball = {};
	ball.x = hero.x+15;
	ball.y = hero.y+15;
	ball.speed = 10;
	if (68 in keysDown){ //d
		ball.direction = "right";
		balls.push(ball);	
	}
	else if(83 in keysDown){ //s
		ball.direction = "down";
		balls.push(ball);
	}
	else if(65 in keysDown){ //a
		ball.direction = "left";
		balls.push(ball);
	}
	else if(87 in keysDown){ //w
		ball.direction = "up";
		balls.push(ball);
	}
}

function moveBullets(){
	for(let i = 0; i < balls.length; i++){
		if(balls[i].direction == "up"){
			balls[i].y -= balls[i].speed;
			if(balls[i].y <= 10){
				balls.splice(i, 1);
			}
		}
		else if(balls[i].direction == "down"){
			balls[i].y += balls[i].speed;
			if(balls[i].y >= canvas.height){
				balls.splice(i, 1);
			}
		}
		else if(balls[i].direction == "right"){
			balls[i].x += balls[i].speed;
			if(balls[i].x >= canvas.width){
				balls.splice(i, 1);
			}
		}
		else if(balls[i].direction == "left"){
			balls[i].x -= balls[i].speed;
			if(balls[i].x <= 10){
				balls.splice(i, 1);
			}
		}
	}
}

function collistionEnemyWithBullets(){
	for(let i = 0; i < balls.length; i++){
		let currentBullet = balls[i];
		for(let j = 0; j < enemies.length; j++){
			var currentEnemy = enemies[j];
			console.log(currentEnemy);
			console.log(currentBullet);
			if(Math.round(currentEnemy.x+15) == Math.round(currentBullet.x)  && Math.round(currentEnemy.y+15) == Math.round(currentBullet.y)){
				enemies.splice(j, 1);
				return;
			}
		}
	}
}

function collisionWithEnemy(){
	for(let i = 0; i < enemies.length; i++){
		if (hero.x <= (enemies[i].x + monsterImage.width)
			&& enemies[i].x <= (hero.x + monsterImage.width)
			&& hero.y <= (enemies[i].y + monsterImage.width)
			&& enemies[i].y <= (hero.y + monsterImage.width)) {
			//gameOver();
			++monstersCaught;
			if(monstersCaught == 5 || monstersCaught == 10 || monstersCaught == 15){
				enemies.push({x: 0, y: 0, speed: 1});
			}
			reset();
		}
	}
}

function lookingForCollisions(){
	collisionWithEnemy()
}

function enemyAI(){
	for(let i = 0; i < enemies.length; i++){
		if(enemies[i].x > hero.x){
			enemies[i].directionX = 'left';
		}
		else{
			enemies[i].directionX = 'right';
		}
		if(enemies[i].y > hero.y){
			enemies[i].directionY = 'up';
		}
		else{
			enemies[i].directionY = 'down';
		}
	}
	
}

function collisionEnemyWithWalls(){
	
}

function moveEnemy(){
	for(let i = 0; i < enemies.length; i++){
		if(enemies[i].directionX == 'right'){
			if(enemies[i].x + enemies[i].speed < canvas.width){
				enemies[i].x += enemies[i].speed;
			}
		}
		else{
			if(enemies[i].x - enemies[i].speed > 0){
				enemies[i].x -= enemies[i].speed;
			}
		}
		if(enemies[i].directionY == 'up'){
			if(enemies[i].y - enemies[i].speed > 0){
				enemies[i].y -= enemies[i].speed;
			}
		}
		else{
			if(enemies[i].y + enemies[i].speed < canvas.height){
				enemies[i].y += enemies[i].speed;
			}
		}
	}	
}

// Draw everything
function render(){
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	for(let i = 0; i < enemies.length; i++){
		if (monsterReady) {
			ctx.drawImage(monsterImage, enemies[i].x, enemies[i].y);
		}
	}

	if(ballReady){
		for(let i = 0; i < balls.length; i++){
			ctx.drawImage(ballImage, balls[i].x, balls[i].y);
		}
	}
	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	var score =ctx.fillText("Score: " + monstersCaught, 32, 32);

}

// The main game loop

function main(){

	if(!hero.isAlive){
		gameOver();
		if (32 in keysDown) {
			hero.isAlive = true;
		}
		reset();
		requestAnimationFrame(main);
	}
	else {
		var now = Date.now();
		var delta = now - then;
		update(delta / 1000);
		render();
		then = now;
		requestAnimationFrame(main);
	}
	

	// Request to do this again ASAP
	

}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();

main();
