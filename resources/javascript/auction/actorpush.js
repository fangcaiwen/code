$(document).ready(function(){
	autorbingo();
	afterclick();
	guanbo();
})

function autorbingo(){
	var aucid = getParam();
	$.ajax({
		url:"/pai/actor/push/bingo.do",
		type:"get",
		data:{
			"aucid":aucid
		},
		dataType:"json",
		success:function(data){
			if(data.success==true){
				$(".smallMess").show();
				var info=data.obj;
				var html = "";
				html+='<div class="popbg nobg"><div id="wrap">';
				html+='<div id="mess_wrap" class="closed closedGai" style="display: none;cursor: pointer;">';
				html+='<div class="con1">';
				html+='<p>'+info.company+'：</p>';
				html+='<p style=" text-indent: 2em;">贵公司通过青岛西海岸建材交易中心网站报名的'+info.autiontname+'已于'+info.endtime+'竞价成功。</p>';
				html+='<div class="result">';
				html+='<span>竞得价格 ：</span><i>'+info.nprice+'元/'+info.unit+'</i><br>';
				html+='<span>竞得数量 ：</span><i>'+info.amount+''+info.unit+'</i><br>';
				html+='</div>';
				html+='<p>请贵公司收到竞价成功通知书后尽快登录青岛西海岸建材交易中心网站完成竞价交易后续流程（包括：签订合同、支付货款等）。</p>';
				html+='<a href="javascript:;" class="close" style="display: none;"></a>';
				html+='</div>';
				html+='<div class="gai heGai"></div>';
				html+='<div class="slogo" style="display: block;"></div>';
				html+='</div>';
				html+='<div class="mess" style="display: block; width: 0px; left: 266px;"><img src="/resources/img/actorbingo/mess.png" width="100%"></div>';
				html+='</div></div>';
				$(".autorbingo").empty();
				$(".autorbingo").append(html);

				setTimeout(function(){
					$('.smallMess').fadeOut();
					$('#mess_wrap .gai').addClass('heGaiOpacity');
					$('.popbg').removeClass('nobg');
					$(".mess").hide()
					setTimeout(function() {
						$('#mess_wrap').show();
					}, 1000)
					setTimeout(function() {
						$('#mess_wrap .slogo').hide();
					}, 1600)
					setTimeout(function() {
						$('#mess_wrap .gai').removeClass('heGai').addClass('heGaii');
					}, 2500)
					setTimeout(function() {
						$('#mess_wrap').removeClass('closedGai');
					}, 3000)
					setTimeout(function() {
						$('#mess_wrap').removeClass('closed');
						$('.close').fadeIn();
					}, 3500)
				}, 1000);

				clickclose();

			}

		}
	});
}


function afterclick(){
	$('.smallMess').click(function() {
		autorbingo()
	})
}


function clickclose(){
	$('.close').click(function() {
		$('.close').fadeOut();
		$('#mess_wrap .gai').removeClass('heGaii heGaiOpacity')

		$('#mess_wrap').addClass('closed');
		setTimeout(function() {
			$('#mess_wrap').addClass('closedGai');
		}, 1000)
		setTimeout(function() {
			$('#mess_wrap .gai').addClass('heGai');
		}, 1600)
		setTimeout(function() {
			$('#mess_wrap .slogo').show();
		}, 2500)
		setTimeout(function() {
			$('#mess_wrap').hide();
			$('.popbg').addClass('nobg');

			$(".mess").show().animate({
				width: "0px",
				left: '266px'
			});

		}, 2700)

		setTimeout(function() {
			$('.smallMess').fadeIn();
		}, 3000)

		setTimeout(function() {
			$(".autorbingo").empty();
		}, 4000)

	})
}


//小易广播
function guanbo(){
	$.ajax({
		url:"/pai/c/signbb.do",
		type:"get",
		data:{
		},
		dataType:"json",
		success:function(data){
			var html="";
			if(data.success==true){
				html+='<span class=""><i style="font-size: 20px;" class="layui-icon layui-icon-speaker"></i> 小易温馨提示:'+data.obj.content+'</span>';
				$(".xygb").empty();
				$(".xygb").append(html);
				$(".xygb").show();
			}

		}
	});

	}
