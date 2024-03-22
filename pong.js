const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");
const gapX = 10;

const setup = () => {
    canvasEl.width = canvasCtx.width = field.w;
    canvasEl.height = canvasCtx.height = field.h;
}

const mouse = {x: 0, y: 0};

const lineWidth = 15;

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function() {
        canvasCtx.fillStyle = "#286047";
    canvasCtx.fillRect(0, 0, this.w, this.h);
    },
}

const line = {
    w: 15,
    h: field.h,
    draw: function() {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(
            field.w / 2 - this.w / 2, 0, this.w,
             this.h);
    },
}

const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h /2
    },
    draw: function () {
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    }
}

const rigthPaddle = {
    x: field.w - line.w - gapX,
    y: 100,
    w: line.w,
    h: 200,
    speed: 4,
    _move: function() {
        if(this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed;
        }else {
            this.y -= this.speed;
        }
    },
    speedUp: function () {
        this.speed += 2;
    },
    draw: function () {
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    }
}

const score = {
    human: 0,
    computer:-1,
    increaseHuman: function() {
        this.human++
    },
    increaseComputer: function() {
        this.computer++
    },
    draw: function() {
        canvasCtx.font = "bold 72px Arial";
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "top";
        canvasCtx.fillStyle = "#01341D";
        canvasCtx.fillText(this.human, field.w /4, 50);
        canvasCtx.fillText(this.computer, field.w /4 + field.w /2, 50);
    }
}

const ball = {
    x: 0,
    y: 0,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function() {
        //verfica se o jogador 1 fez um ponto (x > largura do campo)
        if(this.x > field.w - this.r - rigthPaddle.w - gapX) {
            //verifica se a raquete direita está na posição Y da bola
            if(this.y + this.r > rigthPaddle.y && this.y - this.r < rigthPaddle.y + rigthPaddle.h) {
                //rebate a bola invertendo o sinal de X
                this._reverseX();
            }else {
                //pontuar o jogador 1
                score.increaseHuman();
                this._pointUp();
            }
        }
        //verifica se jogador 2 fez um ponto (x < 0 )
        if(this.x < this.r + leftPaddle.w + gapX) {
            //verifica se a raquete esquerda está na posição Y da bola 
            if(this.y + this.r > leftPaddle.y &&
                this.y - this.r < leftPaddle.y + leftPaddle.h) {
                    //rebate a bola invertendo o sinal de X
                    this._reverseX();
                }else {
                    //pontuar jogador 2
                    score.increaseComputer();
                    this._pointUp();
                }
        }
        //verifica laterais do campo
        if(
            (this. y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)) {
            this._reverseY();    //rebate a bola invertendo o sinal do eixo        
        }
    },
    _reverseY : function () {
        this.directionY *= -1
    },
    _reverseX: function() {
        this.directionX *= -1
    },
     _speedUp: function() {
        this.speed += 1;
    }, 
    _pointUp: function() {
        this._speedUp();
        rigthPaddle.speedUp(); 

        this.x = field.w / 2;
        this.y = field.h / 2;
    },
    _move: function() {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function() {
        canvasCtx.fillStyle ="#ffffff";
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        canvasCtx.fill();

        this._calcPosition();
        this._move();
    }
}

const draw = () => {
    field.draw();
    line.draw();
    leftPaddle.draw();
    rigthPaddle.draw();
    score.draw();
    ball.draw();
    
}

window.animateFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})();

const main = () => {
    animateFrame(main)
    draw();
}

setup();
main();

canvasEl.addEventListener("mousemove", function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})
window.setInterval(draw, 1000 / 60);
