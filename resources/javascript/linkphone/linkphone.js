$(document).ready(function(){
		$("#header_all").load('/public/public_header.html');
		$(".memberCenterNav").load('/public/iframeleft.html');
		checkLogin();
});


// 检查登录状态
function checkLogin(){

	var userKey = getCookie("USERKEY");
	$.ajax({
		url:"/pai/userPro/checkLoginStatus.do",
		type:"get",
		data:{
			"userKey":userKey
		},
		dataType:"json",
		beforeSend:function(){
			return true;
		},
		success:function(data){
			if(data.success==true){
				useform(data);
			}else{
				window.location.href="/user/login.html";
			}

		}
	});
};


function useform(data){
	layui.use('form', function(){
		  var form = layui.form;
		  form.verify({
			  code: function(value, item){
				  if (value.length != 6) {
						return "请输入6位数验证码";
					}
			  }
			});
		  // 监听提交
		  form.on('submit(formDemo)', function(data){
			  $(".formDemo").attr("disabled",true);
			  submitlinkuser(data.field);
		    return false;
		  });

		  form.val('linkphone',data.obj);

		});
}

function submitlinkuser(data){
	$.ajax({
		url:"/pai/linkphone/checkUpMoCode.do",
		type:"get",
		data:{
			mobile:data.editphone,
			code:data.code
		},
		dataType:"json",
		beforeSend:function(){
			return true;
		},
		success:function(data){
			if(data.code=='000'){
				loginOut();
				layer.alert('修改成功,需重新登录', {
					  skin: 'layui-layer-molv' // 样式类名
					  ,closeBtn: 0
					}, function(){
						tologin();
					});
			}else{
				layer.msg(data.upmocode,{offset: 't',anim: 6});
			}

		},
		error:function(){
			layer.msg("系统错误",{offset: 't',anim: 6});
		}

	});
}

/**
 * 请求完成跳转页面
 *
 * @returns
 */
function tourl(){
	var tourl=saveCallbackUrl();
	if(tourl==undefined||tourl==''){
		tourl="/inframe/index.html";
	}
	clearCookie("TOURL");
	return tourl;
}

function getParam(){
	　　var reg = new RegExp("(^|&)"+ "v" +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null)return unescape(r[2]);
	   return null;
	}

function tologin(){
	if(getParam()==3){
		window.location.href= "/sso/user/login.html";
	}else{
		window.location.href= "/user/login.html?v="+getParam();
	}

}


$(document).ready(function(){
	$(".link-phone-edit").click(function(){
		$(".up-phone").show();
	});

	// 验证码获取
	$(".tyuio1").click(function() {
		checkphone(this);
	});
})

/**
 * 检查手机号是否存在
 *
 * @param oo
 * @returns
 */
function checkphone(oo) {
	if($("input[name='editphone']").eq(0).val()==""){
		layer.msg("手机号不能为空!",{offset: 't',anim: 6});
		return ;
	}
	if($("input[name='editphone']").eq(0).val()==$("input[name='phone']").eq(0).val()){
		layer.msg("请填写新的手机号!",{offset: 't',anim: 6});
		return ;
	}

	$.ajax({
		type : "get",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		url : "/pai/userPro/checkMobile.do",
		data : {
			"mobile" : $("input[name='editphone']").eq(0).val()
		},
		async : false,
		dataType : "json",
		success : function(data) {
			if (data.success == false) {
				sendFtCode(oo);
			} else {
				layer.msg(data.msg,{offset: 't',anim: 6})
				return false
			}
		},
		error : function() {
			layer.msg("请求错误",{offset: 't',anim: 6})
			return false;
		}
	});
}

/**
 * 发送验证码
 *
 * @param oo
 * @returns
 */
function sendFtCode(oo) {
	$.ajax({
		type : "get",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		url : "/pai/linkphone/sendUpMoCode.do",
		data : {
			"mobile" : $("input[name='editphone']").eq(0).val()
		},
		async : false,
		dataType : "json",
		success : function(data) {
			if (data.code == 000) {
				$("#sendFtCodeBut").val("''");
				time(oo);
			} else {
				layer.msg(data.message,{offset: 't',anim: 6})
			}
		},
		error : function(e) {
			console.log(e);
			layer.msg("请求错误",{offset: 't',anim: 6})
		}
	});
};


// 检查登录状态
function loginOut(){
	loginoutv3();
	loginoutfront();
	$.ajax({
		url:"/pai/userPro/userLogot.do?time="+new Date().getTime(),
		type:"get",
		data:{
		},
		dataType:"json",
		success:function(data){
			var header = "";
			if(data.success==true){

			}else{
				layer.msg(data.msg, {icon: 5,offset: 't',anim: 6});
			}
		},
		error:function(e){
			layer.msg("系统错误,请重新登录！",{offset: 't',anim: 6});
			tologin();
		}

	});
};


function  loginoutv3(){
	$.ajax({
	    url: baseurlv3+'/wemall_logout.htm',
        type: 'get',
        async:false,
        dataType:'jsonp',
        crossDomain: true,
        cache:false,
        timeout: 200,
        jsonp: "callback",
	    data: {
	    },
	    success:function(data){

	    },
	    error:function(e){}
	});
}

function  loginoutfront(){
	$.ajax({
	    url: baseurlv3+'/front/userPro/userLogot.htm',
        type: 'get',
        async:false,
        dataType:'jsonp',
        crossDomain: true,
        cache:false,
        timeout: 200,
        jsonp: "callback",
	    data: {
	    },
	    success:function(data){

	    },
	    error:function(e){}
	});
}
