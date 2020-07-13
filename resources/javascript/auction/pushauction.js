$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
    $("#footer_all").load('/public/public_footer.html');
	 checkLogin();
	 authparams();
	$(".memberCenterNav").load('/public/iframeleft.html');
	//计价公式
	 $(".formula").click(function(){
		 if($(this).val()=="暂无计价公式"){
			 $(this).val("");
		 }
	 });
	 $(".formula").blur(function(){
		 if($(this).val()==""){
			 $(this).val("暂无计价公式");
		 }
	 });
});

// 检查登录状态
function checkLogin(){

	var userKey = getCookie("USERKEY");

	var reqdata={
			"userKey":userKey
			};
	pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){
			 var timestamp = Date.parse(new Date());
				$.getJSON("/resources/json/tender_blank.json?time="+timestamp,function(data1){
					  $.each(data1,function(index,info){
						  if(info.id==data.obj.userid){
							  iscp=true;
							  $(".head").html('补全竞拍信息<span style="color:red;">（子公司无需填写起拍价格）</span>');
							  $("#psprice").attr("disabled",'disabled');
							  $("input[name='auction.bljmail']").val("soundgroup_xtcb@126.com");
							  $("input[name='auction.bljname']").val("刘一");
						  }
					  })
				  });
			}else{
			window.location.href="/user/login.html";
		}

		$(".header_newe").html(header);

	});
};

/**
 * 及时发布竞价页面
 * @returns
 */
function pushAuctionView(data){
	layer.open({
			anim : 2,
			type : 1,
			title : false,
			shade : 0.1,
			scrollbar : true,
			shadeClose : false,
	      area: ['80%', '50%'],
	      content:$(".yzs-form")
	     ,btn: ['确认发布', '预览公告', '取消']
		  ,yes: function(index, layero){
		    //按钮【按钮一】的回调
			  var jsondata={};
			  jsondata["goodsid"]=data.obj.goodsid;
			  jsondata["auction.bond"]= data.obj.bond;
			  var isp=true;
				 $.each( $($(layero).find("input")),function(i,inf){
					 var name=$(inf).attr("name");
					 var placeholder=$(inf).attr("placeholder");
					 var valu=$(inf).val();
					 if(valu==null||valu==''){
						 isp=false;
						 layer.msg(placeholder,{offset: 't',anim: 6});
						 return false;
					 }
					 jsondata[name]=valu;
				 });
				 jsondata["auction.delay"]=$(layero).find("select[name='auction.delay']").val();
				 if(isp){
					 if(jsondata["auction.endtime"]<jsondata["auction.starttime"]){
						 layer.msg("开始时间需小于结束时间",{offset: 't',anim: 6});
						 return false;
					 }

					 pushAuction(jsondata);
				 }
		    return false ;
		  }
		  ,btn2: function(index, layero){
		    //按钮【按钮一】的回调
			  var jsondata={};
			  jsondata["goodsid"]=data.obj.goodsid;
			  jsondata["auction.bond"]= data.obj.bond;
			  var isp=true;
				 $.each( $($(layero).find("input")),function(i,inf){
					 var name=$(inf).attr("name");
					 var placeholder=$(inf).attr("placeholder");
					 var valu=$(inf).val();
					 if(valu==null||valu==''){
						 isp=false;
						 layer.msg(placeholder,{offset: 't',anim: 6});
						 return false;
					 }
					 jsondata[name]=valu;
				 });
				 jsondata["auction.delay"]=$(layero).find("select[name='auction.delay']").val();
				 if(isp){
					 if(jsondata["auction.endtime"]<jsondata["auction.starttime"]){
						 layer.msg("开始时间需小于结束时间",{offset: 't',anim: 6});
						 return false;
					 }
					 previewAuctionNotice(jsondata);
				 }
		    return false ;
		  }
		  ,btn3: function(index, layero){
			  window.location.href="/auctionmanager/pushauctiongoods.html";
		  }
	    });

};

/**
 * 预览公告
 * @param jsondata
 * @returns
 */
function  previewAuctionNotice(jsondata){
	$.ajax({
		   skin: 'layer-ext-moon',
		   type: "get",
		   dataType:"json",
		   url: "/pai/auction/goods/previewAuctionNotice.do",
		   data: jsondata,
		   success: function(data){
		   		if(data.success){
					var goods = data.obj;
					var template = feisuliaoTemplate;
					if(goods.catanames){
						var catename = goods.catanames;
						if(catename.indexOf("@")>0){
							catename = catename.substring(0,catename.indexOf("@"));
							if(catename.indexOf("废油")>0){
								template = feiyouTemplate;
							}else if(catename.indexOf("废钢")>0){
								template = feigangTemplate;
							}
						}
					}
					console.log(goods);
					template = template.replace(/@company/g,goods.auctiontitle);
					template = template.replace(/@goodsName/g,goods.goodsname);
					template = template.replace(/@auctionStartTime/g,jsondata["auction.starttime"]);
					template = template.replace(/@auctionEndTime/g,jsondata["auction.endtime"]);
					template = template.replace(/@goodsAddress/g,goods.goodsaddress.replace(/@/g,""));
					template = template.replace(/@goodsamount/g,goods.goodsamount);
					template = template.replace(/@goodsunit/g,goods.goodsunit);
					template = template.replace(/@goodsdes/g,goods.goodsdes);
					template = template.replace(/@pactStartTime/g,jsondata["auction.pactstarttime"]);
					template = template.replace(/@pactEndTime/g,jsondata["auction.pactendtime"]);
					template = template.replace(/@goodBonds/g,goods.bond);
					template = template.replace(/@goodsCate/g,catename);
					template = template.replace(/@formula/g,$("#formula").val());
					template = template.replace(/@lookstarttime/g,jsondata["auction.lookstarttime"]);
					template = template.replace(/@lookendtime/g,jsondata["auction.lookendtime"]);
					layer.open({
						anim: 2,
						type: 1,
						title: "公告预览",
						shade: 0.1,
						scrollbar :true,
						shadeClose: false,
						area: ['70%', '60%'],
						content:template
					});
				}else{
				   layer.msg(data.msg,{offset: 't',anim: 6});
		   		}
		   }
		});
}


/**
 * 发布竞价
 * @param jsondata
 * @returns
 */
function  pushAuction(jsondata){

	var reqdata=jsondata;
	pairequest("/pai/auction/goods/publishAuction.do",reqdata).then(function(data){
   		if(data.success){
		  var html='<div class="auth_modal alert1" >';
			html+=''+data.msg+'3秒后跳入待审核竞拍管理页面。<a href="/auctionmanager/pushauctiongoods.html">我要继续发布</a>';
			html+='</div>';
			layer.open({
				  type: 1,
				  title: false,
				  closeBtn: 0,
				  area: '516px',
				  skin: 'layui-layer-nobg', //没有背景色
				  shadeClose: true,
				  content: html
				});
		   setTimeout(function() {
			   location.href="/auctionmanager/managerauction.html";
		}, 3000);
   		}else{
   			layer.msg(data.msg,{offset: 't',anim: 6});
   		}

	});
}



function  authparams(){

	var reqdata={};
	pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
		if(data.success==true){
			var status=data.obj.status;
			 userinfo=data.obj.upistr;
			//0 1  3审核中  4 已通过 5 未通过
			 var html="";
				if(status==3||status==4||status==5){
				if(status!=5){
					if(status==3){
						paiAlert("实名认证审核中，暂不能发布商品。","/","随便逛逛");
					}else{
						readyone();
						readytwo();
					}
				}else{
					paiAlert("实名认证未通过，暂无竞拍商品。","/auth/authinit.html","重新去实名认证");
				}
				}else{
					paiAlert("未实名认证，暂不能发布商品。","/auth/authinit.html","去实名认证");
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

function readyone(){


	$(document).ready(function(e) {
		//加载一级分类

		var reqdata={};
		pairequest("/pai/auction/getFirstCategory.do",reqdata).then(function(data){
			   var categoryOne = data.obj;
			   var categoryOneHtml = "";
			   for(var i = 0 ; i<categoryOne.length;i++){
				   categoryOneHtml += '<option value='+categoryOne[i].cid+'>'+categoryOne[i].catname+'</option>';
			   }

			   $("#fcategory").html(categoryOneHtml);

		});
		//加载默认二级分类

		var reqdata={"parentid":1};
		pairequest("/pai/auction/getSecondCategory.do",reqdata).then(function(data){
			   var categoryTwo = data.obj;
			   var categoryTwoHtml = "";
			   var certname = "";
			   for(var i = 0 ; i<categoryTwo.length;i++){
				   categoryTwoHtml += '<option value='+categoryTwo[i].certname+'>'+categoryTwo[i].catname+'</option>';
			   }

			   var  html=categoryTwo[0].certname;
			   if(html!=''&&html!=undefined){
				   html=html.split("@");
			   }
			   $.each(html,function(index,info){
				   $("#active-zizhi").append('<div class="active-zizhi"> <span name = "rightrequire">'+info+'</span> <a  class="closezz" href="javascript:;">×</a></div>');
			   });
			   /*$('#zizhi_txt').val(categoryTwo[0].certname);*/
			   $("#scategory").html(categoryTwoHtml);
			   //分类
			   $(".auctioncataname").val("");
			   setTimeout(function() {
				   $(".auctioncataname").val($("#fcategory").find("option:selected").text()+"@"+$("#scategory").find("option:selected").text());
			   }, 2000);
		});
		layui.use(['form', 'layedit', 'laydate'], function(){
			var form = layui.form;
			var layer = layui.layer
			var  layedit = layui.layedit
			var  laydate = layui.laydate;
			form.render(null, 'allpush');
			  //日期
			  laydate.render({
			    elem: '#auctionlookstarttime'
			    ,type: 'date'
			  });
			  laydate.render({
			    elem: '#auctionlookendtime'
		    	,type: 'date'
			  });
			  laydate.render({
				    elem: '#auctionpactendtime'
				    ,type: 'date'
			  });
			  laydate.render({
				    elem: '#auctionpactstarttime'
				    ,type: 'date'
			  });
			  laydate.render({
				    elem: '#auctionstarttime'
				    ,type: 'datetime'
			  });
			  laydate.render({
				    elem: '#auctionendtime'
				    	,type: 'datetime'
			  });
			  form.on('switch(basepush)', function(data){
				  if(this.checked){
					  $("input[name='productList[0].sprice']").addClass("layui-btn-disabled");
					  $("input[name='productList[0].jprice']").addClass("layui-btn-disabled");
					  $("input[name='productList[0].sprice']").val(1);
					  $("input[name='productList[0].jprice']").val(1);
				  }else{
					  $("input[name='productList[0].sprice']").val(0);
					  $("input[name='productList[0].jprice']").val("");
					  $("input[name='productList[0].sprice']").removeClass("layui-btn-disabled");
					  $("input[name='productList[0].jprice']").removeClass("layui-btn-disabled");
				  }
				});
		});
	});

	$(document).ready(function(e) {
		function reSizeParentIframe() {
		    var realHeight = 1;
		    if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Mozilla") > 0 || navigator.userAgent.indexOf("Safari") > 0 || navigator.userAgent.indexOf("Chrome") > 0) { // Mozilla, Safari,Chrome, ...
		        realHeight = window.document.documentElement.offsetHeight + 35;
		    } else if (navigator.userAgent.indexOf("MSIE") > 0) { // IE
		        var bodyScrollHeight = window.document.body.scrollHeight + 21; //取得body的scrollHeight
		        var elementScrollHeight = window.document.documentElement.scrollHeight + 1; //取得documentElement的scrollHeight
		        realHeight = Math.min(bodyScrollHeight, elementScrollHeight); //取当中比较大的一个
		    } else {//其他浏览器
		        realHeight = window.document.body.scrollHeight + window.document.body.clientHeight + 1;
		    }
		    if (realHeight < 400) {
		        realHeight = 400;
		    }
		    if ($("#rightFrame", window.parent.document).is("iframe")) {
		        $("#rightFrame", window.parent.document).height(realHeight);
		    }
		}



		    reSizeParentIframe();

			upload("0");
			upload("1");
			upload("2");
			//初始化时间插件
			$( ".datepicker" ).datetimepicker();
			var cpi = 0;
		    $("#add_jingjiachanpin").click(function(){
		    	cpi++;
		    	$("#jingjiachanpin tr:last").after('<tr><td><input  type="text" name="productList['+cpi+'].title" value="" class="w80"></td><td><input  type="text" name="productList['+cpi+'].amount" value="" class="w80"></td><td><input  type="text" name="productList['+cpi+'].unit" value="" class="w80"></td><td><input  type="text" name="productList['+cpi+'].des" value="" class="w80"></td><td><input  type="text" value="" class="w80" name="productList['+cpi+'].thumb" id="img'+cpi+'" ></input><input type="button" id="pic'+cpi+'" value="上传" onclick="upload('+cpi+')"></input></td><td><input  type="text" name="productList['+cpi+'].sprice" value="" class="w80" onblur="calcMargin('+cpi+')" onkeyup="this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[\'\'])[0]"></td><td><input  type="text" name="productList['+cpi+'].jprice" value="" class="w80"></td><td><input  type="text" name="productList['+cpi+'].margin" value="" class="w80" readonly="readonly"></td><td><input type="button" name="operate" value="删除" ></td></tr>');
		    	upload(cpi);
		    	reSizeParentIframe();
			});
			//资质要求
			$("#join :checkbox").click(function(){
					if($("#join2").is(":checked")){
				   		$("#yes").attr("checked",'checked');
							$("#no").attr("disabled", true);
						if (!($("#ex_only").length > 0)){$("#active-zizhi").prepend('<div class="active-zizhi" id="ex_only"> <span name = "rightrequire">委托授权书</span> </div>');}
						if (($("#ex_only .closezz").length > 0)){$("#ex_only .closezz").remove();}
					}else{
						$("#no").attr("disabled", false);
						if (!($("#ex_only .closezz").length > 0)){$("#ex_only").append('<a  class="closezz" href="javascript:;">×</a> ');}
					}
					reSizeParentIframe();
			});
		    $("#add-active-zizhi").click(function(){
					reSizeParentIframe();
		    });



	});


		function upload(i){
			layui.use('upload', function(){
				  var $ = layui.jquery
				  ,upload = layui.upload;
				  //普通图片上传
				  var uploadInst = upload.render({
				    elem: '#pic'+i
				    ,url: '/pai/fileUpload/uploadFile.do'
				    ,done: function(res){
				    if(res.success){
				    	 var thisid=$(this.elem[0]).attr("id");
				    	 var img=$("#"+thisid).children("img").eq(0);
				    	 var i=$("#"+thisid).children("i").eq(0);
				    	 $(img).show();
				    	 $(img).attr("src",res.obj.picurl/*"https://www.ezaisheng.cn/file/upload/201903/06/18-51-17-31-60299.png"*/);
				    	 $("."+thisid).val(res.obj.picurl);
				    	 $(i).hide();
				    	 $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).addClass(thisid+"_look");
				    	 $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).show()
				    	 $($("#"+thisid).find("p").eq(0)).hide();
				    	 imgLook($("."+thisid+"_look"));
				    	 layer.msg(res.msg,{offset: 't',anim: 6});

				    }else{
				    	 layer.msg(res.msg,{offset: 't',anim: 6});
				    }

				    }
				    ,error: function(){
				      //演示失败状态，并实现重传
				      var demoText = $('#pic'+i);
				      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
				      demoText.find('.demo-reload').on('click', function(){
				        uploadInst.upload();
				      });
				    }
				  });
			});
		};



		function  imgLook(oo){
			$(oo).click(function(){
				var photo={
					  "title": $(oo).text(), //相册标题
					  "id": new Date().getTime(), //相册id
					  "start": 0, //初始显示的图片序号，默认0
					  "data": [   //相册包含的图片，数组格式
					    {
					      "alt": $(oo).text(),
					      "pid": new Date().getTime(), //图片id
					      "src": $($($(oo).siblings(".layui-upload-drag")).children("img")).attr("src"), //原图地址
					      "thumb": $($($(oo).siblings(".layui-upload-drag")).children("img")).attr("src") //缩略图地址
					    }
					  ]
					}

				 layer.photos({
					    photos: photo //格式见API文档手册页
					    ,anim: 1 //0-6的选择，指定弹出图片动画类型，默认随机
					  });

			});
		};
};


//动态加载二级分类
function getSecondCategory(){
	$("#scategory").show();
	var pid = $('#fcategory').val();
    if (pid == 16){
		$("#scategory").hide();
		$('#zizhi_txt').val('');
	}else {

		var reqdata={"parentid":pid};
		pairequest("/pai/auction/getSecondCategory.do",reqdata).then(function(data){
			   var categoryTwo = data.obj;
			   var categoryTwoHtml = "";
			   var certname = "";
			   for(var i = 0 ; i<categoryTwo.length;i++){
				   categoryTwoHtml += '<option value='+categoryTwo[i].certname+'>'+categoryTwo[i].catname+'</option>';
			   }
			   var  html=categoryTwo[0].certname;
			   if(html!=''&&html!=undefined){
				   html=html.split("@");
			   }
			   $("#active-zizhi").empty();
			   $.each(html,function(index,info){
				   $("#active-zizhi").append('<div class="active-zizhi"> <span name = "rightrequire">'+info+'</span> <a  class="closezz" href="javascript:;">×</a></div>');
			   });
			  /* $('#zizhi_txt').val(categoryTwo[0].certname);*/
			   $("#scategory").html(categoryTwoHtml);
			 //分类
			   $(".auctioncataname").val("");
			   $(".auctioncataname").val($("#fcategory").find("option:selected").text()+"@"+$("#scategory").find("option:selected").text());

		});
	}
}

function addCertName(){
		var certname = $('#scategory').val();
		var  html=certname;
	   if(html!=''&&html!=undefined){
		   html=html.split("@");
	   }
	   $("#active-zizhi").empty();
	   $.each(html,function(index,info){
		   $("#active-zizhi").append('<div class="active-zizhi"> <span name = "rightrequire">'+info+'</span> <a  class="closezz" href="javascript:;">×</a></div>');
	   });
	 //分类
	   $(".auctioncataname").val("");
	   $(".auctioncataname").val($("#fcategory").find("option:selected").text()+"@"+$("#scategory").find("option:selected").text());
	/*$("#zizhi_txt").val(certname);*/
}


function readytwo(){
	(function($, window, undefined) {
		 var elems = $([]),
		  jq_resize = $.resize = $.extend($.resize, {}),
		  timeout_id,
		  str_setTimeout = 'setTimeout',
		  str_resize = 'resize',
		  str_data = str_resize + '-special-event',
		  str_delay = 'delay',
		  str_throttle = 'throttleWindow';
		 jq_resize[str_delay] = 250;
		 jq_resize[str_throttle] = true;
		 $.event.special[str_resize] = {
		  setup: function() {
		   if (!jq_resize[str_throttle] && this[str_setTimeout]) {
		    return false;
		   }
		   var elem = $(this);
		   elems = elems.add(elem);
		   $.data(this, str_data, {
		    w: elem.width(),
		    h: elem.height()
		   });
		   if (elems.length === 1) {
		    loopy();
		   }
		  },
		  teardown: function() {
		   if (!jq_resize[str_throttle] && this[str_setTimeout]) {
		    return false;
		   }
		   var elem = $(this);
		   elems = elems.not(elem);
		   elem.removeData(str_data);
		   if (!elems.length) {
		    clearTimeout(timeout_id);
		   }
		  },
		  add: function(handleObj) {
		   if (!jq_resize[str_throttle] && this[str_setTimeout]) {
		    return false;
		   }
		   var old_handler;
		   function new_handler(e, w, h) {
		    var elem = $(this),
		     data = $.data(this, str_data);
		    data.w = w !== undefined ? w : elem.width();
		    data.h = h !== undefined ? h : elem.height();
		    old_handler.apply(this, arguments);
		   }
		   if ($.isFunction(handleObj)) {
		    old_handler = handleObj;
		    return new_handler;
		   } else {
		    old_handler = handleObj.handler;
		    handleObj.handler = new_handler;
		   }
		  }
		 };

		 function loopy() {
		  timeout_id = window[str_setTimeout](function() {
		   elems.each(function() {
		    var elem = $(this),
		     width = elem.width(),
		     height = elem.height(),
		     data = $.data(this, str_data);
		    if (width !== data.w || height !== data.h) {
		     elem.trigger(str_resize, [data.w = width, data.h = height]);
		    }
		   });
		   loopy();
		  }, jq_resize[str_delay]);
		 }
		})(jQuery, this);
		window.onload=function(){
			$(".m-input").resize(function() {
					reSizeParentIframe();
				});
			}

		$("input[name='auction.iskeep']").live("click",function(){
			var tt = $("input[name='auction.iskeep']:checked").val();
			if(tt == 0){
				$("#baoliujia").hide();
			}else {
				$("#baoliujia").show();
			}
		}) ;
};

/**
 * 操作相关
 * @returns
 */
$(document).ready(function(){
	  $("#clear-active-zizhi").click(function(){
			$("#zizhi_txt").val('');
	  });

		$("#active-zizhi").on("click",".closezz",function(){
			$(this).parent().remove();
		});
		$("input[name='operate']").live("click",function(){
			$(this).parent().parent().empty();
		}) ;

		$("input[name='auction.isright']").live("click",function(){
			var isright = $(this).val();
			if(isright == "0"){
				$("#active-zizhi").empty();
				$('.zizhiinput').hide();
				$("#zizhiCategory").hide();
			}else {
				$('.zizhiinput').show();
				$("#zizhiCategory").show();
			}

		}) ;

		$("#greet").live("click",function(){
			if ($('#greet').attr('checked')) {
				$('#release').removeClass("layui-btn-disabled");
				$('#release').addClass("layui-btn-warm");
				$("#release").attr('disabled',false);
			}else{
				$("#release").attr('disabled',true);
				$('#release').addClass("layui-btn-disabled");
				$('#release').removeClass("layui-btn-warm");
			}
		}) ;

		$("input[name='auction.ismargin']").live("click",function(){
			var tt = $("input[name='auction.ismargin']:checked").val();
			if(tt == 0 ){
				$("#bond").hide();
			}else {
				$("#bond").show();
			}
		}) ;


		$("input[name='auction.iskeep']").live("click",function(){
			var tt = $("input[name='auction.iskeep']:checked").val();
			if(tt == 0 ){
				 $("#bljname").val("");
				 $("#bljmail").val("");
				 $("#bljphone").val("");
				$("#baoliujia").hide();
			}else {
				$("#baoliujia").show();
			}
		}) ;
})


//富文本
$(document).ready(function(){
	var aa=$("textarea[name='content']");
	//初始化富文本编辑器
	var editor;
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="content"]', {
			resizeType : 1,

	        allowPreviewEmoticons: false,

	        allowImageUpload:true,//允许上传图片

	        allowFileManager:true, //允许对上传图片进行管理

	        uploadJson:'/pai/fileUpload/uploadFile.do', //上传图片的java代码，只不过放在jsp中

	        afterUpload: function(){this.sync();}, //图片上传后，将上传内容同步到textarea中

	        afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中

	        items : [

	            'fontname','fontsize', '|','forecolor', 'hilitecolor','bold', 'italic','underline',

	            'removeformat','|', 'justifyleft','justifycenter', 'justifyright','insertorderedlist',

	            'insertunorderedlist','|', 'emoticons','link','media','|','image']

	    });
	});

	var editor1;
	KindEditor.ready(function(K) {
		editor1 = K.create('textarea[name="contentnotice"]', {
			resizeType : 1,

	        allowPreviewEmoticons: false,

	        allowImageUpload:true,//允许上传图片

	        allowFileManager:true, //允许对上传图片进行管理

	        uploadJson:'/pai/fileUpload/uploadFile.do', //上传图片的java代码，只不过放在jsp中

	        afterUpload: function(){this.sync();}, //图片上传后，将上传内容同步到textarea中

	        afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中

	        items : [

	            'fontname','fontsize', '|','forecolor', 'hilitecolor','bold', 'italic','underline',

	            'removeformat','|', 'justifyleft','justifycenter', 'justifyright','insertorderedlist',

	            'insertunorderedlist','|', 'emoticons','link','media','|','image']

	    });
	});

	var editor2;
	KindEditor.ready(function(K) {
		editor2 = K.create('textarea[name="contentxuzhi"]', {
			resizeType : 1,

	        allowPreviewEmoticons: false,

	        allowImageUpload:true,//允许上传图片

	        allowFileManager:true, //允许对上传图片进行管理

	        uploadJson:'/pai/fileUpload/uploadFile.do', //上传图片的java代码，只不过放在jsp中

	        afterUpload: function(){this.sync();}, //图片上传后，将上传内容同步到textarea中

	        afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中

	        items : [

	            'fontname','fontsize', '|','forecolor', 'hilitecolor','bold', 'italic','underline',

	            'removeformat','|', 'justifyleft','justifycenter', 'justifyright','insertorderedlist',

	            'insertunorderedlist','|', 'emoticons','link','media','|','image']

	    });
	});

	$(".buon_relfo").on("click",function(){

		//邮箱验证
	    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	    //验证手机号码 验证规则：11位数字，以1开头。
	    var phonereg= /^1\d{10}$/;

		var title = $("#title").val();
		if(title == ""){
			layer.msg("竞拍项目名称不能为空",{offset: 't',anim: 6});
			return ;
		}
		var pname = $("#ptitle").val();
		if(pname == ""){
			layer.msg("产品名称不能为空",{offset: 't',anim: 6});
			return ;
		}

		var pamount = $("#pamount").val();
		if(pamount == ""){
			layer.msg("数量不能空",{offset: 't',anim: 6});
			return ;
		}

		var punit = $("#punit").val();
		if(punit == ""){
			layer.msg("单位不能为空",{offset: 't',anim: 6});
			return ;
		}

		var pdes = $("#pdes").val();
		if(pdes == ""){
			layer.msg("描述不能为空",{offset: 't',anim: 6});
			return ;
		}

		//获取资质证书
		var rightrequireHTML = "";
		$("span[name=rightrequire]").each(function(){
			rightrequireHTML +=$(this).html()+",";
		});

		$('#rightrequire').val(rightrequireHTML);

		var isright = $("input['name=auction.isright']:checked").val();

		if(isright=="1"){
			var txt = $('#rightrequire').val();
			if(txt == ""){
				layer.msg("请正确添加资质要求",{offset: 't',anim: 6});
				return;
			}
		}

		//库存地址选择
		var cmbProvince=$("#cmbProvince").find("option:selected").text();
		var cmbCity=$("#cmbCity").find("option:selected").text();
		var cmbArea=$("#cmbArea").find("option:selected").text();
		var inputaddr=$("#input-addr").val();


		if(cmbProvince == ""){
			layer.msg("请选择库存省级地址",{offset: 't',anim: 6});
			return ;
		}
		if(cmbCity == ""){
			layer.msg("请选择库存市级地址",{offset: 't',anim: 6});
			return ;
		}
		if(cmbArea == ""){
			layer.msg("请选择库存县/区级地址",{offset: 't',anim: 6});
			return ;
		}
		if(inputaddr == ""){
			layer.msg("请输入库存详细地址",{offset: 't',anim: 6});
			return ;
		}
		$(".auctionareaname").val(cmbProvince+"@"+cmbCity+"@"+cmbArea+"@"+inputaddr)

		var contacter = $("#contacter").val();
		if(contacter == ""){
			layer.msg("联系人不能为空",{offset: 't',anim: 6});
			return ;
		}

		var contacttel = $("#contacttel").val();
		if(contacttel == ""){
			layer.msg("联系电话不能空",{offset: 't',anim: 6});
			return;
		}

		var phonereg= /^1\d{10}$/;
		if(!phonereg.test(contacttel)){
			layer.msg("请正确填写电话格式，为11位数字",{offset: 't',anim: 6});
			return ;
		}

		var assetunit = $("#assetunit").val();
		if(assetunit == ""){
			layer.msg("资产处置单位不能空",{offset: 't',anim: 6});
			return ;
		}

		var bond = $("#bond").val();
		var ismargin = $("input[name='auction.ismargin']:checked").val();
		if(ismargin == "1"){
			if(bond == "" ||bond =="0" || bond =="0.0" ||bond =="0.00" ){
				layer.msg("保证金不能为空且大于0",{offset: 't',anim: 6});
				return ;
			}
		}


		var keepmoney = $("#kmi").val();
		var iskeep = $("input[name='auction.iskeep']:checked").val();

		var name = $("#bljname").val();
		var mail = $("#bljmail").val();
		var phone = $("#bljphone").val();
		if(iskeep == "1"){

			if(name == ""){
				layer.msg("姓名不能为空",{offset: 't',anim: 6});
				return ;
			}

			if(!myreg.test(mail) || mail==""){
				layer.msg("请输入有效的邮箱",{offset: 't',anim: 6});
				return ;
			}

			if(!phonereg.test(phone) || phone == ""){
				layer.msg("请输入有效的电话号码",{offset: 't',anim: 6});
				return ;
			}

		}else{
			$("#keepmoney").val('');
		}

		var reqdata=$("#auction").serialize();
		pairequest("/pai/auction/goods/addAuctionGoods.do",reqdata).then(function(data){
			   if(data.success){
	   			var oo=layer.msg('商品信息保存成功是否立即发布', {
				    time: 200000, //20s后自动关闭
				    shadeClose: true,
				    shade: 0.3,
				    btn: ['确认','取消'],
				    yes: function(index, layero){
					    //按钮【按钮一】的回调
				    	pushAuctionView(data);
					    return false ;
					}
				   ,btn2: function(){
					  window.location.href="/auctionmanager/pushauctiongoods.html";
				   }
				  });
		   			}else{
				   layer.msg(data.msg,{offset: 't',anim: 6});
		   		}
		});
	});

});


$(document).ready(function(){
	var pprovice="";
	var pcity="";
	var parea="";
	if(pprovice!=""&& pcity!=""){
		addressInit('cmbProvince', 'cmbCity', 'cmbArea', pprovice, pcity, parea);
	  }else{
	 	addressInit('cmbProvince', 'cmbCity', 'cmbArea', pprovice, pcity, parea);
	  }
});

$(document).ready(function(){
	var reqdata={};
	pairequest("/pai/auction/getbasedata.do",reqdata).then(function(data){
		if(data.success==true){
				if(data.obj && data.obj!=null && data.obj.length>0){
					var obj = data.obj[0];
					var contacter = obj.contacter;
					var contacttel = obj.contacttel;
					var assetunit = obj.assetunit;
					$("#contacter").val(contacter);
					$("#contacttel").val(contacttel);
					$("#assetunit").val(assetunit);
				}
			}

	});
});






