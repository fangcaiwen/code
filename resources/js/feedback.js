
function addFeedback(){
	var title = $("#fbTitle").val();

	var content = editor.html();

	var tel = $("#fbTel").val();
	
	if(title ==null || title ==""){
		layer.msg("请填写标题",{offset: 't',anim: 6});
		return ;
	}
	
	if(content == null || content ==""){
		layer.msg("请填写内容",{offset: 't',anim: 6});
		return;
	}
	
	if(tel ==null || tel ==""){
		layer.msg("请填写联系方式",{offset: 't',anim: 6});
		return ;
	}
	
	var phonereg= /^1\d{10}$/;
	if(!phonereg.test(tel)){
		layer.msg("请填写正确的电话号码",{offset: 't',anim: 6});
		return;
	}
   
	layer.msg("提交成功",{offset: 't',anim: 6});
	
}

