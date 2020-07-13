

$(document).ready(function(){
	checkLogin();
})


//检查登录状态
function checkLogin(){
	var reqdata={};
	pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){		
			$(".znxx").show();
			checkisshow();
			phonepush();
			$(".isshow").click(function(){
				hangqMessage();
				$(".ishide").show();
				$(".isshow").hide();
			});
			
			$(".ishide").click(function(){
				layer.closeAll();
				$(".ishide").hide();
				$(".isshow").show();
			})
		}
	});
};
var  isshow=0;
function hangqMessage(){
	var reqdata={"pageNo":6};
	painoloadrequest("/pai/app/hangq/hangqMessage.do",reqdata).then(function(data){
		if(data.obj.isshow==1){
			$(".pushmsg").html("您有未读消息");
			$(".pushmsg").css("background-color","#FF5722");
		}else{
			$(".pushmsg").html("推送消息");
			$(".pushmsg").css("background-color","#009688");
		}
		var header = "";
		var html="<h3 style='font-size: 15px;background-color: #FF9800;text-align: center;height: 30px;line-height: 30px;width: 280px;border-radius: 45px;'>站内消息通知</h3>";
	    html+="<div class='container' style='background-color: #f7f7f7;width: 280px;height: 450px;overflow: auto;color: #000;'>";
		if(data.success==true){	
			 html+="<lu><li><span style='margin-left: 12%;font-size: 15px;'>未读消息</span></li></lu>";
			$.each(data.obj.mlist,function(index,info){
				if(info.islook==1){
					return;
				 }
				 html+="<div class=' pushitemback' style='border-bottom: 1px dotted #8a8282;;width: 280px'>";
				 html+="<a title="+info.requrl+" data='"+info.title+"' href='javascript:void(0);' class='lookpush'>";
				 if(info.islook==0){
					 html+='<span style="margin-left: 2%;" class="layui-badge-dot"></span>';
				 }
				 html+="<lu style=';width: 280px'><li style='height: 15px;font-size: 12px;;width: 280px'>";
			     html+="<span style='margin-left: 5%;'>"+info.title.substring(0,20)+"...</span>";
			     html+="<li style='height: 10px;font-size: 10px;'>";
			     html+="</li>";
			     html+="<span style='margin-left: 5%;'>"+info.pushtime+"</span>";
			     html+="</li>";
			     html+="</lu></a>"
		    	 html+="</div>"
			})
			 html+="<lu><li><span style='margin-left: 36%;font-size: 15px;'>没有更多了</span></li></lu>";
			 html+="<lu><li><span style='margin-left: 12%;font-size: 15px;'>已读消息</span></li></lu>";
			$.each(data.obj.mlist,function(index,info){
				if(info.islook==0){
					return;
				 }
				 html+="<div class=' pushitemback' style='border-bottom: 1px dotted #8a8282;;width: 280px'>";
				 html+="<a title="+info.requrl+" data='"+info.title+"' href='javascript:void(0);' class='lookpush'>";
				 html+="<lu style=';width: 280px'><li style='height: 15px;font-size: 12px;;width: 280px'>";
			     html+="<span style='margin-left: 5%;'>"+info.title.substring(0,20)+"...</span>";
			     html+="<li style='height: 10px;font-size: 10px;'>";
			     html+="</li>";
			     html+="<span style='margin-left: 5%;'>"+info.pushtime+"</span>";
			     html+="</li>";
			     html+="</lu></a>"
			   html+="</div>"
			})
			 html+="<lu><li><span style='margin-left: 36%;font-size: 15px;'>没有更多了</span></li></lu>";
		 }
		
		html+="</div>";
		html+="</div>";
			  layer.tips(html, '.znxx', {
				  tips: [1, 'rgba(152, 148, 148, 0)'],
				  time: 400000
				  }); 
			  
		  $(".pushitemback").mouseover(function(){
			  $(".pushitembackcolor").removeClass("pushitembackcolor");
			  $(this).addClass("pushitembackcolor");
		  })
		  
		  $(".lookpush").click(function(){
			  var requrl=$(this).attr("title");
			  var title=$(this).attr("data");
			  var reqdata={};
				painoloadrequest(requrl,reqdata).then(function(data){
					if(data.success==true){
						if(undefined!=data.obj.openurl&&data.obj.openurl!=""){
//							window.location.href=data.obj.pushurl;
							pushAlerToHref(title,data.obj.openurl);
							
						}else{
							pushAlert(title);
						}
					}else{
						pushAlert(title);
					}
				});
		  })
});
}




function checkisshow(){
	var reqdata={"pageNo":1};
	painoloadrequest("/pai/app/hangq/hangqMessage.do",reqdata).then(function(data){
		if(data.obj.isshow==1){
			$(".pushmsg").html("您有未读消息");
			$(".pushmsg").css("background-color","#FF5722");
		}else{
			$(".pushmsg").html("推送消息");
			$(".pushmsg").css("background-color","#009688");
		}
		
	});
}

/**
 * 遮罩
 * @param title
 * @param tourl
 * @returns
 */
function pushAlerToHref(title,tourl){
	layer.msg(title, {
        time:8000,
        shade: 0.8,
        anim: 2,
        btn: "查看"
   ,yes: function(){
	   $(".isshow").click();
 	  	window.location.href=tourl;
   	}
   });
}

/**
 * 遮罩
 * @param title
 * @param tourl
 * @returns
 */
function pushAlert(title){
	layer.msg(title, {
        time:8000,
        shade: 0.8,
        anim: 2,
        btn: "好的"
   ,yes: function(){
	   $(".isshow").click();
 	  	layer.closeAll();
   	}
   });
}

//手机推广
function phonepush(){
	$(".phone-push").mouseover(function(){
		layer.tips('<img width:400px;  src="http://www.ezaisheng.cn/resources/img/banner/pushout.png?'+ Date.now()+'"/>', '.phone-push', {
			  tips: [3, '#3595CC'],
			  time: 5000
			});
	})
}



