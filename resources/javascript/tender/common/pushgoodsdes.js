$(document).ready(function(){
    desadd(0);
    desaddmouseoverp(0);
});

function  desaddmouseoverp(index){
    $(".input[name='goods["+index+"].description']").mouseover(function(){
        $(".input[name='goods["+index+"].description']").mouseover(function(){
            var this_index=$(this);
            var index_goods=$(this_index).attr("id");
            if($(this).val()==""){
                return false;
            }
            layer.tips($(this).val(), '#description'+index_goods, {
                tips: [2, '#3595CC'],
                time: 2000
            });
        })
    })
};

function desadd(index){
    $("input[name='goods["+index+"].description']").click(function(){
        var description=$(this).val();
        if(undefined==description||""==description){
            description=$(this).attr("placeholder");
        }

        var html="";
        html+='<textarea id="demo" style="display: none;">'+description+'</textarea>';

        var layindex=0;
        var layedit=0;

        var  parama=layer.open({
            anim: 5,
            type: 1,
            title:  ['商品描述', 'font-size:18px;color:#006ad3;'],
            shade: 0.1,
            scrollbar :true,
            skin: '', //没有背景色
            shadeClose: false,
            area: ['820px', '250px'],
            content: html,
            btn: ['确定录入']
            ,yes: function(index1, layero){
                var description=layedit.getContent(layindex)
                if(description.length>200){
                    layer.msg("200个字符以内哦",{offset: 't',anim: 6});
                    return false;
                }
                $("input[name='goods["+index+"].description").val(description);
                layer.close(parama);
            }
        });
        layui.use('layedit', function(){
            layedit= layui.layedit;
            layindex =layedit.build('demo', {
                tool: ['strong' //加粗
                    ,'italic' //斜体
                    ,'underline' //下划线
                    ,'del' //删除线

                    ,'|' //分割线

                    ,'left' //左对齐
                    ,'center' //居中对齐
                    ,'right' //右对齐
                    ,'link' //超链接
                ]
            }); //建立编辑器
        });


    });
}