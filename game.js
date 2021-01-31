const cvs = document.getElementById("main");
const ctx = cvs.getContext("2d");
let cnt = 0 ;

let score = 0;
let bricksDestroyed = 0;
let trajanje = 0;

cvs.style.border = "1px solid black";

ctx.lineWidth = 3;
	
	const PRAVOKOTNIK_Š = 100;
	
	const PRAVOKOTNIK_B = 50;

	const PRAVOKOTNIK_H = 20;

	const ŽOGA = 8;

let leftArrow = false;
let rightArrow = false;
 

const PRAVOKOTNIK = {
    x : cvs.width/2 - PRAVOKOTNIK_Š/2,
    y : cvs.height - PRAVOKOTNIK_B - PRAVOKOTNIK_H,
	width : PRAVOKOTNIK_Š,
    height : PRAVOKOTNIK_H,
    dx :5
}

function drawPRAVOKOTNIK(){
			ctx.fillStyle = "black";
			ctx.fillRect(PRAVOKOTNIK.x, PRAVOKOTNIK.y, PRAVOKOTNIK.width, PRAVOKOTNIK.height);  
			
			ctx.strokeStyle = "#CB0000";
			ctx.strokeRect(PRAVOKOTNIK.x, PRAVOKOTNIK.y, PRAVOKOTNIK.width, PRAVOKOTNIK.height);  
}


document.addEventListener("keydown", function(event){	
	if(event.keyCode == 37){
       leftArrow = true;
		
	}else if(event.keyCode == 39){
       rightArrow = true;
   
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

document.addEventListener("mousemove", function(e) {
  let getMouseX = e.clientX - cvs.offsetLeft;
  if(getMouseX > 0 && getMouseX < cvs.width) {
    PRAVOKOTNIK.x = getMouseX - PRAVOKOTNIK_Š/2;
  }
});

function movePRAVOKOTNIK(){
    if(rightArrow && PRAVOKOTNIK.x + PRAVOKOTNIK.width < cvs.width){
        PRAVOKOTNIK.x += PRAVOKOTNIK.dx;
    
	
	}else if(leftArrow && PRAVOKOTNIK.x > 0){
        PRAVOKOTNIK.x -= PRAVOKOTNIK.dx;
    }
}

const row_brick = 5;
const column_brick = 6;
const brick_w = 85;
const brick_h = 25;
const brick_p = 10;
const brick_top = 20;
const brick_left = 20;

const žoga = {
    x : cvs.width/2,
    y : PRAVOKOTNIK.y - ŽOGA,
    radius : ŽOGA,
		
		speed : 4,
   
   dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}


	function drawžoga(){
    ctx.beginPath();
    
    ctx.arc(žoga.x, žoga.y, žoga.radius, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}


let brk = [];
for(let i=0; i<column_brick; i++) {
    brk[i] = [];
    for(let r=0; r<row_brick; r++) {
        brk[i][r] = { x: 0, y: 0, rem: 1 };
    }
}

function movežoga(){
    žoga.x += žoga.dx;
    žoga.y += žoga.dy;
}

function žogaZid(){
    if(žoga.x + žoga.radius > cvs.width || žoga.x - žoga.radius < 0){
        žoga.dx = - žoga.dx;
    }
    
    if(žoga.y - žoga.radius < 0){
        žoga.dy = -žoga.dy;
    }
    
    if(žoga.y + žoga.radius > cvs.height){
        alert("Izgubili ste v "+trajanje+" sekundah. Uničili ste "+bricksDestroyed+" opek in ste dobili "+score+" točk.")
        LIFE--; // 
        resetžoga();
    }
}




function žogaPRAVOKOTNIK(){
    if(žoga.x < PRAVOKOTNIK.x + PRAVOKOTNIK.width && žoga.x > PRAVOKOTNIK.x && PRAVOKOTNIK.y < PRAVOKOTNIK.y + PRAVOKOTNIK.height && žoga.y > PRAVOKOTNIK.y){
        
        
        let collidePoint = žoga.x - (PRAVOKOTNIK.x + PRAVOKOTNIK.width/2);
        
        
        collidePoint = collidePoint / (PRAVOKOTNIK.width/2);
        
        
        let angle = collidePoint * Math.PI/3;
           
            
        žoga.dx = žoga.speed * Math.sin(angle);
        žoga.dy = - žoga.speed * Math.cos(angle);
    }
}

function draw(){
    drawPRAVOKOTNIK();

    drawžoga();

}


function brick() {
    for(let i=0; i<column_brick; i++) {
        for(let r=0; r<row_brick; r++) {
            if(brk[i][r].rem == 1) {
                let brickY = brick_top + (r*(brick_h+brick_p));
                let brickX = brick_left + (i*(brick_w+brick_p));
                brk[i][r].y = brickY;
                brk[i][r].x = brickX;
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.rect(brickX, brickY, brick_w, brick_h);
                ctx.fillStyle = "black";
				ctx.strokeRect(brickX, brickY, brick_w, brick_h);
                ctx.quadraticCurveTo( 1000, 1000, 1000, 1000);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function removeBrick() {
    for(let i=0; i<column_brick; i++) {
        for(let r=0; r<row_brick; r++) {
            let b = brk[i][r];
            if(b.rem == 1) {
                if(žoga.x > b.x && žoga.x < b.x+brick_w && žoga.y > b.y && žoga.y < b.y+brick_h) {
                    bricksDestroyed += 1;
                    žoga.dy = -žoga.dy;
                    b.rem = 0;
                    cnt++;
                    if(b.y == 160 || b.y == 125 || b.y == 90) {
                        score += 10;
                    } 
                    if(b.y == 55 || b.y == 20) {
                        score += 15;
                    } 
                    if(cnt == row_brick*column_brick) {
                        alert("Igro ste zaključili v "+trajanje+" sekundah. Uničili ste "+bricksDestroyed+" opek in ste dobili "+score+" točk.");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function updateStats() {
    let counter = document.getElementById("score");
    let timer = document.getElementById("timer");
    let trenutno = new Date();
    trajanje = Math.round((Math.abs(trenutno - zacetek)/1000));
    timer.innerHTML = ("Time:   "  +trajanje);
    counter.innerHTML = ("Score:   "  +score);
	 
}


function posodobi(){
    movePRAVOKOTNIK();

    movežoga();

    žogaZid();

    žogaPRAVOKOTNIK();
}


function loop(){
 
    ctx.drawImage(BG_IMG, 0, 0);
    
    draw();
    brick();
    posodobi();
    removeBrick();
    updateStats();
    requestAnimationFrame(loop);
}
let zacetek = new Date();
loop();

