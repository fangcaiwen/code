$(document).ready(function(){
	 checkLogin();
	 $("#footer_all").load('/public/public_footer.html');
});

///检查登录状态
function checkLogin(){
	var userKey = getCookie("USERKEY");
	var reqdata={};
	pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){				
			authparams();
		}else{
			window.location.href="/user/login.html";
		}
		
		$(".header_newe").html(header);
	
	});
};



var userinfo={};
function  authparams(){
	var reqdata={};
	pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
		if(data.success==true){				
			var status=data.obj.status;
			 userinfo=data.obj.upistr;
			 useform();
			// 0 1 3审核中 4 已通过 5 未通过
			if(status==3||status==4||status==5){
				if(status!=5){
					 var html="";
					if(status==3){
						$(".title").html("实名认证审核中，请耐心等待");
						paiAlert("实名认证审核中，请耐心等待","/","随便逛逛");
					}else{
						$(".title").html("实名认证已通过。");
						paiAlert("实名认已通过","/inframe/index.html","去个人中心");
					}
					$(".yzs-login-btn").hide();
					$($(".yzs-login-btn").siblings("a").eq(0)).html("随便逛逛");
				}else{
					$(".title").html("实名认证未通过，请重新填写");
					$(".title").attr("title","");
				}
			}
		}else{
			window.location.href="/user/login.html";
		}
	
	});
};

/**
 * 遮罩
 * @param title
 * @param tourl
 * @returns
 */
function paiAlert(title,tourl,bt){
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



/**
 * 提交公司信息
 * 
 * @param info
 * @returns
 */
function submitComAuth(info){
	var reqdata=info;
	pairequest("/pai/memberAuth/personalAuth.do",reqdata).then(function(data){

		if(data.success==true){				
			var alert1=layer.open({
				  type: 1,
				  title: false,
				  closeBtn: 0,
				  area: '516px',
				  skin: 'layui-layer-nobg', // 没有背景色
				  shadeClose: true,
				  content: $('.alert1')
				});
			
			var alert2
			setTimeout(function() {
				layer.close(alert1);
				 alert2=layer.open({
					  type: 1,
					  title: false,
					  closeBtn: 0,
					  area: '516px',
					  skin: 'layui-layer-nobg', // 没有背景色
					  shadeClose: true,
					  content: $('.alert2')
					});
				
			}, 5000);
			
			setTimeout(function() {
				layer.close(alert2);
				window.location.href="/inframe/index.html";
			}, 6000);
			
			
		}else{
			layer.msg(data.msg, {icon: 5,offset: 't',anim: 6});
		}
	});
}


function useform(){
	layui.use('form', function(){
		  var form = layui.form;
		  // 监听提交
		  form.on('submit(formDemo)', function(data){
			  $(".formDemo").attr("disabled",true);
			  var imgdata="";
			  var  pass=true;
			  $.each($(".layui-upload-img"),function(index,info){
				  var name=$(info).attr("name");
				  var url=$(info).attr("src");
				  if(url==''||url==undefined){
					var msg= $( $(this).parent(".layui-upload-drag")).siblings(".yzs-m-renzheng-imgup-tit").text()
					  layer.msg("请上传"+msg, {icon: 5,offset: 't',anim: 6});
						pass=false;
					  return false;
				  }
				  data.field[name]=url;
			  });
			  
			  
//			  layer.msg(JSON.stringify(data.field));
			  if(pass){
				  submitComAuth(data.field); 
			  }
		    return false;
		  });
		  
		  form.val('acom',userinfo);
		  showimg(userinfo,form);
		});
}


function  showimg(userinfo,form){
	 if(userinfo.gshenz!=undefined&&userinfo.gshenz!=""){
		 $("img[name='gshenz']").attr("src",userinfo.gshenz);
		  $($("img[name='gshenz']").siblings("i")).hide();
		  $("img[name='gshenz']").show();
	 }
	 
	 if(userinfo.gshenf!=undefined&&userinfo.gshenf!=""){
		 $("img[name='gshenf']").attr("src",userinfo.gshenf);
		  $($("img[name='gshenf']").siblings("i")).hide();
		  $("img[name='gshenf']").show();
	 }
	  
}

