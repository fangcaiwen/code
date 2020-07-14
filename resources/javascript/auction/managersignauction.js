$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	$(".memberCenterNav").load('/public/iframeleft.html');
	checkLogin();
});

var  username="";
// 检查登录状态
function checkLogin(){
	var userKey = getCookie("USERKEY");

	var reqdata={"userKey":userKey};
	pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
		var header = "";
		if(data.success==true){
			 authparams();
			username=data.obj.username;
		    $(".mc_titl a").click(function(){
				 var inds = $(this).index();
				$(this).addClass("checked");
				$(this).siblings("a").removeClass("checked");
				$(".mc_dis_none").hide();
				$(".mc_dis_none").eq(inds).show();
			});
		    initpager();
			getMyPublishAuction(0);
		}else{
			window.location.href="/user/login.html";
		}
		$(".header_newe").html(header);

	});
};
/*实名认证校验*/
function authparams(){
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
						paiAlert("实名认证审核中，暂无待审核竞拍商品。","/","随便逛逛");
					}else{
						//有权限
					}
				}else{
					paiAlert("实名认证未通过，暂无竞拍商品。","/auth/authinit.html","重新去实名认证");
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
		//window.location.href=tourl;
	}, 100000);
};
function showReason(a){
	if(a=='null' || a==null||a=='undefined'){
		return;
	}else {layer.open({
		  type: 1
		  ,title: false //不显示标题栏
		  ,closeBtn: false
		  ,area: '300px;'
		  ,shade: 0.8
		  ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
		  ,resize: false
		  ,btn: ['关闭']
		  ,btnAlign: 'c'
		  ,moveType: 1 //拖拽模式，0或者1
		  ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">'+a+'</div>'
		  ,success: function(layero){
		  	var btn = layero.find('.layui-layer-btn');
		  }
		});
	}
}
function modyfiy(a){
	location.href = "/pai/auction/modifyAuction.do?acutid="+a;
}

function getMyPublishAuction(pageNum){
	var status = "0";
	var s = $("#q_status").val();
	if(s!=null && s!=""){
		status = s;
	}
	var pageSize = 10;

	var reqdata={"pageNo":pageNum+1,"pageSize":pageSize,"status":status};
	pairequest("/pai/auction/getMySignList.do",reqdata).then(function(data){

		var result = "";
		if(data.content==null || data.content == ""){
			result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='http://www.ezaisheng.cn/resources/img/nomore.jpg'></a></center></div>";
			var paper = "<a href='javascript:;'>&lt;</a>" +
			"<span class='pager_number'><strong>0</strong>/"+
			"0</span><a href='javascript:;'>&gt;</a> ";
			$(".pager").html(paper);
			$(".ezspage").hide();
		}else{
			if(data.content != null){
				result += "<tr ><th width='20%'><span>批次号</span></th><th><span>采购竞价标题</span></th><th><span>供应商</span></th><th><span>开始时间</span></th><th><span>结束时间</span></th></th><th><span>保证金状态</span></th><th><span>保证金订单号</span></th><th><span>状态</span></th><th><span class='no_border'>操作</span></th></tr>";
		         $.each(data.content, function(index, value) {
		        	var flag="<td width='6%'><span>已结束</span></td>";
	            	if(checkSign(value.starttime)){
	            		flag="<td width='6%'><span>即将开始</span></td>";
	            	 }else if(!checkSign(value.starttime) && checkSign(value.endtime)){
	            		 flag="<td width='6%'><span style='color:red;'>进行中</span></td>";
	            	 }else if(!checkSign(value.endtime)){
	            		 if(value.status=='4'){
	            			 flag="<td width='6%'><span>竞拍成功</span></td>";
	            		 }else{
	            			 flag="<td width='6%'><span>竞拍失败</span></td>";
	            		 }

	            	 }
	            	var title=(value.autiontitle==undefined||value.autiontitle==null)?"--":value.autiontitle;
	            	var assetunit=(value.scompany==undefined||value.scompany==null)?"--":value.scompany;
	            	var starttime=(value.starttime==undefined||value.starttime==null)?"--":value.starttime.substring(0,16);
	            	var endtime=(value.endtime==undefined||value.endtime==null)?"--":value.endtime.substring(0,16);;
			          result += "<tr>";
			          result += "<td width='20%' name='winCG'  class='"+value.groupid+"' title='"+value.groupid+"'><span>"+value.groupid+"</span></td>";
			          result += "<td width='10%' class='tdtitle' title='"+value.autiontitle+"'><span>"+title.substring(0,6)+"</span></td>";
			          result += "<td width='10%' class='tdtitle' title='"+assetunit+"'><span>"+assetunit.substring(0,6)+"</span></td>";
			          result += "<td width='10%' class='tdtitle' title='"+starttime+"'><span>"+starttime.substring(5,16)+"</span></td>";
			          result += "<td width='10%' class='tdtitle'  title='"+endtime+"'><span>"+endtime.substring(5,16)+"</span></td>";
			          if(value.ispay==1){
			        	  result += "<td width='6%'><span>已支付</span></td>";
			          }else if(value.ispay==2){
			        	  result += "<td width='6%'><span>已退款</span></td>";
			          }else if(value.ispay==3){
			        	  result += "<td width='6%'><span>无需支付</span></td>";
			          }else{
			        	  result += "<td width='6%'><span>未支付</span></td>";
			          }
			          if(value.boundOrderNo==undefined||value.boundOrderNo==null){
			        	  result += "<td width='10%  class='tdtitle'  ><span>--</span></td>";
			          }else{
			        	  result += "<td width='10%  class='tdtitle'  title='"+value.boundOrderNo+"''><span>"+value.boundOrderNo+"</span></td>";
			          }

			          result += flag;
			          if(flag!="<td width='6%'><span>竞拍成功</span></td>"){
			        	  result += "<td width='10%'><button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius layui-btn-warm' onclick='joinAuction(&apos;"+value.autionid+"&apos;)'>进入竞价</button>";
			        	  if(status=='3'){
			        		  if(value.ispay==1){
			        			  result += "<button href='javascript:void(0)' style='margin-left:0px' class='layui-btn  layui-btn-xs  layui-btn-radius layui-btn-warm' onclick='manager(&apos;"+value.autionid+"&apos;)'>申请退还</button>";
			        		  }else if(value.ispay==2){
			        			  result += "<button href='javascript:void(0)' style='margin-left:0px' class='layui-btn  layui-btn-xs  layui-btn-radius layui-btn-warm' onclick='manager(&apos;"+value.autionid+"&apos;)'>未收到(申诉)</button>";
			        		  }else if(value.ispay==3){//无需支付
			        			  //do nothing
			        		  }else{//未支付
			        			  //do nothing
			        		  }
			        	  }
			        	  result+="</td>";
			          }else{
			        	  result += "<td width='10%'><button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius layui-btn-warm' onclick='joinAuction(&apos;"+value.autionid+"&apos;)'>进入竞价</button><a href='/orderform/buyerorderformlist.html?v=1'><button class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius'>去订单中心</button></a>";
			        	  if(status=='3'){
			        		  if(value.ispay==1){
			        			  result += "<button href='javascript:void(0)' style='margin-left:0px' class='layui-btn  layui-btn-xs  layui-btn-radius layui-btn-warm' onclick='manager(&apos;"+value.autionid+"&apos;)'>申请退还</button>";
			        		  }else if(value.ispay==2){
			        			  result += "<button href='javascript:void(0)' style='margin-left:0px' class='layui-btn  layui-btn-xs  layui-btn-radius layui-btn-warm' onclick='manager(&apos;"+value.autionid+"&apos;)'>未收到(申诉)</button>";
			        		  }else if(value.ispay==3){//无需支付
			        			  //do nothing
			        		  }else{//未支付
			        			  //do nothing
			        		  }
			        	  }
			        	  result+="</td>";
			          }
			          result += "</tr>";
			     });}
		}
		$("#dataTable").html(result);
		$(".tdtitle").mouseover(function(){
			layer.tips($(this).attr("title"), this, {
				  tips: [1, '#3595CC'],
				  time: 4000
				});
		})
		//颜色
		changeColor();
		//公告
		buyernotice();
	});
	};

/**
 * 公告
 * @returns
 */
function  buyernotice(){
	$(".auctionnotice").mouseover(function(){
		layer.tips('温馨提示:报名批次号相同的竞拍交一次保证金即可,颜色相同的即为同组竞拍。', '.auctionnotice', {
			  tips: [1, '#5FB878'],
			  time: 30000
			});
	});
	layer.tips('温馨提示:报名批次号相同的竞拍交一次保证金即可,颜色相同的即为同组竞拍。', '.auctionnotice', {
		  tips: [1, '#5FB878'],
		  time: 30000
		});
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
	var winid = $(this).attr("title");
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

	//检查报名时间是否小于当前时间
	function checkSign(ot){
		if(ot==null){
			return false;
		}
		var nowDate = new Date().getTime();
		var myDate = new Date(ot.replace(/-/g,"/").substring(0,19)).getTime();
		if(ot != 'undefined'){
			if(nowDate < myDate ){
				return true;
			}
		}
	}

	/**
	 * 分页初始化-发布的竞拍信息
	 * @returns
	 */
	function initpager(){
		var status = "0";
		var s = $("#q_status").val();
		if(s!=null && s!=""){
			status = s;
		}
		var pageSize = 10;

		var reqdata={"pageNo":1,"pageSize":pageSize,"status":status};
		pairequest("/pai/auction/getMySignList.do",reqdata).then(function(data){
			if(data.content != null){
				layui.use(['laypage', 'layer'], function(){
				  var laypage = layui.laypage
				  ,layer = layui.layer;
				  laypage.render({
					  elem: 'demo3',
					  count: data.total,
					  layout: ['count', 'prev', 'page', 'next', 'skip'],
					  jump: function(obj){
					  	getMyPublishAuction(obj.curr-1);
					  }
				  });
				});
			}

		});
	}

	/*该功能暂时屏蔽
	 * function selectAll(){
		var checkbox = $("#selectAll")[0];
		if(checkbox && checkbox.checked){
			var rows = $("input[name='rowname']");
			if(rows.length > 0){
				for(var i=0;i<rows.length;i++){
					rows[i].checked=true;
				}
			}
		}else{
			var rows = $("input[name='rowname']");
			if(rows.length > 0){
				for(var i=0;i<rows.length;i++){
					rows[i].checked=false;
				}
			}
		}
	}*/

	/*该功能暂时屏蔽
	 *function batchauction(){
		var rows = $("input[name='rowname']");
		if(rows.length < 0){
			layer.msg("请至少选择一条数据");
		}else{
			var exist = false;
			for(var i=0;i<rows.length;i++){
				if(rows[i].checked){
					exist=true;
					break;
				}
			}
			if(!exist){
				layer.msg("请至少选择一条数据");
			}else{
				batchAuction();
			}
		}
	}*/

	function query(pageNum,jq){
		getMyPublishAuction(pageNum);
	}
	function page(total,opts){
		$("#Pagination").pagination(total,opts);
	}
	function paymargin(id){
		top.location.href="/pai/auction/paySellerBond.do?id="+id;
	}
	function joinAuction(aucid){
		window.open("/auction/sign.html?param="+aucid,"_blank");
	}
	function batchAuction(){
		window.open("/auctionmanager/batchauction.html");
	}
	function putQueryStatus(status){
		$("#q_status").val(status);
	}
	function manager(aucid){

		var reqdata={"aucid":aucid};
		pairequest("/pai/auction/margin/refundMaginForBuyer.do",reqdata).then(function(data){
			if(data.success){
				if(data.msg){
					layer.msg(data.msg,{offset: 't',anim: 6})
				}else{
					layer.msg("请求已发送",{offset: 't',anim: 6})
				}
			}else{
				if(data.msg){
					layer.msg(data.msg,{offset: 't',anim: 6})
				}else{
					layer.msg("请求失败",{offset: 't',anim: 6});
				}
			}

		});
	}
