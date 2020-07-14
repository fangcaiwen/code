$(document).ready(function(){
	 addressInit();
	 checkLogin();
	 $("#footer_all").load('/public/public_footer.html');
	 $(".authtemplent").click(function(){
	        var photo={
	            "title": "样本查看", //相册标题
	            "id": new Date().getTime(), //相册id
	            "start": 0, //初始显示的图片序号，默认0
	            "data": [   //相册包含的图片，数组格式
	                {
	                    "alt": "样本查看",
	                    "pid": new Date().getTime(), //图片id
	                    "src": "http://www.ezaisheng.com/ezaisheng/resource/images/member/authsample.jpg", //原图地址
	                    "thumb": "http://www.ezaisheng.com/ezaisheng/resource/images/member/authsample.jpg" //缩略图地址
	                }
	            ]
	        }
	        layer.photos({
	            photos: photo //格式见API文档手册页
	            ,anim: 1 //0-6的选择，指定弹出图片动画类型，默认随机
	        });
	 });
	 $("#submitDataBtn").click(function () {
         alert("提交成功");
         window.location.href="/inframe/index.html?auth=true";
     });
});


// 地址选择初始化
function addressInit(){
	 $.each(provinceList, function(key, val) {
		            var option1 = $("<option>").val(val.name).text(val.name);
		  			var option2 = $("<option>").val(val.name).text(val.name);
	                 $("#bankProvince").append(option1);
	  				 $("#operProvince").append(option2);
         }); 

}


//检查登录状态
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
}



/**
 * 提交公司信息
 *
 * @param info
 * @returns
 */
function submitComAuth(info){
	var reqdata=info;
	pairequest("/pai/memberAuth/companyAuth.do",reqdata).then(function(data){

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
		  form.verify({
			  code: function(value, item){
				  if(value.length!=4){
				    	return "请输入4位数验证码";
				    }
			  }
			});
		  // 监听提交
		  form.on('submit(formDemo)', function(data){
              return false;
              $(".formDemo").attr("disabled",true);
			  var imgdata="";
			  var  pass=true;
			  // $.each($(".layui-upload-img"),function(index,info){
				 //  var name=$(info).attr("name");
				 //  var url=$(info).attr("src");
				 //  if(url==''||url==undefined){
					// var msg= $( $(this).parent(".layui-upload-drag")).siblings(".yzs-m-renzheng-imgup-tit").text()
					//   layer.msg("请上传"+msg, {icon: 5,offset: 't',anim: 6});
					// 	pass=false;
					//   return false;
				 //  }
				 //  data.field[name]=url;
			  // });

			  // layer.msg("提交成功",{offset: 't',anim: 6});

//			  layer.msg(JSON.stringify(data.field));
			  if(pass){
				  $.ajax({
					  type: "POST",
					  contentType: "application/x-www-form-urlencoded; charset=utf-8",
					  url : "/pai/userPro/checkCompany.do",
					  data : {company:data.field.company},
					  async:false,
					  datatype:"json",
					  success :function(resd){
						var   resd1=eval('(' + resd + ')');
						  if(resd1.status!="success"){
							  layer.msg(resd1.message,{offset: 't',anim: 6});
							  return false;
						  }else{
							  submitComAuth(data.field);
						  }
					  },
					  error:function(){
						  layer.msg("请求失败",{offset: 't',anim: 6});
					  }
				  });


			  }
		    return false;
		  });

		  form.val('acom',userinfo);
		  showimg(userinfo,form);
		  // 开户行市级选择
		  form.on('select(bankProvince)', function(data){
			  var areaId=data.value;
			  var stop=false;
  			  $.each(provinceList, function(key, val) {
		  				if(stop){
		  					return false;
		  				}
		  				if(val.name==areaId){
		  					$("#bankCity").empty();
		  					$.each(val.cityList, function(key, val) {
		  					var option1 = $("<option>").val(val.name).text(val.name);
                               $("#bankCity").append(option1);
                              form.render('select');
		  					 });
		  				}

                  }); 
             
		  });

		// 营业地址市级选择
		  form.on('select(operProvince)', function(data){
			  var areaId=data.value;
			  var stop=false;
			  $("#operProvince").val(data.value);
  			  $.each(provinceList, function(key, val) {
		  				if(stop){
		  					return false;
		  				}
		  				if(val.name==areaId){
		  					$("#operAreaid").empty();
		  					$.each(val.cityList, function(key, val) {
		  					var option1 = $("<option>").val(val.name).text(val.name);
                               $("#operAreaid").append(option1);
                              form.render('select');
		  					 }); 
		  					stop=true;
		  					return false;
		  				}

                  }); 
             
		  });
		  // 营业地址县级选择
		  form.on('select(operAreaid)', function(data){
			  var indexp=   $("#operProvince").find("option:selected").index();
			  var indexc=   $(data.elem).find("option:selected").index();
			  var areaId=data.value;
			  var stop=false;
			  $("#operSecname").empty();
  			  $.each(provinceList[indexp-1].cityList[indexc].areaList, function(key, val) {
					var option1 = $("<option>").val(val).text(val);
                    $("#operSecname").append(option1);
					 form.render('select');
                  }); 
             
		  });


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
	 if(userinfo.authorizurl!=undefined&&userinfo.authorizurl!=""){
		 $("img[name='authorizurl']").attr("src",userinfo.authorizurl);
		  $($("img[name='authorizurl']").siblings("i")).hide();
		  $("img[name='authorizurl']").show();
	 }
	 if(userinfo.shifourenzheng!=undefined&&userinfo.shifourenzheng!=""){
		 $("img[name='shifourenzheng']").attr("src",userinfo.shifourenzheng);
		  $($("img[name='shifourenzheng']").siblings("i")).hide();
		  $("img[name='shifourenzheng']").show();
	 }
	 if(userinfo.qiyezhizhao!=undefined&&userinfo.qiyezhizhao!=""){
		 $("img[name='qiyezhizhao']").attr("src",userinfo.qiyezhizhao);
		  $($("img[name='qiyezhizhao']").siblings("i")).hide();
		  $("img[name='qiyezhizhao']").show();
	 }
	 if(userinfo.qiyedaimazheng!=undefined&&userinfo.qiyedaimazheng!=""){
		 $("img[name='qiyedaimazheng']").attr("src",userinfo.qiyedaimazheng);
		  $($("img[name='qiyedaimazheng']").siblings("i")).hide();
		  $("img[name='qiyedaimazheng']").show();
	 }

	 //银行地址赋值
	  var areaId=userinfo.bankProvince;
	  var stop=false;
		  $.each(provinceList, function(key, val) {
 				if(stop){
 					return false;
 				}
 				if(val.name==areaId){
 					$("#bankCity").empty();
 					$.each(val.cityList, function(key, val) {
 						 var option1 = $("<option>").val(val.name).text(val.name);
                          $("#bankCity").append(option1);
 					 }); 
 					$("#bankCity").val(userinfo.bankCity)
 	 				form.render('select');
 					stop=true;
 					return false;
 				}
                }); 

		//经营地址赋值
		var province=userinfo.province;
		var city=userinfo.city;
		var opersecname=userinfo.opersecname;
		$("#operProvince").val(province);
		var stop=false;
			  $.each(provinceList, function(key, val) {
					if(stop){
						return false;
					}
					if(val.name==province){
						$("#operAreaid").empty();
						$.each(val.cityList, function(key, val) {
							 var option1 = $("<option>").val(val.name).text(val.name);
	                          $("#operAreaid").append(option1);
								if(val.name==city){
									 $.each(val.areaList, function(i, val1) {
											var option2 = $("<option>").val(val1).text(val1);
						                    $("#operSecname").append(option2);
											 //form.render('select');
						                  }); 
								}
						 }); 
						$("#operAreaid").val(city)
						$("#operSecname").val(opersecname)
						form.render('select');
						stop=true;
						return false;
					}
                }); 
           


}

