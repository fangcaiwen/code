$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	$(".memberCenterNav").load('/public/iframeleft.html');
	 authparams();
});

// 检查登录状态
function checkLogin(){

	var userKey = getCookie("USERKEY");

	var reqdata={
			"userKey":userKey
			};
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
		window.location.href=tourl;
	}, 100000);
};


$(document).ready(function(e) {
    $(".mc_titl a").click(function(){
		 var inds = $(this).index();
		$(this).addClass("checked");
		$(this).siblings("a").removeClass("checked");
		$(".mc_dis_none").hide();
		$(".mc_dis_none").eq(inds).show();
	});
    initpager();
	getMyPublishAuction(0);

});
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
/**
 * 修改操作
 * @param a
 * @returns
 */
function modyfiy(a){

	var reqdata={"acutid":a};
	pairequest("/pai/auction/editauction.do",reqdata).then(function(data){
		if(data.success==true){
			layer.open({
			      type: 2,
			      title: data.obj,
			      shade: false,
			      shadeClose: true, //开启遮罩关闭
			      maxmin: true, //开启最大化最小化按钮
			      area: ['80%', '80%'],
			      content: '/auctionmanager/editauction.html?time='+new Date().getTime()
			    });
		}else{
			layer.msg(data.msg,{offset: 't',anim: 6});
		}

	});
}

function getMyPublishAuction(pageNum){
		var pageSize = 10;

		var reqdata={"pageNo":pageNum+1,"pageSize":pageSize};
		pairequest("/pai/auction/sellermanager/getListNoPayAuction.do",reqdata).then(function(data){

			var result = "";
			if(data.content==null || data.content == ""){
				result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
				var paper = "<a href='javascript:;'>&lt;</a>" +
				"<span class='pager_number'><strong>0</strong>/"+
				"0</span><a href='javascript:;'>&gt;</a> ";
				$(".pager").html(paper);
				$(".ezspage").hide();
			}else{
				if(data.content != null){
					totalpage=data.total;
					result += "<tr><th width='15%' class='layui-unselect'><span>项目</span></th><th width='20%'><span>竞拍开始时间</span></th><th width='20%'><span>竞拍截止时间</span></th><th width='15%'><span>保证金/元</span></th><th width='15%'><span>项目状态</span></th><th width='15%'><span>保证金状态</span></th><th width='15%'><span class='no_border'>操作</span></th></tr>";
			         $.each(data.content, function(index, value) {
			         	var f = "待审核";
			         	var f1 = "----";
			         	var f2 = "待支付";


			         	if(value.status == "2" || value.status =="0"){
			         		if(value.status == "0"){
			         			f="待审核";
			         		}else {
				         		f = "审核未通过";
			         		}
			         		f1 = "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='showReason(&apos;"+value.disagreeinfo+"&apos;)'>查看原因</button>|<span id='idtag"+index+"' style='display:none'>"+value.id+"</span> <button href='javascript:void(0)' class='layui-btn layui-btn-xs layui-btn-radius layui-btn-warm' onclick='modyfiy(&apos;"+value.id+"&apos;)'>修改</button>";
			         		if(value.ispay == "0"){
				         	}else if(value.ispay == "3"){
				         		f2 = "无保证金";
				         	}else if(value.ispay == "1"){
				         		f2 ="已支付";
				         	}else{
				         		f2 = "已退款";
				         	}
			         	}else if(value.status == "1" || value.status == "3" || value.status == "4"){
			         		f ="审核通过";
			         		if(value.ispay == "0"){
				         		f1 ="<button href='javascript:void(0)' class='layui-btn layui-btn-xs  layui-btn-radius layui-btn-danger' onclick='paymargin(&apos;"+value.id+"&apos;)'>支付保证金</button>";
				         	}else if(value.ispay == "3"){
				         		f2 = "无保证金";
				         	}else if(value.ispay == "1"){
				         		f2 ="已支付";
				         	}else{
				         		f2 = "已退款";
				         	}
			         	}

				        result += "<tr>";
				        result += "<td width='15%' class='tdtitle' title='"+value.title+"'><span>"+value.title.substring(0,8)+"</span></td>";
				        result += "<td width='20%'><span>"+value.starttime.substr(0,16)+"</span></td>";
				        result += "<td width='20%'><span>"+value.endtime.substr(0,16)+"</span></td>";
				        result += "<td width='15%'><span>"+value.margin+"元</span></td>";
				        result += "<td width='15%'><span>"+f+"</span></td>";
				        result += "<td width='15%'><span>"+f2+"</span></td>";
				        result += "<td width='15%'>"+f1+"</td>";
				        result += "</tr>";
				     });
		         }
			}
			$("#dataTable").html(result);

			$(".tdtitle").mouseover(function(){
				layer.tips($(this).attr("title"), this, {
					  tips: [1, '#3595CC'],
					  time: 4000
					});
			})
		});
	};

	/**
	 * 分页初始化
	 * @returns
	 */
	function initpager(){
		var pageSize = 10;

		var reqdata={"pageNo":1,"pageSize":pageSize};
		pairequest("/pai/auction/sellermanager/getListNoPayAuction.do",reqdata).then(function(data){
			if(data.content != null){
				layui.use(['laypage', 'layer'], function(){
				  var laypage = layui.laypage
				  ,layer = layui.layer;
						laypage.render({
						    elem: 'demo3'
						    ,count: data.total
						    ,layout: ['count', 'prev', 'page', 'next', 'skip']
						    ,jump: function(obj){
						    	getMyPublishAuction(obj.curr-1);
						    }
						  });
			 });
			}

		});
	}

	function query(pageNum,jq){
		getMyPublishAuction(pageNum);
	}
	function page(total,opts){
		$("#Pagination").pagination(total,opts);
	}
	function paymargin(id){
		var param={};
		param["id"]=id;
		param["reqp"]=id+"SELLMAGINPAY";
		topay("/pai/paycommon/paySellerBond.do",param);
	}





