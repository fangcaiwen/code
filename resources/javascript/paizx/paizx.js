$(document).ready(function(){
	$("#header_all").load('/public/public_header.html');
	$("#footer_all").load('/public/public_footer.html');
	 toc()
});

function getsParam(type){
	　　var reg = new RegExp("(^|&)"+ type +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null){
		return unescape(r[2]);
	　　}else{
		 return "";
	　　}
	};

function toc(){
	var type =getsParam("s");
	if(type==null||type==""){
		var html='';
		html+='<div style="margin: 100px auto 100px;text-align: center"> ';
		html+=' <div style="text-align: left;font-size: 24px; color: #1f6fa7;margin: 30px auto;width: 340px">此链接已经过期';
		html+='</div>   ';
		html+='<div style="text-align: left;margin: 30px auto;width: 340px;font-size: 14px;">       <strong> </strong>  ';
		html+='</div>   ';
		html+='<div style="margin: 30px 10px;">   ';
		html+='<span style="font-size: 24px;color: #373737;margin-right: 30px;">';
		html+='<strong style="color: #1f6fa7;font-size: 40px;font-weight: normal;padding: 0 8px;" id="doUpdate">5</strong>秒钟后自动跳转';
		html+=' </span>      ';
		html+='<a href="http://www.qdxhanjc.com"  style="display: inline-block;background:transparent url(http://www.ezaisheng.cn/cmj/image/404_2.png) center center no-repeat; height:46px;width:159px;text-align:center;line-height:46px;font-size: 24px;color: #1f6fa7;text-decoration:none">返回首页</a>  ';
		html+=' </div>    ';
		html+='</div>';
		$(".w1200").empty();
		$(".w1200").append(html);
		timeover();
	}else{
		c(type);
	}
}



function c(type){
	var reqdata={};
	pairequest("/pai/c/"+type+".do",reqdata).then(function(data){
		var html='';
		if(data.success==true){
			$(".w1200").empty();
			$(".w1200").append(data.obj.content);
			$(".active").toggleClass("active");
	    	$("."+type).addClass("active");
	    	serachto("/zzjp.html");
		}else{
			var html='';
			html+='<div style="margin: 100px auto 100px;text-align: center"> ';
			html+=' <div style="text-align: left;font-size: 24px; color: #1f6fa7;margin: 30px auto;width: 340px">此链接已经过期';
			html+='</div>   ';
			html+='<div style="text-align: left;margin: 30px auto;width: 340px;font-size: 14px;">       <strong>可能因为：已添加过保留价或竞价项目已经结束   </strong>  ';
			html+='</div>   ';
			html+='<div style="margin: 30px 10px;">   ';
			html+='<span style="font-size: 24px;color: #373737;margin-right: 30px;">';
			html+='<strong style="color: #1f6fa7;font-size: 40px;font-weight: normal;padding: 0 8px;" id="doUpdate">5</strong>秒钟后自动跳转';
			html+=' </span>      ';
			html+='<a href="http://www.qdxhanjc.com"  style="display: inline-block;background:transparent url(http://www.ezaisheng.cn/cmj/image/404_2.png) center center no-repeat; height:46px;width:159px;text-align:center;line-height:46px;font-size: 24px;color: #1f6fa7;text-decoration:none">返回首页</a>  ';
			html+=' </div>    ';
			html+='</div>';
			$(".w1200").empty();
			$(".w1200").append(html);
			timeover();
		}
	});
};


var secs =5; //倒计时的秒数
var URL ;
function timeover(){

	$(function(){
		Load('/');
	})
}

function Load(url){
    URL =url;
    for(var i=secs;i>=0;i--)
    {
        window.setTimeout('doUpdate(' + i + ')', (secs-i) * 1000);
    }
}

function doUpdate(num)
{
    document.getElementById("doUpdate").innerHTML = num;
    if(num == 0) { window.location=URL;  }
}



function getsParam(type){
	　　var reg = new RegExp("(^|&)"+ type +"=([^&]*)(&|$)");
	　　var r = window.location.search.substr(1).match(reg);
	　　if(r!=null){
		return unescape(r[2]);
	　　}else{
		 return "";
	　　}
	}

function serachto(url){

	var company=getsParam("c");
	var key=getsParam("t");
	if(company!=""){
		$("#produce").removeClass("yzs-head-search-item-sel");
		$("#company").addClass("yzs-head-search-item-sel");
		$("input[name='keyword']").val(company);
	}
	if(key!=""){
		$("#company").removeClass("yzs-head-search-item-sel");
		$("#produce	").addClass("yzs-head-search-item-sel");
		$("input[name='keyword']").val(key);
	}

	$("#btn-search").click(function(){
		var type=$(".yzs-head-search-item-sel").attr("id");
		var str="";
		if($("input[name='keyword']").val()!=""){
			var base64 = new Base64();
			str = base64.encode($("input[name='keyword']").val());
		}
		if(type=="company"){
			window.location.href=url+(str!=""?("?c="+str):"");
		}else{
			window.location.href=url+(str!=""?("?t="+str):"");
		}
	});
};














