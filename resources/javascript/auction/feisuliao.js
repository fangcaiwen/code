var feisuliaoTemplate = "<div class='des_container'>"+
"			<div class='title'>"+
"				关于@company@goodsName销售的竞价公告"+
"			</div>"+
"			<div class='info'>"+
"				我司将持续供应的@goodsName在“青岛西海岸建材交易中心”（www.qdxhanjc.com)进行公开竞价销售，兹邀广大客户前来竞价，我司将以公开、公平、公正为原则进行竞价，烦请各位客户认真阅读《竞价公告》。"+
"			</div>"+
"			<div class='time_addr'>"+
"				<div class='time'>"+
"					@auctionStartTime起-@auctionEndTime止（延时除外）  "+
"				</div>"+
"				<div class='addr'>"+
"					@goodsAddress"+
"				</div>"+
"			</div>"+
"			<div class='block_title'>竞买须知</div>"+
"			<div class='option_title'>关于看货验质</div>"+
"			<div class='option_list'>"+
"				提倡到我公司现场看货验质，未看货即参与竞价者视为认可货物质量，对报价负责；看货验质时间：@lookstarttime-@lookendtime"+
"			</div>"+
"			<div class='option_title'>货品质量约定</div>"+
"			<div class='option_list'>"+
"				由于竞卖方所售货物<span class='orange'>@goodsName</span>属于废旧物资，没有材质单、质量保证书、使用说明书等相关资料文件，竞卖方对所售货物不给予任何质量方面的担保或保证。"+
"			</div>"+
"			<div class='option_title'>货品去向约定</div>"+
"			<div class='option_list'>"+
"				对于竞卖方提供的<span class='orange'>@goodsName</span>，买方不得将其进入法律法规所禁止的领域。竞买方在使用、销售或以其他方式处置货物过程中，产生的质量、安全、环保等问题，竞卖方不承担任何责任，由此产生一切的责任及后果由竞买方承担。"+
"			</div>"+
"			<div class='option_title'>竞价要求</div>"+
"			<div class='option_list'>"+
"				<ul>"+
"					<li>竞买方参与竞价的资质要求：（包括但不限于）：营业执照三证合一复印件（营业执照为进口的需要提供进出口资质）、开票资料、竞价保证书、资质证书及环评批复等；若竞标人不是法人代表，还需提供《授权委托书》（加盖公章）原件。"+
"					</li>"+
"					<li>参与竞价的竞买方与本公司无不良合作记录。</li>"+
"					<li>参加本次竞价的竞买方务必开通支付帐户（微众），且全程需通过青岛西海岸建材建议中心旗下竞价平台“青岛西海岸建材交易中心”（www.qdxhanjc.com）进行线上交易，如有帐户注册、开通支付（微众）、交易支付等问题请及时拨打青岛西海岸建材建议中心客服电话：400-8888-888进行咨询。"+
"					</li>"+
"					<li>竞价资料获取：请电话联系我公司联系人索取。</li>"+
"					<li>计价公式"+
"						<div class='option_table'>"+
"							<table>"+
"								<tr>"+
"									<th width='10%'>序号</th>"+
"									<th width='30%'>物资种类</th>"+
"									<th width='30%'>描述</th>"+
"									<th width='30%'>计价公式</th>"+
"								</tr>"+
"								<tr>"+
"									<td>1</td>"+
"									<td>@goodsCate</td>"+
"									<td>@goodsdes</td>"+
"									<td>@formula</td>"+
"								</tr>"+
"							</table>"+
"						</div>"+
//"						铜价参考：上海有色网-1#SMM电解铜均价 https://www.smm.cn/； <br />"+
//"						铝价参考：zz91网-台州破碎生铝均价http://jiage.zz91.com/detail/707208.html； <br />"+
//"						铁价参考：我的钢铁网-华东张家港普碳废钢统料平均价格 http://feigang.mysteel.com/；"+
"					</li>"+
"					<li> 合同起止期限：<span class='orange'>@pactStartTime--@pactEndTime</span></li>"+
"				</ul>"+
"			</div>"+
"			<div class='block_title'>竞价参与方式及流程</div>"+
"			<div class='option_list'>"+
"				<ul>"+
"					<li>参加竞价仅限公司行为，个人行为的竞价不计入有效竞价；参加竞价必须能够支持青岛西海岸建材建议中心线上交易（包括保证金）。</li>"+
"					<li>此次竞价为网上竞价，所有相关资料及保证金需按照青岛西海岸建材建议中心旗下竞价平台“青岛西海岸建材交易中心”（www.qdxhanjc.com）中竞价的流程进行操作。</li>"+
"					<li>以下简述此次线上竞价的主要流程：</li>"+
"				</ul>"+
"			</div>"+
"			<div class='step'>"+
"				<div class='step_order'>"+
"					<i>第一步</i>"+
"					打开“青岛西海岸建材交易中心”网站（www.qdxhanjc.com)  > 点击导航栏目“正在竞拍或即将开始”> 通过货品分类或直接点击货品图片查看竞价货品详情："+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第二步</i>"+
"					报名并缴纳保证金，进入竞价货品详细介绍页面后点击“报名”按钮完成报名，然后通过线上支付竞价保证金人民币@goodBonds元。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第三步</i>"+
"					提交资质：根据页面提示提交参与竞价需要的资质。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第四步</i>"+
"					资质审核后，需要客户现场看货后进行点击“确认看货”。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第五步</i>"+
"					竞价开始后竞买方可按照系统提示进行报价及加价，在竞价结束前，客户可以多次报价。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第六步</i>"+
"					@auctionStartTime--@auctionEndTime（延时除外） ，竞价准时结束。竞价资料须在竞价结束前完成操作，逾期者取消竞标资格。"+
"				</div>"+
"			</div>"+
"			<div class='block_title'>其他注意事项</div>"+
"			<div class='warning'>"+
"				<div class='warning_option'>"+
"					<i>1.</i>竞买方通过青岛西海岸建材建议中心旗下竞价平台“青岛西海岸建材交易中心”缴纳的竞价保证金不得抵扣货款。竞价失败客户缴纳的保证金将在【3】个工作日内足额无息原路退还。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>2.</i>竞价遵循价高者得原则，竞价设有起拍价及保留价，竞价参与客户满足2家及以上，且报价超过保留价，则此次竞价成功；竞买方报价低于保留价或者报价客户少于2家，则竞价失败。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>3.</i>在竞价结束前 2 分钟内，如果有客户出价竞拍，则本次拍卖结束时间顺延2分钟，在顺延的2分钟内如有客户再次出价，则继续延时【2】分钟，如此循环，直至再无客户出价为止。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>4.</i>竞价成功客户在我公司通知竞价成功后，须【3】日内与我公司签订销售合同。因竞价成功客户原因，【3】日内未能签订合同的，视为竞价成功客户自动放弃资格，我公司将扣除全部竞价保证金，并有权组织重新竞价。履约及付款事宜须按双方签订的销售合同执行。"+
"				</div>"+
"			</div>"+
"		</div>";
