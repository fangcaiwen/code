var paylonding
var  topay=function(requrl,param){
	 paylonding=layer.load(0, {shade: false});
	 asyncUserInfo(requrl,param);
}
function asyncUserInfo(requrl,param){
	var reqdata={};
	pairequest("/pai/paycommon/userInfoAsync.do",reqdata).then(function(data){
		if(data.success==true){
			chacePayInfo(requrl,param);
		}else{
			var html="";
			if(data.errorcode==110005){
				html+='<div class="auth_modal" >';
				html+='您还未登录,请先登录。<a href="/user/login.html">去登录</a>';
				html+='</div>';
				layer.open({type: 1,title: false,closeBtn: 0,area: '516px',skin: 'layui-layer-nobg', shadeClose: true,content: html });
				layer.close(paylonding,param);
			}else{
				layer.msg(data.msg,{offset: 't',anim: 6});
			}
		}

	});
}

function chacePayInfo(requrl,param){
	var reqdata=param;
	pairequest(requrl,reqdata).then(function(data){
		if(data.success==true){
			closeLonding(data.obj);
		}else{
			layer.close(paylonding);
			layer.msg(data.msg,{offset: 't',anim: 6});
		}
	});
};

function closeLonding(param){
	setTimeout(function() {
		layer.close(paylonding);
		window.open("/pay/paipay.html?t="+new Date().getTime()+"&param="+param);

		setTimeout(function() {
			var html="";
			html+='<div class="auth_modal" >';
			html+='请确定您已经支付成功,支付成功点击。<a href="javascript:window.location.reload();">刷新</a>';
			html+='</div>';
			layer.open({type: 1,title: false,closeBtn: 0,area: '516px',skin: 'layui-layer-nobg', shadeClose: true,content: html });
		}, 500);


	}, 500);
}
