var trashTemplate = "<div class='des_container'>"+
"			<div class='title'>"+
"				关于@company采购@goodsName的公告"+
"			</div>"+
"			<div class='info'>"+
"				我公司现有一批@goodsName需竞价采购，兹邀广大客户前来参与出价，我司将以公开、公平、公正为原则进行竞价，烦请各位客户认真阅读《竞价公告》。"+
"			</div>"+
"			<div class='time_addr'>"+
"				<div class='time'>"+
"					@auctionStartTime起-@auctionEndTime止（延时除外）  "+
"				</div>"+
"				<div class='addr'>"+
"					@goodsAddress"+
"				</div>"+
"			</div>"+
"			<div class='block_title'>竞价须知</div>"+
"			<div class='option_title'>关于出价说明</div>"+
"			<div class='option_list'>"+
"				供应商所出价格需包含增值税发票费及物流费（即将货物送到采购方仓库的费用）。"+
"			</div>"+
"			<div class='option_title'>关于质量要求</div>"+
"			<div class='option_list'>"+
"				以上产品为全新HDPE一次性注塑而成，无焊接，材料性能指标符合CJ/T280-2008行业标准。正常使用（人为损坏除外）两年内有质量问题免费更换。"+
"			</div>"+
"			<div class='option_title'>交货时间要求</div>"+
"			<div class='option_list'>"+
"				根据@company要求分批次送货，每次送货时间及数量由双方协商。送货前采购方需通过微信、邮件、电话等形式通知供应商。"+
"			</div>"+
"			<div class='option_title'>关于到货验收</div>"+
"			<div class='option_list'>"+
"				产品送到后，采购方需当场验收，验收合格后签字；验收标准：从每次收到的货品中随机抽取1个为样品进行抽样检验，验收合格后根据合同结算方式支付相应货款。"+
"			</div>"+
"			<div class='option_title'>竞价要求</div>"+
"			<div class='option_list'>"+
"				<ul>"+
"					<li>参与竞价的竞卖方与本公司无不良合作记录。"+
"					</li>"+
"					<li>参加本次竞价的竞卖方务必开通支付帐户（微众），且全程需通过青岛西海岸建材建议中心旗下竞价平台“青岛西海岸建材交易中心”（www.qdxhanjc.com）进行线上交易，如有帐户注册、开通支付（微众）、交易支付等问题请及时拨打青岛西海岸建材建议中心客服电话：400-8888-888进行咨询。</li>"+
"					<li>竞价资料获取：请电话联系我公司联系人索取。"+
"					</li>"+
"					<li>竞价采购产品说明"+
"						<div class='option_table'>"+
"							<table>"+
"								<tr>"+
"									<th width='10%'>序号</th>"+
"									<th width='45%'>物资种类</th>"+
"									<th width='45%'>详细说明</th>"+
"								</tr>"+
"								<tr>"+
"									<td>1</td>"+
"									<td> @goodsCate</td>"+
"									<td  style='text-align:left'> @goodsdes</td>"+
"								</tr>"+
"							</table>"+
"						</div>"+
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
"					打开“青岛西海岸建材交易中心”网站（www.qdxhanjc.com)  > 点击导航栏目“正在进行或即将开始”> 通过货品分类或直接点击货品图片查看竞价货品详情："+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第二步</i>"+
"					提交资质：根据页面提示提交参与竞价需要的资质。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第三步</i>"+
"					资质审核后，需要供应商邮寄样品。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第四步</i>"+
"					双方确认样品符合竞买方需求后，供应商通过线上支付竞价保证金人民币@goodBonds元。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第五步</i>"+
"					竞价开始后供应商可按照系统提示进行报价，在竞价结束前，供应商可以多次报价。"+
"				</div>"+
"				<div class='step_order'>"+
"					<i>第六步</i>"+
"					@auctionStartTime--@auctionEndTime，竞价准时结束。竞价资料须在竞价结束前完成操作，逾期者取消参与资格。"+
"				</div>"+
"			</div>"+
"			<div class='block_title'>其他注意事项</div>"+
"			<div class='warning'>"+
"				<div class='warning_option'>"+
"					<i>1.</i>供应商通过青岛西海岸建材建议中心旗下竞价平台“青岛西海岸建材交易中心”缴纳的竞价保证金不得抵扣货款。竞价失败供应商缴纳的保证金将在【3】个工作日内足额无息原路退还。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>2.</i>竞价遵循价低者得原则，竞价设有保留价，竞价参与客户满足2家及以上，且报价低于保留价，则此次竞价成功；报价高于保留价或者报价供应商少于2家，则竞价失败。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>3.</i>因竞价产品特殊，往往需要实地看货，故建议供应商早做准备，充分预留报名、缴纳保证金、看货等时间。供应商可在竞价起始时间内按规则多次出价，系统以结束时最后一次出价记录为准判定竞价成功方。"+
"				</div>"+
"				<div class='warning_option'>"+
"					<i>4.</i>竞价成功的供应商在我公司通知竞价成功后，须【3】日内与我公司签订合同。因竞价成功供应商原因，【3】日内未能签订合同的，视为竞价成功供应商自动放弃资格，我公司将扣除全部竞价保证金，并有权组织重新竞价。履约及付款事宜须按双方签订的合同执行。"+
"				</div>"+
"			</div>"+
"		</div>";
