// JavaScript Document
(function(window){
	//返回
	f(".header_back").touch(function(){
		history.back();
	});
	//搜索
	f(".s_ul li").touch(function(){
		var index=$(this).index();
		$(".s_ul li").removeClass("selected");	
		$(this).addClass("selected");
		$(".s_underLine").animate({"left":index*33.3+"%"},300);
		$(".s_list").hide();
		$(".s_list").eq(index).show();
	});
	//选择法律法规
	f(".checkbox").touch(function(){
		$(this).toggleClass("selected");
	});
	//调查取证
	f("#l_add_div").touch(function(){
		var content="<ul class='d_list lc_list'><li class='cf'><div class='left ellip'>证据情况</div></li><li class='cf'><div class='left ellip'>证据名称</div><div class='right ellip'><input type='text' class='underline_input' placeholder='请填写' /></div></li><li class='cf'><div class='left ellip'>证据单位</div><div class='right ellip'><input type='text' class='underline_input' placeholder='请填写' /></div></li><li class='cf'><div class='left ellip'>证据数量</div><div class='right ellip'><input type='text' class='underline_input' placeholder='请填写' /></div></li><li class='cf'><div class='left ellip'>备注</div><div class='right ellip'><input type='text' class='underline_input' placeholder='请填写' /></div></li><li class='cf'><div class='left ellip'>附件</div><div class='right ellip'><img src='images/add_bnt.jpg' width='45' height='45'/></div></li></ul>";
		$(this).before(content);
		
	});
	//行政处罚
	f(".p_title").touch(function(){
		$(this).next("div").toggle();
		$(this).find(".row_icon").toggleClass("selected");
		
	});
	f(".p_reduce_div").touch(function(){
		$(this).parent("div").toggle();
		$(this).parent("div").prev('div').find(".row_icon").toggleClass("selected");
	});
	f(".p_toggle").touch(function(){
		$(this).next("ul").toggle();
		$(this).find(".right_row").toggleClass("selected");
	});
})(window)