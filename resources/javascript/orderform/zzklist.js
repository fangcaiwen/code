$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	 checkLogin();
	 var ltype=getParam();
	 if("t"==ltype){
	 	 $(".memberCenterNav").load('/public/tiframeleft.html');
	 }else{
	 	 $(".memberCenterNav").load('/public/iframeleft.html'); 
	 }
	lookmore();
    
	var reqdata={};
    pairequest("/pai/qualification/getCategory.do",reqdata).then(function(data){
        if(data.errorcode=="101000"){
            initPage(data.obj);
            //添加上传事件
            addUploadAction(data.obj);
        }else {
            layer.alert("查询失败",{offset: 't',anim: 6});
        }
    });
    
    //初始化-获取登录人员资质列表
    /**
     * 初始化页面
     */
    function initPage(objs) {
    	for(var m=0;m<objs.length;m++){
    		var obj = objs[m];
    		var datas = obj.childList;
    		for(var item in datas){
    			var html = "";
    			var certStatusval="未提交";
    			var htmlcert="";
    			var useStatus= datas[item].certStatus;
    			if(""==datas[item].certurl){
    				useStatus=0;
    			}
    			switch (useStatus) {
    			case "1":
    				 certStatusval="新上传/待审核";
    				 htmlcert+='<p class="cert-init">'+certStatusval+'</p>';
    				 htmlcert+='<p>点击上传，或将文件拖拽到此处</p>';
    				break;
    			case "2":
    				 certStatusval="审核通过";
    				 htmlcert+='<p class="cert-pass">'+certStatusval+'</p>';
    				break;
    			case "3":
    				certStatusval="审核未通过";
    				htmlcert+='<p class="cert-nopass">'+certStatusval+'</p>';
    				htmlcert+='<p>点击上传，或将文件拖拽到此处</p>';
    					break;
    			case "4":
    				certStatusval="作废";
    				htmlcert+='<p class="cert-time">'+certStatusval+'</p>';
    				htmlcert+='<p>点击上传，或将文件拖拽到此处</p>';
    					break;
    			default:
    				certStatusval="待上传";
					 htmlcert+='<p class="">'+certStatusval+'</p>';
					 htmlcert+='<p>点击上传，或将文件拖拽到此处</p>';
    				break;
    			}
    			
    			html = html + "<div id='demo"+datas[item].id+"' class='yzs-m-renzheng-imgup-box'>";
    			html = html + "<div class='layui-upload-drag' id='test"+datas[item].id+"'>";
    			
    			if(datas[item].certurl != null && datas[item].certurl!=''){
    				html = html + "<i class='layui-icon' style='display: none;'></i>";
    			}else{
    				html = html + "<i class='layui-icon'></i>";
    			}
    				html+=htmlcert;
    			if(datas[item].certurl != null && datas[item].certurl!='')
    				html = html + "<img class='layui-upload-img' src='"+datas[item].certurl+"' style='display: inline-block;' ></div>";
    			else
    				html = html + "<img class='layui-upload-img' ></div>";
    			
    			html = html + "<input class='layui-upload-file' type='file' accept='undefined' name='file'>";
    			
    			if(datas[item].certurl != null && datas[item].certurl!=''){
//    				if(4==datas[item].certStatus){
//    					html+='<div class="" style="text-align:center;color: red;/* width: 100px; *//* height: 100px; */">已失效</div>';
//    				}else if(3==datas[item].certStatus){
//    					html+='<div class="" style="text-align:center;color: red;/* width: 100px; *//* height: 100px; */">审核未通过</div>';
//    				}else if(1==datas[item].certStatus){
//    					html+='<div class="" style="text-align:center;color: red;/* width: 100px; *//* height: 100px; */">待审核</div>';
//    				}
    				html = html + "<div class='name test"+datas[item].id+"_look' style='text-align:center;' >查看 "+datas[item].certname+"</div></div>";
    			}else
    				html = html + "<div class='name' style='text-align:center;' >"+datas[item].certname+"</div></div>";
    			
    			if(datas[item].qulificationType=='公司基本信息'){
    				$("#basicInfo").append(html);
    			}else if(datas[item].qulificationType=='餐厨废油'){
    				
    				$("#feiyou").append(html);
    			}else if(datas[item].qulificationType=='废有色'){
    				$("#feiyouse").append(html);
    			}else if(datas[item].qulificationType=='废塑料'){
    				$("#feisuliao").append(html);
    			}else if(datas[item].qulificationType=='废钢'){
    				$("#feigang").append(html);
    			}else if(datas[item].qulificationType=='废铁'){
    				$("#feitie").append(html);
    			}else if(datas[item].qulificationType=='玻璃'){
    				$("#feiboli").append(html);
    			}else if(datas[item].qulificationType=='其他'){
    				$("#feiother").append(html);
    			}
    			/*yzs-m-renzheng-imgup-tit*/
    				imgLook($(".test"+datas[item].id+"_look"));
//    			j++;
//    			j=datas[item].id;
    		}
    	}
    	signcate();
    }

    function addUploadAction(objs){
        layui.use('upload', function(){
            var $ = layui.jquery,
                upload = layui.upload;
//            for (var i = 1; i <= (count+1); i++) {
            	for (var i=0;i<objs.length;i++) {
            		var obj = objs[i];
            		var datas = obj.childList;
            		for(var item in datas){
            			//普通图片上传
            			var uploadInst = upload.render({
            				elem: '#test'+datas[item].id
            				,url: '/pai/fileUpload/uploadFile.do'
            					,done: function(res){
            						if(res.success){
            							var thisid=$(this.elem[0]).attr("id");
            							var img=$("#"+thisid).children("img").eq(0);
            							var i=$("#"+thisid).children("i").eq(0);
            							$(img).show();
            							$(img).attr("src",res.obj.picurl);
            							//上传图片
            							uploadPic(thisid,res.obj.picurl);
            							
            							$(i).hide();
            							$($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).addClass(thisid+"_look");
            							var text = $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text();
            							if(text.indexOf("查看 ")==-1)
            								$($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text("查看 "+$($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text());
            							
            							imgLook($("."+thisid+"_look"));
            							layer.msg(res.msg,{offset: 't',anim: 6});
            						}else{
            							layer.msg(res.msg,{offset: 't',anim: 6});
            						}
            					}
            			,error: function(){
            				//演示失败状态，并实现重传
            				var demoText = $('#demoText');
            				demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            				demoText.find('.demo-reload').on('click', function(){
            					uploadInst.upload();
            				});
            			}
            			});
            		}
            }
        });
    }

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
                ,anim: 3 //0-6的选择，指定弹出图片动画类型，默认随机
            });

        });
    };

    function uploadPic(picType,picUrl) {
    	
    	var reqdata={"picUrl":picUrl,"picType":picType};
    	pairequest("/pai/qualification/saveCertlibrary.do",reqdata).then(function(data){
            if(data.errorcode=="101000"){
                layer.msg(data.msg,{offset: 't',anim: 6});
            }else {
                layer.msg(data.msg,{offset: 't',anim: 6});
            }
            var reqdata={};
            pairequest("/pai/qualification/getCategory.do",reqdata).then(function(data){
                if(data.errorcode=="101000"){
                	$("#basicInfo").empty();
    				$("#feiyou").empty();
    				$("#feiyouse").empty();
    				$("#feisuliao").empty();
    				$("#feigang").empty();
    				$("#feitie").empty();
    				$("#feiboli").empty();
    				$("#feiother").empty();
                    initPage(data.obj);
                    addUploadAction(data.obj);
                }else {
                    layer.alert("查询失败",{offset: 't',anim: 6});
                }
            });
    	});
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
	var reqdata={};
	pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){				
			
		}else{
			window.location.href="/user/login.html";
		}
		
		$(".header_newe").html(header);
	
	});
};

function getsParam(type){
	　　var reg = new RegExp("(^|&)"+ type +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null){
		var base64 = new Base64();
		return base64.decode(unescape(r[2]));
	　　}else{
		 return "";
	　　}
	};
	
	
function pushsParam	(istr){
	var str="";
	var base64 = new Base64();
	str = base64.encode(istr);
	return str;
}

function  signcate(){
	var reqdata={};
	$(".zzklist>.head").css("display","none");
	$(".zzklist>.list").css("display","none");
	$("#basicInfo").show();
    pairequest("/pai/qualification/signCateName.do",reqdata).then(function(data){
    	if(data.success==true){
    		if(undefined==data.obj.signc){
    			return ;
    		}
    		var sc=getsParam("ca");
    		var catas=data.obj.signc;
    		$.each($(".head"),function(index,info){
    			var tx=$(info).html();
    			var aa=catas.indexOf(tx);
    			if(catas.indexOf(tx)!=-1||(sc.indexOf(tx)!=-1)){
    				$(".zzkv").append("&nbsp;"+tx+"&nbsp;");
    				$(info).show();
    				$("."+$(info).attr("title")+"list").show();
    			}
    		});
    		$(".gsjbxx").show();
    		$(".gsjbxxlist").show();
    	}
    });
    
    
    $.each($(".yzs-m-renzheng-imgup-box>.layui-upload-drag>.layui-upload-img"),function(index,info){
    	if(undefined==$(info).attr("src")){
    		$($(info).parent(".layui-upload-drag")).css("border","1px dashed #FF5722");
    	}
    })
}




/**
 * 查看更多
 * @returns
 */
function lookmore(){
	$(".lookmore").click(function(){
		$.each($(".head"),function(index,info){
			$(info).show();
			$("."+$(info).attr("title")+"list").show();
		});
	})
}















