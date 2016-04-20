(function(undefined) {
	
	"use strict";

	let canvas = document.querySelector('canvas');

	let ctx = canvas.getContext('2d');

	let canvasWidth = canvas.width,
		canvasHeight = canvas.height,
		initX = 20,
		initY = canvasHeight - 20;

	let cannon, cannonBalls = [];

	window.c = cannonBalls;

	let Vector = function(x, y) {
		this.vx = x;
		this.vy = y;
	};

	Vector.prototype = {
		constructor: Vector,
		add: function(vec) {
			this.vx += vec.vx;
			this.vy += vec.vy;
		},
		sub: function(vec) {
			this.vx -= vec.vx;
			this.vy -= vec.vy;
		},
		normalize: function() {
			let len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
			this.vx /= len;
			this.vy /= len;
		},
		scale: function(number) {
			this.vx *= number;
			this.vy *= number;
		}
	};

	let Cannon = function(x, y, angel) {
		this.x = x;
		this.y = y;
		this.angel = angel || 0;
		this.vec = new Vector(0, 0);
	};

	Cannon.prototype = {
		constructor: Cannon,
		move: function(mouseX, mouseY) {
			this.vec = new Vector(mouseX - this.x, mouseY - this.y);
			this.angel = Math.atan2(mouseY - this.y, mouseX - this.x);
		},
		draw: function() {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angel);
			//画出炮管
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#000';
			ctx.strokeRect(0, -6, 50, 12);
			//画出炮头
			ctx.beginPath();
			ctx.arc(0, 0, 15, 0, 2 * Math.PI);
			ctx.fillStyle = '#000';
			ctx.fill();
			ctx.restore();
		}
	};

	// vec 为炮弹的初始速度
	let CannonBall = function(x, y, vec, radius) {
		this.x = x;
		this.y = y;
		this.velocity = vec;
		this.radius = radius || 5;
	};

	CannonBall.prototype = {
		constructor: CannonBall,
		gravity: 9.8 / 300,
		move: function() {
			this.x += this.velocity.vx;
			this.velocity.vy += this.gravity;
			this.y += this.velocity.vy;
			//撞地/天花板 纵向速度反向
			if (this.y >= canvasHeight - this.radius) {
				if (this.velocity.vx < 0) {
					this.velocity.vx += 0.01;
				} else {
					this.velocity.vx -= 0.01;
				}
				this.velocity.vy -= 0.2;
				this.velocity.vy = -this.velocity.vy;
				this.y = canvasHeight - this.radius;
			} else if (this.y <= this.radius) {
				this.velocity.vy += 0.1;
				this.velocity.vy = -this.velocity.vy;
				this.y = this.radius;
			}
			if (this.x >= canvas.width - this.radius) {
				this.velocity.vx -= 0.1;
				this.velocity.vx = -this.velocity.vx;
				this.x = canvas.width - this.radius;
			} else if (this.x <= this.radius) {
				this.velocity.vx += 0.1;
				this.x = this.radius;
				this.velocity.vx = -this.velocity.vx;
			}
			//小球间的碰撞检测
			
;		},
		draw: function() {
			ctx.save();
			ctx.fillStyle = '#000';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
	};

	let init = function() {
		cannon = new Cannon(initX, initY);
		ctx.fillStyle = '#fff';
		//跟随鼠标转动事件
		canvas.addEventListener('mousemove', function(e) {
			let canvasRect = canvas.getBoundingClientRect();
			cannon.move(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
		});
		//发射炮弹
		canvas.addEventListener('click', function(e) {
			let vec = new Vector(cannon.vec.vx, cannon.vec.vy);
			vec.normalize();
			vec.scale(5);
			let cannonBall = new CannonBall(initX, initY, vec);
			cannonBalls.push(cannonBall);
		});
		render();
	};

	let render = function() {
		ctx.globalAlpha = 0.8;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.globalAlpha = 1.0;
		cannon.draw();
		for (let i = 0; i < cannonBalls.length; ++i) {
			cannonBalls[i].move();
			cannonBalls[i].draw();
		}
		requestAnimationFrame(render);
	};



	window.onload = init;

}());