var indx1
var isFeiyou=false;

$(document).ready(function(){
	 signInit();
	 getauctionrecords(1,30);
});


function getParam(){
　　var reg = new RegExp("(^|&)"+ "ctype" +"=([^&]*)(&|$)");
　　var r = window.location.search.substr(1).match(reg);
　　if(r!=null)return unescape(r[2]);
   return null;
}

/**
 * 获取竞价信息 是否非法请求
 * @returns
 */
function signInit(){
	var aucid = getParam();
	if(aucid==""||aucid==null){
		layer.msg("非法请求",{offset: 't',anim: 6});
		return false;
	}

    function getQueryString(name) {
        var reg = new RegExp("(/?|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.href.match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return '';
    }
	var reqdata={
			"acutid":aucid
			};
	pairequest("/pai/auction/auctionDetail.do",reqdata).then(function(data){
        var name = null;
        var pic = '';
        try{
            pic = getQueryString('param');
            name = pic.substring(pic.lastIndexOf('/') + 1, pic.lastIndexOf('.'));
        } catch(e){}
		// 是否非法请求 v2
		if(data.success==true){
			$(".name").addClass("item");
			$(".name").attr("id",aucid);

			$(".hdnr_oip").hide();
			$(".jprice").val(data.obj.jprice);
			$(".dprice").val(data.obj.nprice);

			$(".simg").attr("src",pic ||data.obj.thumb);
			$(".simg").attr("jqimg",pic ||data.obj.thumb);
			var pichtml='';
			$.each(data.obj.thumbs,function(thumbindex,thuminfo){
				 pichtml+='<li><img bimg="'+pic+'" src="'+pic+'" onmousemove="preview(this);"></li>';
			})
			$(".thumbspic").empty();
			$(".thumbspic").append(pichtml);

			$(".tname").html(name || data.obj.title);
			$(".name").html(name || data.obj.title);
			//2 已结束  1 在竞价期内   0 还未开始
			var projectstatus=data.obj.projectstatus;
			$(".la").html(data.obj.breadtitle);
			//当前价格
			$(".curPrice").empty();
			if(data.obj.nprice>0.001){
				var html='<span class="curPricem1">当前价：<em class="curPricem"><i>￥</i> '+data.obj.nprice+'</em> 元/吨</span><span>数量：'+data.obj.amount+' （'+data.obj.unit+'）</span>';
				$(".curPrice").append(html);
			}else{
				var html='<span class="curPricem1"><span>当前价：<em class="curPricem" style="font-size: 16px;">竞拍开始前一天可见 </em></span> </span><span>数量：'+data.obj.amount+' （'+data.obj.unit+'）</span>';
				$(".curPrice").append(html);
			}

			//保证金
			$(".basePrice").empty();
			var html='<span>保证金：<em><i>￥</i>'+data.obj.margin+' 元</em></span>';
			$(".basePrice").append(html);

			//下栏位
			$(".extra").empty();
			var html='';
				html+='<table>';
				html+='<tbody><tr>';
				 if(data.obj.sprice<="0.001"){
					 html+='<td>起拍价：<span class="colororange">竞拍开始前一天可见</span></td>';
				}else{
					html+='<td>起拍价： ￥ '+data.obj.sprice+'元/吨</td>';
				}
				html+='<td>加价幅度： ￥ '+data.obj.jprice+'元</td>';
				//0:单价报盘 1:总价报盘
				html+='<td>报盘方式：'+data.obj.offermethod+'</td>';
				html+='</tr>';
				html+='<tr>';
				html+='<td>保证金：￥ '+data.obj.margin+' 元</td>';
				html+='<td>延时周期：'+data.obj.delay+'分钟/次</td>';
				var projectstatus=data.obj.projectstatus;
				if(projectstatus=="2"){
					if(data.obj.keepmoney!=undefined&&data.obj.keepmoney!=null){
						html+='<td>保留价：<span class="colororange">报名后可见</span></td>';
					}else{
						html+='<td>保留价：无</td>';
					}

				}else{
					html+='<td>保留价：<span class="colororange">****</span></td>';
				}
				html+='</tr>';
				html+='<tr>';
				html+='<td>拍品所在单位： <span class="colororange">报名后可见</span></td>';
				html+='<td>联系人：<span class="colororange">报名后可见</span></td>';
				html+='<td>联系方式：<span class="colororange">报名后可见</span></td>';
				html+='</tr>';
				html+='</tbody></table>';
				$(".extra").append(html);
				//须知
				$(".xuzhi").empty();
				$(".xuzhi").append(data.obj.xuzhi);
				//描述
				var template = feisuliaoTemplate;
				if(data.obj.goodscate){
					var catename = data.obj.goodscate;
					if(catename.indexOf("@")>-1){
						catename = catename.substring(0,catename.indexOf("@"));
					}
					if(catename.indexOf("废油")>-1){
						template = feiyouTemplate;
						isFeiyou = true;
					}else if(catename.indexOf("废钢")>-1){
						if(data.obj.notice!=null && data.obj.notice!=undefined && data.obj.notice!=""){
							template = data.obj.notice;
						}else{
							template = feigangTemplate;
						}

					}
						if(data.obj.notice!=null && data.obj.notice!=undefined && data.obj.notice!=""){
							template = data.obj.notice;
						}

				}

				template = template.replace(/@company/g,data.obj.company);
				template = template.replace(/@goodsName/g,data.obj.goodsname);
				template = template.replace(/@auctionStartTime/g,data.obj.auctionStarttime);
				template = template.replace(/@auctionEndTime/g,data.obj.auctionEndtime);
				template = template.replace(/@goodsAddress/g,data.obj.areaname.replace(/@/g,""));
				template = template.replace(/@goodsamount/g,data.obj.amount);
				template = template.replace(/@goodsunit/g,data.obj.unit);
				template = template.replace(/@goodsdes/g,data.obj.goodsdes);
				template = template.replace(/@pactStartTime/g,data.obj.pactstarttime==undefined?"":data.obj.pactstarttime);
				template = template.replace(/@pactEndTime/g,data.obj.pactendtime==undefined?"":data.obj.pactendtime);
				template = template.replace(/@goodBonds/g,data.obj.bond);
				template = template.replace(/@goodsCate/g,catename);
				template = template.replace(/@goodBonds/g,data.obj.bond);
				template = template.replace(/@formula/g,data.obj.formula==undefined?"现货":data.obj.formula);
				template = template.replace(/@lookstarttime/g,data.obj.lookstarttime==undefined?"":data.obj.lookstarttime);
				template = template.replace(/@lookendtime/g,data.obj.lookendtime==undefined?"":data.obj.lookendtime);
				template = template.replace(/@@goodsDes/g,data.obj.lookendtime==undefined?"":data.obj.lookendtime);
				$(".notice").empty();
				$(".notice").append(template);
				var pactstarttime="--";
				var pactendtime="--";
				if(data.obj.pactstarttime!=undefined&&data.obj.pactstarttime!=null){
					 pactstarttime=data.obj.pactstarttime;
					 pactendtime=data.obj.pactendtime;
				}
				var html='<span>'+pactstarttime+'--'+pactendtime+'</span>';
				$(".pactup").empty();
				$(".pactup").append(html);


			if(projectstatus=="0"){
				var html='开始时间：<span class="djs" style="color: #555555;font-size: 16px">'+data.obj.endtime+' </span>';
				$(".con").html(html);
				$(".la").css("background","#006ad3");
				$(".la").html("即将开始");
			}else if(projectstatus=="1"){
				$(".con").html("距竞拍结束还剩:");
				$(".la").html("正在竞拍");
			}else if(projectstatus=="2"){
				var html='结束时间：<span class="djs" style="color: #555555;font-size: 16px">'+data.obj.endtime+' </span>';
				$(".con").html(html);
				$(".la").addClass("end");
			}

			//判断用户是否登录
			 if(data.errorcode==110005){
				 nologinSignInit(data);
			 }else{
				 loginSignInit(data);
			 }

			 //竞价记录逻辑
			 var totalrec=data.obj.totalrec;
			 $(".num").empty();
			 var html='<em>'+totalrec.total+'次</em>出价';
			 $(".num").append(html);

			 $(".signum").empty();
			 var shtml='<span class="signum"><em>'+data.obj.signupnum+'人</em>报名</span>';
			 $(".signum").append(shtml);

			 var  html='';
			 if(totalrec.total==0){
				  html+='<div class="item">';
				  html+='<span>暂无出价记录</span>';
				  html+='</div>';
			 }else{
				 html+='<div class="item"><span style="margin-left: 5%;">竞拍号</span><span style="margin-left: 25%;">时间</span><span style="margin-left: 30%;">价格</span></div>';
				 $.each(totalrec.content,function(index,info){
					  html+='<div class="item">';
					  if(bidid==info.bidid){
						  html+='<span style="margin-left: 5%;color:#FF5722;">'+info.bidid+'</span>';
					  }else{
						  html+='<span style="margin-left: 5%;">'+info.bidid+'</span>';
					  }

					  html+='<span style="margin-left: 5%;">'+info.addtime+'</span>';
					  html+='<span class="price">￥'+info.price+'元</span>';
					  html+='</div>';
				 });
			 }
			 $(".list").empty();
			 $(".list").append(html);

			 //面包框操作
			 clickinit()

			 var projectstatus=data.obj.projectstatus;
			 if(projectstatus==1||projectstatus==0){
				//未结束开始轮训
					setInterval(ink,1000);
			 }
			 setInterval(getauctionrecords,3000);
		}else{
			//非法请求处理
			layer.msg("非法请求",{offset: 't',anim: 6});
		}

	});

};

/**
 * 登录展示
 * @returns
 */

function loginSignInit(data){
	$(".address").html((data.obj.areaname==undefined||data.obj.areaname==null)?"暂无":data.obj.areaname.split("@")[0]+(data.obj.areaname.split("@").length>=2?("-"+data.obj.areaname.split("@")[1]):""));
	checkSign(data)
}

/**
 * 未登录展示
 * @returns
 */
function nologinSignInit(data){
	var projectstatus=data.obj.projectstatus;
	var html='';
	if(projectstatus=="0"){
		html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius" id="tologin">报 名</span>';
	}else if(projectstatus=="1"){
		html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius" id="tologin">报 名</span>';
	}else if(projectstatus=="2"){
		html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled" id="tologin">已结束</span>';
	}
	$(".action").empty();
	$(".action").append(html);
}

//检查报名状态
function checkSign(data){
	if(data.success==true&&data.obj.bidstatus!="0"){
		//TODO 已报名逻辑  用户已登录
		issign(data)
	}else{
		 //TODO 未报名逻辑 用户已登录
		nosign(data);
	}

};


/**
 * 客户已报名逻辑
 * @returns
 */

/*bidstatus 0 未报名,未支付保证金 1已报名，未支付保证金 2已支付保证金，待提交资质 3资质审核不通过 4资质审核通过
5资质已提交   7竞拍结束，未竞得 8竞拍结束，竟得,待支付货款  10支付成功*/
var bidid="";
function issign(data){

	 $(".bidid").empty();
	 bidid=data.obj.bidid;
	 var bhtml='<span class="bidid" id="bidid"><em>竞拍号:</em>'+data.obj.bidid+'</span>';
	 $(".bidid").append(bhtml);
	 $(".bidid").show();
	//下栏位
	$(".extra").empty();

	var html='';
		html+='<table>';
		html+='<tbody><tr>';
		if(data.obj.sprice<="0.001"){
			 html+='<td>起拍价：<span class="colororange">竞拍开始前一天可见</span></td>';
		 }else{
			 html+='<td>起拍价： ￥ '+data.obj.sprice+'元/吨</td>';
		 }
		html+='<td>加价幅度： ￥ '+data.obj.jprice+'元</td>';
		//0:单价报盘 1:总价报盘
		html+='<td>报盘方式：'+data.obj.offermethod+'</td>';

		html+='</tr>';
		html+='<tr>';
		html+='<td>保证金：￥ '+data.obj.margin+' 元</td>';
		html+='<td>延时周期：'+data.obj.delay+'分钟/次</td>';
		var projectstatus=data.obj.projectstatus;
		if(projectstatus=="2"){
			if(data.obj.keepmoney!=undefined&&data.obj.keepmoney!=null){
				html+='<td>保留价：'+data.obj.keepmoney+'元</td>';
			}else{
				html+='<td>保留价：无</td>';
			}

		}else{
			html+='<td>保留价：<span class="colororange">结束后可见</span></td>';
		}
		html+='</tr>';
		html+='<tr>';
		html+='<td>拍品所在单位： <span class="colororange">'+data.obj.company+'</span></td>';
		html+='<td>联系人：<span class="colororange">'+data.obj.contacter+'</span></td>';
		html+='<td>联系方式：<span class="colororange">'+data.obj.contacttel+'</span></td>';
		html+='</tr>';
		html+='</tbody></table>';
		$(".extra").append(html);


	//面包框
	$(".action").empty();
	var html='';

	var projectstatus=data.obj.projectstatus;
	var html='';
	if(projectstatus=="0"||projectstatus=="1"){
		if(data.obj.bidstatus=="0"){
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">报 名</span>';
		}else if(data.obj.bidstatus=="1"){
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">支付保证金</span>';
		}else if(data.obj.bidstatus=="2"){
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">提交资质</span>';
		}else if(data.obj.bidstatus=="3"){
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">重新提交资质</span>审核未通过';
		}else if(data.obj.bidstatus=="4"){
			if(projectstatus=="0"){
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled">等待出价</span>';
			}else{
				html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">出价</span>';
			}
		}else if(data.obj.bidstatus=="5"){
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius ">资质审核中</span>';
		}else if(data.obj.bidstatus=="7"){
			html='<span class="grayBtn layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled" >竞拍失败</span>';
		}else if(data.obj.bidstatus=="8"){
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">签订合同</span>';
		}else if(data.obj.bidstatus=="10"){
			html='<span class="grayBtn  layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled">竞拍完成</span>';
		}
	}else if(projectstatus=="2"){
		if(data.obj.bidstatus=="7"){
			html='<span class="grayBtn layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled" >竞拍失败</span>';
		}else if(data.obj.bidstatus=="8"){
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">签订合同</span>';
		}else if(data.obj.bidstatus=="10"){
			html='<span class="grayBtn  layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled">竞拍完成</span>';
		}else{
			html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled">等待中标结果公布</span>';
			setInterval(jieguo,1000);
		}
	}
	$(".action").append(html);
};
/**
 * 客户未报名逻辑
 * @returns
 */
function nosign(data){
	var projectstatus=data.obj.projectstatus;
	var html='';
	if(projectstatus=="0"){
		html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">报 名</span>';
	}else if(projectstatus=="1"){
		html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius">报 名</span>';
	}else if(projectstatus=="2"){
		html='<span class="bigRedBtn layui-btn layui-btn-danger layui-btn-radius layui-btn-disabled">已结束</span>';
	}
	$(".action").empty();
	$(".action").append(html);
};






/**
 * 面包框操作
 * @returns
 */
function clickinit(){
	$(".bigRedBtn").click(function(){
		var text=$(this).html();
		text = text.replace(/\s+/g,"");
		if(text=="报名"){
			toApply()
		}else if(text=="支付保证金"){
			$(this).html("支付中")
			setTimeout(function() {
				$(this).html("支付保证金");
			}, 10000);
			var param={};
			param["acutid"]=getParam();
			param["reqp"]=getParam()+"MAGINPAY";
			topay("/pai/paycommon/toPayBond.do",param);
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
			layer.msg("竞拍还未开始,请在开始后再来吧", {time: 5000, icon:6});
		}else if(text=="出价"){
			$(this).html("确认出价");
			 addbjinit()
		}else if(text=="签订合同"){
			window.location.href="/orderform/buyerorderformlist.html";
		}else if(text=="确认出价"){
			bidPrice();
		}
	});

};


//报名交保证金
function toApply(){
	var id=getParam();
	var reqdata={"acutid":id};
	if(isFeiyou){
		layer.confirm('1、竞卖方提供的餐厨废弃油脂，竞买方只能将其用作工业用途，不得将其进入食品领域，也不得将其进入饲料领域或法律法规所禁止的领域。否则，竞买方应独自承担由此引起的一切法律责任及后果。<br>2、竞买方在竞价过程中请合理出价，若因出价错误导致此次竞价无效，将按规则扣除竞买方保证金。', {
			title:"请您知晓：",
			btn: ['确认','取消'] //按钮
		}, function(){
			signAuction(reqdata);
		}, function(){
//			取消
		});

	}else{
		signAuction(reqdata);
	}


};


function signAuction(reqdata){
//	layer.msg("成功");
	pairequest("/pai/auction/sign/signAuction.do",reqdata).then(function(data){
	   if(data.success){
		   window.location.reload();
		   }else {
		   layer.msg(data.msg,{offset: 't',anim: 6});
		   var html="";
			if(data.errorcode==110005){
				layer.msg(data.msg,{offset: 't',anim: 6});
				setTimeout(function(){
					window.location.href="/user/login.html";
				}, 1000);
			}else if(data.errorcode==102000){
				authparams();
			}else if(data.errorcode=1011120){
				paiAlert(data.msg, "/orderform/zzklist.html?ca="+pushsParam(data.obj), "去查看我的资质");
			}

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
	};


function pushsParam	(istr){
	var str="";
	var base64 = new Base64();
	str = base64.encode(istr);
	return str;
}

var userinfo={};
function  authparams(){
	var reqdata={};
	pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
		if(data.success==true){
			var status=data.obj.status;
			 userinfo=data.obj.upistr;
			//0 1  3审核中  4 已通过 5 未通过
			 var html="";
				if(status==3||status==4||status==5){
				if(status!=5){
					if(status==3){
						paiAlert("未实名认证，暂无竞拍商品。","/auth/authinit.html","去实名认证");
					}else{
						//有权限
					}
				}else{
					paiAlert("实名认证未通过。","/auth/authinit.html","重新去实名认证");
				}
				}else{
					paiAlert("未实名认证，暂无竞拍商品。","/auth/authinit.html","去实名认证");
				}
		}else{
			window.location.href="/user/login.html";
		}

	});
};

/**
 * 遮罩
 * @param title
 * @param tourl
 * @returns
 */
function paiAlert(title,tourl,bt){return;
	layer.msg(title, {
        time:100000,
        shade: 0.8,
        anim: 2,
        btn: [bt]
   ,yes: function(){
 	  	window.location.href=tourl;
   	}
   });

	setTimeout(function(){
		window.location.href=tourl;
	}, 100000);
};


/**
 * 结果轮训
 * @returns
 */
function  jieguo(){
	var auctionid=getParam();
	if(auctionid==""){
		return ;
	}
	$.ajax({
		   type: "get",
		   url: "/pai/auction/getSignStatus.do",
		   data: {"auctionid":auctionid},
		   dataType:"json",
		   success: function(data){
			   if(data.success==true){
				   var text=$(".bigRedBtn").html();
					text = text.replace(/\s+/g,"");
				  if(data.obj=="8"&&text!="签订合同"){
					  window.location.href="/auction/sign.html?param="+auctionid;
				  }else if(data.obj=="10"&&text!="已完成"){
					  window.location.href="/auction/sign.html?param="+auctionid;
				  }
			   }
		   }
		});
}



//ajax轮询
function ink(){
	var auctionid=getParam();
	if(auctionid==""){
		return ;
	}
$.ajax({
	   type: "get",
	   url: "/pai/auction/getCurrentMoney.do",
	   data: {"auctionid":auctionid},
	   dataType:"json",
	   success: function(data){
		   if(data.success==true){
			  /* var reloadstatus=data.obj.reloadstatus;
			   if(reloadstatus==1){
				   window.location.reload;
			   }*/
			   var  alist=data.obj.alist;
			   var  time=data.obj.systime;
			   var starttime=data.obj.starttime;
			   var endtime=data.obj.endtime;
			   var aa=time-starttime;
			   var bb=endtime-time;
			   if((0<=(time-starttime)&&(time-starttime)<=1000)||(0<=(endtime-time)&&(endtime-time)<=1000)){
				   setTimeout(function() {
					   layer.load(3, {shade: [0.1,'#fff']});
					   window.location.href="/auction/sign.html?param="+auctionid;
					}, 10000);
			   }
			   $.each(alist,function(index,info){
				  var endtime=info.endtimeemp;
				  //竞价中
				  if(time>starttime&&endtime>time){
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

					  //当前价格
					  //加价 当前价
					  	if(info.nprice<="0.001"){
						  	var html='<span>当前价：<em class="curPricem" style="font-size: 16px;">竞拍开始前一天可见 </em></span> ';
						  }else{
							  var html='<span>当前价：<em class="curPricem"><i>￥</i>'+info.nprice+' </em> 元/吨</span> ';
						  }
					  $(".curPricem1").empty();
					$(".curPricem1").append(html);
					$(".con").html('距竞拍结束还剩：<span class="djs"><em>'+days+'</em>天<em>'+hours+'</em>时<em>'+minutes+'</em>分<em>'+seconds+'</em>秒</span>');

				  }
				  //即将开始
				  if(starttime>time){
					  var date3=starttime-time; //时间差的毫秒数
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

					  //当前价格
					  //加价 当前价
					  	if(info.nprice<="0.001"){
						  	var html='<span>当前价：<em class="curPricem" style="font-size: 16px;">竞拍开始前一天可见 </em></span> ';
						  }else{
							  var html='<span>当前价：<em class="curPricem"><i>￥</i>'+info.nprice+' </em> 元/吨</span> ';
						  }
					  $(".curPricem1").empty();
					$(".curPricem1").append(html);

					$(".con").html('距竞拍开始还剩：<span class="djs"><em>'+days+'</em>天<em>'+hours+'</em>时<em>'+minutes+'</em>分<em>'+seconds+'</em>秒</span>');
				  }


			  });
			   pushRecoud(data);
		   }else{

		   }
	   }
	});
};

/**
 *  竞拍记录
 * @param data
 * @returns
 */
function pushRecoud(data){
	//竞价记录逻辑
	 //竞价记录逻辑
	 var totalrec=data.obj;
	 if(totalrec.total==undefined||totalrec.total==0){
		 $(".num").empty();
		 var html='<em>'+0+'次</em>出价';
		 $(".num").append(html);
		 var  html='';
		  html+='<div class="item">';
		  html+='<span>暂无出价记录</span>';
		  html+='</div>';
	 }else{
	    $(".num").empty();
		 var html='<em>'+totalrec.total+'次</em>出价';
		 $(".num").append(html);
		 var  html='';
		 html+='<div class="item"><span style="margin-left: 5%;">竞拍号</span><span style="margin-left: 25%;">时间</span><span style="margin-left: 30%;">价格</span></div>';
		 $.each(totalrec.content,function(index,info){
			  html+='<div class="item">';
			  if(bidid==info.bidid){
				  html+='<span style="margin-left: 5%;color:#FF5722;">'+info.bidid+'</span>';
			  }else{
				  html+='<span style="margin-left: 5%;">'+info.bidid+'</span>';
			  }

			  html+='<span style="margin-left: 5%;">'+info.addtime+'</span>';
			  html+='<span class="price">￥'+info.price+'元</span>';
			  html+='</div>';
		 });
	 }
	 $(".list").empty();
	 $(".list").append(html);
}

/**
 * 提交报价
 * @returns
 */
function addbjinit(){
	 $(".jiagebfj").val($(".dprice").val());
	 $('.hdnr_oip').show();
}

function addPrice(){
	var jprice=$(".jprice").val();
	var cprice = $(".jiagebfj").val();//出价
	var price = $(".dprice").val();//当前价
	cprice = parseFloat(parseFloat(jprice) + parseFloat(cprice)).toFixed(2);

	$(".jiagebfj").val(cprice);
}

function subPrice(){
	var jprice=$(".jprice").val();
	var cprice =$(".jiagebfj").val()//出价
    var price = $(".dprice").val();//当前价
	//出价大于当前价
	if(parseFloat(cprice)==parseFloat(price)){
		cprice = price;
	}else {
		cprice = parseFloat(parseFloat(cprice) - parseFloat(jprice)).toFixed(2);
	}

	$(".jiagebfj").val(cprice);
}


//出价，保存记录
function bidPrice(){
	if(calculate()!=1){
		return ;
	}
	var jprice=$(".jprice").val();
	var bp = $(".jiagebfj").val();//出价
	var cp = $(".dprice").val();//当前价
    var diffvalue =parseFloat(bp) - (parseFloat(cp)+parseFloat(jprice)).toFixed(2);

	if(diffvalue >= 0){
		 /*if(cp<diffvalue){
		    	layer.msg("请理性出价",{offset: 't',anim: 6});
				return ;
		    }*/
		 editPrice();
	}else{
		layer.msg("出价应高于当前价和加价幅度之和",{offset: 't',anim: 6});
		return ;
	}
}

function editPrice(){
	var cp = $(".jiagebfj").val();
	var reqdata={acutid:getParam(),price:cp};
	pairequest("/pai/auction/bidPrice.do",reqdata).then(function(data){
		   if(data.success==true){
//			   window.location.reload();
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


function calculate(){
	var jprice=$(".jprice").val();
	var cprice =$(".jiagebfj").val()//出价
	 var price = $(".dprice").val();//当前价
	var czz=parseFloat(cprice)- parseFloat(price);
	if(czz<=0){
		$(".jiagebfj").val(price);
		layer.msg("出价必须大于当前价",{offset: 't',anim: 6});
		return 0;
	}


	if(parseFloat(parseFloat(parseFloat(czz)*10000000000).toFixed(2))%parseFloat(parseFloat(parseFloat(jprice)*10000000000).toFixed(2))!=0){
		layer.msg("出价幅度必须是：所出价格与当前价差额是当前加价幅度的整数倍！",{offset: 't',anim: 6});
		return 0;
	}
	return 1;
}

/*******出价相关 end***************/

function getauctionrecords(pageNum,pageSize){
	var auctionid=getParam();
	if(auctionid==""){
		return ;
	}
	$.ajax({
  		type: "get",
  		contentType: "application/x-www-form-urlencoded; charset=utf-8",
  		url : "/pai/auction/getAutionRecords.do",
  		data : {"pageNum":pageNum,"pageSize":pageSize,"acutid":auctionid},
  		async:false,
  		dataType:"json",
  		success :function(data){
  			if(data.success){
  				$("#records").empty();
				var html ="<table class='recode' border='' cellspacing='' cellpadding='' width='100%'>"
				+"<tbody>"
				+"<tr>"
				+"<th>竞拍号</th>"
				+"<th>出价</th>"
				+"<th>时间</th>"
				+"</tr>";

					if(data.obj && data.obj.content && data.obj.content.length>0){
	  					var records = data.obj.content;
	  						for(var i=0;i<records.length;i++){
	  							var record = records[i];
	  							var isme = "";
	  							var isfirst = "";
	  							if(record.isfirst==2){
	  								isfirst='<div class="chujiajilulist"><i class="chujiatype1"></i></div>';
	  							}else if(record.isfirst==1){
	  								isfirst='<div class="chujiajilulist"><i class="chujiatype2"></i></div>';
	  							}else if(record.isme==1){
		  							  isme='<div class="chujiajilulist"><i class="chujiatype3"></i></div>';
		  						 }else{
		  							  isme='<div class="chujiajilulist"><i class="chujiatype0"></i></div>';
		  						 }

	  							html+="<tr>"
	  		  					/*+"<td>"+isfirst+isme+"</td>"*/
	  								if(bidid==record.bidid){
	  									html+="<td style='color:#FF5722;'>"+record.bidid+"</td>"
	  								}else{
	  									html+="<td>"+record.bidid+"</td>"
	  								}
	  							html+="<td>"+record.price+"元</td>"
	  							html+="<td>"+record.addtime+"</td>"
	  							html+="</tr>"
	  						}
	  				}
					html+="</tbody>"
					+"</table>"
	  				$("#records").html(html);
  				}else{

  				}
  		},
  		error:function(){
  			layer.msg('请求失败',
					{
					icon: 2,
					time: 1500 //1秒关闭（如果不配置，默认是3秒）
					}, function(){
						//do something
				});
  		}
      });
}

function page(total,opts){
	$("#Pagination").pagination(total,opts);
}

function query(pageNum,jq){
	getauctionrecords(pageNum);
}
