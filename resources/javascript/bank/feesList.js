//月结中心
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
			initmonth();
		}else{
			window.location.href="/user/login.html";
		}
		
		$(".header_newe").html(header);
	
	});
};

/**
 * 分页初始化
 * @returns
 */
function initmonth(){
	var reqdata={"status":1};
	var html='月份筛选:';
	pairequest("/pai/feeCenter/month.do",reqdata).then(function(data){
		if(data.success==false){	
			return false;
		}
		var c="month";
		$.each(data.obj,function(index,info){
			html+='<span  class="'+c+'" style="cursor: pointer;margin-left: 2%;font-size: 14px;" class="total">'+info.month+'</span>';
			if(c=="month"){
				c="nomonth";
			}
		})
		$(".months").empty();
		$(".months").append(html);
		monthclick();
	});
};


var uparray=new Array();

function getfeedList(pageNum){
	uparray=new Array();
	uparray.push(pageNum);
	var serachNo = $("#orderNo_productName").val();
	var startTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var month = $(".month").html();
	
	var reqdata={"serachNo":serachNo,"month":month,"startTime":startTime,"endTime":endTime,"pageNow":pageNum,"pageSize":10};
	pairequest("/pai/auction/fee/getFeeList.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				if(data.obj && data.obj.list && data.obj.list.length>0){
					$.each(data.obj.list,function(index,info){
						html+='<tr style="width:920px;height:40px;line-height:40px;text-align:center;border:1px solid #eee;margin-top: 1%;">';
						var torderno=(isMonthpay(info.msg)==""?info.payOrderNo:info.msg);
						html+='<td  class="headtl '+torderno+'"   name="winCG"  data-value="'+torderno+'" >'+torderno+'</td>';
						html+='<td  class="headtl" style="cursor: pointer;color: red;" onclick="ordershow(&apos;'+info.outOrderNo+'&apos;,&apos;'+info.checkid+'&apos;)">'+info.outOrderNo+'</td>';
						html+='<td  class="headtl" style="cursor: pointer;color: red;" onclick="viewCheckorder(&apos;'+info.outOrderNo+'&apos;,&apos;'+info.checkid+'&apos;)">'+info.checkOrderNo+'</td>';
						html+='<td  class="headts" >'+info.price+'元</td>';
						html+='<td  class="headts" >'+(info.status==0?'未支付':(isMonthpay1(info.msg)+'支付'))+'</td>';
						html+='<td  class="headts" >'+info.fee+'元</td>';
						html+='<td  class="headtl" >'+((undefined==info.paytime)?'--':timestampToTime(info.paytime))+'</td>';
						html+='</tr>';
					})
				}else{
					html+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
				}
				$(".orders").html(html);
				//颜色
				changeColor();
			}else{
				html+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
				$(".orders").html(html);
			}	
	});
 }

function isMonthpay(orderno){
	if(undefined==orderno||null==orderno){
		return "";
	}
	if(orderno.indexOf("PSXM")>=0){
		return ("合并:"+orderno);
	}
}

function isMonthpay1(orderno){
	if(undefined==orderno||null==orderno){
		return "单笔";
	}
	if(orderno.indexOf("PSXM")>=0){
		return ("月结");
	}
}


//搜索订单
function searchOrder(){
	initpager()
};

//月份单击
function monthclick(){
	$(".nomonth").click(function(){
		$(".month").addClass("nomonth");
		$(".month").removeClass("month");
		$(this).removeClass("nomonth");
		$(this).addClass("month");
		initpager();
	});
	
	$(".month").click(function(){
		$(".month").removeClass("month");
		$(this).addClass("month");
		initpager();
	})
};

/**
 * 分页初始化
 * @returns
 */
function initpager(){
	uparray=new Array();
	uparray.push(0);
	var serachNo = $("#orderNo_productName").val();
	var startTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var month = $(".month").html();
	
	var reqdata={"serachNo":serachNo,"month":month,"startTime":startTime,"endTime":endTime,"pageNow":0,"pageSize":10};
	pairequest("/pai/auction/fee/getFeeList.do",reqdata).then(function(data){
		if(data.obj.count != undefined){
			$(".total").text(data.obj.count);
			layui.use(['laypage', 'layer'],function(){
			  var laypage = layui.laypage,layer = layui.layer;
			  laypage.render({
				  elem: 'demo3',
				  count: data.obj.count,
				  limit:10,
				  layout: ['count', 'prev', 'page', 'next', 'skip'],
				  jump: function(obj){
					  getfeedList(obj.curr-1);
				  }
			  });
			});
		}
		$(".monthsfeed").empty();
		$(".monthsfeed").append('--月已缴金额--元')
		setTimeout(function() {
			getFees();
		}, 2000);
	});
}

//手续费计算
function getFees(){
	var month = $(".month").html();
	if(undefined==month){
		return false;
	}
	$(".month").val(month);
	var reqdata={"month":month,"status":1};
	painoloadrequest("/pai/feeCenter/sumfee.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				$(".monthsfeed").empty();
				$(".monthsfeed").append(month+"月已缴金额"+data.obj.fees+"元")
				if(data.obj.fees>0){
					$(".monthsfeedb").show();
				}else{
					$(".monthsfeedb").hide();
				}
				
			}
		})
}


function query(pageNum,jq){
	getOrderList(pageNum);
}

function orderinfo(orderno){
	window.location.href="/orderform/sellerordershow.html?param="+orderno;
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

function ordershow(orderno){
	var tourl="/bank/sellerordershow.html?param=";
	 if(orderno.indexOf("TEN")>=0){
		 tourl="/bank/tbuyerordershow.html?param=";
	 }
	layer.open({
		   anim: 2,
		   type: 2,
		   title: false,
		   shade: 0.1,
		   scrollbar :true,
		   area: ["95%", "75%"],
		   skin: '#000', //没有背景色
		   shadeClose: false,
		   content: tourl+orderno,
		   cancel: function(){
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

//导出 
function exportfeedList(){
	uparray=new Array();
	var serachNo = $("#orderNo_productName").val();
	var startTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	$(".serachNo").val(serachNo);
	$(".startTime").val(startTime);
	$(".endTime").val(endTime);
	$(".exportExcel").submit();
	
 }









function printfeedList(pageNum){
	uparray=new Array();
	uparray.push(pageNum);
	var serachNo = $("#orderNo_productName").val();
	var startTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	
	var reqdata={"serachNo":serachNo,"startTime":startTime,"endTime":endTime,"pageNow":pageNum,"pageSize":1000};
	pairequest("/pai/auction/fee/getFeeList.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				if(data.obj && data.obj.list && data.obj.list.length>0){
					$(".total1").text(data.obj.list.length);
					$(".total2").text("搜索订单号:"+(serachNo==""?"--":serachNo)+"开始日期:"+(startTime==""?"--":startTime)+"结束日期:"+(endTime==""?"--":endTime));
					$.each(data.obj.list,function(index,info){
						html+='<tr style="width:920px;height:40px;line-height:40px;text-align:center;border:1px solid #eee;margin-top: 1%;">';
						var torderno=(isMonthpay(info.msg)==""?info.payOrderNo:info.msg);
						html+='<td  class="headtl '+torderno+'"   name="winCG"  data-value="'+torderno+'" >'+torderno+'</td>';
						html+='<td  class="headtl" style="cursor: pointer;color: red;" onclick="ordershow(&apos;'+info.outOrderNo+'&apos;,&apos;'+info.checkid+'&apos;)">'+info.outOrderNo+'</td>';
						html+='<td  class="headtl" style="cursor: pointer;color: red;" onclick="viewCheckorder(&apos;'+info.outOrderNo+'&apos;,&apos;'+info.checkid+'&apos;)">'+info.checkOrderNo+'</td>';
						html+='<td  class="headts" >'+info.price+'元</td>';
						html+='<td  class="headts" >'+(info.status==0?'未支付':(isMonthpay1(info.msg)+'支付'))+'</td>';
						html+='<td  class="headts" >'+info.fee+'元</td>';
						html+='<td  class="headtl" >'+((undefined==info.paytime)?'--':timestampToTime(info.paytime))+'</td>';
						html+='</tr>';
					})
				}else{
				}
				$(".orders1").html(html);
				$(".print").show().jqprint({importCSS:true});
				$(".print").hide();
			}else{
			}	
	});
 }




var colorArr=["background:#f7941e;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#18b0a3;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#49b7ec;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#fe8686;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#f6b37f;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#c14440;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#00caef;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#67b687;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#7ce0a1;color:#000;border-radius: 60px 0px 0px 60px;",
		  "background:#bd89d2;color:#000;border-radius: 60px 0px 0px 60px;"];
		  
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