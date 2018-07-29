// JavaScript Document
/****************
	游戏开始
****************/
(function(window, undefined){
// Browser capabilities
var isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CLICK_EV = hasTouch ? 'touchend' : 'click',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';
 window.f=window.Base=function(ele){
	return new Base.fn.init(ele);
}
//Base.init.prototype=Base.prototype;
Base.fn=Base.prototype={
	/****************
		核心
	****************/
	//选中元素
	length:0,
	init:function(ele){
		if(typeof ele=="string"||ele instanceof String){
			var elements=[];
			var eleArr=ele.split(" ");
			for(var i=0;i<eleArr.length;i++){
				var perf=eleArr[i].substr(0,1);
				var childElement=[];
				switch(perf){
				case "#":
					if(this.getId(eleArr[i].substr(1))){childElement.push(this.getId(eleArr[i].substr(1)))};
					break;
				case ".":
					if(i!=0&&elements.length==0){
					}else{
						childElement=this.getClass(eleArr[i].substr(1),elements);	
					}
					break;
				default:
					if(i!=0&&elements.length==0){
					}else{
						if(eleArr[i].indexOf(".")!=-1){
							var childArr=eleArr[i].split(".");
							var findChild=[];
							for(var j=0;j<childArr.length;j++){
								if(j==0){
									findChild=this.getTagName(childArr[j],elements);
								}else{
									var matchChild=[];
									var newArr=this.getClass(childArr[j],elements);
									for(var k=0;k<findChild.length;k++){
										for(var z=0;z<newArr.length;z++){
											if(findChild[k]==newArr[z]){
												matchChild.push(findChild[k]);
											};
										}
									}
									findChild=matchChild;
								}
								childElement=findChild;
							}
						}else{
							childElement=this.getTagName(eleArr[i],elements);	
						}
					}
					break;
				}
				elements=childElement;
			}
			for(var j=0;j<elements.length;j++){
				this.length=elements.length;
				this[j]=elements[j];
				//canvas的2d环境
				if(this[j] && this[j].nodeName=="CANVAS" && !this[j]['cobj']){
					this[j]['cobj']=this[j].getContext('2d');
				}
			};
			return this;
		}else if(typeof ele=="object"){
			var elements=[];
			elements[0]=ele;
			for(var j=0;j<elements.length;j++){
				this.length=elements.length;
				this[j]=elements[j];
				//canvas的2d环境
				if(this[j].nodeName=="CANVAS" && !this[j]['cobj']){
					this[j]['cobj']=this[j].getContext('2d');
				}
			};
			return this;
		}else if(typeof ele=="function"){
			Base.bind(document,"DOMContentLoaded",ele,false);
		}
	},
	//获取id元素
	getId:function(ele){
		return document.getElementById(ele);
	},
	//获取class元素
	getClass:function(ele,parentNode){
		var temps=[];
		var pLen=parentNode.length;
		if(pLen>0){
			for(var i=0;i<pLen;i++){
				var temp=parentNode[i].getElementsByTagName("*");
				for (var i=0;i<temp.length;i++) {
					if ((new RegExp('(\\s|^)'+ele+'(\\s|$)')).test(temp[i].className)) {
						temps.push(temp[i]);
					}
				}
			}
		}else{
			var temp=document.getElementsByTagName("*");
			for(var j=0;j<temp.length;j++){
				if ((new RegExp('(\\s|^)'+ele+'(\\s|$)')).test(temp[j].className)) {
					temps.push(temp[j]);
				}
			}
		}
		return temps;
	},
	//获取name元素
	getTagName:function(ele,parentNode){
		var temps=[];
		var pLen=parentNode.length;
		if(pLen>0){
			for(var i=0;i<pLen;i++){
				var temp=parentNode[i].getElementsByTagName(ele);
				for(var j=0;j<temp.length;j++){
					temps.push(temp[j]);
				}
			}
		}else{
			var temp=document.getElementsByTagName(ele);
			for(var j=0;j<temp.length;j++){
				temps.push(temp[j]);
			}
		}
		return temps;
	},
	//获取某一个元素到最外层顶点的位置
	offsetTop:function() {
		var top = this[0].offsetTop;
		var parent = this[0].offsetParent;
		while (parent != null) {
			top += parent.offsetTop;
			parent = parent.offsetParent;
		}
		return top;
	},
	//获取某一个元素到最外层右边的位置
	offsetLeft:function() {
		var left = this[0].offsetLeft;
		var parent = this[0].offsetParent;
		while (parent != null) {
			left += parent.offsetLeft;
			parent = parent.offsetParent;
		}
		return left;
	},
	//保存数据
	data:function(name,value){
		if(arguments.length==2){
			for(var i=0;i<this.length;i++){
				Base.data(this[i],name,value);
			}
			return this;
		}else{
			return this[0][name];
		}
	},
	//绑定事件
	bind:function(type,fn,bol){
		if(arguments.length==2){
			for(var i=0;i<this.length;i++){
				Base.bind(this[i],type,fn,false);
			}
		}else{
			for(var i=0;i<this.length;i++){
				Base.bind(this[i],type,fn,bol);
			}
		}
		return this;
	},
	//解除绑定事件
	unbind:function(type,fn){
		if(type){
			switch(type){
				case 'touch':
				type = CLICK_EV;
				break;
				case 'touchmove':
				type = MOVE_EV;
				break;
				case 'touchend':
				type = END_EV;
				break;
				case 'touchstart':
				type = START_EV;
				break;
				case 'move':
				type = START_EV;
				break;
				case 'slide':
				type = START_EV;
				break;
				default:
				type=type;
			}
		}
		if(arguments.length==0){
			for(var i=0;i<this.length;i++){
				for(var j=0;j<this[i].eventData.length;j++){
					Base.unbind(this[i],this[i].eventData[j][0],this[i].eventData[j][1],this[i].eventData[j][2]);
				}
			}
		}else if(arguments.length==1){
			for(var i=0;i<this.length;i++){
				for(var j=0;j<this[i].eventData.length;j++){
					if(this[i].eventData[j][0]==type){
						Base.unbind(this[i],this[i].eventData[j][0],this[i].eventData[j][1],this[i].eventData[j][2]);
					}
				}
			}
		}else if(arguments.length==2){
			for(var i=0;i<this.length;i++){
				for(var j=0;j<this[i].eventData.length;j++){
					if(this[i].eventData[j][0]==type&&this[i].eventData[j][1]==fn){
						Base.unbind(this[i],this[i].eventData[j][0],this[i].eventData[j][1],this[i].eventData[j][2]);
					}
				}
			}
		}
		return this;
	},
	//点击
	touch:function(fn){
		for(var i=0;i<this.length;i++){
			Base.bind(this[i],CLICK_EV,function(){
				var touch = hasTouch ? event.changedTouches[0] : event;
					fn.call(this,touch.pageX,touch.pageY);
			},false);
		}
	},
	//鼠标按下或触摸开始
	touchstart:function(fn){
		for(var i=0;i<this.length;i++){
			Base.bind(this[i],START_EV,function(event){
				var touch = hasTouch ? event.targetTouches[0] : event;
					fn.call(this,touch.pageX,touch.pageY);
			},false);
		}
	},
	//鼠标移动或触摸移动
	touchmove:function(fn){
		for(var i=0;i<this.length;i++){
			Base.bind(this[i],MOVE_EV,function(event){
				var touch = hasTouch ? event.targetTouches[0] : event;
					fn.call(this,touch.pageX,touch.pageY);
			},false);
		}
	},
	//鼠标松开或触摸结束
	touchend:function(fn){
		for(var i=0;i<this.length;i++){
			Base.bind(this[i],END_EV,function(event){
				var touch = hasTouch ? event.changedTouches[0] : event;
					fn.call(this,touch.pageX,touch.pageY);
			},false);
		}
	},
	//滑动事件
	move:function(obj){
		//参数
		var _that=this[0];
		_that.options={
			vScroll:true,
			hScroll:true,
			animate:true,
			zoom:false,
			scale:false,
			//参数
			zoomNum:1,
			minZoom:1,
			maxZoom:5,
			nowPointX:0,
			nowPointY:0,
			a:1000,
			minX:0,
			minY:0,
			maxX:0,
			maxY:0,
			onRefresh:null
		};
		for (i in obj) _that.options[i] = obj[i];
		if (_that.options.onRefresh) _that.options.onRefresh.call(_that);
		//刷新数据
		_that.refresh=function(){
			if (_that.options.onRefresh) _that.options.onRefresh.call(_that);
		}
		 //滑动开始
		obj.start=function(event){
			if(hasTouch && event.targetTouches.length > 1){
				_that.options.scale=true;
				if(_that.options.zoom){
					var touch1 = event.targetTouches[0];
					var touch2 = event.targetTouches[1];
					var moveX=touch1.pageX-touch2.pageX;
					var moveY=touch1.pageY-touch2.pageY;
					var c1=Math.abs(moveX);
					var c2=Math.abs(moveY);
					obj.touchesDistStart = Math.sqrt(c1*c1+c2*c2);
					_that.options.scaleStart=_that.options.zoomNum;
					Base.css3(this,'transitionDuration',"200ms");
				}	
			}else{
				_that.options.scale=false;
				Base.css3(this,'transitionDuration',"0ms");
				var touch = hasTouch ? event.targetTouches[0] : event;     //touches数组对象获得屏幕上所有的touch，取第一个touch
				//取第一个touch的坐标值
				obj.startPos = {
					x:touch.pageX,
					y:touch.pageY,
					time:+new Date,
					scrollX:window.scrollX,
					scrollY:window.scrollY,
					nowPointX:Base.translate(this).x,
					nowPointY:Base.translate(this).y
				};
				obj.prePageX = touch.pageX;
				obj.prePageY = touch.pageY;
				if(obj.startFn){
					obj.startFn.call(this,obj.startPos);	
				}
			}
			Base.bind(this,MOVE_EV,obj.move,true);
			Base.bind(this,END_EV,obj.end,true);
		}
		//移动
		obj.move=function(event){
			if(hasTouch && event.targetTouches.length > 1){
				if(_that.options.zoom){
					var touch1 = event.targetTouches[0];
					var touch2 = event.targetTouches[1];
					var moveX=touch1.pageX-touch2.pageX;
					var moveY=touch1.pageY-touch2.pageY;
					var x=(Base.translate(this).x-Math.abs(touch2.pageX+moveX))/_that.options.zoomNum;
					var y=(Base.translate(this).y-Math.abs(touch2.pageY+moveY))/_that.options.zoomNum;
					var c1=Math.abs(moveX);
					var c2=Math.abs(moveY);
					obj.touchesDist = Math.sqrt(c1*c1+c2*c2);
					_that.options.zoomNum = 1 / obj.touchesDistStart * obj.touchesDist *_that.options.scaleStart;
					if(_that.options.zoomNum < _that.options.minZoom) _that.options.zoomNum = _that.options.minZoom;
					else if(_that.options.zoomNum > _that.options.maxZoom) _that.options.zoomNum = _that.options.maxZoom;
					x=x*_that.options.zoomNum+Math.abs(touch2.pageX+moveX);
					y=y*_that.options.zoomNum+Math.abs(touch2.pageY+moveY);
					Base.css3(this,'transform',"translate("+x+"px,"+y+"px)  scale("+_that.options.zoomNum+")");
					if(obj.zoomFn){
						obj.zoomPos={
							nowPointX:Base.translate(this).x,
							nowPointY:Base.translate(this).y
						},
						obj.zoomFn.call(this,obj.zoomPos);	
					}
				}
			}else{
				var touch = hasTouch ? event.targetTouches[0] : event;
				obj.movePos = {
					x:touch.pageX - obj.startPos.x,
					y:touch.pageY - obj.startPos.y,
					scale:_that.options.scale,
					zoomNum: _that.options.zoomNum,
					startPointX:obj.startPos.nowPointX,
					startPointY:obj.startPos.nowPointY,
					nowPointX:Base.translate(this).x,
					nowPointY:Base.translate(this).y
				};
				obj.isScrolling = Math.abs(touch.pageX-obj.prePageX) < Math.abs(touch.pageY-obj.prePageY) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
				obj.prePageX = touch.pageX;
				obj.prePageY = touch.pageY;
				if(obj.moveFn){
					obj.moveFn.call(this,obj.movePos,obj.isScrolling);	
				}
			}		
		},
		//滑动释放
		obj.end=function(event){
			if(!hasTouch || event.targetTouches.length==0){
				var touch =  hasTouch ? event.changedTouches[0] : event; 
				obj.endPos = {
					x:touch.pageX - obj.startPos.x,
					y:touch.pageY - obj.startPos.y,
					scrollX:window.scrollX- obj.startPos.scrollX,
					scrollY:window.scrollY- obj.startPos.scrollY,
					duration:Number(+new Date - obj.startPos.time),
					scale:_that.options.scale,
					zoomNum: _that.options.zoomNum,
					startPointX:obj.startPos.nowPointX,
					startPointY:obj.startPos.nowPointY,
					nowPointX:Base.translate(this).x,
					nowPointY:Base.translate(this).y
				};
				if(obj.endFn){
					obj.endFn.call(this,obj.endPos,obj.isScrolling);	
				}
				Base.unbind(this,MOVE_EV,obj.move,true);
				Base.unbind(this,END_EV,obj.end,true);
			}
			if(hasTouch && event.targetTouches.length>0){
				event.stopPropagation();		 //阻止捕获和冒泡
			}	
		}
		Base.css3(_that,'transformOrigin',"0px 0px");
		Base.bind(_that,START_EV,obj.start,true);	
	},
	//遍历
	each:function(fn,args){
		return Base.each(this,fn,args);
	},
	/****************
		CSS3
	****************/
	//获取或设置元素css3的style值
	css3:function(attr,value){
		if(arguments.length==1){
			return Base.css3(this[0],attr);
		}else if(arguments.length==2){
			for(var i=0;i<this.length;i++){
				Base.css3(this[i],attr,value);
			}
			return this;
		}
	},
	/****************
		HTML5
	****************/
	//canvas放大镜
	magnify:function(x,y,r,num){//x：鼠标x轴;y:鼠标y轴;r:放大镜半价;num:放大倍数
		if(!this[0].scaleData){
			this[0].scaleData={};
			}
		if(this[0].scaleData.imageData){
			this[0].scaleData.cobj.putImageData(this[0].scaleData.imageData,this[0].scaleData.x,this[0].scaleData.y);
		}
		this[0].scaleData.cobj=this[0].getContext("2d");
		this[0].scaleData.h=this[0].height;
		this[0].scaleData.w=this[0].width;
		this[0].scaleData.x=x-r;
		this[0].scaleData.y=y-r;
		this[0].scaleData.imageData=this[0].scaleData.cobj.getImageData(this[0].scaleData.x,this[0].scaleData.y,r*2,r*2);
		this[0].scaleData.cobj.save();
		this[0].scaleData.cobj.beginPath();
		this[0].scaleData.cobj.arc(x,y,r,0,2*Math.PI,false);
		this[0].scaleData.cobj.clip();
		this[0].scaleData.cobj.drawImage(this[0],x-r/num,y-r/num,r*2/num,r*2/num,x-r,y-r,r*2,r*2);
		this[0].scaleData.cobj.restore();
		if(x>=(this[0].scaleData.w-r/2)||y>=(this[0].scaleData.h-r/2)||x<=r/2||y<=r/2){
			this[0].scaleData.cobj.putImageData(this[0].scaleData.imageData,this[0].scaleData.x,this[0].scaleData.y);
		}
		return this;
	},
	//canvas的2d环境
	cobj:function(){
		return this[0].cobj;
	},
	//开始绘制路径
	begin:function(){
		for(var i=0;i<this.length;i++){
			this[i].cobj.beginPath();
		}
		return this;
	},
	//闭合绘制路径
	close:function(){
		for(var i=0;i<this.length;i++){
			this[i].cobj.closePath();
		}
		return this;
	},
	//保存当前画布状态
	save:function(){
		for(var i=0;i<this.length;i++){
			this[i].cobj.save();
		}
		return this;
	},
	//释放之前画布状态
	res:function(){
		for(var i=0;i<this.length;i++){
			this[i].cobj.restore();
		}
		return this;
	},
	//清除画布
	clear:function(x,y,w,h){
		if(arguments.length==4){
			for(var i=0;i<this.length;i++){
				this[i].cobj.clearRect(x,y,w,h);
			}
		}else{
			for(var i=0;i<this.length;i++){
				var h=this[i].height;
				var w=this[i].width;
				this[i].cobj.clearRect(0,0,w,h);
			}
		}
		return this;
	},
	//全屏
	setInner:function(w,h,overflow){
		var width=window.innerWidth?window.innerWidth:document.documentElement.clientWidth;
		var height=window.innerHeight?window.innerHeight:document.documentElement.clientHeight;
		if(arguments.length==0){
			for(var i=0;i<this.length;i++){
				this[i].width=width;
				this[i].height=height;
			}
		}else{
			for(var i=0;i<this.length;i++){
				if(w){
					this[i].width=w;
				}else{
					this[i].width=width;
				}
				if(h){
					this[i].height=h;
				}else{
					this[i].height=height;
				}
			}
		}
		if(overflow){
			document.documentElement.style.overflow="auto";
		}else{
			document.documentElement.style.overflow="hidden";
		}
		document.body.style.padding="0px";
		document.body.style.margin="0px";
		return this;
	},
	//转化矩阵
	transf:function(a,b,c,d,e,f){
		for(var i=0;i<this.length;i++){
			this[i].cobj.transform(a,b,c,d,e,f);//a:水平缩放，b:水平倾斜，c:垂直倾斜，d：垂直缩放，e:水平移动，f:垂直移动
		}		
		return this;
	},
	//重置转化矩阵
	setTransf:function(a,b,c,d,e,f){
		for(var i=0;i<this.length;i++){
			this[i].cobj.setTransform(a,b,c,d,e,f);//a:水平缩放，b:水平倾斜，c:垂直倾斜，d：垂直缩放，e:水平移动，f:垂直移动
		}		
		return this;
	},
	//位移
	trans:function(x,y){
		for(var i=0;i<this.length;i++){
			this[i].cobj.translate(x,y);
		}		
		return this;
	},
	//放大或缩小
	scale:function(x,y){
		for(var i=0;i<this.length;i++){
			this[i].cobj.scale(x,y);
		}		
		return this;
	},
	//旋转
	rotate:function(num){
		for(var i=0;i<this.length;i++){
			this[i].cobj.rotate(num*Math.PI/180);
		}		
		return this;
	},
	//剪切
	clip:function(){
		for(var i=0;i<this.length;i++){
			this[i].cobj.clip();
		}		
		return this;
	},
	//透明
	opacity:function(num){
		for(var i=0;i<this.length;i++){
			this[i].cobj.globalAlpha=num;
		}		
		return this;
	},
	//图像合成
	mixImage:function(value){
		for(var i=0;i<this.length;i++){
			this[i].cobj.globalCompositeOperation=value;
		}		
		return this;
	},
	//canvas操作图像
	draw:function(ele,sx,sy,sw,sh,x,y,w,h){
		var imgData;
		if(typeof ele=="string"){
			imgData=f(ele)[0];
		}else{
			imgData=ele;
		}
		if(arguments.length==3){
			for(var i=0;i<this.length;i++){
				this[i].cobj.drawImage(imgData,sx,sy);
			};
		}else if(arguments.length==5){
			for(var i=0;i<this.length;i++){
				this[i].cobj.drawImage(imgData,sx,sy,sw,sh);
			};
		}else if(arguments.length==9){
			for(var i=0;i<this.length;i++){
				this[i].cobj.drawImage(imgData,sx,sy,sw,sh,x,y,w,h);
			};
		}
		return this;
	},
	//canvas创建图像数据
	create:function(w,h){
		if(arguments.length==2){
			this[0].imgData=this[0].cobj.createImageData(w,h);
		}else if(arguments.length==1){
			this[0].imgData=this[0].cobj.createImageData(w);
		}
		return this[0].imgData;
	},
	//canvas当前的数据
	get:function(x,y,w,h){
		if(arguments.length==4){
			this[0].imgData=this[0].cobj.getImageData(x,y,w,h);
		}else{
			var h=this[0].height;
			var w=this[0].width;
			this[0].imgData=this[0].cobj.getImageData(0,0,w,h);
		}
		return this[0].imgData;
	},
	//canvas插入数据
	put:function(imgData,x,y,Dx,Dy,w,h){
		if(arguments.length==3){
			for(var i=0;i<this.length;i++){
				this[i].cobj.putImageData(imgData,x,y);
			};
		}else if(arguments.length==7){
			for(var i=0;i<this.length;i++){
				this[i].cobj.putImageData(imgData,x,y,Dx,Dy,w,h);
			};
		}
		return this;
	},
	//canvas阴影
	shadow:function(shadow){
		var shadow=eval(shadow);
		for(var i=0;i<this.length;i++){
			this[i].cobj.shadowColor=shadow[0];
			this[i].cobj.shadowOffsetX=shadow[1];
			this[i].cobj.shadowOffsetY=shadow[2];
			this[i].cobj.shadowBlur=shadow[3];
		}
		return this;
	},
	//canvas颜色
	color:function(colorArr){
		var	colorArr=eval("("+colorArr+")");
		for(var i=0;i<this.length;i++){
			var color;
			if(colorArr.linear){
				color=this[i].cobj.createLinearGradient(colorArr.linear[0],colorArr.linear[1],colorArr.linear[2],colorArr.linear[3]);
				for(var k in colorArr.addColor){
					color.addColorStop(k,colorArr.addColor[k]);		
				}
			}else if(colorArr.radial){
				color=this[i].cobj.createRadialGradient(colorArr.radial[0],colorArr.radial[1],colorArr.radial[2],colorArr.radial[3],colorArr.radial[4],colorArr.radial[5]);
				for(var k in colorArr.addColor){
					color.addColorStop(k,colorArr.addColor[k]);		
				}
			}else if(colorArr.color){
				color=colorArr.color;
			}else if(colorArr.image){
				if(colorArr.imagePosition){
					color=this[i].cobj.createPattern(f(colorArr.image)[0],colorArr.imagePosition);
				}else{
					color=this[i].cobj.createPattern(f(colorArr.image)[0],"repeat");	
				}
			}
			if(colorArr.shadow){
				Base.shadow(this[i],colorArr.shadow);
			}
			if(colorArr.type){
				var typeArr=colorArr.type.split(",");
				for(var j=0;j<typeArr.length;j++){
					if(typeArr[j]=="fill"){
						this[i].cobj.fillStyle=color;
					}else if(typeArr[j]=="stroke"){
						this[i].cobj.strokeStyle=color;
					}
				}
			}else{
                this[i].cobj.fillStyle=color;
            }
		}
		return this;
	},
	//canvas填充类型
	type:function(type){
		var typeArr=type.split(",");
		for(var i=0;i<this.length;i++){
			for(var j=0;j<typeArr.length;j++){
				if(typeArr[j]=="fill"){
					this[i].cobj.fill();
				}else if(typeArr[j]=="stroke"){
					this[i].cobj.stroke();
				}
			}
		}
		return this;
	},
	//canvas本身属性
	prop:function(prop){
		var	prop=eval("("+prop+")");
		for(var i=0;i<this.length;i++){
			for(var k in prop){
				this[i].cobj[k]=prop[k];
			}
		}
		return this;
	},
	//矩形
	rect:function(data,type,colorArr,prop,beginPath,closePath){
		for(var i=0;i<this.length;i++){
			this[i].cobj.save();
			if(colorArr){
				Base.color(this[i],colorArr);
			}
			if(prop){
				Base.prop(this[i],prop);
			}
			if(beginPath==false){
			}else{
				this[i].cobj.beginPath();
			}
			var data=eval(data);
			this[i].cobj.rect(data[0],data[1],data[2],data[3]);
			if(closePath){
				this[i].cobj.closePath();
			}
			if(type){
				Base.type(this[i],type);
			}
			this[i].cobj.restore();
			}
		return this;
	},
	//圆
	arc:function(data,type,colorArr,prop,beginPath,closePath){
		for(var i=0;i<this.length;i++){
			this[i].cobj.save();
			if(colorArr){
				Base.color(this[i],colorArr);
			}
			if(prop){
				Base.prop(this[i],prop);
			}
			if(beginPath==false){
			}else{
				this[i].cobj.beginPath();
			}
			var data=eval(data);
			this[i].cobj.arc(data[0],data[1],data[2],data[3],data[4]*Math.PI/180,data[5]);
			if(closePath){
				this[i].cobj.closePath();
			}
			if(type){
				Base.type(this[i],type);
			}
			this[i].cobj.restore();
			}
		return this;
	},
	//线
	line:function(data,type,colorArr,prop,beginPath,closePath){
		for(var i=0;i<this.length;i++){
			this[i].cobj.save();
			if(colorArr){
				Base.color(this[i],colorArr);
			}
			if(prop){
				Base.prop(this[i],prop);
			}
			if(beginPath==false){
			}else{
				this[i].cobj.beginPath();
			}
			if(data){
				var data=eval(data);
				for(var j=0;j<data.length;j++){
					if(j==0){
						if(data[j].length==2){
							this[i].cobj.moveTo(data[j][0],data[j][1]);
						}else if(data[j].length==4){
							this[i].cobj.quadraticCurveTo(data[j][0],data[j][1],data[j][2],data[j][3]);
						}else if(data[j].length==5){
							this[i].cobj.arcTo(data[j][0],data[j][1],data[j][2],data[j][3],data[j][4]);
						}else if(data[j].length==6){
							this[i].cobj.bezierCurveTo(data[j][0],data[j][1],data[j][2],data[j][3],data[j][4],data[j][5]);
						}
					}else{
						if(data[j].length==2){
							this[i].cobj.lineTo(data[j][0],data[j][1]);
						}else if(data[j].length==4){
							this[i].cobj.quadraticCurveTo(data[j][0],data[j][1],data[j][2],data[j][3]);
						}else if(data[j].length==5){
							this[i].cobj.arcTo(data[j][0],data[j][1],data[j][2],data[j][3],data[j][4]);
						}else if(data[j].length==6){
							this[i].cobj.bezierCurveTo(data[j][0],data[j][1],data[j][2],data[j][3],data[j][4],data[j][5]);
						}
					}
				}
			}
			if(closePath){
				this[i].cobj.closePath();
			}
			if(type){
				Base.type(this[i],type);
			}
			this[i].cobj.restore();
			}
		return this;
	},
    //canvas星形
    star:function(data,type,colorArr,prop,beginPath,closePath){
        for(var i=0;i<this.length;i++){
            this[i].cobj.save();
            if(colorArr){
                Base.color(this[i],colorArr);
            }
            if(prop){
                Base.prop(this[i],prop);
            }
            if(beginPath==false){
            }else{
                this[i].cobj.beginPath();
            }
            if(data){
                var data=eval(data);
                var starPoints=[];
                for(var j=0;j<data[4]*2;j++){
                    var starPoint=[];
                    var a=(360/(data[4]*2))*(Math.PI/180);
                    if(j%2==0){
                        starPoint.x=data[0]+data[2]*Math.cos(j*a);
                        starPoint.y=data[1]-data[2]*Math.sin(j*a);
                    }else{
                        starPoint.x=data[0]+data[3]*Math.cos(j*a);
                        starPoint.y=data[1]-data[3]*Math.sin(j*a);
                    }
                    starPoints.push(starPoint);
                }
                for(var k=0;k<starPoints.length;k++){
                    this[i].cobj.lineTo(starPoints[k].x,starPoints[k].y);
                }
            }
            if(closePath){
                this[i].cobj.closePath();
            }
            if(type){
                Base.type(this[i],type);
            }
            this[i].cobj.restore();
        }
        return this;
    },
	//canvas多边形
    poly:function(data,type,colorArr,prop,beginPath,closePath){
        for(var i=0;i<this.length;i++){ 
            this[i].cobj.save();
            if(colorArr){
                Base.color(this[i],colorArr);
            }
            if(prop){
                Base.prop(this[i],prop);
            }
            if(beginPath==false){
            }else{
                this[i].cobj.beginPath();
            }
            if(data){
                var data=eval(data);
                var polyPoints=[];
                for(var j=0;j<data[3];j++){
                    var polyPoint=[];
                    var a=(360/(data[3]))*(Math.PI/180);
					polyPoint.x=data[0]+data[2]*Math.cos(j*a);
					polyPoint.y=data[1]-data[2]*Math.sin(j*a);
                    polyPoints.push(polyPoint);
                }
                for(var k=0;k<polyPoints.length;k++){
                    this[i].cobj.lineTo(polyPoints[k].x,polyPoints[k].y);
                }
            }
            if(closePath){
                this[i].cobj.closePath();
            }
            if(type){
                Base.type(this[i],type);
            }
            this[i].cobj.restore();
        }
        return this;
    },
	//canvas文字
	text:function(data,type,colorArr,prop,beginPath,closePath){
		for(var i=0;i<this.length;i++){
			this[i].cobj.save();
			if(colorArr){
				Base.color(this[i],colorArr);
			}
			if(prop){
				Base.prop(this[i],prop);
			}
			if(beginPath==false){
			}else{
				this[i].cobj.beginPath();
			}
			var data=eval(data);
			if(data.length==1){
				return this[i].cobj.measureText(data[0]);
			}
			var typeArr=type.split(",");
			for(var j=0;j<typeArr.length;j++){
				if(typeArr[j]=="fill"){
					if(data.length==4){
						this[i].cobj.fillText(data[0],data[1],data[2],data[3]);	
					}else{
						this[i].cobj.fillText(data[0],data[1],data[2]);
					}
				}else if(typeArr[j]=="stroke"){
					if(data.length==4){
						this[i].cobj.strokeText(data[0],data[1],data[2],data[3]);	
					}else{
						this[i].cobj.strokeText(data[0],data[1],data[2]);
					}
				}
			}
			if(closePath){
				this[i].cobj.closePath();
			}
			this[i].cobj.restore();
			}
		return this;
	},
	//图像绑定事件
	addEvent:function(x,y,draw,callBack){
		var cobj=this.cobj();
		if(arguments.length==3){
			if(cobj.isPointInPath(x,y)){
				draw.call(null,x,y);
			}
		}else if(arguments.length==4){
			var draw=eval(draw);
			draw;
			if(cobj.isPointInPath(x,y)){
				callBack.call(null,x,y);
			}
		}	
	}
}
Base.fn.init.prototype=Base.prototype;
/****************
	公共函数
****************/
//浏览器检测
Base.sys=function(){
	var sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;		
	(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] : 
	(s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] : 
	(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
	if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
	return sys;
}
//获取和设置css3属性
Base.css3=function(ele,attr,value){
	if(arguments.length==2){
		if (typeof window.getComputedStyle != 'undefined') {//W3C
			return window.getComputedStyle(ele, null)[attr];
		} else if (typeof ele.currentStyle != 'undefined') {//IE
			return ele.currentStyle[attr];
		}
	}else if(arguments.length==3){
		var Attr=attr.toUpperCase().substr(0,1)+attr.substr(1);
		ele.style[attr]=value;
		ele.style["webkit"+Attr]=value;
		ele.style["o"+Attr]=value;
		ele.style["moz"+Attr]=value;
		ele.style["ms"+Attr]=value;
	}
}
//绑定事件
Base.bind=function(ele,type,fn,bol){
	if(!ele.eventData){
		ele.eventData=[];
	}
	var data=[];
	data.push(arguments[1],arguments[2],arguments[3]);	
	ele.eventData.push(data);
	if(ele.addEventListener){
		ele.addEventListener(type, fn, bol);
	}else{
		ele.attachEvent("on"+type,fn);
	}
}
//获取行内translate
Base.translate=function(ele){
	var str=ele.style['transform'];
	if(str){
		str=str.match(/translate.+\)/g)[0];
		return {
			x:parseInt(str.match(/\-?[0-9]+\.?[0-9]*/g)[0]),
			y:parseInt(str.match(/\-?[0-9]+\.?[0-9]*/g)[1])
		}
	}else{
		return {
			x:0,
			y:0
		}
	}
},
//解除事件
Base.unbind=function(ele,type,fn,bol){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,bol);
	}else{
		ele.detachEvent("on"+type,fn);
	}
}
//保存数据
Base.data=function(ele,name,value){
	ele[name]=value;
},
//遍历
Base.each=function( obj, fn, args ) { 
    if ( args ) { 
       if ( obj.length == undefined ){ 
           for ( var i in obj ) 
             fn.apply( obj, args ); 
       }else{ 
           for ( var i = 0, ol = obj.length; i < ol; i++ ) {
              if ( fn.apply( obj, args ) === false ) 
                  break; 
          }
       }
   } else { 
       if ( obj.length == undefined ) {
            for ( var i in obj ) 
               fn.call( obj, i, obj ); 
       }else{ 
          for ( var i = 0, ol = obj.length, val = obj[0]; i < ol && fn.call(val,i,val) !== false; val = obj[++i] ){} 
       }
  } 
  return obj; 
} 
/*******canvas**********/
//canvas创建离线画板
Base.createC=function(w,h){
	var bgC=document.createElement("canvas");
	bgC.height=h;
	bgC.width=w;
	return Base(bgC);
}
//canvas阴影
Base.shadow=function(ele,shadow){
	ele.cobj=ele.getContext("2d");
	var shadow=eval(shadow);
	ele.cobj.shadowColor=shadow[0];
	ele.cobj.shadowOffsetX=shadow[1];
	ele.cobj.shadowOffsetY=shadow[2];
	ele.cobj.shadowBlur=shadow[3];
}
//canvas颜色
Base.color=function(ele,colorArr){
	var color;	
	ele.cobj=ele.getContext("2d");
	var	colorArr=eval("("+colorArr+")");
	if(colorArr.linear){
		color=ele.cobj.createLinearGradient(colorArr.linear[0],colorArr.linear[1],colorArr.linear[2],colorArr.linear[3]);
		for(var k in colorArr.addColor){
			color.addColorStop(k,colorArr.addColor[k]);		
		}
	}else if(colorArr.radial){
		color=ele.cobj.createRadialGradient(colorArr.radial[0],colorArr.radial[1],colorArr.radial[2],colorArr.radial[3],colorArr.radial[4],colorArr.radial[5]);
		for(var k in colorArr.addColor){
			color.addColorStop(k,colorArr.addColor[k]);		
		}
	}else if(colorArr.color){
		color=colorArr.color;
	}else if(colorArr.image){
		if(colorArr.imagePosition){
			color=ele.cobj.createPattern(f(colorArr.image)[0],colorArr.imagePosition);
		}else{
			color=ele.cobj.createPattern(f(colorArr.image)[0],"repeat");	
		}
	}
	if(colorArr.shadow){
		Base.shadow(ele,colorArr.shadow);
	}
	if(colorArr.type){
		var typeArr=colorArr.type.split(",");
		for(var j=0;j<typeArr.length;j++){
			if(typeArr[j]=="fill"){
				ele.cobj.fillStyle=color;
			}else if(typeArr[j]=="stroke"){
				ele.cobj.strokeStyle=color;
			}
		}
	}else{
        ele.cobj.fillStyle=color;
    }
}
//canvas填充类型
Base.type=function(ele,type){
	var typeArr=type.split(",");
	ele.cobj=ele.getContext("2d");
	for(var j=0;j<typeArr.length;j++){
		if(typeArr[j]=="fill"){
			ele.cobj.fill();
		}else if(typeArr[j]=="stroke"){
			ele.cobj.stroke();
		}
	}
}
//canvas本身的属性
Base.prop=function(ele,prop){
	var	prop=eval("("+prop+")");
	ele.cobj=ele.getContext("2d");
	for(var k in prop){
		ele.cobj[k]=prop[k];
	}
}
//canvas图像反相
Base.opp=function(imgData){
	for(var i=0;i<imgData.width*imgData.height;i++){
		imgData.data[4*i+0]=255-imgData.data[4*i+0];
		imgData.data[4*i+1]=255-imgData.data[4*i+1];
		imgData.data[4*i+2]=255-imgData.data[4*i+2];
		imgData.data[4*i+3]=imgData.data[4*i+3];
		}
	return imgData;
}
//canvas图像窗帘
Base.blind=function(imgData,num){
	for(var i=0;i<imgData.width*imgData.height;i++){
		if(i%num==0){
			imgData.data[4*i+0]=0;
			imgData.data[4*i+1]=0;
			imgData.data[4*i+2]=0;
			imgData.data[4*i+3]=0;
		}
	}
	return imgData;
}
//canvas图像杂色
Base.rand=function(imgData,per){
	var arr=[];
	var newArr=[];
	for(var i=0;i<imgData.height*imgData.width;i++){
		arr.push(i);
	}
	for(var j=0;j<Math.round(imgData.height*imgData.width*per);j++){
		newArr.push(arr.splice([Math.round(Math.random()*(arr.length-1))],1));
	}
	for(var i=0;i<newArr.length;i++){
		imgData.data[newArr[i]*4+0]=Math.round(255*Math.random());
		imgData.data[newArr[i]*4+1]=Math.round(255*Math.random());
		imgData.data[newArr[i]*4+2]=Math.round(255*Math.random());
		imgData.data[newArr[i]*4+3]=255;
	}
	return imgData;
}
//canvas图像模糊
Base.blur=function(imgData,num){
	for(var j=0;j<num;j++){
		for(var i=0;i<imgData.width*imgData.height;i++){
			imgData.data[4*i+0]=(imgData.data[4*(i-1)+0]+imgData.data[4*i+0]+imgData.data[4*(i+1)+0])/3;
			imgData.data[4*i+1]=(imgData.data[4*(i-1)+1]+imgData.data[4*i+1]+imgData.data[4*(i+1)+1])/3;
			imgData.data[4*i+2]=(imgData.data[4*(i-1)+2]+imgData.data[4*i+2]+imgData.data[4*(i+1)+2])/3;
			imgData.data[4*i+3]=(imgData.data[4*(i-1)+3]+imgData.data[4*i+3]+imgData.data[4*(i+1)+3])/3;
		}
	}
	return imgData;
}
//canvas图像倒影
Base.ref=function(imgData,num,num2){
	var newImgArr=f.createC(imgData.width,imgData.height).create(imgData.width,imgData.height);
	for(var i=0;i<num2;i++){
		for(var j=0;j<imgData.width;j++){
			newImgArr.data[i*imgData.width*4+j*4+0]=imgData.data[(imgData.height-i-1)*imgData.width*4+j*4+0];
			newImgArr.data[i*imgData.width*4+j*4+1]=imgData.data[(imgData.height-i-1)*imgData.width*4+j*4+1];
			newImgArr.data[i*imgData.width*4+j*4+2]=imgData.data[(imgData.height-i-1)*imgData.width*4+j*4+2];
			newImgArr.data[i*imgData.width*4+j*4+3]=imgData.data[i*imgData.width*4+j*4+3]-i*num;
		}
	}
	return newImgArr;
}
//获取某一个元素到最外层顶点的位置
Base.offsetTop=function(ele) {
	var top = ele.offsetTop;
	var parent = ele.offsetParent;
	while (parent != null) {
		top += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return top;
}
//获取某一个元素到最外层右边的位置
Base.offsetLeft=function(ele) {
	var left = ele.offsetLeft;
	var parent = ele.offsetParent;
	while (parent != null) {
		left += parent.offsetLeft;
		parent = parent.offsetParent;
	}
	return left;
}
//扩展
Base.extend=function(name,fn) {
	Base.prototype[name] =fn;
},
/*******动画**********/
//动画
Base.animate=function(fn,allTime){//fn:需要循环执行的函数
	var stopWatch=new StopWatch();
	function animate(){
		if(stopWatch.isRunning){
			stopWatch.getElapsedTime();
			stopWatch.time+=stopWatch.elapsedTime;
			if(allTime!==undefined&&stopWatch.time>=allTime){
				stopWatch.isRunning=false;
			}
			stopWatch.ftp=1000/stopWatch.elapsedTime;
			fn.call(null,stopWatch.elapsedTime,stopWatch.ftp);//fn第一个参数表示间隔时间，第二个参数表示每秒的频率
			requestAnimationFrame(animate);
		}
	};
	requestAnimationFrame(animate);
	return stopWatch;
}
//取消动画
Base.stop=function(ele){//ele:取消动画的名称
	ele.isRunning=false;
}
//动画类型
//线性
Base.linear=function(percentC){
	return percentC;
}
//缓入
Base.easeIn=function(percentC,strength){
	return Math.pow(percentC,strength*2);
}
//缓出
Base.easeOut=function(percentC,strength){
	return 1-Math.pow(1-percentC,strength*2);
}
//缓入缓出
Base.easeInOut=function(percentC){
	return percentC-Math.sin(percentC*2*Math.PI)/(2*Math.PI);
}
//弹簧运动
Base.elastic=function(percentC,passes){
	return ((1-Math.cos(percentC*Math.PI*passes))*(1-percentC))+percentC;
}
//弹跳运动
Base.bounce=function(percentC,bounces){
	percentC=Base.elastic(percentC,bounces);
	return percentC<=1?percentC:2-percentC;
}
//动画间隔时间和帧
function StopWatch(){
}
StopWatch.prototype={
	time:0,
	fps:0,
	startTime:0,
	endTime:0,
	elapsedTime:0,
	isRunning:true,
	getElapsedTime:function(){
		this.endTime=+new Date();
		if(this.startTime){
			this.elapsedTime=this.endTime-this.startTime;
			}
		this.startTime=this.endTime;
	}
}	
//window动画属性
window.requestAnimationFrame=window.requestAnimationFrame||
	window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame||
	window.msRequestAnimationFrame||
	function(callback){
		var self=this,start,finish;
		window.setTimeout(
		function(){
		 start=+new Date();
		 callback();
		 finish=+new Date();
		 self.timeout=1000/60-(finish-start);
		},self.timeout); 
	}
/********精灵*********/
Sprite=function(name,painter,behaviors){
	if(name!==undefined) this.name=name;
	if(painter!==undefined) this.painter=painter;
	this.top=0;
	this.left=0;
	this.width=0;
	this.height=0;
	this.vX=0;
	this.vY=0;
	this.startvX=0;
	this.startvY=0;
	this.visible=true;
	this.animating=false;
	this.behaviors=behaviors||[];
	return this;
}
Sprite.prototype={
	paint:function(){
		if(this.painter!==undefined&&this.visible){
			this.painter.paint();
		}
	},
	update:function(time,ftp){
		for(var i=0;i<this.behaviors.length;i++){
			this.behaviors[i].execute(time,ftp);
		}
	}
}	
})(window);
/****************
	作者：小赵
****************/