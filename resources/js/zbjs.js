var index1
$(document).ready(function(){
	getSerachCataData();
});


function getSerachCataData(){
	var reqdata={};
	pairequest("/pai/serach/catedata.do",reqdata).then(function(data){
		if(data.success==true){
			var html='';
			$.each(data.obj,function(index,info){
				if(index==1||index==2){
					return;
				}
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
			$("#footer_all").load('public/public_footer.html');
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
	}
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

	var reqdata={
			 "pageNo":pageNum+1,
			 "pageSize":pageSize,
			 "status":4,
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
	pairequest("/pai/tender/tolist.do",reqdata).then(function(data){

		$(".subEnded").empty();
		var result ='';
		if(data.total==0 || data.total == "0"){
			result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
		}else{
            if(data.content != null){
                //result =' <div class="content">';
                var  auctionids=new Array();
                $.each(data.content, function(index, value) {
                	auctionids.push("'"+value.tid+"'");
                    var address="";
                    if(value.address==undefined){address="暂无信息"}else{address=value.address}
                    result += '<div  class="item '+value.tid+'p" id="'+value.tid+'">';
                    result+='<a href="/tender/buyer/tsign.html?param='+value.tid+'"  class="opennew" target="_blank" >';
                    result += '<div class="product">';
                    result += '<span class="ti">已结束</span>';
                    if(value.goodsname.split(",").length>1){
                   	 result += '<span class="tig">集采</span>';
                   }
                    result += '<div class="img"><img src="'+value.url+'" alt="" srcset=""></div>';
                    result += '<div class="wrap">';
                    result += '<div class="nameAddress">';
                    result += '<div class="name">'+value.tname.substring(0,13)+'...</div>';
                    result += '<div class="address"><i class="el-icon-location"></i>'+ address +'</div>';
                    result += '</div>';
                    result += '<div class="info">';
                    result += '<div class="num">保证金：'+value.margin+'元</div>';
                    if(value.goodsname.split(",").length==1){
                    	result += '<div class="num">数量：'+value.amount+value.unit+'</div>';
                    }
                    result += '</div>';
                    result += '<div class="num">资产采购公司：'+value.company+'</div>';
                    result += '<div class="start_end">竞拍结束时间：'+value.opentendertime.substring(0,19)+'</div>';
                    result += '</div>';
                    result += '</div>';
//                    result +='<img  disabled="disabled" src="/resources/img/home/end.png" alt="" srcset="" class="endicon  '+value.id+'img">';
                    result += '</a>';
                    result += '</div>';
                });
            }
        }
		$(".subEnded").append(result);
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
			 "status":4,
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
	pairequest("/pai/tender/tolist.do",reqdata).then(function(data){
		$(".subSoon").empty();
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

}




//加载特别推荐
function  recommend(){

	var reqdata={};
	pairequest("/pai/tender/recommend.do",reqdata).then(function(data){
		var reqdata={};
		pairequest("/pai/tender/recommend.do",reqdata).then(function(data){
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
					+'<img src="'+obj[i].url+'" alt="">'
					+'</div>'
					+'<div class="ename">'+obj[i].tname+'</div>'
					+'<div class="eprice">当前价：<em>￥'+nprice+'元</em> </div>'
					+'<a href="/tender/buyer/tsign.html?param='+obj[i].tid+'"  class="opennew" target="_blank" ><div class="evinfo">查看详情&gt;</div></a>'
					+'</div>';
			 }
			 $(".eitems").html(html);
		});
});

}


