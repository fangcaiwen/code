
$(document).ready(function(){
	//热门推荐
	outhot();
	//首页推荐
	getIndexBanner("pcindexbanner");
});



//get index bannser
function getIndexBanner(type){
	var reqdata={};
	pairequest("/pai/c/"+type+".do",reqdata).then(function(data){
		var html='';
		if(data.success==true){
			//usebanner(data.obj.content)

            //usebanner('/newRes/s1.png,/source_asso/index.html;/newRes/s2.png,/source_asso/index.html')
            usebanner('/newRes/s1.png,#;/newRes/s2.png,#;/newRes/s3.png,#;/newRes/s4.png,#;/newRes/s5.png,#;/newRes/s6.png,#')
		}
	});
};

function  usebanner(data){
	var html="";
	$.each(data.split(";"),function(index,info){
		html+='<div>';
		html+='<a href="'+(info.split(",")[1])+'" target="_blank">';
		html+='<img src="'+info.split(",")[0]+'" style="height:369px">';
		html+='</a>';
		html+='</div>';
	});
	$(".indexbanner").empty();
	$(".indexbanner").append(html);

	layui.use('carousel', function(){
		  var carousel = layui.carousel;
		  //建造实例
		  carousel.render({
		     elem: '#test1'
		    ,anim:'fade'
		    ,indicator:'inside'
		    ,height:'370px'
		    ,width: 'auto' //设置容器宽度
		    ,arrow: 'none' //始终显示箭头
		    ,anim: 'default' //切换动画方式
		  });
		});
	setTimeout(function(){
		pushout();
	}, 1000);
}



function pushout(){
	$(".pushOutTopic").mouseover(function(){
		layer.tips('<img width:400px;  src="http://www.ezaisheng.cn/resources/img/banner/pushout.png?'+ Date.now()+'"/>', '.pushOutTopic', {
			  tips: [1, '#3595CC'],
			  time: 5000
			});
	})
};





//热门推荐
function outhot(){
	  var html="";
		html+='<a target="_blank" href="javascript:void(0)"><img src="http://www.qdxhanjc.com/upload/advert/94778e93-cde5-4b35-8109-73a198bb60d7.jpg"   style="';
		html+=' width: 90%;';
		html+=' height: 100%;margin-left: 5%;';
		html+='"></a>';
	$(".hotout").empty();
	$(".hotout").append(html);

}



//重要通知important_notice
function importantnotice(){
	setTimeout(function() {
		layer.tips('重要提示：订单自竞价成功之日起30日内若无任何对账交易，系统将自动按订单成交金额*0.6%收取交易服务费。详情请见<a href="/bank/monthfee.html?v=20191024" target="_blank">手续费中心</a>。', '.important_notice', {
			  tips: [1, '#FF5722'],
			  time: 30000
			});
	}, 2000);

	setTimeout(function() {
		layer.tips('重要提示：订单自竞价成功之日起30日内若无任何对账交易，系统将自动按订单成交金额*0.6%收取交易服务费。详情请见<a href="/bank/monthfee.html?v=20191024" target="_blank">手续费中心</a>。', '.toOpenMem', {
			  tips: [1, '#FF5722'],
			  time: 30000
			});
	}, 1000);
}

