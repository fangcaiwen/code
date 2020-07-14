$(document).ready(function(){
	canvas2load();
});

var colorArr1=["#f7941e;",
	  "#006ad3;",
	  "#49b7ec;",
	  "#fe8686;",
	  "#f6b37f;",
	  "#c14440;",
	  "#00caef;",
	  "#67b687;",
	  "#7ce0a1;",
	  "#bd89d2;"];
function  canvas2load(){
		$(".sharepic").click(function(){
			var auctionids=new Array();
			$.each($("input[name='c']"),function(index,info){
				if($(info).attr("checked")=="checked"){
					auctionids.push($(info).attr("id"));
				}
			});
			if(auctionids.join(",").length==0){
				layer.msg("请选择推广商品");
				return;
			};
//			if(auctionids.join(",").length>5){
//				layer.msg("最多选择5个商品,请");
//				return;
//			};
			$(".container1").empty();
			var html='<style>.container *{margin:0;padding:0;font-family:"PingFang SC","Microsoft YaHei","微软雅黑",Arial,sans-serif}.container{width:1242px;margin:0 auto;position:relative;height:1800px}.bg{width:1242px;background:url(/resources/img/share/bg.png) '+colorArr1[Math.ceil(Math.random()*10)]+' no-repeat center top;position:absolute;top:0}.container .title{position:absolute;top:295px;left:340px;color:#fff;font-size:40px}.container .info{position:absolute;top:460px;left:210px;font-size:30px;color:#333}.container .info li{list-style:none;height:80px;line-height:80px}.container .code{position:absolute;top:460px;right:162px}.container .table{position:absolute;top:735px;left:160px;color:#333;font-size:25px;text-align:center;width:920px}.container .contentdata{position:relative;margin-top:795px;padding-top:1px;left:0;color:#333;font-size:25px;text-align:center;width:100%;background:url(/resources/img/share/whitebg.png) left top}.container .bottom{background:url(/resources/img/share/radius.png) left top no-repeat;height:63px;margin-bottom:60px}.container .contentdata table{width:920px;margin:0 auto}.container table{border:0;border-collapse:collapse;border:1px solid #ddd}.container th{color:#fff;font-weight:bold}.container th,.container td{height:60px;line-height:60px}.container .image{margin:0 160px}.container .image img{width:100%;border-radius:30px}</style>';
			 html+='<div class="container" >';
			 html+='<div class="bg" id="test">';
			 html+='<h1 class="title trcompany"></h1>';
			 html+='<div class="info">';
			 html+='<ul>';
			 html+='<li class="trstarttime"></li>';
			 html+='<li class="traddress"></li>';
			 html+='<li class="trcontacttel"></li>';
			 html+='</ul>';
			 html+='</div>';
			 html+='<div class="code">';
			 html+='<img class="tdsharepic" src="/resources/img/share/code.jpg">';
			 html+='</div>';
			 html+='<div class="table">';
			 html+='<table border="" cellspacing="" cellpadding="" width="100%">';
			 html+='<tbody><tr>';
			 html+='<th width="30%">产品名称</th>';
			 html+='<th width="20%">品质</th>';
			 html+='<th width="20%">重量（吨）</th>';
			 html+='<th width="30%">合同截止日</th>';
			 html+='</tr>';
			 html+='</tbody></table>';
			 html+='</div>';
			 html+='<div class="contentdata">';
			 html+='<table border="" cellspacing="" cellpadding="" width="100%">';
			 html+='<tbody class="trappend">';
			 html+='</tbody></table>';
			 html+='<div class="image">';
			 html+='<img class="trpic" src="">';
			 html+='</div>';
			 html+='</div>';
			 html+='<div class="bottom">';
			 html+='</div>';
			 html+='</div>';
			 html+='</div>';
			 $(".container1").append(html);

			$.each(auctionids,function(index,acutid){
				var reqdata={
						"acutid":acutid
						};
				pairequest("/pai/auction/auctionDetail.do",reqdata).then(function(data){
				    	if(data.success==true){
				    		var htmltd='<tr>';
				    			htmltd+='<td width="30%">'+data.obj.goodsname+'</td>';
				    			htmltd+='<td width="20%">'+(data.obj.goodsdes==""?"--":data.obj.goodsdes.substr(0,10))+'...</td>';
				    			htmltd+='<td width="20%">'+data.obj.amount+''+data.obj.unit+'</td>';
				    			htmltd+='<td width="30%">'+(data.obj.pactstarttime==undefined?"":data.obj.pactstarttime.substr(0,10))+'-'+(data.obj.pactendtime==undefined?"":data.obj.pactendtime.substr(6,10))+'</td>';
		    					htmltd+='</tr>';
		    				   $(".trappend").append(htmltd);

				    	       if(index==auctionids.length-1){
				    	    	   processpic(data,auctionids);
				    	       };
						    	//一个商品展示图片
						    	if(auctionids.length==1&&index==0){
						    		 $(".trpic").attr("src",data.obj.thumb);
						    	}

				    	}else{
				    		layer.msg(data.msg);
				    		return false;
				    	}
				    });
			})

		});
	};

function  processpic(data,auctionids){
	   $(".trcompany").html(data.obj.company);
	   $(".traddress").html("地       址 :"+((data.obj.areaname==undefined||data.obj.areaname==null)?"暂无":data.obj.areaname.split("@")[0]+(data.obj.areaname.split("@").length>=2?("-"+data.obj.areaname.split("@")[1]):"")));
	   $(".trcontacttel").html("联系电话 : "+data.obj.contacttel);
	   $(".trstarttime").html('起止时间 :  '+data.obj.auctionStarttime.substr(0,10)+''+(data.obj.auctionStarttime.substr(10,10))+'-'+(data.obj.auctionEndtime.substr(10,10)));
	      var shareurl="/auction/sign.html?param="+data.obj.id;
		  if(auctionids.length>1){
			 shareurl="/jjks.html?c="+getsParam(data.obj.company);
		  }
		    var reqdata={"shareurl":shareurl};
			pairequest("/pai/fileUpload/pushCode.do",reqdata).then(function(data){
			    	if(data.success==true){
			    		  $(".tdsharepic").attr("src",data.obj.picurl)
			    	     layer.load(1, {shade: [1,'#000'] ,time: 1000});
			    		  $(".container1").show();
							setTimeout(function(){
								canvas2pic();
							}, 500);
						setTimeout(function(){
							  $(".container1").hide();
						}, 800);
			    	}else{
			    		layer.msg(data.msg);
			    		return false;
			    	}
			    });


}

function getsParam(type){
	　　var reg = new RegExp("(^|&)"+ type +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null){
		var base64 = new Base64();
		return base64.decode(unescape(r[2]));
	　　}else{
		 return "";
	　　}
	}

	/**
	 * 推广图
	 * @returns
	 */
	function canvas2pic(){
		 var canvas2 = document.createElement("canvas");
		    let
		        _canvas = document.querySelector('#test');

		    var w = parseInt(window.getComputedStyle(_canvas).width);
		    var h = parseInt(window.getComputedStyle(_canvas).height);
		    //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
		    canvas2.width = w;
		    canvas2.height = h;
		    //可以按照自己的需求，对context的参数修改,translate指的是偏移量
		    var context = canvas2.getContext("2d");
		    context.translate(-0,-0);
		    context.scale(1, 1);
		    html2canvas(document.querySelector('#test'), { canvas: canvas2 }).then(function(canvas) {

		    	var imgData = context.getImageData(0, 0, canvas.width, canvas.height).data

		    	var lOffset = canvas.width, rOffset = 0,tOffset = canvas.height, bOffset = 0

		    	for (var i = 0; i < canvas.width; i++) {
		    	    for (var j = 0; j < canvas.height; j++) {
		    	        var pos = (i + canvas.width * j) * 4
		    	        if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
		    	            // 说第j行第i列的像素不是透明的
		    	            // 楼主貌似底图是有背景色的,所以具体判断RGBA的值可以根据是否等于背景色的值来判断
		    	            bOffset = Math.max(j, bOffset) // 找到有色彩的最底部的纵坐标
		    	            rOffset = Math.max(i, rOffset) // 找到有色彩的最右端

		    	            tOffset = Math.min(j, tOffset) // 找到有色彩的最上端
		    	            lOffset = Math.min(i, lOffset) // 找到有色彩的最左端
		    	        }
		    	    }
		    	}
		    	lOffset++
		    	rOffset++
		    	tOffset++
		    	bOffset++
		    	console.log(lOffset, rOffset, tOffset, bOffset);
		    	var  data=new Array();
		        var html={};
	    		html["alt"]="";
	    		html["pid"]=new Date().getTime();
	    		html["src"]=canvas.toDataURL();
	    		html["thumb"]=canvas.toDataURL();
	    		data.push(html);
		    	/*var photo={
		            "title": "", //相册标题
		            "id": new Date().getTime(), //相册id
		            "start": 0, //初始显示的图片序号，默认0
		            "data": data
		        }

		        layer.photos({
		            photos: photo //格式见API文档手册页
		            ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
		        });*/
		    	cutcanvas(lOffset,rOffset,tOffset,bOffset,h,w);

		    });
	};
	function  cutcanvas(lOffset,rOffset,tOffset,bOffset,h,w){
		 var canvas2 = document.createElement("canvas");
		    let
		        _canvas = document.querySelector('#test');

		    //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
		    canvas2.width = w;
		    canvas2.height = h;

		    //可以按照自己的需求，对context的参数修改,translate指的是偏移量
		    var context = canvas2.getContext("2d");
		    context.translate(-lOffset,-tOffset);
		    context.scale(1, 1);
		    html2canvas(document.querySelector('#test'), { canvas: canvas2 }).then(function(canvas) {

		    	var imgData = context.getImageData(0, 0, canvas.width, canvas.height).data

		    	var lOffset = canvas.width, rOffset = 0,tOffset = canvas.height, bOffset = 0

		    	for (var i = 0; i < canvas.width; i++) {
		    	    for (var j = 0; j < canvas.height; j++) {
		    	        var pos = (i + canvas.width * j) * 4
		    	        if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
		    	            // 说第j行第i列的像素不是透明的
		    	            // 楼主貌似底图是有背景色的,所以具体判断RGBA的值可以根据是否等于背景色的值来判断
		    	            bOffset = Math.max(j, bOffset) // 找到有色彩的最底部的纵坐标
		    	            rOffset = Math.max(i, rOffset) // 找到有色彩的最右端

		    	            tOffset = Math.min(j, tOffset) // 找到有色彩的最上端
		    	            lOffset = Math.min(i, lOffset) // 找到有色彩的最左端
		    	        }
		    	    }
		    	}
		    	lOffset++
		    	rOffset++
		    	tOffset++
		    	bOffset++
		        var  data=new Array();
		        var html={};
	    		html["alt"]="";
	    		html["pid"]=new Date().getTime();
	    		html["src"]=canvas.toDataURL();
	    		html["thumb"]=canvas.toDataURL();
	    		data.push(html);
		    	var photo={
		            "title": "", //相册标题
		            "id": new Date().getTime(), //相册id
		            "start": 0, //初始显示的图片序号，默认0
		            "data": data
		        }

		        layer.photos({
		            photos: photo //格式见API文档手册页
		            ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
		        });

		    });
	}
