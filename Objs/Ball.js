function Ball(position, speed) {
	Obj.call(this,position,speed);
	this.times=0;
	this.die=false;
    this.radius = 20;
    this.color = "#fff";
}

Ball.prototype.draw = function (context) {
    context.save();
    this.reComputer();
    context.translate(this.position.x, this.position.y);
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.restore();
}

Ball.prototype.__proto__ = Obj.prototype;