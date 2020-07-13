$(document).ready(function(){

	layui.use('upload', function(){
		  var $ = layui.jquery
		  ,upload = layui.upload;
		  
		  for (var i = 1; i <= 6; i++) {
			  //普通图片上传
			  var uploadInst = upload.render({
			    elem: '#test'+i
			    ,url: '/pai/fileUpload/uploadFile.do'
			    ,done: function(res){
			    if(res.success){
			    	 var thisid=$(this.elem[0]).attr("id");
			    	 var img=$("#"+thisid).children("img").eq(0);
			    	 var i=$("#"+thisid).children("i").eq(0);
			    	 $(img).show();
			    	 $(img).attr("src",res.obj.picurl/*"http://www.ezaisheng.cn/file/upload/201812/12/14-21-21-22-663.jpg"*/);
			    	 $(i).hide();
			    	 $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).addClass(thisid+"_look");
			    	 $($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text("查看"+$($("#"+thisid).siblings(".yzs-m-renzheng-imgup-tit").eq(0)).text())
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
		 
		  
	});
	
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

});