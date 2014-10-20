/**
 * 二维坐标系中的点
 * @param x x坐标
 * @param y y坐标
 * @constructor
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Point.V0 = new Point(0, 0);

var Scale = Point;

/**
 * 2维向量
 * @param rad 角度
 * @param size 大小
 * @constructor
 */
function Vector(angle, size) {
    this.angle = angle;
    this.size = size;
    this.x = Math.cos(angle) * size;
    this.y = Math.sin(angle) * size;
}

Vector.V0 = new Vector(0, 0);

/**
 * 物体
 * @param position 初始位置
 * @param speed 初始速度
 * @constructor
 */
function Obj(position, speed) {
    this.position = position;
    this.speed = speed;
    this.powers = [];
    this.power = new Vector(0, 0);
}

/**
 * 物体的质量，默认为单位1
 * @type {number}
 */
Obj.prototype.mass = 1;

Obj.prototype.showPosition = function () {
    log("x:" + this.position.x + ",y:" + this.position.y);
}

/**
 * 在画板上画出物体自身
 * @param context
 */
Obj.prototype.draw = function (context) {
};

/**
 * 重新计算物体坐标位置，速度等
 */
Obj.prototype.reComputer = function () {
    this.speed.x += this.power.x; //当前x速度
    this.speed.y += this.power.y; //当前y速度
    this.position.x += this.speed.x;  //当前x坐标
    this.position.y += this.speed.y;  //当前y坐标
}

/**
 * 向物体增加一个力
 * @param power
 */
Obj.prototype.addPower = function (power) {
    //分解到xy
    this.power.x += power.x / this.mass;
    this.power.y += power.y / this.mass;
    this.powers.push(power);
}

function Game(rect, canvas) {
    this.objs = [];
    this.rect = rect;
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
}

Game.prototype.getMouse = function () {
    return tools.captureMouse(this.canvas);
};

Game.prototype.on = function (evt, callback) {
    tools.on(this.canvas, evt, callback);
}

Game.prototype.addObj = function (obj) {
    this.objs.push(obj);
}

/**
 * 绘制当前帧
 */
Game.prototype.reFrame = function () {
    var i, len;
    for (var i = 0, len = this.objs.length; i < len; i++) {
        this.objs[i].draw(this.context);
    }
}

/**
 * 开始
 */
Game.prototype.start = function () {
    var rect = this.rect;
    this.context.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.CheckBorder();
    this.CheckCollision();
    this.reFrame();
}

/**
 * 边界检查
 * @constructor
 */
Game.prototype.CheckBorder = function () {
    var i, len, obj, pos, rect = this.rect;
    for (i = 0, len = this.objs.length; i < len; i++) {
        obj = this.objs[i];
        pos = obj.position;
        if (pos.x - obj.radius <= rect.x) {
            obj.speed.x *= -0.7;
            pos.x = obj.radius;
        }
        else if (pos.x + obj.radius >= rect.width) {
            obj.speed.x *= -0.7;
            pos.x = rect.width -  obj.radius;
        }
        else if (pos.y - obj.radius <= rect.y) {
            obj.speed.y *= -0.7;
            pos.y =obj.radius;
        }
        else if (pos.y + obj.radius >= rect.height) {
            obj.speed.y *= -0.7;
            pos.y = rect.height - obj.radius;
        }

    }
}

/**
 * 碰撞检测
 * @constructor
 */
function checkCollision (ball0, ball1) {
    var dx = ball1.position.x - ball0.position.x,
        dy = ball1.position.y - ball0.position.y,
        dist = Math.sqrt(dx * dx + dy * dy);
    //collision handling code here
    if (dist < ball0.radius + ball1.radius) {
        //calculate angle, sine, and cosine
        var angle = Math.atan2(dy, dx),
            sin = Math.sin(angle),
            cos = Math.cos(angle),
        //rotate ball0's position
            x0 = 0,
            y0 = 0,
        //rotate ball1's position
            x1 = dx * cos + dy * sin,
            y1 = dy * cos - dx * sin,
        //rotate ball0's velocity
            vx0 = ball0.speed.x * cos + ball0.speed.y * sin,
            vy0 = ball0.speed.y * cos - ball0.speed.x * sin,
        //rotate ball1's velocity
            vx1 = ball1.speed.x * cos + ball1.speed.y * sin,
            vy1 = ball1.speed.y * cos - ball1.speed.x * sin,
        //collision reaction
            vxTotal = vx0 - vx1;

		x1 =  ball0.radius + ball1.radius;
		
        vx0 = ((ball0.mass - ball1.mass) * vx0 + 2 * ball1.mass * vx1) /
            (ball0.mass + ball1.mass);
        vx1 = vxTotal + vx0;
        x0 += vx0;
        x1 += vx1;
        //rotate positions back
        var x0Final = x0 * cos - y0 * sin,
            y0Final = y0 * cos + x0 * sin,
            x1Final = x1 * cos - y1 * sin,
            y1Final = y1 * cos + x1 * sin;
        //adjust positions to actual screen positions
        ball1.position.x = ball0.position.x + x1Final;
        ball1.position.y = ball0.position.y + y1Final;
        ball0.position.x = ball0.position.x + x0Final;
        ball0.position.y = ball0.position.y + y0Final;
        //rotate velocities back
        ball0.speed.x = vx0 * cos - vy0 * sin;
        ball0.speed.y = vy0 * cos + vx0 * sin;
        ball1.speed.x = vx1 * cos - vy1 * sin;
        ball1.speed.y = vy1 * cos + vx1 * sin;
    }
}

Game.prototype.CheckCollision = function () {
    var a, b, i, len, j;
    for (i = 0, len = this.objs.length; i <  len ; i++) {
        a = this.objs[i];
        for (j = i + 1; j < len; j++) {
            b = this.objs[j];
            var dx = b.position.x - a.position.x;
            var dy = b.position.y - a.position.y;
            var r = Math.sqrt(dx * dx + dy * dy);
            if (r <= (a.radius + b.radius)) {
                checkCollision(a,b);
            }
        }
    }
}

Game.prototype.delObj = function (index) {
    var len = this.objs.length;
    this.objs[index] = this.objs[len - 1];
    this.objs.length = len - 1;
}

