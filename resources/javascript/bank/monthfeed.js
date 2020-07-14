$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	$(".memberCenterNav").load('/public/iframeleft.html');
	var ltype=getParam();
	 if("t"==ltype){
	 	 $(".memberCenterNav").load('/public/tiframeleft.html');
	 }else{
	 	 $(".memberCenterNav").load('/public/iframeleft.html'); 
	 }
	checkLogin();
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
			initpager();
		}else{
			window.location.href="/user/login.html";
		}
		
		$(".header_newe").html(header);
	
	});
};

function getfeedList(pageNum){
	var reqdata={"pageno":pageNum,"pageSize":10};
	pairequest("/pai/feeCenter/feedlist.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				if(data.obj && data.obj.list && data.obj.list.length>0){
					$.each(data.obj.list,function(index,info){
						html+='<tr class="feeout'+info.payno+'" style="width: 920px;height: 60px;line-height: 40px;text-align: center; margin-top: 1%;color: #333333; background-color: #fff;">';
						html+='<td >'+info.payno+'</td>';
						html+='<td style="cursor: pointer;" >'+((undefined!=info.company)?(info.company.substring(0,6)):"--")+'...</td>';
						html+='<td >'+timestampToTime(info.refundtime)+'</td>';
						html+='<td >'+info.needfee+'元</td>';
						html+='<td >'+info.msg+'</td>';
						html+='<td >'+(info.status==1?"已支付":"未支付")+'</td>';
						html+='<td >';
						html+='<a href="javascript:void(0);" title="'+info.payno+'" class="feedetail" id="'+info.payno+'">明细<i class="layui-icon">&#xe625;</i><a/>';
						html+='</td>';
						html+='</tr>';
						html+='<tr class="feedetail'+info.payno+'" style="background-color: #fff;display:none;width:800px;height:40px;line-height:40px;text-align:center;border:1px solid #eee;margin-top: 1%;"></tr>';
					})
				}else{
					html+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
				}
				$(".orders").html(html);
				feedetail();
			}else{
				html+="<div class='feed_list_more'  style='width: 800px;' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";

			}	
			
	});
 }



/**
 * 分页初始化
 * @returns
 */
function initpager(){
	var reqdata={"pageno":0,"pageSize":10};
	pairequest("/pai/feeCenter/feedlist.do",reqdata).then(function(data){
		if(data.obj.total != undefined){
			$(".total").text(data.obj.total);
			layui.use(['laypage', 'layer'],function(){
			  var laypage = layui.laypage,layer = layui.layer;
			  laypage.render({
				  elem: 'demo3',
				  count: data.obj.total,
				  limit:6,
				  layout: ['count', 'prev', 'page', 'next', 'skip'],
				  jump: function(obj){
					  getfeedList(obj.curr);
				  }
			  });
			});
		}
	
	});
}

//明细
function feedetail(){
	$(".feedetail").click(function(){
		var  thisclass=$(".feedetail"+$(this).attr("id")).attr("class");
		if(thisclass.indexOf("show")>0){
			$(".feedetail"+$(this).attr("id")).hide();
			$(".feedetail"+$(this).attr("id")).removeClass("show");
			$(".feeout"+$(this).attr("id")).css("border-color", "#eee");
			$(".feeout"+$(this).attr("id")).css("color", "#000");
			$(".feeout"+$(this).attr("id")).css("background-color", "#fff");
			return;
		}
		
		
		var reqdata={"payorderNo":$(this).attr("title")};
		pairequest("/pai/feeCenter/feeddetail.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				if(data.obj  && data.obj.length>0){
					html='<td><div style="    overflow: auto;height: 300px;"><table>';
					html+='<thead  style="width:920px;height:40px;line-height:40px;text-align:center;border:1px solid #eee;margin-top: 1%;">';
					html+='<th style="width:200px;background-color: #006ad3;color: #fff;">订单号</td>';
					html+='<th style="width:200px;background-color: #006ad3;color: #fff;">对账单号</td>';
					html+='<th style="width:200px;background-color: #006ad3;color: #fff;">对账单金额</td>';
					html+='<th style="width:200px;background-color: #006ad3;color: #fff;">手续费金额</td>';
					html+='<th style="width:200px;background-color: #006ad3;color: #fff;">付款时间</td>';
					html+='<th style="width:200px;background-color: #006ad3;color: #fff;">支付状态</td>';
					html+='</thead>';
					html+='<tbody class="">';
					$.each(data.obj,function(index,info){
						html+='<tr style="cursor: pointer;width:920px;height:40px;line-height:40px;text-align:center;border:1px solid #eee;margin-top: 1%;">';
						html+='<td  onclick="ordershow(&apos;'+info.outOrderNo+'&apos;)">'+info.outOrderNo+'<span style="color:red;">(明细)</span></td>';
						html+='<td onclick="viewCheckorder(&apos;'+info.outOrderNo+'&apos;,&apos;'+info.checkid+'&apos;)" >'+info.checkOrderNo+'<span style="color:red;">(明细)</span></td>';
						html+='<td >'+info.price+'元</td>';
						html+='<td >'+info.fee+'元</td>';
						html+='<td >'+timestampToTime(info.paytime)+'</td>';
						html+='<td >'+(info.status!=1?"未支付":"已支付");
						html+='</td>';
						html+='</tr>';
					})
					
					html+="</tbody>";
					html+='</table></div></td>';
				}
				if(html==""){
					 layer.msg("无更多明细", {offset: 't',anim: 6});
					 return false;
				}
				$(".feeout"+$(this).attr("id")).css("border-color", "#006ad3");
				$(".feeout"+$(this).attr("id")).css("color", "#000");
				$(".feeout"+$(this).attr("id")).css("background-color", "#006ad3");
				$("."+thisclass).html(html);
				layer.open({
					   anim: 2,
					   type: 1,
					   title: false,
					   shade: 0.1,
					   /*offset: 'b',*/
					   scrollbar :true,
					   area: [$("."+thisclass).width,  "325px"],
					   skin: '#000', //没有背景色
					   shadeClose: false,
					   content: html,
					   cancel: function(){
						  }
					 });
			}
	});
		
	})
}


function query(pageNum,jq){
	getOrderList(pageNum);
}

function ordershow(orderno){
	layer.open({
		   anim: 2,
		   type: 2,
		   title: false,
		   shade: 0.1,
		   scrollbar :true,
		   area: ["80%", "80%"],
		   skin: '#000', //没有背景色
		   shadeClose: false,
		   content: "/bank/sellerordershow.html?param="+orderno,
		   cancel: function(){
			  }
		 });
}

//查看对账单
function viewCheckorder(orderNo,id){
    layer.open({
      type: 2,
      title: '查看对账单',
      shadeClose: false,
      shade: 0.5,
      maxmin: false, //开启最大化最小化按钮
      area: ['80%', '90%'],
      content: ['/orderform/checkorder/seller_checkorder_view.html?v='+new Date().getTime(), 'yes'],
      success:function(layero, index){
    	var body = layer.getChildFrame('body', index);  
        var iframeWin = window[layero.find('iframe')[0]['name']];
        body.find('#orderNo').val(orderNo);
        body.find('#checkorder_id').val(id);
		iframeWin.getFormatDateStr();
		iframeWin.getFullData();
		iframeWin.caculatemoney();
	  }
    });
}


//时间戳转为格式化日期
function timestampToTime(timestamp) {
	if(timestamp != null && timestamp != undefined && timestamp != ""){
		if(timestamp.length == 10){
			timestame = timestamp * 1000;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		}
		var date = new Date(timestamp);
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
		var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
		var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
		var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
		return Y+M+D+h+m+s;
	}
	return "";
}



var colorArr=["background:#f7941e;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#006ad3;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#49b7ec;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#fe8686;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#f6b37f;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#c14440;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#00caef;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#67b687;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#7ce0a1;color:#fff;border-radius: 60px 0px 0px 60px;",
	  "background:#bd89d2;color:#fff;border-radius: 60px 0px 0px 60px;"];
	  
function changeColor(){
var randomNum= 0;
$('td[name=winCG]').each(function(){
	if(randomNum==9){
		randomNum=0;
	}
var winid = $(this).attr("data-value");
var  bcolor=$(this).attr("id");

if(bcolor==undefined||bcolor==null){
	if(winid!=null){
		$("."+winid).attr("style",colorArr[randomNum]);
		$("."+winid).attr("id",randomNum);
	}
	randomNum++;
}

});
}
