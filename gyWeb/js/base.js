// JavaScript Document
(function(window){
	window.f=window.Base={}
	//登录
	Base.login=function(){
		var len=$(".l_img li").length;
		var content="";
		for(var i=0;i<len;i++){
			content+="<li></li>"
		}
		$(".l_dot").append(content);
		var width=len*22;
		$(".l_dot").css("marginLeft",(-width/2)+"px");
		$(".l_dot li").eq(0).addClass("selected");
		
		var index=0;
		var timer;
		function selected(i){
			$(".l_img li").css("zIndex","-9998");
			$(".l_img .selected").css("zIndex","-9997");
			$(".l_img li").eq(i).css("zIndex","-9996");
			$(".l_img li").eq(i).css('opacity','0.6');
			$(".l_img li").eq(i).animate({opacity:'1'},1000);
			$(".l_img li").removeClass("selected");
			$(".l_img li").eq(i).addClass("selected");
			
			$(".l_dot li").removeClass("selected");
			$(".l_dot li").eq(i).addClass("selected");		
		}
		function timerFn(){
			timer=setInterval(function(){
				index++;
				if(index>4){
					index=0;
				}
				selected(index);
			},4000);
		}
		timerFn();
		$(".l_dot li").mouseover(function(){
			index=$(this).index();
			clearInterval(timer);
			$(".l_img li").stop();
			selected(index);
		});
		$(".l_dot li").mouseout(function(){
			timerFn();
		});
	}
	
})(window);