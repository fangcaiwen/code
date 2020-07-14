$(function(){

    $("#header_all").load('/public/public_header.html');
    $("#footer_all").load('/public/public_footer.html');
})

﻿var  loadindex=0;
var  showlond=0;

var  londlayer=0;
var  layercout=0;
var  pairequest=function selfRequest(requrl,data){
	 return new Promise(function(resolve,reject){
		 if(londlayer==0){
			 layercout = layer.load(3, {
				  shade: [0.2,'#fff'], //0.1透明度的白色背景
				  time:30000
				});
			 $(".layui-layer-loading3").empty();
			 $(".layui-layer-loading3").append('<div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>')
			 londlayer=1;
		 }
		 loadindex++;
		 $.ajax({
		        type : 'get',
		        url : requrl,
		        dataType : "json",
		        data:data,
		        success : function(data) {
		            console.log(requrl, data);
		        	showlond++;
		        	if(loadindex==showlond){
		        		setTimeout(function(){
							if(loadindex==showlond){
								londlayer=0;
								layer.close(layercout);
							}
						}, 300);

		        	}
		        	livefind();//直播事件
		        	return resolve(data);
		        },
		        error:function(e){
		        	showlond++;
		        	if(loadindex==showlond){
		        		setTimeout(function(){
							if(loadindex==showlond){
								londlayer=0;
				        		layer.close(layercout);
							}
						}, 300);
		        	}
		        	resolve("")
		        	layer.msg("请求失败",{offset: 't',anim: 6});
		        }
			});
	 })

}


/*var reqdata={};
pairequest("",reqdata).then(function(data){

});*/


var  painoloadrequest=function selfRequestNoLoad(requrl,data){
	 return new Promise(function(resolve,reject){
		 $.ajax({
		        type : 'get',
		        url : requrl,
		        dataType : "json",
		        data:data,
		        success : function(data) {
		        	return resolve(data);
		        },
		        error:function(e){
		        	resolve("")
		        	layer.msg("请求失败",{offset: 't',anim: 6});
		        }
			});
	 })

}


$(document).ready(function(){
//	fastlogin();
	catchdata();
});
//快速登录入口
function  fastlogin(){
	$(".fastlogin").click(function(){
		layer.open({
			   anim: 2,
			   type: 2,
			   title: false,
			   shade: 0.2,
			  /* offset: 'b',*/
			   scrollbar :true,
			   area: ['500px', '400px'],
			   skin: 'layui-layer-nobg', //没有背景色
			   shadeClose: true,
			   closeBtn :0,
			   content: ['/user/fastlogin.html?time='+new Date().getTime(), 'no']

		    });
	})
};

/**
 * 行为轨迹
 * @returns
 */
function catchdata(){
	var t=document.title;
	var reqdata={"savecode":t,"outcode":getreqcode()};
	painoloadrequest("/elocus/push/Locus.do",reqdata).then(function(data){});
	console.log("当前浏览"+t)
};

function getreqcode(){
	　　var reg = new RegExp("(^|&)"+ "reqcode" +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null)return unescape(r[2]);
	   return null;
	}

// 获取url参数
function getUrlParams (url,key){
    let urlParmStr = url.slice(url.indexOf('?')+1);
    let arr = urlParmStr.split('&');
    for(let i=0;i<arr.length;i++){
        let mKey = arr[i].split("=")[0];
        let mValue = arr[i].split("=")[1];
        if(key == mKey){
            return mValue;
        }
    }
}

/**
 * 直播列表
 * @returns
 */
var livearray=new Array();
function livefind(){
	setTimeout(function() {
		var temparray =new Array();
		$.each($(".item"),function(index,info){
			if(undefined==$(info).attr("id")||""==$(info).attr("id")){
				return ;
			}
			if(livearray.indexOf($(info).attr("id"))==-1){
				temparray.push("'"+$(info).attr("id")+"'");
				livearray.push("'"+$(info).attr("id")+"'")
			}

		})

		if(temparray.length>0){
		var reqdata={"findids":temparray.join(",")};
		painoloadrequest("/bbs/live/findliveapi.do",reqdata).then(function(data){
			if(data.success==true){
				if(data.obj.clist.length>0){
					$.each(data.obj.clist,function(index,info){
						$('.'+info.paramid+"p>.opennew>.product").append('<span title="'+info.picurl+'" class="'+info.paramid+'live live layui-anim-upbit" mouseover="">直播中<i class="layui-icon">&#xe63b;</i></span>');

						$(".product-intro>.info>.title").append('<span title="'+info.picurl+'" class="'+info.paramid+'live live layui-anim-upbit" mouseover="">直播中<i class="layui-icon">&#xe63b;</i></span>');

						$(".product-intro>.pic>.spec-scroll>.items>.thumbspic").append('<li><img bimg="'+info.picurl+'" src="'+info.picurl+'" onmousemove="preview(this);"></li>');

					    $("."+info.paramid+"live").mouseover(function(){
					    	layer.tips('<div style="width:200px;"><img style="width:180px;overflow: hidden;" src="'+info.picurl+'">', '.'+info.paramid+'live', {
					    		  tips: [1, '#01AAED'],
					    		  time: 10000
					    		});
					    });
					})
				}

			}
		});
		var reqdata={"findids":temparray.join(","),"isopen":0};
		painoloadrequest("/bbs/live/findliveapi.do",reqdata).then(function(data){
			if(data.success==true){
				if(data.obj.clist.length>0){
					$.each(data.obj.clist,function(index,info){
						$('.'+info.paramid+"p>.opennew>.product").append('<span title="'+info.picurl+'" class="'+info.paramid+'willlive willlive layui-anim-upbit" mouseover="">即将直播<i class="layui-icon">&#xe63b;</i></span>');

//						$('.'+info.paramid+"p>.opennew>.product>.img").empty();
//						$('.'+info.paramid+"p>.opennew>.product>.img").append('<img src="'+info.picurl+'" alt="" srcset="">');

						$(".product-intro>.info>.title").append('<span title="'+info.picurl+'" class="'+info.paramid+'live willlive layui-anim-upbit" mouseover="">即将直播<i class="layui-icon">&#xe63b;</i></span>');

						$(".product-intro>.pic>.spec-scroll>.items>.thumbspic").append('<li><img bimg="'+info.picurl+'" src="'+info.picurl+'" onmousemove="preview(this);"></li>');

					    $("."+info.paramid+"willlive").mouseover(function(){
					    	layer.tips('<div style="width:240px;"><img style="width:185px;overflow: hidden;" src="'+info.picurl+'">', '.'+info.paramid+'willlive', {
					    		  tips: [1, '#5fb878'],
					    		  time: 10000
					    		});
					    });
					})
				}

			}
		});
		}
	}, 200);
};



