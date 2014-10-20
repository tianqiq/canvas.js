var tools={
	captureMouse:function(canvas){
		var mouse = {x:0,y:0};
		this.on(canvas,"mousemove",function(evt){
			var rect = canvas.getBoundingClientRect();
			mouse.x = evt.clientX - rect.left * (canvas.width / rect.width);
			mouse.y = evt.clientY - rect.top * (canvas.height / rect.height);

		});
		return mouse;
	},
	on:function(ele,evt,call){
		ele.addEventListener(evt,call);
	}
};

function extendObj(child){
    for(var i in Obj){
        child.prototype[i] = Obj[i];
    }
}

function Pool(createFun,iniFun){
    this.create = createFun;
    this.ini = iniFun;
    this.pool = [];
}

Pool.prototype.take=function(){
    if(this.pool.length == 0){
        this.pool.push(this.create());
    }
    return this.pool.pop();
}

Pool.prototype.to=function(one){
    this.ini(one);
    this.pool.push(one);
}

String.prototype.format = function(){
	var args = arguments;
    return this.replace(/\{(\d+)\}/g,function(m,i){
        return args[i];
    });
}

function include(){
	for(var i=0;i<arguments.length;i++){
		var path = arguments[i];
        document.write("<script src='{0}.js'></script>".format(path));
	}
}
