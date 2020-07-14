$(document).ready(function(){
	monthfeecheckLogin();
});

function getParam(){
	　var reg = new RegExp("(^|&)"+ "ltype" +"=([^&]*)(&|$)");
	　var r = window.location.search.substr(1).match(reg);
	　if(r!=null)return unescape(r[2]);
	  return null;
	}

//检查登录状态
function monthfeecheckLogin(){
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

var uparray=new Array();
var feedmoney=0;

function getfeedList(pageNum){
	var serachNo = $("#orderNo_productName").val();
	var month = $(".month").html();
	
	var reqdata={"serachNo":serachNo,"month":month,"pageno":pageNum,"pageSize":10};
	pairequest("/pai/feeCenter/page.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				if(data.obj && data.obj.list && data.obj.list.length>0){
					$.each(data.obj.list,function(index,info){
						html+='<tr class="feeout'+info.checkOrderNo+'" style="width: 920px;height: 60px;line-height: 40px;text-align: center; margin-top: 1%;color: #333333; background-color: #fff;">';
						html+='<td >'+info.payOrderNo+'</td>';
						html+='<td style="cursor: pointer;color:red;" onclick="viewCheckorder(&apos;'+info.outOrderNo+'&apos;,&apos;'+info.checkid+'&apos;)" >'+info.checkOrderNo+'</td>';
						html+='<td >'+info.price+'</td>';
						html+='<td >'+timestampToTime(info.addtime)+'</td>';
						html+='<td >'+info.fee+'元</td>';
						html+='<td >'+(info.status==1?"已支付":"未支付")+'</td>';
						html+='<td >';
						if(info.status==0){
						html+='<a href="javascript:void(0);"  onclick="topayfeeo(&apos;'+info.payOrderNo+'&apos;,&apos;'+info.fee+'&apos;)" class="">去支付</a>';
						}else{
							html+='<a href="javascript:void(0);">--</a>';
						}
						html+='</td>';
						html+='</tr>';
					})
				}else{
					html+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
				}
				$(".orders").html(html);
			}else{
				html+="<div class='feed_list_more'  style='width: 800px;' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";

			}	
			
	});
 }

//搜索订单
function searchOrder(){
	initpager()
}


/**
 * 全部选中
 * @returns
 */
function  allpushcheck(){
	$("input[name='allcheck']").click(function(){
		if($("input[name='allcheck']").is(":checked")){
			$("input[name='c']").prop("checked",true);
		}else{
			$("input[name='c']").prop("checked",false);
		}
		checkboxclick();
	});
}

//绑定复选框事件
function checkboxclick(){
	pushOrderNo();
}

//加入队列
function pushOrderNo(){
	$.each($("input[name='c']"),function(index,info){
		if($(info).is(":checked")){
			addOrderNoKey($(info).attr("id"));
		}else{
			delOrderNoKey($(info).attr("id"));
		}
	})
	var month = $(".month").html();
	$(".monthslength").empty();
	$(".monthslength").append(month+"月选择"+uparray.length+"个")
	getFees();
}
//选中回显
function pushOrderNoRollback(){
	$.each(uparray,function(index,info){
		$("#"+info).prop("checked",true);
	})
}
//添加key
function addOrderNoKey(key){
	if(""==key){
		return ;
	}
	var  temparray=uparray;
	var status=1;
	$.each(temparray,function(index,info){
		if(info==key){
			status=0;
			return false;
		}
	})
	if(status==1){
		feedmoney=feedmoney+Number($("#"+key).attr("title"));
		uparray.push(key);
	}
	
}
//删除key
function delOrderNoKey(key){
	if(""==key){
		return ;
	}
	var  temparray=uparray;
	uparray=new Array();
	$.each(temparray,function(index,info){
		if(key==info){
			feedmoney=feedmoney-Number($("#"+key).attr("title"));
			return;
		}
		uparray.push(info);
	})
}

/**
 * 分页初始化
 * @returns
 */
function initpager(){
	uparray=new Array();
	var serachNo = $("#orderNo_productName").val();
	var month = $(".month").html();
	
	var reqdata={"serachNo":serachNo,"month":month,"pageno":0,"pageSize":10};
	pairequest("/pai/feeCenter/page.do",reqdata).then(function(data){
		if(data.obj.total != undefined){
			$(".total").text(data.obj.total);
			layui.use(['laypage', 'layer'],function(){
			  var laypage = layui.laypage,layer = layui.layer;
			  laypage.render({
				  elem: 'demo3',
				  count: data.obj.total,
				  limit:20,
				  layout: ['count', 'prev', 'page', 'next', 'skip'],
				  jump: function(obj){
					  getfeedList(obj.curr);
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


/**
 * 分页初始化
 * @returns
 */
function initmonth(){
	var reqdata={"status":0};
	var html='月份筛选:';
	pairequest("/pai/feeCenter/month.do",reqdata).then(function(data){
		var c="month";
		if(data.success==true){	
			$.each(data.obj,function(index,info){
				html+='<span  class="'+c+'" style="cursor: pointer;margin-left: 2%;font-size: 14px;" class="total">'+info.month+'</span>';
				if(c=="month"){
					c="nomonth";
				}
			})
			$(".months").empty();
			$(".months").append(html);
			monthclick();
		}
	});
}
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
}


function query(pageNum,jq){
	getOrderList(pageNum);
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

//手续费计算
function getFees(){
	var month = $(".month").html();
	if(undefined==month){
		return false;
	}
	var reqdata={"month":month,"status":0};
	painoloadrequest("/pai/feeCenter/sumfee.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				$(".monthsfeed").empty();
				$(".monthsfeed").append(month+"月待缴金额"+data.obj.fees+"元")
				if(data.obj.fees>0){
					$(".monthsfeedb").show();
				}else{
					$(".monthsfeedb").hide();
				}
				
			}
		})
};

function topayfee(){
	var month = $(".month").html();
	var reqdata={"month":month,"status":0};
	painoloadrequest("/pai/feeCenter/sumfee.do",reqdata).then(function(data){
		var html='';
			if(data.success){
				if(data.obj.fees>0){
					 layer.msg("确定支付"+month+"月服务费"+data.obj.fees+"元", {
						    time: 20000, //20s后自动关闭
						    btn: ['去支付', '暂不支付'],
						    yes:function(index, layero){
						    	topay("/pai/feeCenter/payfee.do",reqdata);
							  	 return false ;
						    },
						    bt3:function(index, layero){
								   
							  }
						  });
				}else{
					layer.msg(data.msg,{offset: 't',anim: 6});
				}
				
			}else{
				layer.msg(data.msg,{offset: 't',anim: 6});
			}
		})

}
//单笔支付
function topayfeeo(orderno,fee){
	 layer.msg("确定支付订单"+orderno+"服务费"+fee+"元", {
		    time: 20000, //20s后自动关闭
		    btn: ['去支付', '暂不支付'],
		    yes:function(index, layero){
		    	var param={};
				param["payOrderNo"]=orderno;
				topay("/pai/feeCenter/payFeeRecode.do",param);
			  	 return false ;
		    },
		    bt3:function(index, layero){
				   
			  }
		  });
};

$(document).ready(function(){
	setTimeout(function() {
		/*layer.tips('财务对账点击这里', '.feedtetail', {
			  tips: [1, '#006ad3'],
			  time: 40000
			});*/
		/*layer.tips('<div class="layui-inline" style="width:350px;"><a  href="/auctionmanager/managerpushauction.html"  target="_blank" class="  "><img style="width:250px;"  src="https://www.ezaisheng.cn/file/upload/202006/24/09-40-56-52-16702.png" /></a></div>', '.feedtetail', {
			  tips: [1, '#006ad3'],
			  time: 40000
			});*/
		
		/*layer.tips('<a href="/resources/js/topic2020624/webank_advice.pdf" target="_blank"><span style="font-size: 16px;color: #ea3800;"><i class="auctionnotice layui-icon layui-icon-speaker"></i>&nbsp;&nbsp;&nbsp; 重要通知：关于微众银行部分功能暂停的通知。点击查看详情。</span></a>', '.zs-login-btn', {
			  tips: [4, '#fff'],
			  time: 300000
			});
		 */
	}, 3000);
})


