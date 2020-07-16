var feigangTemplate = "<div class='des_container'>"+
"			<div class='title'>"+
"				关于青岛西海岸企业竞价销售的公告"+
"			</div>"+
"			<div class='info'>"+
"				我司将持续供应的@goodsName在“青岛西海岸建材交易中心”（www.qdxhanjc.com)进行公开竞价销售，兹邀广大客户前来竞价，我司将以公开、公平、公正为原则进行竞价，烦请各位客户认真阅读《竞价公告》。"+
"			</div>"+
"			<div class='time_addr'>"+
"				<div class='time'>"+
"					@auctionStartTime起-@auctionEndTime止（延时除外）  "+
"				</div>"+
"				<div class='addr'>"+
"					青岛市西海岸新区"+
"				</div>"+
"			</div>"+
"			<div class='block_title'>本次竞价物资、竞价说明</div>"+
"			<div class='option_title'>竞价物资</div>"+
"			<div class='option_table'>"+
"				<table>"+
"					<tr>"+
"						<th width='5%'>序号</th>"+
"						<th width='5%'>大类</th>"+
"						<th width='10%'>标的物名称</th>"+
"						<th width='12%'>标的物规格</th>"+
"						<th width='10%'>数量（单位）</th>"+
"						<th width='13%'>合同期限</th>"+
"						<th width='15%'>货款支付形式</th>"+
"						<th width='30%'>备注</th>"+
"					</tr>"+
"					<tr>"+
"						<td>1</td>"+
"						<td>废钢</td>"+
"						<td>@goodsName</td>"+
"						<td>@goodsdes</td>"+
"						<td>@goodsamount(@goodsunit)</td>"+
"						<td><font style='color:red'><b>@pactStartTime<br>@pactEndTime</b></font></td>"+
"						<td>按出货量、及合同金额，预付货款；</td>"+
"						<td style='padding: 0;'>"+
"							<table border='' cellspacing='' cellpadding=''>"+
"								<tr>"+
"									<td>报价为含税价；</td>"+
"								</tr>"+
"								<tr>"+
"									<td>重量为合同期内预计重量，以实际出货量为准 ；</td>"+
"								</tr>"+
"								<tr>"+
"									<td>销售定价：参考相关网站</td>"+
"								</tr>"+
"								<tr>"+
"									<td>实际发生货物交付后，每月15日进行调价，调价日铁均价为每月10-15日参考铁价平均价格;</td>"+
"								</tr>"+
"								<tr>"+
"									<td>本次竞价销售标的物组成：报废机动车（3吨以下小型汽车）、报废机动车（3吨及以上大型汽车）两品类按一定比例组成；标的物由项目公司在合同期限内分批次交付给买方。</td>"+
"								</tr>"+
"								<tr>"+
"									<td><font style='color:red'><b>买方中标后，进场前需预付货款不低于30万元。</b></font></td>"+
"								</tr>"+
"							</table>"+
"						</td>"+
"					</tr>"+
"				</table>"+
"			</div>"+
"			<div class='option_title'>竞价说明</div>"+
"			<div class='option_list'>"+
"				<ul>"+
"					<li><font style='color:red'><b>竞价期间出价以3吨及以上大型汽车最终价格为准。</b></font></li>"+
"					<li><font style='color:red'><b>报废机动车废钢（3吨以下小型汽车）销售定价=报废机动车废钢（3吨及以上大型汽车）*0.9</b></font></li>"+
"					<li><font style='color:red'><b>摩托车销售定价=报废机动车（3吨以下小型汽车）*1.53</b></font></li>"+
"				</ul>"+
"			</div>"+
"			<div class='option_title'>关于看货验质：提倡到我公司现场看货验质，未看货即参与竞价者视为认可货物质量，对报价负责。</div>"+
"			<div class='option_list'>"+
"				<ul>"+
"					<li>看货验质时间：@lookstarttime-@lookendtime</li>"+
"					<li>质量约定：买方确认在报价前，对所购买商品的品质、外观已经了解；知晓卖方所售货物属于废旧物资，没有材质单、质量保证书、使用说明书等相关资料文件；卖方对"+
"						所售货物不给予任何质量方面的担保或保证；买方在使用、销售或以其他方式处置过程中，产生的质量、安全等问题；卖方不承担任何责任，由此产生一切的责任及后果 由买方承担。</li>"+
"					<li>标的物交付以实际车型为准，最终解释权归项目公司。</li>"+
"					<li>车辆电瓶，三元催化，废油废液等属于危险废弃物的，由项目公司负责回收，不包含在竞价范围内。</li>"+
"				</ul>"+
"			</div>"+
"			<div class='option_title'>拆解要求</div>"+
"			<div class='option_list'>"+
"				<ul>"+
"					<li>拆解须符合《报废机动车回收管理办法》、《报废汽车拆解企业技术规范》的拆解工艺流程及《拆解物加工分类标准》进行拆解作业。</li>"+
"					<li>场地整洁、物料有序分类存放、生产流程安全环保，拆解过程产生的塑料、泡棉泡沫垃圾等均由买方合规处理，由于买方原因引起的一切法律责任及后果，由买方负责与卖方无关。拆解过程中产生的危险废弃物，纳入项目公司危险废物管理，产生收益归卖方，此类危废处置过程中发生需支付给第三方的处置费用由买方承担。</li>"+
"					<li>买方入场要求：买方现场特种作业人员必须经过培训、持证上岗，买方需为入场人员缴纳相关保险，现场操作需遵守项目公司安全、环境、健康管理制度。</li>"+
"					<li>拆解工具：买方应自备叉车等运输、拆解设备。买方自备的设备资质、手续应符合相关法律法规要求，并受卖方所在地监管部门管理。</li>"+
"					<li>地点：应在项目公司厂区内指定区域拆解作业，且接受项目公司现场安全、合规性监管。</li>"+
"					<li>买方进场前需向我司交纳履约保证金壹拾万元，合同执行完毕后退还，或可抵部分货款使用。</li>"+
"					<li>中标方入场拆解前缴纳预付货款不低于叁拾万元，后期按每批次交车辆结算当期货款，末次交车时预付款抵部分货款使用。</li>"+
"				</ul>"+
"			</div>"+
"			<div class='option_title'>竞价要求</div>"+
"			<div class='option_list'>"+
"				<ul>"+
"					<li>竞价资料（包括但不限于）：营业执照三证合一复印件（营业执照为进口的需要提供进出口资质）、开票资料、竞价保证书、资质证书及环评批复等；若竞标人不是法人 代表，还需提供《授权委托书》（加盖公章）原件。</li>"+
"					<li>参与竞价的竞买方与本公司无不良合作记录。</li>"+
"					<li>参加本次竞价的公司务必注册微众账户，并在青岛西海岸建材建议中心：www.qdxhanjc.com线上交易，如有注册问题请及时拨打青岛西海岸建材建议中心客服电话：400-8888-888进行咨询。</li>"+
"					<li>竞价资料获取：请电话联系我公司联系人索取。</li>"+
"					<li>销售定价：参考我的钢铁网废钢网（http://feigang.mysteel.com/）华东张家港普碳废钢中废平均价格（不含税）</li>"+
"					<li><font style='color:red'><b>调价公式：  3吨以下：中标价格+（调价日铁均价-中标日铁价）*0.7</b></font></li>"+
"					<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style='color:red'><b>3吨及以上：中标价格+（调价日铁均价-中标日铁价）*0.8</b></font></p>"+
"					<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style='color:red'><b>摩托车：中标价格+（调价日铁均价-中标日铁价）*1.2</b></font></p>"+
"					<li><font style='color:red'><b>调价周期：首次实际发生货物交付后，每月15日进行调价，调价日铁均价为每月10-15日参考铁价平均价格。</b></font></li>"+
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
"					<i>1.</i>竞买方通过青岛西海岸建材建议中心旗下竞价平台“青岛西海岸建材交易中心”缴纳的竞价保证金不得抵扣货款。竞价失败客户缴纳的保证金将在【3】个工作日内足额无息原路退还。成交客户向我公司缴纳合同履约保证金后【3】个工作日内，由我公司将竞价保证金足额无息原路退还竞买方。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>2.</i>竞价遵循价高者得原则，竞价设有起拍价及保留价，竞价参与客户满足2家及以上，且报价超过保留价，则此次竞价成功；竞买方报价低于保留价或者报价客户少于2家，则竞价失败。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>3.</i><font style='color:red'><b>竞价成功客户在我司通知竞价成功后，须【3】工作日内与我公司签订《销售合同》，自签订《销售合同》日起【10】个自然日内进场作业。因竞价成功客户原因，【3】个工作日内未能签订合同的，视为竞价成功客户自动放弃资格，我公司将扣除全部竞价保证金，并有权组织重新竞价。履约及付款事宜须按双方签订的销售合同执行。</b></font>"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>4.</i>在竞价结束前2分钟内，如果有竞买方出价竞拍，则本次竞价结束时间顺延2分钟，在顺延的2分钟内如有竞买方再次出价，则继续延时2分钟，如此循环，直至再无竟买方出价为止。"+
"				</div>"+
"			</div>"+
"		</div>";
