var status;
var auditStatus;
var nowtime;
var opentime;
var pricetime;
var sid;
var bidid;
var goodsid;
var goodsList;
var originalData;
var timeInterval;

$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	$("#footer_all").load('/public/public_footer.html');
	authparams();
	datainit();
	 
	//监听tab
	layui.use('element', function(){
	  var element = layui.element;
	  //一些事件监听
	  element.on('tab(area-filter)', function(data){
		  //得到当前Tab的所在下标 data.index;
		  //得到当前的Tab大容器 data.elem); 
		  getTenderQuoteBytenderidAndAreaAndSigner();
		});
	});
});

// 检查登录状态
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

function  authparams(){
	var reqdata={};
	pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
		if(data.success==true){				
			var sts=data.obj.status;
			 userinfo=data.obj.upistr;
			//0 1  3审核中  4 已通过 5 未通过
			 var html="";
				if(sts==3||sts==4||sts==5){
				if(sts!=5){
					if(sts==3){
						paiAlert("实名认证审核中，暂无待审核竞拍商品","/","随便逛逛");
					}else{
						//有权限
					}
				}else{
					paiAlert("实名认证未通过，暂无竞拍商品","/auth/authinit.html","重新去实名认证");
				}
				}else{
					paiAlert("未实名认证，暂无竞拍商品","/auth/authinit.html","去实名认证");
				}
		}else{
		}
	
	});
};

function getParam(){
　　var reg = new RegExp("(^|&)"+ "param" +"=([^&]*)(&|$)");
　　var r = window.location.search.substr(1).match(reg);
　　if(r!=null){
		return unescape(r[2]);
　　}
   return null;
}

function getType(){
	var reg = new RegExp("(^|&)"+ "type" +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return unescape(r[2]);
	}
	return null;
}

function datainit(){
	var tenderid = getParam();
	if(tenderid==""||tenderid==null){
		layer.msg("非法请求",{offset: 't',anim: 6});
		return false;
	}
	var reqdata={
			"tenderid":tenderid
			};
	pairequest("/pai/tender/sign/toSignPage.do",reqdata).then(function(data){
		// 是否非法请求 v2
		if(data.success==true){
			tenderdatainit(data);
		}else{
			//非法请求处理
			layer.msg("非法请求",{offset: 't',anim: 6});
		}
	});
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


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


//通用初始化
function tenderdatainit(data){
	$(".memberCenter").hide();
	originalData = data;
	var tender=data.obj.tenderInfo;
	var sign=data.obj.sign;
	var gLists=data.obj.goodsList;
	goodsList=data.obj.goodsList;
	var aList=data.obj.aList;
	status = data.obj.status;//0:无状态 1: 报名 2: 提交资质 3:申请看货 4:支付保证金 5:我要出价 6:发布中标 7:支付货款8:已退款
	nowtime=data.obj.nowtime;
	opentime=data.obj.opentime;
	pricetime=data.obj.pricetime;
	var html="";
	$(".tname").html(tender.tname);
	$(".name").html(tender.tname);
	$(".buycom").html("采购商： "+tender.assetunit);
	$(".address").html(tender.areaname.split("@")[0]);
	html="保证金：<em class='no2-bond'><i>￥</i>"+tender.margin+" 元</em>";
	$(".margin").html(html);
	$(".opentendertime").html("开标时间:"+timestampToTime(opentime));
	$(".chujiatendertime").html("报价时间:"+timestampToTime(pricetime));
	
	var template = trashTemplate;
	if(tender.goodscate){
		var catename = data.obj.goodscate;
		if(catename.indexOf("@")>-1){
			catename = catename.substring(0,catename.indexOf("@"));
		}
		if(catename.indexOf("废油")>-1){
			template = feiyouTemplate;
		}else if(catename.indexOf("废钢")>-1){
			template = feigangTemplate;
		}
	}
	var areaname ="";
	if(tender.areaname!=null && areaname!=undefined){
		$.each(gLists,function(index,info){
			areaname+="</span>"
			areaname+=info.goodsname;
			areaname+="&nbsp;&nbsp;&nbsp;";
			areaname+=((undefined==gLists[0].areaname?"无":gLists[0].areaname).split("@").join("-"))+"</span></br>"
		})
//		areaname = tender.areaname;
	}
	areaname = areaname.replace(/\s+/g,"");
	

	var thtml='';		
	    thtml+='<div class="option_table">';		
	    thtml+='<table>    ';		
	    thtml+='<tbody>';		
	    $.each(gLists,function(index,info){		
	    thtml+='<tr>';		
	    thtml+='<td>'+(index+1)+'</td>';		
	    thtml+='<td> '+info.goodsname+'</td>';		
	    thtml+='<td style="text-align:left;">'+info.description+'</td>';		
	    thtml+='</tr>';		
	    })		
	    thtml+='</tbody>';		
	    thtml+='</table>';		
	    thtml+='</div>';

	template = template.replace(/@company/g,tender.assetunit);
	template = template.replace(/@goodsName/g,gLists[0].goodsname);
	template = template.replace(/@auctionStartTime/g,timestampToTime(pricetime));
	template = template.replace(/@auctionEndTime/g,timestampToTime(opentime));
	template = template.replace(/@goodsAddress/g,areaname.replace(/@/g,""));
	template = template.replace(/@goodsamount/g,gLists[0].amount);
	template = template.replace(/@goodsunit/g,gLists[0].unit);
//	template = template.replace(/@goodsdes/g,gLists[0].description);
	template = template.replace(/@goodsdes/g,thtml);
	template = template.replace(/@pactStartTime/g,tender.pactstarttime==undefined?"":tender.pactstarttime);
	template = template.replace(/@pactEndTime/g,tender.pactendtime==undefined?"":tender.pactendtime);
	template = template.replace(/@goodBonds/g,tender.margin);
	template = template.replace(/@goodsCate/g,tender.cataname.split("@").join("-"));
	template = template.replace(/@goodBonds/g,tender.margin);
	template = template.replace(/@formula/g,data.obj.formula==undefined?"现货":data.obj.formula);
	template = template.replace(/@lookstarttime/g,tender.lookstarttime==undefined?"":tender.lookstarttime);
	template = template.replace(/@lookendtime/g,tender.lookendtime==undefined?"":tender.lookendtime);
	template = template.replace(/@@goodsDes/g,tender.lookendtime==undefined?"":tender.lookendtime);
	
	if(tender.content!=undefined&&tender.content!=null&&tender.content!=""){
		template=tender.content;
	}
	$(".notice").empty();
	$(".notice").append(template);
	
	
	$(".simg").attr("src",gLists[0].url);
	$(".simg").attr("jqimg",gLists[0].url);
	var pichtml='';
	var array=new Array();
	for(var i=0;i<gLists.length;i++){
		array.push(gLists[i].url);
	}
	$.each(array,function(thumbindex,thuminfo){
		 pichtml+='<li><img bimg="'+thuminfo+'" src="'+thuminfo+'" onmousemove="preview(this);"></li>';
	})
	$(".thumbspic").empty();
	$(".thumbspic").append(pichtml);
	//判断是否报名
	signinit(data);
	//初始化出价版块儿
	bidPartInit(data);
}

//判断是否报名
function  signinit(data){
	var status = data.obj.status;
	var tender=data.obj.tenderInfo;
	var sign=data.obj.sign;
	var gLists=data.obj.goodsList;
	var aList=data.obj.aList;
	$(".signum").empty();
	$(".num").empty();
	var sname;
	var isfee;
	var auditdoing;
	if(sign!=null && sign!=undefined){
		sname=sign.sname;
		isfee=sign.isfee;
		auditdoing=sign.auditdoing;
		sid=sign.sid;
	}
	if(status==0||status==1){
		if(nowtime>opentime){
			 $(".bigRedBtn").text("已结束");
		}
		setInterval(function() {
			gettendercountdownTime();
		}, 1000);
		clickinit();
		return false;
	}
	var isaudit=sign.isaudit;
	auditStatus = isaudit;
	var tiStatus=tender.tiStatus;
	var company=data.obj.company;
	 $(".contacter").html(tender.contacter);
	 $(".contacttel").html(tender.contacttel);
	  bidid=sign.tenderBidNo;
	  if(undefined!=bidid){
		  $(".bidno").empty();
		  $(".bidno").append("<span style='color:#000;padding-left:30px;'>您的竞拍号：</span><span class='bidid' id='bidid'>"+bidid+"</span>");
	  }
	 
	//即将开始
	  var html="";
	  if(pricetime>nowtime){
		  if(status==1){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">马上报名</span>';
			}else if(status==2){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">提交资质</span>';
			}else if(status==3){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">申请看货</span>';
			}else if(status==4){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">支付保证金</span>';
			}else if(status==5){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">等待出价</span>';
			}
			if(auditdoing==1){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">资质审核中</span>';
			}else{
				if(isaudit==2){
					html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">重新提交资质</span>';
				}
			}
	  }else if(opentime>nowtime&&nowtime>pricetime){
		  if(status==1){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">马上报名</span>';
			}else if(status==2){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">提交资质</span>';
			}else if(status==3){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">申请看货</span>';
			}else if(status==4){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">支付保证金</span>';
			}else if(status==5){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">我要出价</span>';
			}else if(status==6){
				html='<span class="grayBtn layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled">发布中标</span>';
			}
			if(auditdoing==1){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">资质审核中</span>';
			}else{
				if(isaudit==2 || isaudit==0){
					html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">重新提交资质</span>';
				}
			}
	  }else{
		  if(undefined==sid){
			  html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">已结束</span>';
		  }else{
			  html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">查看中标结果</span>';
		  }
		 
	  }
	$(".action").empty();
	$(".action").append(html);
	clickinit();
	//轮询更新倒计时相关页面信息
	timeInterval = setInterval(function() {
		gettendercountdownTime()
	}, 1000);
}

//更新倒计时相关页面信息
function gettendercountdownTime(){
	var tid=getParam();
	var reqdata={tid:getParam()};
	painoloadrequest("/pai/tender/price/gettendercountdownTime.do",reqdata).then(function(data){
	   if(data.success==true){
		   timecuttur(data);
		   }else{
			   
		   }
	});
	
};

//倒计时
function timecuttur(data){
	 var nowtime=data.obj.nowtime;
	 var opentime=data.obj.opentime;
	 var pricetime=data.obj.pricetime;
	
	//即将开始
	  if(pricetime>nowtime){
		  var date3=pricetime-nowtime; //时间差的毫秒数
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
//		 $(".la").css("background","#009688");
		 $(".la").text("即将开始：");
		$(".con").html('距竞拍开始出价还剩&nbsp;<span class="djs"><em>'+days+'</em>天<em>'+hours+'</em>时<em>'+minutes+'</em>分<em>'+seconds+'</em>秒</span>');
	  }
	  
	  if((((nowtime-pricetime)>0&&(nowtime-pricetime)<=3000))||((opentime-nowtime)>0&&(opentime-nowtime)<=2000)){
		  setTimeout(function() {
			  datainit();
		}, 5000);
	  }
	  if(opentime>nowtime&&nowtime>pricetime){
		  var date3=opentime-nowtime; //时间差的毫秒数
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
		   $(".la").text("竞拍中：");
		   $(".con").html('距竞标结束还剩：<span class="djs"><em>'+days+'</em>天<em>'+hours+'</em>时<em>'+minutes+'</em>分<em>'+seconds+'</em>秒</span>');	 

	  }
	  
	  if(nowtime>opentime){
		   clearInterval(timeInterval);//竞价结束后，终止倒计时轮询
		   $(".la").text("已结束：");
		   $(".con").html('<span class="djs">开标时间&nbsp;'+new Date(opentime).Format("yyyy-MM-dd hh:mm:ss")+'</span>')
	  }
}

/**
 * 初始化出价版块儿
 * @param data
 * @returns
 */
function bidPartInit(data){
	//区域
	$(".layui-tab-title").empty();
	var belongareas=data.obj.belongareas;
	var areaHtml = "";
	for(var i=0;i<belongareas.length;i++){
		if(i==0){
			areaHtml+="<li class='layui-this'><span>"+belongareas[i]+"</span></li>"
		}else{
			areaHtml+="<li class=''><span>"+belongareas[i]+"</span></li>"
		}
	}
	$(".layui-tab-title").append(areaHtml);
	getTenderQuoteBytenderidAndAreaAndSigner();
}
//根据区域展示出价板块
function getTenderQuoteBytenderidAndAreaAndSigner(){
	var thisarea = $('.layui-tab-title').find('li[class="layui-this"]')[0].innerText;
	var tenderid = getParam();
	if(tenderid==""||tenderid==null){
		layer.msg("非法请求",{offset: 't',anim: 6});
		return false;
	}
	var reqdata={
			"tenderid":tenderid,
			"belongarea":thisarea
			};
	pairequest("/pai/tender/quote/getTenderQuoteByTenderidAndBelongareaAndSigner.do",reqdata).then(function(data){
		if(data.success==true){
			
			$(".tenderGoods-list").empty();
			var html = buildQuoteHtml(data);
			$(".tenderGoods-list").append(html);
			var isEnd = data.obj.isEnd;
			if(isEnd == "1"){
				console.log("已结束，不需再轮询");
			}else{
				//轮询更新出价记录
				setInterval(function() {
					pollingdata(reqdata);
				}, 1000);
			}
		}else{
//			layer.msg(data.msg,{offset: 't',anim: 6});
		}
	});
}
//轮询更新出价记录
function pollingdata(reqdata){
	painoloadrequest("/pai/tender/quote/getTenderQuoteByTenderidAndBelongareaAndSigner.do",reqdata).then(function(data){
		if(data.success==true){
			if(data!=null && data!=undefined && data.obj!=null && data.obj!=undefined && data.obj.quoteList!=null
					&& data.obj.quoteList!=undefined){
				var quoteList = data.obj.quoteList;
				for(var i=0;i<quoteList.length;i++){
					var quote = quoteList[i];
					if(quote!=null && quote!=undefined && quote.qdList!=null && quote.qdList!=undefined && quote.qdList.length>0){
						var goodsid;
						var html = buildRecordHtml(quote);
						var qdList = quote.qdList;
						for(var j=0;j<qdList.length;j++){
							var qd = qdList[j];
							if(qd!=null && qd!=undefined && qd.goodsid!=null && qd.goodsid!=undefined){
								goodsid = qd.goodsid;
							}
						}
						$("#"+goodsid).empty();
						$("#"+goodsid).append(html);
					}
				}
			}
		}else{
			layer.msg(data.msg,{offset: 't',anim: 6});
		}
	});
}

//构建出价页面模块
function buildQuoteHtml(data){
	var html="";
	var obj = data.obj;
	if(obj!=null && obj!=undefined){
		var quoteList = obj.quoteList;
		if(quoteList!=null && quoteList!=undefined && quoteList.length>0){
			for(var i=0;i<quoteList.length;i++){
				quote = quoteList[i];
				var qList = quote.qList;
				var qdList = quote.qdList;
				html+="<li>"
					+"<div class='leftPart'>"
					+"	<table width='100%'>"
					+"		  <tr>"
					+"		    <th width='25%'>商品名称</th>"
					+"		    <th  width='12%'>数量</th>"
					+"		    <th  width='37%'>采购单位</th>"
					+"		    <th  width='25%'>起拍价</th>"
					+"		  </tr>"
					+"		  <tr>"
					+"		    <td><div style='height:42px;line-height:42px;overflow:hidden;vertical-align:middle'><p style='display:inline-block;line-height:21px;'>"+quote.goodsname+"</p></div></td>"
					+"		    <td>"+quote.amount+quote.unit+"</td>"
					+"		    <td><div style='height:42px;line-height:42px;overflow:hidden;vertical-align:middle'><p style='display:inline-block;line-height:21px;'>"+qList[0].company+"</p></div></td>"
					+"		    <td><em style='font-size:16px;color:#ff6c08;font-style:normal'>￥<span id='price_"+quote.goodsid+"'>"+(quote.baseprice==undefined?("**"):quote.baseprice)+"</span>元</em></td>"
					+"		  </tr>"
					+buildBidHtml(quote)
					+"	</table>"
					+"</div>"
					+"<div class='rightPart'>"
					+"<div class='chujiaTitle'>出价记录</div>"
					+"<div class='chujiaLog'>"
					+"<table width='100%'>"
					+"		  <tr>"
					+"		    <th colspan='3'>参与人数：<span style='color:#ff6c08' id='signnum_"+quote.goodsid+"'>"+qList.length+"人</span>&nbsp;&nbsp;&nbsp;&nbsp;"
					+							"出价次数：<span style='color:#ff6c08' id='qdtotal_"+quote.goodsid+"'>"+qdList.length+"次</span></th>"
					+"		  </tr>"
					+"		  <tr>"
					+"		    <td style='width:100px;color:#18b0a3;border-bottom: 1px solid #e8e8e8;padding: 2px 0px;font-weight:bold;font-size:14px;'>竞拍号</td>"
					+"		    <td style='width:80px;color:#18b0a3;border-bottom: 1px solid #e8e8e8;padding: 2px 0px;font-weight:bold;font-size:14px;'>时间</td>"
					+"		    <td style='color:#18b0a3;border-bottom: 1px solid #e8e8e8;padding: 2px 0px;font-weight:bold;font-size:14px;'>价格</td>"
					+"		  </tr>"
					+"	</table>"
					+"	<div class='boxcon'>"
					+"		<table width='100%' class='bid-records-list' id='"+quote.goodsid+"'>"
					+buildRecordHtml(quote)
					+"	</table>"
					+"	</div>"
					+"</div>"
					+"</div>"
					+"</li>";
				
				
			}
		}
	}
	return html;
}

//构建出价框
function buildBidHtml(quote){
	var placeholder = (undefined==quote.baseprice?"***":quote.baseprice);
	var qdList = quote.qdList;
	if(qdList!=null && qdList!=undefined && qdList.length>0){
		placeholder=(qdList[0].price==undefined?(""):qdList[0].price);
	}
	if(placeholder==null || placeholder==undefined){
		placeholder = "**";
	}
	var bidHtml="<tr>"
				+"<td colspan=4>"
				+"<div class='inText'>";
	if(pricetime>nowtime){
		bidHtml+="<span style='font-weight:bold'>报价：</span>"
				+"<div style='border-bottom:1px dotted #ddd;display:inline-block;padding:2px 30px;'>"
				+"<em style='font-size:25px;vertical-align:middle'>￥</em><input  class='bid-price' id='"+quote.qit+"' type=number disabled='disabled' placeholder='"+placeholder+"'>元"
				+"</div>"
				+"<button class='bid-button'>即将开始</button>"
				+"</div>"
				+"</td>"
				+"</tr>";
	}else if(opentime>nowtime&&nowtime>pricetime){
		if(auditStatus==1 || auditStatus==3){
			if(status==5){
				bidHtml+="<span style='font-weight:bold'>报价：</span>"
					+"<div style='border-bottom:1px dotted #ddd;display:inline-block;padding:2px 30px;'>"
					+"<em style='font-size:25px;vertical-align:middle'>￥</em><input style='border: 1px solid #e8e8e8;' class='bid-price' id='"+quote.qit+"' type=number required='required' min='0' value='"+placeholder+"'>元"
					+"</div>"
					+"<button class='bid-button' onclick=submitBid('"+quote.qit+"','"+quote.goodsid+"','"+quote.signid+"')>提交报价</button>"
					+"</div>"
					+"</td>"
					+"</tr>";
			}else if(status==4){
				bidHtml+="<span style='font-weight:bold'>报价：</span>"
					+"<div style='border-bottom:1px dotted #ddd;display:inline-block;padding:2px 30px;'>"
					+"<em style='font-size:25px;vertical-align:middle'>￥</em><input  class='bid-price' id='"+quote.qit+"' type=number  disabled='disabled' placeholder='"+placeholder+"'>元"
					+"</div>"
					+"<button class='bid-button'>待支付保证金</button>"
					+"</div>"
					+"</td>"
					+"</tr>";
			}
		}else{
			bidHtml+="<span style='font-weight:bold'>报价：</span>"
				+"<div style='border-bottom:1px dotted #ddd;display:inline-block;padding:2px 30px;'>"
				+"<em style='font-size:25px;vertical-align:middle'>￥</em><input  class='bid-price' id='"+quote.qit+"' type=number  disabled='disabled' placeholder='"+placeholder+"'>元"
				+"</div>"
				+"<button class='bid-button'>资质审核中</button>"
				+"</div>"
				+"</td>"
				+"</tr>";
		}
	}else{
		if(quote.isbingo==1){
			bidHtml+="<span style='font-weight:bold'>报价：</span>"
				+"<div style='border-bottom:1px dotted #ddd;display:inline-block;padding:2px 30px;'>"
				+"<em style='font-size:25px;vertical-align:middle'>￥</em><input  class='bid-price' id='"+quote.qit+"' type=number  disabled='disabled' placeholder='"+placeholder+"'>元"
				+"</div>"
				+"<button class='bid-button'>中标</button>"
				+"</div>"
				+"</td>"
				+"</tr>";
		}else if(quote.isbingo==0){
			bidHtml+="<span style='font-weight:bold'>报价：</span>"
				+"<div style='border-bottom:1px dotted #ddd;display:inline-block;padding:2px 30px;'>"
				+"<em style='font-size:25px;vertical-align:middle'>￥</em><input  class='bid-price' id='"+quote.qit+"' type=number  disabled='disabled' placeholder='"+placeholder+"'>元"
				+"</div>"
				+"<button class='bid-button'>未中标</button>"
				+"</div>"
				+"</td>"
				+"</tr>";
		}
	}
	return bidHtml;
}
//构建出价记录
function buildRecordHtml(data){
	var qdHtml="";
	if(status==0 || status==1 || status==2 || status==3 || status==4){
		return "";
	}
	var qit=data.qit;
	var goodsid = data.goodsid;
	var qdList = data.qdList;
	var qList = data.qList;
	if(qList!=null && qList!=undefined){
		if($("#signnum_"+goodsid)[0]!=null && $("#signnum_"+goodsid)[0]!=undefined){
			$("#signnum_"+goodsid)[0].innerText=qList.length+"人";
		}
	}
	if(qdList!=null && qdList!=undefined){
		if($("#qdtotal_"+goodsid)[0]!=null && $("#qdtotal_"+goodsid)[0]!=undefined){
			$("#qdtotal_"+goodsid)[0].innerText=qdList.length+"次";
		}
		for(var i=0;i<data.qdList.length;i++){
			var qd = data.qdList[i];
			var timestr = "--:--:--";
			if(qd.createtimeStr!=null && qd.createtimeStr!=undefined){
				timestr = qd.createtimeStr;
			}
			var colorstyle="";
			if(qit==qd.qit){
				colorstyle=" ;color:red";
			}
			qdHtml+="<tr class='bid-records-item'>"
					+"<td style='width:100px"+colorstyle+"'>"+qd.bidNo+"</td>"
					+"<td style='width:80px'>"+timestr.substring(timestr.length - 8)+"</td>"
					+"<td>￥"+qd.price+"元</td>"
					+"</tr>";
		}
	}
	return qdHtml;
}

//提交报价
function submitBid(qit,goodsid,sid){
	var price = $("#"+qit).val();
	var minprice;
	if($("#"+goodsid).find('tr').find('td')[2]!=null && $("#"+goodsid).find('tr').find('td')[2]!=undefined){
		minprice = $("#"+goodsid).find('tr').find('td')[2].innerText;
	}
	var regPos = /^\d+(\.\d{1,2})?$/; //非负浮点数
	if(regPos.test(price)) {
		if(minprice!=null && minprice!=undefined){
			minprice = minprice.substring(1,minprice.length - 1);
			if(parseFloat(price)>=parseFloat(minprice)){
				layer.msg('出价须小于出价记录中最低价');
			}else{
				var reqdata={"tenderid":getParam(),"goodsid":goodsid,"price":price,"sid":sid};
				pairequest("/pai/tender/price/quote.do",reqdata).then(function(data){
					if(data.success==true){
						layer.msg(data.msg,{offset: 't',anim: 6});
					}else{
						if(data.errorcode==110005){
							layer.msg(data.msg,{offset: 't',anim: 6});
						}else{
							layer.msg(data.msg,{offset: 't',anim: 6});
						}
					}
				});
			}
		}else{
			var goodsprice;
			if($("#price_"+goodsid)!=null && $("#price_"+goodsid)!=undefined && $("#price_"+goodsid)[0]!=null
					&& $("#price_"+goodsid)[0]!=undefined){
				goodsprice = $("#price_"+goodsid)[0].innerText;
			}
			if(goodsprice!=null && goodsprice!=undefined){
				if(parseFloat(price)>parseFloat(goodsprice)){
					layer.msg('出价不能大于起拍价');
				}else{
					var reqdata={"tenderid":getParam(),"goodsid":goodsid,"price":price,"sid":sid};
					pairequest("/pai/tender/price/quote.do",reqdata).then(function(data){
						if(data.success==true){
							layer.msg(data.msg,{offset: 't',anim: 6});
						}else{
							if(data.errorcode==110005){
								layer.msg(data.msg,{offset: 't',anim: 6});
							}else{
								layer.msg(data.msg,{offset: 't',anim: 6});
							}
						}
					});
				}
			}
			
		}
	}else{
	   layer.msg('报价格式错误（只能是数字，精确到两位小数）')
	}
}

/**
 * 面包框操作
 * @returns
 */
function clickinit(){
	$(".bigRedBtn").click(function(){
		var text=$(this).html();
		text = text.replace(/\s+/g,"");
		if(text=="马上报名"){
			signtender();
		}else if(text=="支付保证金"){
			$(this).html("支付中")
			setTimeout(function() {
				$(this).html("支付保证金");
			}, 10000);
			var param={};
			param["tenderSignId"]=sid;
			param["reqp"]=getParam()+"TENDERMAGINPAY";
			topay("/pai/paycommon/tender/toPayTenderBond.do",param);
		}else if(text=="提交资质"){
			$(this).html("提交资质中")
			uploadrequire();
		}else if(text=="重新提交资质"){
			$(this).html("重新提交资质中")
			uploadrequire();
		}else if(text=="资质审核中"){
			$(this).html("资质审核中查看");
			$(".submitrequire").hide();
			uploadrequire();
		}else if(text=="等待出价"){
			layer.msg("采购竞价还未开始,请在开始后再来吧", {time: 5000, icon:6});
		}else if(text=="我要出价"){
			 toBidPrice();
		}else if(text=="签订合同"){
			window.location.href="/orderform/buyerorderformlist.html";
		}else if(text=="确认出价"){
			bidPrice();
		}else if(text=="查看中标结果"){
			toBidPrice();
		}else if(text=="已结束"){
			layer.msg("采购竞价已结束", {time: 5000, icon:6});
		}
	});
	
	$(".jiagebfj").keyup(function(){
		var tv=parseFloat(parseFloat($(this).val()));
		var pv=parseFloat(parseFloat($(".jinjiabd").val()));
		if(tv==""||tv>=pv){
			$($(this).parent("div")).css("border"," 2px solid #F44336");
		}else{
			$($(this).parent("div")).css("border"," 1px solid #4CAF50");
		}
	})
};

//报名
function signtender(data){
	var tenderid = getParam();
	var reqdata={"tid":tenderid};
	pairequest("/pai/tender/sign/sign.do",reqdata).then(function(data){
		if(data.success==true){
			layer.msg(data.msg,{offset: 't',anim: 6});
			setTimeout(function() {
				datainit();
			}, 1000);
		}else{
			layer.msg(data.msg,{offset: 't',anim: 6});
		}
	});
};
/**
 * 我要出价
 * @returns
 */
function toBidPrice(){
	$('.tabTitle').find('li').removeClass('liNow');
	$('.tabTitle').find('li').eq(2).addClass('liNow');
	$('.tabConDiv').find('.tabCon').hide();
	$('.tabConDiv').find('.tabCon').eq(2).show();
    document.getElementById('bidprice').scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth'
    })
}


/**
 * 货品清单
 */
function showGoodsBom(){
	var html="<table class='goods-table' width='100%'>" +
			"		  <tbody>" +
			"			<tr>" +
			"		    	<th width='10%'>商品图片</th>" +
			"		    	<th width='20%'>商品名称</th>" +
			"		    	<th width='20%'>数量</th>" +
			"		    	<th width='30%'>公司名称</th>" +
//			"		    	<th width='20%'>起拍价</th>" +
			"		  	</tr>";
	if(goodsList!=null && goodsList!=undefined){
		html+="";
		for(var i=0;i<goodsList.length;i++){
			var goods=goodsList[i];
			if(goods!=null && goods!=undefined){
				var gcompany=(undefined==goods.company?"":goods.company);
				var gareaname=(undefined==goods.areaname?"":goods.areaname)
			html+=	"<tr>" +
					"	<td><img src='"+goods.url+"'></td>" +
					" 	<td>"+goods.goodsname+"</td>" +
					"	<td>"+goods.amount+goods.unit+"</td>" +
					"	<td> <font style='font-size: 14px;'>"+(goods.company+"</br>"+goods.areaname.split("@").join("-"))+"</font></td>" +
					"</tr>";
			}
		}
	}
	html+="		</tbody>" +
		  "</table>";
	
	layer.open({
	  title:'货品清单',
	   anim: 2,
	   type: 1,
	   shade: 0.1,
	   scrollbar :true,
	   area: ['70%', '60%'],
	   skin: '#FFF', //没有背景色
	   shadeClose: false,
	  content: html
	});
}

/**
 * 附件收费
 */
function payAnnex(isaudit,money){
	var signId = sid;
	if(signId=="" || signId==null || signId==undefined || signId=="undefined"){
		layer.msg("请先报名");
		return ;
	}
	if( isaudit!=null && isaudit!=undefined && isaudit!="undefined" && isaudit!='0' && isaudit!=""){
		layer.confirm("下载附件需支付"+money+"元", {
			  btn: ['去支付','取消'] //按钮
			}, function(){
				toPayAnnex(signId);
			}, function(){
			  
			});
	}else{
		layer.msg("请在资质审核通过后下载.");
		return;
	}
}
/**
 * 附件收费
 */
function toPayAnnex(signId){
	var param={};
	param["signId"]=signId;
	param["reqp"]=getParam()+"TENDERANNEX";
	topay("/pai/paycommon/tender/toPayAnnex.do",param);
}

/**
 * 下载附件
 */
function downloadAnnex(){
	var isfee = "0";
	var sign = originalData.obj.sign;
	if(sign!=null && sign!=undefined){
		isfee = sign.isfee;
	}else{
		layer.msg("报名后可下载",{offset: 't',anim: 6});
		return;
	}
	var tenderInfo=originalData.obj.tenderInfo;
	var isfee=originalData.obj.sign.isfee;
	var aList=originalData.obj.aList;
	var obj=originalData.obj;
	var html="<table class='goods-table' width='100%'>" +
			"		  <tbody>" +
			"			<tr>" +
			"		    	<th width='50%'>附件</th>" +
			"		    	<th width='50%'>操作</th>" +
			"		  	</tr>";
	if(aList!=null &&aList!=undefined && aList.length>0){
			for(var i=0;i<aList.length;i++){
				var a = aList[i];
				html+=	"<tr>" +
				"	<td>"+a.filename+"</td>" +
				" 	<td>"+
				"		<a href='"+a.filethumb+"'>"+
				"		<span style='color:#4C33E5;font-size:12px;'>" +
				"			<strong><u>下载</u></strong>" +
				"		</span>" +
				"		</a>"+
				"	</td>" +
				"</tr>";
			}
			
		}else{
			html+="<tr><td colspan=2>无附件</td></tr>";
		}
		html+="		</tbody>" +
		  "</table>";
	if(obj.tenderInfo.ischarge=='0'){
		if(aList!=null &&aList!=undefined && aList.length>0){
			layer.open({
				  type: 1,
				  title:'附件清单',
				  skin: 'layui-layer-rim', //加上边框
				  area: ['40%', '30%'], //宽高
				  content: html
				});
		}else{
			layer.msg("无附件",{offset: 't',anim: 6});
		}
	}else if(obj.tenderInfo.ischarge=='1'){
		if(aList!=null && aList!=undefined && aList.length>0){
			if(isfee !='1'){
				if(obj.tenderInfo!=null && obj.tenderInfo!=undefined && obj.tenderInfo.fee!=null &&
						obj.tenderInfo.fee!=undefined && obj.tenderInfo.fee!='0'){
					payAnnex(obj.sign.isaudit,obj.tenderInfo.fee);
				}else{
					layer.open({
						 type: 1,
						  title:'附件清单',
						  skin: 'layui-layer-rim', //加上边框
						  area: ['40%', '30%'], //宽高
						content: html
					});
				}
			}else if(isfee =='1'){
				layer.open({
					 type: 1,
					  title:'附件清单',
					  skin: 'layui-layer-rim', //加上边框
					  area: ['40%', '30%'], //宽高
					  content: html
					});
			}
		}else{
			layer.msg("无附件",{offset: 't',anim: 6});
		}
	}
}