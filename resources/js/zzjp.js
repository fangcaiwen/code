var index1
$(document).ready(function(){
	getSerachCataData();
	$("#footer_all").load('public/public_footer.html');
});


function getSerachCataData(){

	var reqdata={};
	pairequest("/pai/serach/catedata.do",reqdata).then(function(data){

		if(data.success==true){
			var html='';
			$.each(data.obj,function(index,info){
				html+='<dl>';
				html+='<dt >'+info.catename+'：</dt>';
				if(info.list.length<8){
					html+='<dd>';
				}else{
					html+='<dd style="width: 1100px;">';

				}

				$.each(info.list,function(index1,info1){
					html+='<span class="my'+info.mainid+'">'+info1.cname+'</span>';
				});
				html+='</dd>';
				html+='</dl>';
			});
			$(".filter").empty();
			$(".filter").append(html);
			serach();
			recommend();
			initpager();
		}else{

		}
	});
}


function  serach(){
	$(".my1").click(function(){
		var text=$(this).text();
		var thisclass=$(this).attr("class");
		if(text=="全部"){
			if(thisclass.indexOf("allcheck")!=-1){
				$(".my1").removeClass("allcheck");
			}else{
				$(".my1").addClass("allcheck");
			}

		}else{
			if(thisclass.indexOf("allcheck")==-1){
				$(this).siblings().removeClass("allcheck");
			}
			$(this).toggleClass("allcheck");
		}
		initpager(0);
	});

	$(".my2").click(function(){
		var text=$(this).text();
		var thisclass=$(this).attr("class");
		if(text=="全部"){
			if(thisclass.indexOf("allcheck")!=-1){
				$(".my2").removeClass("allcheck");
			}else{
				$(".my2").addClass("allcheck");
			}

		}else{
			if(thisclass.indexOf("allcheck")==-1){
				$(this).siblings().removeClass("allcheck");
			}
			$(this).toggleClass("allcheck");
		}
		initpager(0);
	});

	$(".my3").click(function(){
		var text=$(this).text();
		var thisclass=$(this).attr("class");
		if(text=="全部"){
			if(thisclass.indexOf("allcheck")!=-1){
				$(".my3").removeClass("allcheck");
			}else{
				$(".my3").addClass("allcheck");
			}

		}else{
			if(thisclass.indexOf("allcheck")==-1){
				$(this).siblings().removeClass("allcheck");
			}
			$(this).toggleClass("allcheck");
		}
		initpager(0);
	});

	$(".my4").click(function(){
		var text=$(this).text();
		var thisclass=$(this).attr("class");
		if(text=="全部"){
			if(thisclass.indexOf("allcheck")!=-1){
				$(".my4").removeClass("allcheck");
			}else{
				$(".my4").addClass("allcheck");
			}

		}else{
			if(thisclass.indexOf("allcheck")==-1){
				$(this).siblings().removeClass("allcheck");
			}
			$(this).toggleClass("allcheck");
		}
		initpager(0);
	});
}

//pprice  stime    snum
$(document).ready(function(){
	$(".pprice").click(function(){
		$(".pprice").addClass("curr");
		$(".stime").removeClass("curr");
		$(".stime").attr("id",-1);
		$(".snum").removeClass("curr");
		$(".snum").attr("id",-1);
		if($(this).attr("id")==1){
			$(this).attr("id",0);
			$(this).find("em").removeClass("fs-up");
			$(this).find("em").addClass("fs-down");
		}else{
			$(this).attr("id",1);
			$(this).find("em").removeClass("fs-down");
			$(this).find("em").addClass("fs-up");
		}
		initpager(0);
	});

	$(".stime").click(function(){
		$(".stime").addClass("curr");
		$(".pprice").removeClass("curr");
		$(".pprice").attr("id",-1);
		$(".snum").removeClass("curr");
		$(".snum").attr("id",-1);
		if($(this).attr("id")==1){
			$(this).attr("id",0);
			$(this).find("em").removeClass("fs-up");
			$(this).find("em").addClass("fs-down");
		}else{
			$(this).attr("id",1);
			$(this).find("em").removeClass("fs-down");
			$(this).find("em").addClass("fs-up");
		}
		initpager(0);
	});

	$(".snum").click(function(){
		$(".snum").addClass("curr");
		$(".pprice").removeClass("curr");
		$(".pprice").attr("id",-1);
		$(".stime").removeClass("curr");
		$(".stime").attr("id",-1)
		if($(this).attr("id")==1){
			$(this).attr("id",0);
			$(this).find("em").removeClass("fs-up");
			$(this).find("em").addClass("fs-down");
		}else{
			$(this).attr("id",1);
			$(this).find("em").removeClass("fs-down");
			$(this).find("em").addClass("fs-up");
		}
		initpager(0);
	});
});

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


/**
 * 列表
 * @param pageNum
 * @returns
 */
function getauctionLists(pageNum){
	var pageSize=9;
	var company=getsParam("c");
	var key=getsParam("t");
	var cates=new Array();
	var areas=new Array();
	var sprices=new Array();
	var sernum=new Array();
	var pprice=$(".pprice").attr("id");
	var stime=$(".stime").attr("id");
	var snum=$(".snum").attr("id");

	$.each($(".my1"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
			cates.push("'"+$(info).text()+"'");
		}
	});

	$.each($(".my2"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
		sprices.push($(info).text());
		}
	});
	$.each($(".my3"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
		sernum.push($(info).text());
		}

	});

	$.each($(".my4"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
		areas.push("'"+$(info).text()+"'");
		}
	});
	pprice=$(".pprice").attr("id");
	stime=$(".stime").attr("id");
	snum=$(".snum").attr("id");


	//加载竞价列表

	var reqdata={
			 "pageNo":pageNum+1,
			 "pageSize":pageSize,
			 "status":3,
			 "company":company,
			 "title":key,
			 "catainfo":cates.join(","),
			 "areainfo":areas.join(","),
			 "sprice":sprices.join(","),
			 "sernum":sernum.join(","),
			 "pprice":pprice,
			 "stime":stime,
			 "snum":snum
			};
	pairequest("/pai/auction/searchAuction.do",reqdata).then(function(data){

		$(".subDoing").empty();
		var result ='';
		if(data.total==0 || data.total == "0"){
			result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
		}else{
            if(data.content != null){
                result ='';
                var  auctionids=new Array();
                $.each(data.content, function(index, value) {
                    auctionids.push("'"+value.id+"'");
                    var areaname="";
                    if(value.areaname==undefined){areaname="暂无信息"}else{areaname=value.areaname.split("@")[1]}
                    if(value.sprice<="0.001"){value.sprice="**"}
                    result += '<div class="item '+value.id+'p" id="'+value.id+'">';
                    result+='<a href="/auction/sign.html?param='+value.id+'"  class="opennew" target="_blank" >';
                    result += '<div class="product">';
                    result += '<span class="ti '+value.id+'ti">竞拍中</span>';
            	    result += '<div class="img"><img src="'+value.disagreeinfo+'" alt="" srcset=""></div>';
                    if(checkSign(value.endtime)){
                        result += '<div class="datetime '+value.id+'datetime"><i></i><span class="tim '+value.id+'">距竞拍结束还剩：<em>0</em>天<em>0</em>时<em>0</em>分<em>0</em>秒 </span></div>';
                    }
                    result += '<div class="wrap">';
                    result += '<div class="nameAddress">';
                    result += '<div class="name">'+value.title.substring(0,10)+'...</div>';
                    result += '<div class="address"><i class="el-icon-location"></i>'+ areaname +'</div>';
                    result += '</div>';
                    result += '<div class="price  '+value.id+'price">当前价：<span>'+value.nprice+'</span>元</div>';
                    result += '<div class="info">';
                    result += '<div class="basePrice">起拍价：'+value.sprice+'元/'+value.unit+'</div>';
                    result += '<div class="num">数量：'+value.amount+value.unit+'</div>';
                    result += '</div>';
                    result += '</div>';
                    result += '</div>';
                    result += '</a>';
                    result += '</div>';
                });
                result += '</div>' ;
            }
            $(".auctionids").val(auctionids.join(","));
        }
		$(".subDoing").append(result);
		setInterval(ink,1000);
	});

}

//检查报名时间是否小于当前时间
function checkSign(ot){
	var nowDate = new Date().getTime();
	var myDate = new Date(ot.replace(/-/g,"/").substring(0,19));
	if(ot != 'undefined'){
		if(nowDate < myDate ){
			return true;
		}
	}
}
/**
 * 分页初始化
 * @returns
 */
function initpager(pageNo){
	var pageSize=9;
	var company=getsParam("c");
	var key=getsParam("t");
	var cates=new Array();
	var areas=new Array();
	var sprices=new Array();
	var sernum=new Array();
	var pprice=$(".pprice").attr("id");
	var stime=$(".stime").attr("id");
	var snum=$(".snum").attr("id");

	$.each($(".my1"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
			cates.push("'"+$(info).text()+"'");
		}
	});

	$.each($(".my2"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
		sprices.push($(info).text());
		}
	});
	$.each($(".my3"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
		sernum.push($(info).text());
		}
	});

	$.each($(".my4"),function(index,info){
		if($(info).attr("class").indexOf("allcheck")>0){
		areas.push("'"+$(info).text()+"'");
		}
	});
	pprice=$(".pprice").attr("id");
	stime=$(".stime").attr("id");
	snum=$(".snum").attr("id");


	var reqdata={
			 "pageNo":pageNo,
			 "pageSize":pageSize,
			 "status":3,
			 "company":company,
			 "title":key,
			 "catainfo":cates.join(","),
			 "areainfo":areas.join(","),
			 "sprice":sprices.join(","),
			 "sernum":sernum.join(","),
			 "pprice":pprice,
			 "stime":stime,
			 "snum":snum
			};
	pairequest("/pai/auction/searchAuction.do",reqdata).then(function(data){

		$(".subDoing").empty();
		var result ='';
		if(data.total==0 || data.total == "0"){
			layui.use(['laypage', 'layer'], function(){
				  var laypage = layui.laypage
				  ,layer = layui.layer;
						laypage.render({
						    elem: 'demo3'
					    	,limit: 9
						    ,count: data.total
						    ,layout: ['count', 'prev', 'page', 'next', 'skip']
						    ,jump: function(obj){
						    	getauctionLists(obj.curr-1);
						    }
						  });
			 });
		}else{
			if(data.content != null){
				layui.use(['laypage', 'layer'], function(){
					  var laypage = layui.laypage
					  ,layer = layui.layer;
							laypage.render({
							    elem: 'demo3'
							    ,limit: 9
							    ,count: data.total
							    ,layout: ['count', 'prev', 'page', 'next', 'skip']
							    ,jump: function(obj){
							    	getauctionLists(obj.curr-1);
							    }
							  });
				 });

			}
		}

	});

	//加载竞价列表
}


//ajax轮询
function ink(){
	var  auctionids=$(".auctionids").val();
	if(auctionids==""){
		return ;
	}
$.ajax({
	   type: "get",
	   url: "/pai/auction/getCurrentMoneyList.do",
	   data: {"auctionids":$(".auctionids").val()},
	   dataType:"json",
	   success: function(data){
		   if(data.success==true){
			   var  alist=data.obj.alist;
			   var  time=data.obj.systime;
			   $.each(alist,function(index,info){
				  var endtime=info.endtimeemp;
				  if(endtime>time){
					  var date3=endtime-time; //时间差的毫秒数
					  //计算出相差天数
					  var days=Math.floor(date3/(24*3600*1000))
					  //计算出小时数
					  var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
					  var hours=Math.floor(leave1/(3600*1000))
					  //计算相差分钟数
					  var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
					  var minutes=Math.floor(leave2/(60*1000))
					  //计算相差秒数
					  var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
					  var seconds=Math.round(leave3/1000)

					  if(info.sprice<="0.001"){info.sprice="**"}
		              if(info.nprice<="0.001"){info.nprice="**"}

					  $("."+info.id+"price").html("");
					  $("."+info.id+"price").html('当前价：<span>'+info.nprice+'</span>元');
					  $("."+info.id+"datetime").empty();
					  $("."+info.id+"datetime").append('<i></i> <span class="tim '+info.id+'">距竞拍结束还剩：<em>'+days+'</em>天<em>'+hours+'</em>时<em>'+minutes+'</em>分<em>'+seconds+'</em>秒</span>');
					  $("."+info.id+"img").hide();
				  }else{
					  if(info.sprice<="0.001"){info.sprice="**"}
		              if(info.nprice<="0.001"){info.nprice="**"}

					  $("."+info.id+"price").html("");
					  $("."+info.id+"price").html('当前价：<span>'+info.nprice+'</span>元');
					  $("."+info.id+"datetime").remove();
					  $("."+info.id+"ti").html("已结束");
					  $("."+info.id+"ti").css("background","#333333");
//					  $("."+info.id+"datetime").append('<span class="ti">已结束</span>');
//					  $("."+info.id+"img").show();
				  }
			   });
		   }else{

		   }
	   }
	});
}






//加载特别推荐
function  recommend(){
	var reqdata={};
	pairequest("/pai/auction/recommend.do",reqdata).then(function(data){
		$(".eitems").empty();
		 var obj = data.obj;
		 var html="";

		 for(var i = 0; i<obj.length ;i++){
			 var nprice = "**";
			 if(obj[i].nprice > 0){
				 nprice = obj[i].nprice;
			 }

			html+='<div class="eitem">'
				+'<div class="eimg">'
				+'<img src="'+obj[i].disagreeinfo+'" alt="">'
				+'</div>'
				+'<div class="ename">'+obj[i].title+'</div>'
				+'<div class="eprice">当前价：<em>￥'+nprice+'元</em> </div>'
				+'<a href="/auction/sign.html?param='+obj[i].id+'"  class="opennew" target="_blank" ><div class="evinfo">查看详情&gt;</div></a>'
				+'</div>';


		 }
		 $(".eitems").html(html);
	});
}


