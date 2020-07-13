$(document).ready(function(){
	$(".comauth").click(function(){
		return;
		$(".authentication").empty();
		$(".authentication").load('/auth/atcom.html');
	});
	$(".invauth").click(function(){
		$(".authentication").empty();
		$(".authentication").load('/auth/atidv.html');
	});
	$(".persionauth").click(function(){
		$(".authentication").empty();
		$(".authentication").load('/auth/atpersion.html');
	});

	/*setTimeout(function() {
		$("input[name='company']").blur(function(){
			checkcompany();
		});
	}, 2000);*/
});

function checkcompany(){
	var val=$("input[name='company']").val();
	if(val!=""){
		 $.ajax({
			  type: "POST",
			  contentType: "application/x-www-form-urlencoded; charset=utf-8", 
			  url : "/pai/userPro/checkCompany.do",
			  data : {company:val},
			  async:false,
			  datatype:"json",
			  success :function(data){
				  data=eval('(' + data + ')'); 
				  if(data.status!="success"){
					  layer.msg(data.message,{offset: 't',anim: 6});
				  }
			  },
			  error:function(){
				  layer.msg("请求失败",{offset: 't',anim: 6});
			  }
		  });
	}
}