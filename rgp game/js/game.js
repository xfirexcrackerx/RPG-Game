// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
<<<<<<< .mine=======canvas.width = 1301;
canvas.height = 600;
>>>>>>> .theirsdocument.body.appendChild(canvas);
canvas.width = 1301;
canvas.height = 600;

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
monsterImage.src = "images/newMonster.png";

var bossReady = false;
var bossImage = new Image();
bossImage.onload = function(){
	bossReady = true;
}
bossImage.src = "images/BigEnemy.png";

var ballReady = false;
var ballImage = new Image();
ballImage.onload = function(){
	ballReady = true;
}
ballImage.src = "images/BallBlue.png";


// Game objects
var hero = {
	speed: 256,
	isAlive:true, // movement in pixels per second
	x: canvas.width / 2,
	y: canvas.height / 2
};
var enemies = [{x: 0, y: 0, speed: 1}];
var monstersCaught = 0;
var boss = {};
var balls = [];
var level = 1;
var pressSpaceToContinue = false;


// Handle keyboard controls
var keysDown = {};
var fired = false;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
	fired = false;
}, false);



function reset(){
	// Throw the monster somewhere on the screen randomly
	for(let i = 0; i < enemies.length; i++){
		
		while(true){
		enemies[i].x = 16 + (Math.random() * (canvas.width - 64));
		enemies[i].y = 16 + (Math.random() * (canvas.height - 64));	
		if((enemies[i].x+75 < hero.x || enemies[i].x-75 > hero.x) &&
			(enemies[i].y+75 < hero.y || enemies[i].y-75 > hero.y) ) 
			break;
		}
	}
}
function gameOver() {
	hero.isAlive=false;
	ctx.fillStyle = "red";
	ctx.font = "60px Comic-sans";
	ctx.textAlign = "center";
	ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-50);
	ctx.fillStyle = "white";
	ctx.font = "35px Comic-sans ";
	//ctx.textAlign = "center";
	ctx.fillText("press space to restart",canvas.width/2,canvas.height/2);
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
	lookingForCollisions();
}

let fireDirection = "d";

function fire(){

	let ball = {};
	ball.x = hero.x;
	ball.y = hero.y;
	ball.speed = 10;
	if (68 in keysDown){ //d
		ball.direction = "right";
		if(!fired)
		{
			balls.push(ball);	
			fired = true;
		}
		fireDirection = "d";
	}
	else if(83 in keysDown){ //s
		ball.direction = "down";
		if(!fired)
		{
			balls.push(ball);	
			fired = true;
		}
		fireDirection = "s";
	}
	else if(65 in keysDown){ //a
		ball.direction = "left";
		if(!fired)
		{
			balls.push(ball);	
			fired = true;
		}
		fireDirection = "a";
	}
	else if(87 in keysDown){ //w
		ball.direction = "up";
		if(!fired)
		{
			balls.push(ball);	
			fired = true;
		}
		fireDirection = "w";
	}
}

function moveBullets(){
	for(let i = 0; i < balls.length; i++){
		if(balls[i].direction == "up"){
			balls[i].y -= balls[i].speed;
			if(balls[i].y <= 0){
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
			if(balls[i].x <= 0){
				balls.splice(i, 1);
			}
		}
	}
}

//Used to compare close pixels to fix the rounding problem
function compare(x, y){
	if( x == y ) return true;
	for(let i = 1; i <= 10; i++)
	{
		if( x+i == y ) return true;
		if( x == y+i ) return true;	
	}
	
	return false;
}

function collistionEnemyWithBullets(){
	for(let i = 0; i < balls.length; i++){
		let currentBullet = balls[i];
		for(let j = 0; j < enemies.length; j++){
			var currentEnemy = enemies[j];
			
			let currentBulletXPos = Math.round(currentBullet.x);
			let currentBulletYPos = Math.round(currentBullet.y);
			
			let bossX = Math.round(boss.x);
			let bossY = Math.round(boss.y);
			
			let currentEnemyXPos = Math.round(currentEnemy.x);
			let currentEnemyYPos = Math.round(currentEnemy.y);

			if(compare(bossX, currentBulletXPos) && compare(bossY, currentBulletYPos)){
				boss.health--;
				if(boss.health == 0){
					boss = {};
				}
				if(enemies.length == 0 && boss.health == 0){
					pressSpaceToContinue = true;
					hero.isAlive = false;
				}
			}

			if(compare(currentEnemyXPos,currentBulletXPos) && compare(currentEnemyYPos,currentBulletYPos)) 
			{
				balls = [];
				enemies.splice(j, 1);
				++monstersCaught;
				if(level == 1){
					if(enemies.length == 0) {
						enemies.push({x: 0, y: 0, speed: 1});
						if(monstersCaught >= 1 && monstersCaught <= 1){
							enemies.push({x: 0, y: 0, speed: 1});
						}
					
						if(monstersCaught >= 2 && monstersCaught <= 3){
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
						}
						if(monstersCaught >= 4 && monstersCaught <= 6){
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
						}
						if(monstersCaught >= 7 && monstersCaught <= 10){
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
						}
						if(monstersCaught >= 11 && monstersCaught <= 15){
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
						}
						if(monstersCaught >= 16 && monstersCaught <= 21){
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
						}
						if(monstersCaught == 21){
							level = 2;
							monsterImage.src = "images/enemy1.png";
							bgImage.src = "images/background2.png";							
							enemies = [];
							pressSpaceToContinue = true;
							hero.isAlive = false;
							reset();
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});
							enemies.push({x: 0, y: 0, speed: 1});				
						}
						reset();
					}
				}
				else if(level == 2){
					if(enemies.length == 0 && boss.health == 0){
						pressSpaceToContinue = true;
						hero.isAlive = false;
					}
				}
				
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

			reset();
			gameOver();
		}
	}

	if (hero.x <= (boss.x + bossImage.width)
		&& boss.x <= (hero.x + bossImage.width)
		&& hero.y <= (boss.y + bossImage.width)
		&& boss.y <= (hero.y + bossImage.width)) {

		reset();
		gameOver();
	}
}

function lookingForCollisions(){
	collisionWithEnemy();
	collistionEnemyWithBullets();
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

	//boss AI
	if(boss.x > hero.x){
		boss.directionX = 'left';
	}
	else{
		boss.directionX = 'right';
	}
	if(boss.y > hero.y){
		boss.directionY = 'up';
	}
	else{
		boss.directionY = 'down';
	}
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

	//move boss
	if(boss.directionX == 'right'){
		if(boss.x + boss.speed < canvas.width){
			boss.x += boss.speed;
		}
	}
	else{
		if(boss.x - boss.speed > 0){
			boss.x -= boss.speed;
		}
	}
	if(boss.directionY == 'up'){
		if(boss.y - boss.speed > 0){
			boss.y -= boss.speed;
		}
	}
	else{
		if(boss.y + boss.speed < canvas.height){
			boss.y += boss.speed;
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

	if(bossReady){
		ctx.drawImage(bossImage, boss.x, boss.y);
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
		if(!pressSpaceToContinue){
			gameOver();
			if (32 in keysDown) {
				hero.isAlive = true;
				monstersCaught = 0;
			}
			reset();
			requestAnimationFrame(main);
		}
		else{
			ctx.fillStyle = "red";
			ctx.font = "40px Comic-sans";
			ctx.textAlign = "center";
			ctx.fillStyle = "white";
			ctx.font = "40px Comic-sans ";
			ctx.fillText("press space to continue to level 2",canvas.width/2,canvas.height/2);
			if(32 in keysDown){
				hero.isAlive = true;
				pressSpaceToContinue = false;
				boss.x = canvas.width / 2;
				boss.y = 10;
				boss.health = 10;
				boss.speed = 1;
			}
			requestAnimationFrame(main);
		}		
	}
	else {
		var now = Date.now();
		var delta = now - then;
		update(delta / 1000);
		render();
		then = now;
		requestAnimationFrame(main);
	}
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();