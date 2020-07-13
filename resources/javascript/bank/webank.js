$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	 checkLogin();
	 var ltype=getParam();
	 if("t"==ltype){
		 $(".memberCenterNav").load('/public/tiframeleft.html');
	 }else{
		 $(".memberCenterNav").load('/public/iframeleft.html'); 
	 }
	
});

function getParam(){
	　　var reg = new RegExp("(^|&)"+ "ltype" +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null)return unescape(r[2]);
	   return null;
	}




//检查登录状态
function checkLogin(){
	var userKey = getCookie("USERKEY");
	var reqdata={
			"userKey":userKey
			};
	pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){				
			authparams();
		}else{
			window.location.href="/user/login.html";
		}
	});
};

function  weizshow(){
	
	var reqdata={};
	pairequest("/website/webank/checkisUserWz.do",reqdata).then(function(data){

		if(data.success==true){
			
			var reqdata={};
			pairequest("/website/webank/toIndex.do",reqdata).then(function(obj){
				if(obj.success==true){
					window.open(obj.content); 
                  }else{
                	  layer.msg(obj.message, {icon: 2,  time: 4000,offset: 't',anim: 6});
                  }
			});
          }else{
        	  if(data.message=='请先绑定公司银行卡'){
        		  layer.msg(data.message, {icon: 2,  time: 4000,offset: 't',anim: 6});
				  }else{
					  
					  var reqdata={};
					  pairequest("/website/webank/toIndex.do",reqdata).then(function(obj){
							if(obj.success==true){
								window.location.href=obj.content; 
			                  }else{
			                	  layer.msg(obj.message, {icon: 2,  time: 4000,offset: 't',anim: 6});
			                  }
						
					  });
				  }
          }
	
	});

}



function  authparams(){
	
	var reqdata={};
	pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
		if(data.success==true){				
			var status=data.obj.status;
			 var userinfo=data.obj.upistr;
			// 0 1 3审核中 4 已通过 5 未通过
			 var html="";
				if(status==3||status==4||status==5){
				if(status!=5){
					if(status==3){
						paiAlert("实名认证审核中","/","随便逛逛");
					}else{
						var timestamp = Date.parse(new Date());
						var iscp=false;
						$.getJSON("/resources/json/tender_blank.json?time="+timestamp,function(data1){
							  $.each(data1,function(index,info){
								  if(info.id==userinfo.userid){
									  iscp=true;
									  return false;
								  }
							  })
							// 子公司
								if(iscp){
									// 验证码获取
									$(".tyuio1").click(function() {
										sendFtCode(this);
									});
								
								   $(".weizshow").click(function(){
									   checkpay();
								   });
								// 有权限
//								   userinfo["iphone"]="";
									if((userinfo.iphone==undefined||userinfo.iphone=="")){
										 paiAlert("未绑定银行卡","/bank/bindCard.html","去绑定");
									 }else{
										$(".iphone").html(userinfo.iphone);
									 };
									
								}else{
								//非子公司
								   $(".checkPay").hide();
								   $(".weizshow").click(function(){
									   weizshow();
								   });
								}
						  });
						
					}
				}else{
					paiAlert("实名认证未通过","/auth/authinit.html","重新去实名认证");
				}
				}else{
					paiAlert("未实名认证","/auth/authinit.html","去实名认证");
				}
		}else{
			window.location.href="/user/login.html";
		}
	
	});
};


function checkpay(){
	   var code=$("input[name='code']").val();
	   if(code==undefined||code==''){
			   layer.msg("验证码不能为空",{offset: 't',anim: 6})
			   return false;
	   }
	   if (code.length != 6) {
			 layer.msg("请输入6位数验证码",{offset: 't',anim: 6})
			 return false;
		}
	   
	   
	   var reqdata={
				"mobile" : $(".iphone").html(),
				"param":"wbank",
				"code":code
			};
	   pairequest("/pai/paycommon/checkPaySendCode.do",reqdata).then(function(data){
			if (data.success == true) {
				weizshow();
			} else {
				layer.msg(data.msg,{offset: 't',anim: 6})
			}
	   });
};




/**
 * 发送验证码
 * 
 * @param oo
 * @returns
 */
function sendFtCode(oo) {
	var phone=$(".iphone").html();
	if((phone==undefined||phone=="")){
		layer.msg($(".phone").html(),{offset: 't',anim: 6})
		 paiAlert("未绑定银行卡","/bank/bindCard.html","去绑定");
		 return false;
	 }
	
	var reqdata={
			"mobile" : $(".iphone").html(),
			"param":"wbank"
		};
	pairequest("/pai/paycommon/sendCode.do",reqdata).then(function(data){
		if (data.success == true) {
			$("#sendFtCodeBut").val("''");
			time(oo);
		} else {
			layer.msg(data.msg,{offset: 't',anim: 6})
		}
	
	});
};

/**
 * 遮罩
 * 
 * @param title
 * @param tourl
 * @returns
 */
function paiAlert(title,tourl,bt){return;
	layer.msg(title, {
        time:100000,
        shade: 0.8,
        anim: 2,
        btn: [bt]
   ,yes: function(){
 	  	window.location.href=tourl;
   	}
   });

	setTimeout(function(){
		window.location.href=tourl;
	}, 100000);
};
















