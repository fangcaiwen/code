$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	iframecheckLogin();
	authparams();
	$(".memberCenterNav").load('/public/iframeleft.html');

	$(".noauth").click(function(){
		window.location.href="/auth/authinit.html";
	});
	$(" .authfaile ").click(function(){
		window.location.href="/auth/authinit.html";
	});
	$(".authing").click(function(){
		window.location.href="/auth/authinit.html";
	});
	$(".isauth").click(function(){
		window.location.href="/auth/authinit.html";
	});


});

// 检查登录状态
function iframecheckLogin(){
	var userKey = getCookie("USERKEY");
	var reqdata={
			};
	pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){
			$(".name").empty();
			var company=data.obj.company;
			if(company==undefined||company==''){
				if(data.obj.truename==undefined||data.obj.truename==''){
					company=data.obj.username;
				}else{
					company=data.obj.truename;
				}

			}

			var welcome="";
			var now = new Date(),hour = now.getHours()
			if(hour < 6){
				welcome="晚上好";
			} else if (hour < 9){
				welcome="早上好";
			}else if (hour < 12){
				welcome="上午好";}
			else if (hour < 14){
				welcome="中午好";}
			else if (hour < 17){
				welcome="下午好";}
			else if (hour < 19){
				welcome="傍晚好";}
			else if (hour < 22){
				welcome="晚上好";}
			else {
				welcome="晚上好";
			}

			var html='';
			html+='<p class="company">'+welcome+','+company+'</p>';
			$(".name").append(html);
			//判断是否开通
			feeMem();
		}else{
			window.location.href="/user/login.html";
		}

		$(".header_newe").html(header);
	});
};

//检查登录状态
function loginOut(){
	var reqdata={};
	pairequest("/pai/userPro/userLogot.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){
			window.location.href="/";
		}else{
			layer.msg(data.msg, {icon: 5,offset: 't',anim: 6});
		}
	});
};



function  authparams(){
	var reqdata={};
	pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
		if(data.success==true){
			var status=data.obj.status;
			 userinfo=data.obj.upistr;
			//0 1  3审核中  4 已通过 5 未通过
				$(".isauth").hide();
				$(".noauth").hide();
				$(".authing").hide();
				$(".authfaile").hide();
			if(status==3||status==4||status==5){
				if(status!=5){
					 var html="";
					if(status==3){
						$(".authing").show();
					}else{
						  $(".isauth").show();
					}
				}else{
					$(".authfaile").show();
				}
			}else{
				$(".noauth").show();
			}
			//获取其他信息
			getuserInframAuc()
		}else{
			window.location.href="/user/login.html";
		}
	});
};

/**
 * 得到竞价信息 订单信息
 * @returns
 */
function  getuserInframAuc(){

	var reqdata={};
	pairequest("/pai/inframe/getAuctionForInframe.do",reqdata).then(function(data){
		console.log(data);
		if(data.success==true){
			$(".zz-jp").empty();
			$(".dcj").empty();
			$(".dtjzz").empty();
			$(".fbjj").empty();
			$(".cyjj").empty();
			$(".cjcs").empty();
			$(".jdcs").empty();

			$(".zz-jp").append(data.obj.zzjp);
			$(".dcj").append('<a href="/auctionmanager/managersignauction.html" target="_blank" title="managersignauction" style="color:#ff6700">'+data.obj.dcj+'</a>');
			$(".dtjzz").append('<a href="/auctionmanager/managersignauction.html" target="_blank" title="managersignauction" style="color:#ff6700">'+data.obj.dtjzz+'</a>');
			$(".fbjj").append(data.obj.fbjj);
			$(".cyjj").append(data.obj.cyjj);
			$(".cjcs").append(data.obj.cjcs);
			$(".jdcs").append(data.obj.jdcs);
			getuserInframOrd();
		}else{
			layer.msg(data.msg,{offset: 't',anim: 6});
		}
	});
};



function  getuserInframOrd(){

	var reqdata={};
	pairequest("/pai/inframe/getOrderForInframe.do",reqdata).then(function(data){

		if(data.success==true){
			$(".jxzdd").empty();
			$(".dqy").empty();
			$(".dzf").empty();
			$(".dqrdzd").empty();
			$(".cgdd").empty();
			$(".xsdd").empty();
			$(".cgzl").empty();
			$(".xszl").empty();
			$(".cgze").empty();
			$(".xsze").empty();
			$(".yfje").empty();
			$(".ysje").empty();

			$(".jxzdd").html(data.obj.jxzdd);
			$(".dqy").html('<a href="/orderform/sellerorderformlist.html" title="managersignauction" style="color:#ff6700">'+data.obj.dqy+'</a>');
			$(".dzf").html('<a href="/orderform/buyerorderformlist.html" title="managersignauction" style="color:#ff6700">'+data.obj.dzf+'</a>');
			$(".dqrdzd").html('<a href="/orderform/buyerorderformlist.html" title="managersignauction" style="color:#ff6700">'+data.obj.dqrdzd+'</a>');

			$(".cgdd").html(data.obj.cgdd);
			$(".xsdd").html(data.obj.xsdd);
			$(".cgzl").html((data.obj.cgzl==undefined||data.obj.cgzl=="")?0:data.obj.cgzl);
			if(undefined==data.obj.xszl||data.obj.xszl==''||data.obj.xszl==null){
				$(".xszl").html(0);
			}else{
				$(".xszl").html(data.obj.xszl);
			}

			$(".cgze").html(data.obj.cgze);
			$(".xsze").html(data.obj.xxze);
			$(".yfje").html(data.obj.yfje);
			$(".ysje").html(data.obj.ysje);
		}else{
			layer.msg(data.msg,{offset: 't',anim: 6});
		}
	});
};


//检查登录状态
function feeMem(){
	$(".toOpenMem").hide();
	$(".OpenMem").hide();
	var reqdata={};
	pairequest("/pai/feeCenter/feeMem.do",reqdata).then(function(data){
		if(data.success==false){
			$(".toOpenMem").show();
		}else{
			$(".toOpenMemtext").empty();
			$(".toOpenMemtext").append(data.obj.status==1?"已开通&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a  style='color:orange;'  href='/bank/monthfee.html'>去月结中心> </a>":"审核中");
			$(".OpenMem").show();
		}
	});
};

//申请开通月结
function toOpenMem(){
	var reqdata={};
	pairequest("/pai/feeCenter/toOpenMem.do",reqdata).then(function(data){
		if(data.success==true){
			layer.msg(data.msg, {offset: 't',anim: 6});
			feeMem();
		}else{
			layer.msg(data.msg, {offset: 't',anim: 6});
			feeMem();
		}
	});
};
