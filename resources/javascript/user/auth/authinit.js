$(document).ready(function(){
	$("#footer_all").load('/public/public_footer.html');
	checkLogin();
	// $(".authentication").load('/auth/atcom.html');
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
		var timestamp = Date.parse(new Date());
		if(data.success==true){	
			if(data.obj.status==1||data.obj.status==0){
				$(".authentication").load('/auth/atcom.html?v=2');
			}else if(data.obj.status==3||data.obj.status==4||data.obj.status==5){
				if(data.obj.regid!=5){
					if(data.obj.qiyezhizhao==""||data.obj.qiyezhizhao==undefined){
						$(".authentication").load('/auth/atidv.html?v=2');
					}else{
						$(".authentication").load('/auth/atcom.html?v=2');
					}
				}else{
					$(".authentication").load('/auth/atpersion.html?v=2');
				}
			}
		}else{
			window.location.href="/user/login.html";
		}
	});
};


