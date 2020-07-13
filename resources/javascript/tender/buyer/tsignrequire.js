var  uploadrequire=function(){
	var tid = getParam();
	 var reqdata={"tid":tid};
	pairequest("/pai/tender/sign/certs.do",reqdata).then(function(data){
		   if(data.success){
			   var tender=data.obj.tender;
			   var  aList=data.obj.aList;
			   $("input[name='sname']").val(data.obj.sname==undefined?data.obj.company:data.obj.sname);
			   $("input[name='tenderid']").val(tender.tid);
			   $("input[name='sid']").val(data.obj.sid);
			   $(".listzhizhi").empty();
			   if(data.obj.tender.isqualication==1){
				   var requires=tender.qualification.split(",");
				   if(data.value==0){
					   $.each(aList,function(index,info){
						   addimg(info.certname,info.link,index,0,info.certStatus) ;
					   });
					   $(".submitrequire").attr("name",0);
				   }else{
					   $(".submitrequire").attr("name",1);
					   $.each(requires,function(index,info){
						   if(info==""||info==null){
							   return false;
						   }
						   
						   var  istrue=false;
						   $.each(aList,function(i,inf){
							   if(info==inf.certname){
								   addimg(inf.certname,inf.url,index,inf.auditid,inf.status) ;
								   istrue=true; 
								   return false;
								   
							   }
						   });
						   if(!istrue){
							   addimg(info.certname,"",index,"") ;
						   }
					   });
				   }
			   }else{
				   layer.msg("不需要添加资质", {time: 5000, icon:6,offset: 't',anim: 6});
				   setTimeout(function() {
					window.location.reload();
				}, 1000);
			   };
			   $('.memberCenter').show();
			   
			   var h = $('.memberCenter').offsetHeight;
			   var w = $('.memberCenter').offsetWidth;
			   layer.open({
				   anim: 2,
				   type: 1,
				   title: false,
				   shade: 0.1,
				   offset: 'b',
				   scrollbar :true,
				   area: ['70%', h],
				   skin: 'layui-layer-nobg', //没有背景色
				   shadeClose: false,
				   content: $('.memberCenter'),
				   cancel: function(){
					  window.location.reload();
					  }
				 });
			   //提交资质
			   $(".submitrequire").click(function(){
				   submitrequire();
			   })
			  
		   }else {
		   layer.msg(data.msg, {offset: 't',anim: 6,time: 5000, icon:6});
		   }
	   
	});
}

/**
 * 拼接资质图片
 * @param name
 * @param url
 * @returns
 */
function addimg(name,url,index,auditid,certStatus){
	var html='';
	var certStatusval="未提交";
	var htmlcert="";
	switch (certStatus) {
	case 0:
		 certStatusval="待审核(无需上传)";
		 htmlcert+='<p class="cert-init">'+certStatusval+'</p>';
		 htmlcert+='<p>点击上传，或将文件拖拽到此处</p>';
		break;
	case 1:
		 certStatusval="审核通过";
		 htmlcert+='<p class="cert-pass">'+certStatusval+'</p>';
		break;
	case 2:
		certStatusval="审核未通过";
		htmlcert+='<p class="cert-nopass">'+certStatusval+'</p>';
		htmlcert+='<p>点击上传，或将文件拖拽到此处</p>';
			break;
	case 4:
		certStatusval="作废";
		htmlcert+='<p class="cert-time">'+certStatusval+'</p>';
		htmlcert+='<p>点击上传，或将文件拖拽到此处</p>';
			break;
	default:
		break;
	}
	
	
	if(url!=null&&url!=''){
			html+='<div class="yzs-m-renzheng-imgup-box">';
			html+='<div class="layui-upload-drag" id="test'+index+'">';
			html+=htmlcert;
			html+='<img id="'+auditid+'" name="'+name+'" src="'+url+'" class="layui-upload-img"  style="display: inherit; height: 55px;" >';
			html+='</div>';
			html+='<div class="yzs-m-renzheng-imgup-tit  '+index+'_look" style="text-align: center;">查看'+name+'</div>';
			html+='</div>';
			$(".listzhizhi").append(html);
			setTimeout(function() {
				imgLook($("."+index+"_look"));
			}, 1000);
	}else{
			html+='<div class="yzs-m-renzheng-imgup-box">';
			html+='<div class="layui-upload-drag" id="test'+index+'">';
			html+='<i class="layui-icon"></i>';
			html+='<p>点击上传，或将文件拖拽到此处</p>';
			html+='<img id="'+auditid+'" name="'+name+'" class="layui-upload-img" name="qiyedaimazheng" >';
			html+='</div>';
			html+='<div class="yzs-m-renzheng-imgup-tit" style="text-align: center;">'+name+'</div>';
			html+='</div>';
			$(".listzhizhi").append(html);
	}
	addUploadAction(index);
	
}

function getParam(){
	　　var reg = new RegExp("(^|&)"+ "param" +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null)return unescape(r[2]);
	   return null;
	}



function addUploadAction(count){
    layui.use('upload', function(){
        var $ = layui.jquery,
            upload = layui.upload;

        //普通图片上传
        var uploadInst = upload.render({
            elem: '#test'+count
            ,url: '/pai/fileUpload/uploadFile.do'
            ,done: function(res){
                if(res.success){
                    var thisid=$(this.elem[0]).attr("id");
                    var img=$("#"+thisid).children("img").eq(0);
                    var i=$("#"+thisid).children("i").eq(0);
                    $(img).show();
                    $(img).attr("src",res.obj.picurl);
                    $(img).css("height","55px");
                    $(i).hide();
                    $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).addClass(thisid+"_look");
                    var text = $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text();
                    if(text.indexOf("查看 ")==-1)
                        $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text("查看 "+$($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text());

                    imgLook($("."+thisid+"_look"));
                    layer.msg(res.msg, {time: 5000, icon:6,offset: 't',anim: 6});
                    
                }else{
                    layer.msg(res.msg, {time: 5000, icon:6,offset: 't',anim: 6});
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
            ,anim: 1 //0-6的选择，指定弹出图片动画类型，默认随机
        });

    });
};

/**
 * 提交资质
 * @returns
 */
function submitrequire(){
	var company=$("input[name='sname']").val();
	var tenderid=$("input[name='tenderid']").val();
	
	var imgurls=new Array();
	var auditids=new Array();
	
	var size=0;
	$.each($(".layui-upload-img"),function(index,info){
		  var name=$(info).attr("name");
		  var id=$(info).attr("id");
		  var url=$(info).attr("src");
		  if(url==''||url==undefined){
			  url="";
			  size++;
		  }
		  imgurls.push(url);
		  auditids.push(id);
	  });
	
	if(company==""){
		layer.msg("公司名称不能为空", {time: 5000, icon:5,offset: 't',anim: 6});
		return false;
	}
	
	
	if(imgurls.length==size){
		layer.msg("最少上传一张图片", {time: 5000, icon:5});
		return false;
	}
	
	//首次添加资质
	var info={};
	var url="/pai/tender/sign/getAudit.do";
	info["imgUrlStr"]=imgurls.join(",");
	info["tenderid"]=tenderid;
	info["sid"]=$("input[name='sid']").val();
	info["sname"]=company;
	if($(".submitrequire").attr("name")==1){
		info["auditidStr"]=auditids.join(",");
	}else{
		info["auditidStr"]="-1";
	}
	var reqdata=info;
	pairequest(url,reqdata).then(function(data){
		   if(data.success==true){
			   layer.msg(data.msg, {time: 5000, icon:5});
			    setTimeout(function() {
					window.location.reload();
				}, 1000);
		   }else{
			   layer.msg(data.msg, {time: 5000, icon:5});
		   }
	});
	
};