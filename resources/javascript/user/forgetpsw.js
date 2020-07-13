$(document).ready(function(){
	$("#footer_all").load('/public/public_footer.html');
	/*$("#randimgcode").attr("src","/pai/randImg/randCode.do?"+new Date().getTime());
	$("#randimgcode").click(function(){
		$(this).attr("src","/pai/randImg/randCode.do?"+new Date().getTime());
	});*/

	$(".toregist").click(function() {
		window.location.href = "/user/regist.html";
	});

	$(".forgetpsw").click(function() {
		window.location.href = "/user/login.html";
	});

});



layui.use('form', function(){
	  var form = layui.form;
	  form.verify({
		  code: function(value, item){
			  if(value.length!=4){
			    	return "请输入4位数验证码";
			    }
		  }
		});
	  //监听提交
	  form.on('submit(formDemo)', function(data){
//		  layer.msg(JSON.stringify(data.field));
		  forgetCheckImgCode(data.field);
	    return false;
	  });

	});

function forgetCheckImgCode(info){
	var reqdata=info;
	pairequest("/pai/userPro/forgetCheckImgCode.do",reqdata).then(function(data){
		if(data.success){
			window.location.href="/user/forget-2.html";
		}else{
			layer.msg(data.msg,{offset: 't',anim: 6});
		}
	});
}
