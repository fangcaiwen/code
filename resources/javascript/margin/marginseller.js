$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	$(".memberCenterNav").load('/public/iframeleft.html');
	 authparams();
});

//检查登录状态
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
			var status=data.obj.status;
			 userinfo=data.obj.upistr;
			//0 1  3审核中  4 已通过 5 未通过
			 var html="";
				if(status==3||status==4||status==5){
				if(status!=5){
					if(status==3){
						paiAlert("实名认证审核中，暂无保证金记录。","/","随便逛逛");
					}else{
					}
				}else{
					paiAlert("实名认证未通过，暂无保证金记录。","/auth/authinit.html","重新去实名认证");
				}
				}else{
					paiAlert("未实名认证，暂无保证金记录。","/auth/authinit.html","去实名认证");
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
			      area: ['80%', '70%'],
			      content: '/auctionmanager/editauction.html?time='+new Date().getTime()
			    });
		}else{
			layer.msg(data.msg,{offset: 't',anim: 6});
		}

	});
}

function getMyPublishAuction(pageNum){

	var reqdata={"pageNo":pageNum+1};
	pairequest("/pai/auction/margin/sellermanager.do",reqdata).then(function(data){
		if(data.success==true){
			var data=data.obj;
			var result = "";
			if(data.total==null || data.total == ""){
				result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
				var paper = "<a href='javascript:;'>&lt;</a>" +
				"<span class='pager_number'><strong>0</strong>/"+
				"0</span><a href='javascript:;'>&gt;</a> ";
				$(".pager").html(paper);
				$(".ezspage").hide();
			}else{
				if(data.total != null){
					totalpage=data.total;
					result += "<tr>" +
							"<th width='15%' class='layui-unselect'><span>保证金订单号</span></th>" +
							"<th width='10%'><span>竞价项目名称</span></th>" +
							"<th width='10%'><span>保证金</span></th>" +
							"<th width='6%'><span>支付渠道</span></th>" +
							"<th width='12%'><span>支付保证金时间</span></th>" +
							"<th width='12%'><span>退还保证金时间</span></th>" +
							"<th width='10%'><span>状态</span></th>" +
							"<th width='10%'><span class='no_border'>操作</span></th>" +
							"</tr>";
			         $.each(data.list, function(index, value) {
			        	var orderno= (value.orderno==undefined||value.orderno==null)?"--":value.orderno;
			        	var tname= (value.tname==undefined||value.tname==null)?"--":value.tname;
			        	var phone= (value.phone==undefined||value.phone==null)?"--":value.phone;
			        	var company= (value.company==undefined||value.company==null)?"--":value.company;
			        	var margin= (value.margin==undefined||value.margin==null)?"--":value.margin;
			        	var payMethod="微众";
			        	var paytime= (value.paytime==undefined||value.paytime==null)?"--":value.paytime;
			        	var refundtime= (value.refundtime==undefined||value.refundtime==null)?"--":value.refundtime;
			        	var status=(value.status==undefined||value.status==null)?"--":(value.status==1?"未退款":"已退款");
			        	var todo=(value.status==undefined||value.status==null)?"--":(value.status==1?
			        			"<td width='10%'><button href='javascript:void(0)' class='layui-btn layui-btn-warm layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.aucid+"&apos;)'>申请退还</button></td>"
			        			:
		        				"<td width='10%'><button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.aucid+"&apos;)'>未收到(申诉)</button></td>"
		        				);

			        	result += "<tr>";
				        result += "<td width='15%' class='tdtitle' title='"+orderno+"'><span>"+orderno+"</span></td>";
				        result += "<td width='10%'><span class='tdtitle' title='"+tname+"'>"+tname.substr(0,5)+"</span></td>";
				        result += "<td width='10%'><span>"+margin+"元</span></td>";
				        result += "<td width='10%'><span>"+payMethod+"</span></td>";
				        result += "<td width='10%' class='tdtitle' title='"+paytime+"'>"+paytime.substr(0,10)+"</td>";
				        result += "<td width='10%' class='tdtitle' title='"+refundtime+"'>"+refundtime.substr(0,10)+"</td>";
				        result += "<td width='10%'>"+status+"</td>";
				        result += todo;
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
		}else{
			layer.msg(res.msg(),{offset: 't',anim: 6});
		}

	});
};

	/**
	 * 分页初始化
	 * @returns
	 */
	function initpager(){
		var pageSize = 8;

		var reqdata={"pageNo":1};
		pairequest("/pai/auction/margin/sellermanager.do",reqdata).then(function(data){
			if(data.obj.total != null){
				layui.use(['laypage', 'layer'], function(){
				  var laypage = layui.laypage
				  ,layer = layui.layer;
						laypage.render({
						    elem: 'demo3'
						    ,count: data.obj.total
						    ,limit:8
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
		top.location.href="/pai/auction/paySellerBond.do?id="+id;
	}


	function manager(aucid){
		$.ajax({
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			url : "/pai/auction/margin/refundMaginForSeller.do",
			data : {"aucid":aucid},
			dataType:"json",
			async:false,
			type: "get",
			success : function(data) {
				layer.msg(data.msg,{offset: 't',anim: 6})
			},
			error : function(data){
				layer.msg("请求失败",{offset: 't',anim: 6})
			}
		});
	}


