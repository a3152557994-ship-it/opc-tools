/**
 * 个体户/小微商家常见合同「12 大霸王条款排雷器 + 4 套防坑补充协议包」核心引擎 (#16 smb-contract-guard)
 * 同构零依赖：同时运行于 Node.js (ESM 单测) 与现代浏览器 (<script type="module">)。
 *
 * 【重要合规声明】
 * 本工具、排雷对照表及补充协议模板仅供个体户/小微商家日常商业谈判常识排雷与签约前自查参考，
 * 不构成执业律师法律意见书或正式法律服务；如涉及大额标的或复杂纠纷，请咨询执业律师。
 */

export const PUBLIC_SPKI_BASE64 = "MCowBQYDK2VwAyEAP5NCVP7CT0tgaGLSGMe4r87SjYRWTM6gN6igBZYSXys=";
export const PRODUCT_SLUG = "smb-contract-guard";
export const FREE_SUGGESTION_LIMIT = 3;

export const LEGAL_DISCLAIMER =
  "【重要声明】本工具、12大霸王条款排雷结果及4套补充协议模板仅供商业谈判常识排雷与签约前自查参考，不构成执业律师法律意见书或正式法律服务；如涉及大额资金或重大复杂纠纷，请务必聘请执业律师把关。";

export const ORDER_CHANNELS = {
  priceText: "¥19.9",
  emailPrimary: "3152557994@qq.com",
  emailSecondary: "a3152557994@gmail.com",
};

export const CONTRACT_SCENARIOS = [
  {
    id: "shop_lease",
    name: "① 商铺/档口租赁与转让合同",
    shortName: "商铺租赁转让",
    painSummary: "专防办不出餐饮/消防证押金不退、二房东无权转租、拆迁补偿独吞、公摊电费刺客与断水电锁门",
  },
  {
    id: "outsourcing",
    name: "② 软件/设计/装修外包定制合同",
    shortName: "软件设计外包",
    painSummary: "专防未付尾款先丢著作权、外包商扣留源码/分层原稿、主观满意无限改稿或24h默示验收坑",
  },
  {
    id: "livestream_mcn",
    name: "③ 达人/主播带货与代运营协议",
    shortName: "主播带货合作",
    painSummary: "专防高坑位费零保底刷单充数、退货不扣佣金、主播天价违约金与个人实名账号被强占",
  },
  {
    id: "parttime_labor",
    name: "④ 门店兼职/钟点工劳务用工协议",
    shortName: "兼职劳务用工",
    painSummary: "专防“意外工伤概不负责”无效免责甩锅、押扣工资扯皮、离职客户资源带走与考勤边界模糊",
  },
];

/**
 * 12 类个体户/小微商家最高频踩坑的不对等霸王条款规则库
 */
export const RED_FLAG_RULES = [
  {
    id: "RF01",
    code: "霸王条款 #01",
    title: "单方最终解释权 / 随时单方改规",
    severity: "CRITICAL",
    scenarios: ["shop_lease", "outsourcing", "livestream_mcn", "parttime_labor"],
    patterns: [
      /(?:甲方|出租方|转让方|公司|机构|本平台|本店|用工方|发包方)[^。；\n]{0,18}(?:享有|保留|拥有)[^。；\n]{0,15}最终解释权/g,
      /最终解释权归(?:甲方|出租方|公司|本机构|本店|用工方|平台)所有/g,
      /(?:甲方|出租方|机构|公司|本店)有权随时单方(?:修改|调整|变更)[^。；\n]{0,28}(?:乙方|承租方|主播|兼职人员)?(?:须|必须|应当)?无条件(?:服从|执行|接受)/g,
    ],
    negationGuard: /(?:任何一方均不享有|不得单方享有|双方共同协商解释)/,
    riskImpact: "签完字等于把规则修改器交到对方手里！商管或甲方随时可以借“管理规定调整”加收管理费、罚款或卡验收，你一抗议他就拿这条压你。",
    negotiationTalk: "“老板，‘单方最终解释权’和‘随时单方改制度’在商业合作里太不对等了，就算上法庭通常也会按格式条款无效或不利于提供方解释。咱们改成：未尽事宜或有歧义的地方，由双方书面补充协商解决，任何修改须经双方签字确认才生效。”",
    replacementClause: "本合同条款如存在歧义或未尽事宜，应按照公平原则及商业惯例由双方协商并签署书面补充协议确认；任何一方单方发布的通知、制度或细则，未经对方书面确认不得变更本合同约定的核心权利义务及费用标准。",
  },
  {
    id: "RF02",
    code: "霸王条款 #02",
    title: "定金/押金/保证金/转让费一律不退",
    severity: "CRITICAL",
    scenarios: ["shop_lease", "outsourcing", "livestream_mcn"],
    patterns: [
      /(?:无论(?:任何|何种)原因|不论何种情况|一经支付|一旦缴纳)[^。；\n]{0,24}(?:定金|押金|保证金|诚意金|意向金|转让费)[^。；\n]{0,12}(?:一律不退|概不退还|不予退还|全额没收)/g,
      /(?:定金|押金|保证金|诚意金|转让费|坑位费)[^。；\n]{0,16}(?:一律不予退还|概不退还|在任何情况下均不退还)/g,
      /提前(?:退租|解除合同)[^。；\n]{0,18}押金全额没收且剩余租金不予退还/g,
    ],
    negationGuard: /(?:因甲方原因[^。；\n]{0,12}全额退还|协商一致退还押金)/,
    riskImpact: "最狠的现金流杀手！哪怕是房东产权有问题办不出证、二房东被大房东清退、或外包商根本做不出东西，他都能指着“无论任何原因概不退还”赖掉你的几万块血汗钱。",
    negotiationTalk: "“‘无论任何原因概不退还’肯定没法签哈。如果是我的原因无故毁约，按合理比例扣违约金我认；但如果是贵方产权/资质原因、不可抗力或者验收达不到约定标准，押金和预付款必须在 5 个工作日内全额无息退还给我。”",
    replacementClause: "如因甲方（收款方）主体资格瑕疵、产权/授权缺陷、逾期交付或未能达到约定核心交付标准导致合同无法继续履行的，乙方有权解除合同，甲方应于收到解除通知之日起 5 个工作日内全额退还已收取的押金/保证金及未发生期间的预付款。",
  },
  {
    id: "RF03",
    code: "霸王条款 #03",
    title: "天价日息/无限连带违约金且对方零违约责任",
    severity: "CRITICAL",
    scenarios: ["shop_lease", "outsourcing", "livestream_mcn", "parttime_labor"],
    patterns: [
      /逾期[^。；\n]{0,15}按(?:日|每日)(?:千分之[五六七八九]|百分之[一二三四五]|[1-9]%|0\.[5-9]%)[^。；\n]{0,15}(?:违约金|滞纳金)/g,
      /承担(?:甲方|对方)?一切直接(?:与|及|和)间接(?:经济)?损失[^。；\n]{0,25}(?:预期可得利益|预期利润|商誉损失)/g,
      /甲方(?:逾期|违约|延期)[^。；\n]{0,18}不承担(?:任何)?(?:违约|赔偿)责任/g,
    ],
    negationGuard: /(?:双方违约责任对等|累计违约金上限不超过合同总额)/,
    riskImpact: "日息千分之五折合年化 182.5%，日息 1% 折合年化 365%！晚交几天款或者项目卡壳，违约金滚雪球直接超过本金；更坑的是对方违约却写“不承担任何责任”。",
    negotiationTalk: "“日息千五/百分之一太夸张了，年化都几百了，而且违约条款必须双方对等。咱们统一改成：任何一方逾期付款或逾期交付，按日万分之五计付违约金，且累计违约金总额以合同已付金额/总金额的 20% 封顶。”",
    replacementClause: "甲乙双方违约责任严格对等：任何一方未按约定期限履行付款或交付义务的，每逾期一日按逾期金额的万分之五（0.05%）向守约方支付违约金；任何一方在本合同项下承担的累计违约金及赔偿总额上限不超过本合同总金额的 20%。",
  },
  {
    id: "RF04",
    code: "霸王条款 #04",
    title: "未付清尾款即转移知识产权 / 外包锁死源码底稿",
    severity: "HIGH",
    scenarios: ["outsourcing", "livestream_mcn"],
    patterns: [
      /自(?:本合同签订|初稿提交|作品创作完成|项目启动)之日起[^。；\n]{0,25}(?:著作权|知识产权|所有权)[^。；\n]{0,12}归(?:甲方|委托方)所有/g,
      /(?:不提供|不包含|不予交付)(?:可编译)?(?:源代码|源码|工程源文件|PSD分层源文件|原始设计稿)/g,
      /源代码归(?:乙方|开发方)所有[^。；\n]{0,25}后续修改须另行支付/g,
    ],
    negationGuard: /(?:付清全部款项后[^。；\n]{0,15}知识产权方转移|同步交付完整可编译源代码)/,
    riskImpact: "对接单方：尾款还没收到，初稿版权先归了甲方，甲方拿初稿找别人改完直接赖掉你尾款！对发包商家：花几万做小程序/设计却拿不到源码和分层源文件，以后改个字都被外包商卡脖子收高价年费！",
    negotiationTalk: "“知识产权和源文件咱们按行业最公平的‘一手交钱、一手交权’写清：甲方付清 100% 合同尾款之日，定制成果的知识产权及完整可编译源代码/分层设计源文件一并移交甲方；未付清尾款前，甲方不得擅自商用上线。”",
    replacementClause: "自甲方按约付清本合同全部款项之日起，本合同定制成果的著作权及商用授权正式转移归甲方所有，乙方应于收齐尾款后 3 个工作日内向甲方完整交付可独立编译部署的源代码、数据库脚本（或可编辑分层设计源文件）及部署文档；在尾款结清前，相关知识产权仍归乙方保留。",
  },
  {
    id: "RF05",
    code: "霸王条款 #05",
    title: "异地对方所在地排他管辖 / 高门槛异地仲裁坑",
    severity: "HIGH",
    scenarios: ["shop_lease", "outsourcing", "livestream_mcn", "parttime_labor"],
    patterns: [
      /(?:提交|由)(?:甲方所在地|发包方所在地|机构住所地|公司注册地)人民法院(?:排他)?(?:诉讼)?管辖/g,
      /提交[^。；\n]{0,12}仲裁委员会仲裁[^。；\n]{0,20}仲裁费[^。；\n]{0,10}由乙方承担/g,
    ],
    negationGuard: /(?:原告所在地|合同履行地|商铺所在地人民法院)/,
    riskImpact: "一两万块钱的小微合同，对方把管辖法院定在两千公里外的他老家，或者定在起步受理费就要几千上万的异地商事仲裁委——真出事你连高铁票和住宿费都划不来，只能忍气吞声放弃维权！",
    negotiationTalk: "“管辖这块别写单方所在地或高价仲裁委了，小本生意跑外地打官司双方都折腾。按《民事诉讼法》常规做法，咱们改成‘由合同实际履行地（或商铺所在地 / 原告所在地）人民法院管辖’，公平省事。”",
    replacementClause: "因履行本合同发生的任何争议，双方应先行友好协商；协商不成的，任何一方均有权向合同实际履行地（商铺所在地）或原告住所地有管辖权的人民法院提起诉讼。",
  },
  {
    id: "RF06",
    code: "霸王条款 #06",
    title: "霸王拆迁免责且房东独吞装修与停业补偿",
    severity: "CRITICAL",
    scenarios: ["shop_lease"],
    patterns: [
      /(?:拆迁|征收|市政改造)[^。；\n]{0,30}(?:全部|所有)?(?:拆迁)?补偿(?:款|金)?[^。；\n]{0,18}均归(?:甲方|出租方|房东)所有/g,
      /(?:政府拆迁|规划征收)[^。；\n]{0,25}(?:甲方|出租方)不承担任何赔偿或退费责任[^。；\n]{0,25}装修损失由乙方自负/g,
    ],
    negationGuard: /(?:装修补偿及停产停业损失归乙方|退还剩余租期租金及押金)/,
    riskImpact: "刚花十五万装修完餐饮店开业两个月遇上拆迁，房东拿走所有政府拆迁款（包括专门赔给经营户的停产停业费和装修费），连你预交的半年房租都不退，直接让你一夜回到解放前！",
    negotiationTalk: "“房东大哥，房子土地本身的拆迁补偿肯定是您的；但万一遇上市政拆迁，咱们租户真金白银投进去的装修折旧补偿、搬迁费和停产停业损失，政策本来就是补给实际经营户的，而且没住满的预收房租和押金肯定要按天退还哈。”",
    replacementClause: "租赁期内如遇政府规划征收、拆迁或市政改造导致本合同无法继续履行的，本合同自搬迁腾退之日起终止：甲方应按实际承租天数结算并退还乙方剩余未履约期间的租金及全额押金；政府发放的补偿款中，归属房屋产权及土地部分归甲方所有，归属承租经营户的室内装修残值补偿、设备搬迁补助及停产停业损失补偿归乙方所有。",
  },
  {
    id: "RF07",
    code: "霸王条款 #07",
    title: "商铺办证/消防/二房东转租资质甩锅免责",
    severity: "CRITICAL",
    scenarios: ["shop_lease"],
    patterns: [
      /按现状交付[^。；\n]{0,30}(?:营业执照|餐饮|环评|消防|许可证)[^。；\n]{0,25}(?:自行核实|自行承担|概不退租|租金照常计算)/g,
      /能否办理(?:工商)?营业执照[^。；\n]{0,25}与(?:甲方|出租方|转让方)无关/g,
      /转租未征得原产权人书面同意[^。；\n]{0,20}风险由受让方自负/g,
    ],
    negationGuard: /(?:因房屋产权或消防原因无法办证[^。；\n]{0,15}全额退还)/,
    riskImpact: "十个开店九个死在这条！交完转让费和押三付一才发现：铺子是住宅性质/违建、没法通烟道过餐饮环评、前租客营业执照没迁走，或者二房东根本没拿大房东书面转租授权！办不出证开不了业还得照交房租！",
    negotiationTalk: "“租铺子就是为了开门办证做生意的。签之前请先出示房产证（二房东须出示大房东允许转租书面证明）并确认前租客执照已注销；咱们必须加一条：如果因为房屋产权性质、主体消防未验收或原租户遗留问题导致 30 天内办不出营业执照/经营许可，我可以无责解约，押金租金全退。”",
    replacementClause: "甲方承诺该商铺产权清晰、具备商业经营法定用途且原承租户工商注册地址已迁出/注销（如系转租，须附原产权人书面同意转租证明）。如因房屋规划用途、主体建筑消防缺陷、产权查封或历史工商地址占用等非乙方原因，导致乙方在签约后 30 日内无法办妥营业执照及相关行业经营许可的，乙方有权单方无责解除合同，甲方须在 3 个工作日内全额退还已收租金、押金及转让费。",
  },
  {
    id: "RF08",
    code: "霸王条款 #08",
    title: "直播高坑位费零保底不退 / 主播天价违约金夺号",
    severity: "CRITICAL",
    scenarios: ["livestream_mcn"],
    patterns: [
      /(?:坑位费|服务费)[^。；\n]{0,22}(?:不承诺任何销量|不设保底|无论带货金额高低概不退费)/g,
      /(?:主播|达人|乙方)违约[^。；\n]{0,20}(?:支付|赔偿)违约金(?:人民币)?\s*(?:[5-9]\d|[1-9]\d{2,})\s*万元/g,
      /个人实名认证账号[^。；\n]{0,25}无偿归(?:公司|机构|甲方)永久所有/g,
    ],
    negationGuard: /(?:按实际有效净成交额阶梯退还坑位费)/,
    riskImpact: "商家端：交了 3 万坑位费，机构找水军刷几百单转头全退货，真实成交 200 块却一分钱坑位费不退！达人端：底薪才三四千，合同却埋了 50 万～200 万天价违约金，还把你身份证实名认证的个人号永久抢走！",
    negotiationTalk: "“纯收坑位费一点有效成交保底都不写，现在行业里没法过账。咱们按‘保底有效净GMV（扣除退货退款及异常刷单）’挂钩：未达保底线按未完成比例在 7 个工作日内退还对应坑位费；严禁机器刷量，发现刷单直接退全款。”",
    replacementClause: "本合作以签收后 15 日内扣除退货、仅退款及异常虚假订单后的【实际有效净成交额（Net GMV）】作为唯一结算依据：若单场/周期有效净成交额未达人民币 ____ 元保底目标的，乙方应于核算日起 5 个工作日内按未达标比例向甲方退还相应坑位费/基础服务费；严禁任何刷单、买量造假行为，一经查实甲方有权解除协议并要求全额退费。",
  },
  {
    id: "RF09",
    code: "霸王条款 #09",
    title: "外包“主观满意无限免费改稿”或“24h默示验收免责”",
    severity: "HIGH",
    scenarios: ["outsourcing"],
    patterns: [
      /以(?:甲方|客户)主观满意为(?:唯一)?验收标准[^。；\n]{0,20}修改次数不限/g,
      /无条件免费修改直至(?:甲方)?满意为止/g,
      /交付后\s*(?:24\s*小时|48\s*小时|[123]\s*日)内未提出书面异议[^。；\n]{0,20}视为全部验收合格且不再承担(?:任何)?修复责任/g,
    ],
    negationGuard: /(?:以附件功能需求清单为客观验收标准|免费微调上限)/,
    riskImpact: "两头都是雷：写“直到甲方主观满意为止”，项目永远结不了项、尾款永远收不回；反过来外包商写“交付24小时没回消息就视为全部验收合格且不包修 Bug”，商家周末忙店没看电脑，烂尾半成品就直接算验收完了！",
    negotiationTalk: "“验收标准不能靠主观感觉，也不能搞 24 小时突击默示通过。咱们把《功能/设计需求清单》作为附件，按清单逐项客观核对：给甲方留足 5 个工作日测试验收期，包含定稿前 3 次免费合理调整；交付上线后保留 30 天免费 Bug 质保修复期。”",
    replacementClause: "项目验收以双方签字确认的《需求规格与交付物清单》为客观评判依据：乙方提交阶段成果后，甲方应在 5 个工作日内完成测试并出具书面验收意见；合同报价含需求范围内免费调整不超过 3 次（超出部分或推翻已确认框架的新增需求另行书面议价）；系统正式上线后乙方提供 30 日免费缺陷（Bug）修复质保。",
  },
  {
    id: "RF10",
    code: "霸王条款 #10",
    title: "公摊水电杂费单方乱摊派 / 暴力断水断电锁门",
    severity: "HIGH",
    scenarios: ["shop_lease"],
    patterns: [
      /(?:公摊水电|物业费|推广费|管理费)[^。；\n]{0,22}由(?:甲方|商管|物业)单方核定摊派/g,
      /租金每年递增\s*(?:1[2-9]|[2-9]\d)%/g,
      /有权直接采取(?:断水|停水|断电|停电|锁门|封铺|扣押店内财物)/g,
    ],
    negationGuard: /(?:按独立分表及国家电网目录电价实收|不得擅自采取断水断电)/,
    riskImpact: "房租看着便宜，进场后电费按 2.2 元/度收、每月平白多出几千块“商场公摊空调损耗费/节庆推广费”，稍有争议物业直接拉闸断电把你冰柜里几万块食材全闷臭、大周末锁门让你没法营业！",
    negotiationTalk: "“水电物业单价必须今天白纸黑字写进合同附件（电费多少一度、水费多少一吨、公摊每月封顶多少，无其他隐形推广费）；另外就算账目有争议也得走沟通或法律途径，绝不能私自拉闸断水断电锁门损坏我冷柜食材和正常营业。”",
    replacementClause: "租赁期内水电费严格按独立计量分表读数结算（电费单价 ____ 元/度、水费单价 ____ 元/吨，公摊损耗每月封顶不超过 ____ 元），除本合同列明明细外甲方不得加收任何推广费、进场费或管理杂费；在双方就账目发生争议协商期间，甲方严禁擅自采取断水、断电、锁门或扣留财物等阻断经营行为，否则须赔偿乙方停业及食材货物腐损全部损失。",
  },
  {
    id: "RF11",
    code: "霸王条款 #11",
    title: "兼职/劳务“死伤意外概不负责”无效甩锅与押扣工资",
    severity: "HIGH",
    scenarios: ["parttime_labor"],
    patterns: [
      /(?:工作|兼职|劳务)期间发生任何(?:人身)?(?:意外伤害|工伤|安全事故|突发疾病)[^。；\n]{0,20}(?:概由乙方自负|与甲方无任何关系|本店概不负责)/g,
      /押扣首月(?:工资|劳务费)|未提前\s*30\s*日通知离职扣除全部未结报酬/g,
    ],
    negationGuard: /(?:为乙方投保雇主责任险或团体意外伤害险)/,
    riskImpact: "个体老板最容易自欺欺人的雷！民法典第 1192 条/劳动法明确规定造成人身损害的免责条款**法定无效**！签句“死伤本店概不负责”发生烫伤摔伤照样让你赔十几万；真正防破产的做法是花几十块钱给兼职买份雇主责任险/商业意外险写进协议！兼职打工者也要防黑店押扣工资条款。",
    negotiationTalk: "“人身意外写‘概不负责’法律上本来就是无效的，真出意外还是扯皮。最稳妥的办法是：上岗当天门店统一买好商业团体意外险/雇主责任险，乙方严格遵守安全操作规程；劳务报酬按周/半月准时结算，不押工资，离职提前 3 天交接清楚即可。”",
    replacementClause: "甲方应于乙方上岗前为其投保商业团体人身意外伤害险或雇主责任险，并提供必要劳动安全防护；乙方须严格遵守门店安全操作规范。劳务报酬按【小时/日/半月】据实结算，绝不无故押扣报酬；任何一方拟终止劳务合作的，提前 3 日通知对方并办妥工服设备交接即可结清全部已发生报酬。",
  },
  {
    id: "RF12",
    code: "霸王条款 #12",
    title: "静默高价自动续约捆绑 / 单方提前3天无责清退",
    severity: "HIGH",
    scenarios: ["shop_lease", "outsourcing", "livestream_mcn"],
    patterns: [
      /到期前\s*(?:60|90|180)\s*日未书面通知[^。；\n]{0,24}视为自动(?:按上浮[^。；\n]{0,10})?续签/g,
      /(?:甲方|出租方|机构)有权提前\s*[1-7]\s*日通知随时无责(?:解除合同|清退乙方|收回商铺)/g,
    ],
    negationGuard: /(?:合同期满经双方另行书面签署续约协议方为续期)/,
    riskImpact: "忙生意忘了提前 3 个月发挂号信，合同竟然自动按涨价 20% 捆绑续签三年，不续就扣光你押金！或者你把档口生意刚做火，房东/MCN 借“提前3天通知无责收回”把你一脚踢开自己接着干！",
    negotiationTalk: "“自动续约和提前几天无责清退这俩坑太大了，生意没法做长期规划。改成：合同到期前 30 天双方协商是否续签，必须重新签书面续约协议才算续期（同等条件下我有优先续租权）；合同期内除非严重违约，任何一方不得单方无故提前清退。”",
    replacementClause: "本合同期满后不发生静默自动续约，如需续期应于期满前 30 日由双方另行签署书面续约协议（同等条件下乙方享有优先续约权）；除本合同明确约定的法定或重大违约情形外，任何一方不得单方无故提前解除合同或清退对方，否则应向守约方赔偿相当于 2 个月费用/合同总额 20% 的违约金及实际装修投入损失。",
  },
];

/**
 * 4 套内置高仿真「问题霸王合同」测试样本（供用户一键体验扫描标红）
 */
export const SAMPLE_CONTRACTS = {
  shop_lease: {
    scenario: "shop_lease",
    title: "样本①：街边餐饮档口二房东转租霸王合同",
    text: `《临街商铺档口租赁（转租）协议》
甲方（出租方）：张某某    乙方（承租方）：个体工商户陈某

第一条 房屋交付与证照：本商铺按现状交付，至于该房屋能否办理工商营业执照、餐饮服务许可证、油烟环评及消防审批，由乙方自行核实解决，与甲方无关，如办不出证租金照常计算、概不退租。
第二条 租金与杂费：月租金 8500 元，租金每年递增 18%；商场公摊水电损耗、节庆推广费、物业管理费由甲方单方核定摊派，乙方逾期3日未缴的，甲方有权直接采取断水、断电、锁门清场措施。
第三条 押金与退租：乙方缴纳押金 25500 元及转让诚意金 30000 元，无论任何原因解除合同或未满期退租，押金及转让费一律不予退还。
第四条 拆迁免责：租赁期内如遇政府规划征收、拆迁或市政改造，甲方不承担任何赔偿或退费责任，装修损失由乙方自负，全部拆迁补偿款均归甲方所有。
第五条 续约与解释：合同到期前 90 日未书面通知的，视为自动按上浮 20% 续签三年。本协议最终解释权归甲方所有，任何争议由甲方所在地人民法院排他管辖。`,
  },
  outsourcing: {
    scenario: "outsourcing",
    title: "样本②：小程序/品牌设计定制外包不对等合同",
    text: `《定制小程序开发与视觉设计委托合同》
委托方（甲方）：某贸易公司    服务方（乙方）：某工作室

1. 预付款与退款：甲方签约当日支付定金及首付款 15000 元，一旦缴纳在任何情况下均不退还。
2. 验收标准：以甲方主观满意为唯一验收标准，乙方须无条件免费修改直至甲方满意为止；但系统测试版交付后 24 小时内未提出书面异议的，即视为全部验收合格且不再承担任何修复责任。
3. 源码与版权：自本合同签订之日起全部著作权及知识产权归甲方所有；但本报价不包含可编译源代码及PSD分层源文件，源代码归乙方所有，后续修改须另行支付每年 8000 元维护费。
4. 违约与管辖：乙方逾期一日按日千分之八计收违约金并承担甲方一切直接与间接经济损失及预期可得利益损失；甲方逾期付款不承担任何违约责任。争议提交机构住所地人民法院管辖。`,
  },
  livestream_mcn: {
    scenario: "livestream_mcn",
    title: "样本③：达人直播带货坑位费与MCN锁号合同",
    text: `《短视频直播带货合作及达人经纪协议》
甲方（商家/机构）：某MCN传媒    乙方（合作方/主播）：林某

一、坑位服务费：商家签约即支付专场坑位费 28000 元，坑位费一经支付无论带货金额高低概不退费、不承诺任何销量或保底。
二、账号归属与违约：合作期间乙方使用的个人实名认证账号无偿归机构永久所有；如主播违约或私自停播，须向公司支付违约金人民币 80 万元。
三、制度与清退：公司有权随时单方修改提成考核制度，乙方必须无条件服从；机构有权提前 3 日通知随时无责解除合同。本合同最终解释权归公司所有。`,
  },
  parttime_labor: {
    scenario: "parttime_labor",
    title: "样本④：奶茶/餐饮门店兼职钟点工免责甩锅协议",
    text: `《门店兼职钟点工劳务用工协议》
甲方（用工门店）：某茶饮店    乙方（兼职人员）：周某

1. 薪资结算：时薪 18 元/小时，入职须押扣首月劳务费作为履约担保；乙方未提前 30 日通知离职扣除全部未结报酬。
2. 意外免责：乙方在兼职期间发生任何意外伤害、工伤、烫伤滑倒安全事故或突发疾病，概由乙方自负，本店概不负责。
3. 管理制度：本店享有本协议最终解释权，争议提交甲方所在地人民法院管辖。`,
  },
};

/**
 * 4 套完整可打印《防坑补充协议》Markdown 模板（均内置显著非律所参考声明）
 */
export const SUPPLEMENTAL_TEMPLATES = [
  {
    id: "tpl_shop_lease",
    scenario: "shop_lease",
    title: "模板①：《商铺/档口租赁与转租防坑补充协议》",
    filename: "01-商铺档口租赁与转租防坑补充协议.md",
    content: `# 商铺/档口租赁与转租防坑补充协议

> ${LEGAL_DISCLAIMER}

**甲方（出租方/转租方）**：____________________（身份证号/统一社会信用代码：____________________）  
**乙方（承租方）**：____________________（身份证号/统一社会信用代码：____________________）

鉴于甲乙双方于 ____年____月____日就位于 ____________________________________ 之商铺签订了《商铺租赁/转让合同》（下称“原合同”），经平等协商，特达成如下优先适用的补充条款：

### 第一条 产权合规与办证兜底退租条款（防办不出证死局）
1. 甲方保证系该商铺合法产权人（若为转租，须在本协议签署时交付原产权人同意转租且租期覆盖本合同的书面证明复印件），且该商铺符合商业/【餐饮/零售/美业】经营规划及主体消防验收要求，原租户营业执照注册地址已迁出或注销。
2. 自本协议签订之日起 **30 日内**，如因房屋产权性质、主体消防缺陷、历史工商地址占用或原房东异议等**非乙方原因**，导致乙方无法办妥《营业执照》或《食品经营许可证》等相关证照的，乙方有权单方无责解除原合同及本协议；甲方须在收到解除通知后 **3 个工作日内全额无息退还**已收取的押金、预付租金及转让费。

### 第二条 水电物业透明封顶与严禁断水电锁门条款
1. 商铺水电费严格按独立分表实际读数计收：电费单价固定为 **____元/度**，水费单价 **____元/吨**，物业及公摊损耗费合计每月封顶不超过 **____元**；除上述明列费用外，甲方不得单方摊派任何节庆费、推广费或管理杂费。
2. 合同期内租金递增幅度约定为：前 ____ 年不递增，自第 ____ 年起每满一年在上一年度基础上递增不超过 **____%**（建议 ≤5%）。
3. 双方如发生账目或履约争议应协商或依法诉讼解决，甲方及物业**严禁擅自采取断水、断电、锁门、堵门或扣留店内设备食材等强制措施**；否则每发生一日，免除乙方当月 3 日租金，且甲方须全额赔偿乙方停业损失及冷链食材腐损实际损失。

### 第三条 市政拆迁/征收补偿归属切分条款
租赁期内如遇政府规划征收、拆迁或市政改造导致无法继续经营的，原合同自实际腾退日终止：
1. 甲方应按日折算并在 **5 个工作日内**退还乙方剩余租期预付租金及全额押金；
2. 政府部门发放的征收补偿款中：属于房屋产权及土地价值补偿归甲方所有；**属于室内外装修投入残值补偿、设施设备搬迁费及实际经营户停产停业损失补助归乙方所有**。

### 第四条 优先效力与就近管辖
1. 本补充协议与原合同具有同等法律效力；**原合同中任何“单方最终解释权”“押金一律不退”等条款与本补充协议不一致的，一律以本补充协议为准**。
2. 争议由**本商铺所在地人民法院**依法管辖。

**甲方签章**：________________    **乙方签章**：________________  
**签署日期**：____年____月____日
`,
  },
  {
    id: "tpl_outsourcing",
    scenario: "outsourcing",
    title: "模板②：《软件开发/视觉设计外包定制防坑补充协议》",
    filename: "02-软件开发与设计外包防坑补充协议.md",
    content: `# 软件开发/视觉设计外包定制防坑补充协议

> ${LEGAL_DISCLAIMER}

**委托方（甲方）**：____________________  
**服务方（乙方）**：____________________

就双方于 ____年____月____日签署之定制外包合同（下称“原合同”），双方补充约定如下核心对等条款：

### 第一条 里程碑付款与客观验收清单（防烂尾/防无限改稿）
1. 款项按 **3 : 4 : 3** 节点支付：签约付 30% 启动款 → 核心功能/初稿演示确认付 40% 进度款 → 终验通过付清 30% 尾款。
2. 验收严格以附件《功能模块与设计交付规格清单》为**唯一客观验收依据**（不以抽象“主观感觉”无限拒收，亦不适用 24 小时突击默示通过）。乙方提交成果后，甲方享有 **5 个工作日**测试核验期。
3. 本报价包含定稿前在原需求框架内的免费修改上限 **3 次**；如甲方中途推翻已确认原型或新增清单外功能模块，由双方另签书面增补工单核算工期与差价。

### 第二条 源码/分层原件移交与知识产权“钱权同步”条款
1. 自甲方付清本合同 **100% 全部款项**之日起 **3 个工作日内**，乙方必须向甲方完整移交：**① 可独立编译部署的全部前后端源代码与数据库脚本（或可编辑 PSD/AI/Figma 分层源文件及商用正版字体说明）；② 部署运维手册**。乙方不得加密、留后门或捆绑强制高价年费。
2. 在甲方付清全部尾款前，交付成果之著作权仍由乙方保留，甲方不得擅自去水印正式商用上线；尾款结清瞬间，约定定制成果之著作权及商业使用权正式归属甲方。
3. 乙方保证交付内容不侵犯第三方知识产权（不含未授权盗版图库/字体/代码），否则由乙方承担全部侵权索赔责任。

### 第三条 免费质保期与对等违约上限
1. 终验上线后，乙方提供 **30 个自然日**免费缺陷（Bug）响应修复服务（紧急阻断性故障 12 小时内响应）。
2. 任何一方逾期付款或逾期交付的，每逾期一日按逾期对应阶段款项的 **0.05%（万分之五）**支付违约金；双方累计违约金上限均不超过合同总金额的 **20%**。
3. 本补充协议效力优先于原合同冲突条款；争议由合同履行地或原告住所地人民法院管辖。

**甲方签章**：________________    **乙方签章**：________________  
**签署日期**：____年____月____日
`,
  },
  {
    id: "tpl_livestream_mcn",
    scenario: "livestream_mcn",
    title: "模板③：《达人/主播带货与代运营合作防坑补充协议》",
    filename: "03-达人主播带货合作防坑补充协议.md",
    content: `# 达人/主播带货与代运营合作防坑补充协议

> ${LEGAL_DISCLAIMER}

**甲方（品牌商家）**：____________________  
**乙方（MCN机构/达人）**：____________________

针对双方签署之直播带货/短视频种草合作合同（原合同），特补充以下防刷单与保底退费条款：

### 第一条 实际有效净成交额（Net GMV）核算与坑位费阶梯退还
1. 双方确认：**“实际有效净成交额”**是指直播/视频发布后，消费者确认收货满 **15 日**且剔除退货退款、仅退款、秒拍秒退异常单及虚假刷单后的真实回款净额。
2. 本次合作基础坑位费人民币 **________元**，对应保底有效净成交额目标为人民币 **________元**（另有纯佣金比例 **____%**，仅对超出保底或有效净成交部分计提，退货订单不计提佣金）：
   - 如核算周期届满，实际有效净成交额未达保底目标的，乙方须在核算日起 **5 个工作日内**按未完成比例退还坑位费：\`应退坑位费 = 已付坑位费 × (1 - 实际有效净成交额 ÷ 保底目标额)\`。

### 第二条 严禁刷单造假红线（一票否决）
乙方严禁采取机器刷量、雇佣水军虚假下单再退货、互动数据造假等欺诈手段套取坑位费或佣金。一经平台后台异常订单风控记录或物流签收证据查实，甲方有权立即单方解除合同，乙方须在 **3 个工作日内全额退还全部已收费用**，并按已收费用总额的 **30%** 支付违约金。

### 第三条 广告合规词边界与账号独立权属
1. 甲方对商品质量、检测报告及发货售后负责；乙方主播须严格按照甲方书面审核确认的合规卖点手卡口播，不得擅自夸大功效或使用《广告法》极限违禁词，因乙方擅自脱稿违规宣传导致的行政处罚或平台扣分由乙方承担。
2. 合作各方原有自媒体/直播账号的所有权及实名权属保持独立不变，不因本次商务合作发生无偿转移；合作终止后双方均不得恶意投诉或强占对方实名账号。
3. 本补充协议优先于原合同任何“坑位费概不退还”“单方解释权”条款适用。

**甲方签章**：________________    **乙方签章**：________________  
**签署日期**：____年____月____日
`,
  },
  {
    id: "tpl_parttime_labor",
    scenario: "parttime_labor",
    title: "模板④：《个体门店兼职/钟点工劳务合作与意外险兜底协议》",
    filename: "04-门店兼职钟点工劳务与安全兜底协议.md",
    content: `# 个体门店兼职/钟点工劳务合作与意外险兜底协议

> ${LEGAL_DISCLAIMER}

**甲方（用工门店/雇主）**：____________________  
**乙方（兼职/劳务人员）**：__________（身份证号：____________________ 联系电话：____________）

甲乙双方本着平等自愿原则，就门店灵活用工/非全日制兼职事项达成如下清晰透明约定：

### 第一条 工作内容与灵活排班时间
1. 乙方在甲方门店担任【收银/备餐协助/导购/理货】兼职岗位，具体出勤时段由双方每周提前排班确认（平均每日工作不超过 4 小时，每周累计不超过 24 小时，严格遵循非全日制/灵活劳务边界）。

### 第二条 透明计酬与绝不押扣工资承诺
1. 计酬标准为人民币 **____元/小时**（法定节假日出勤按协议约定补贴标准执行），以门店考勤打卡/排班签字记录为准。
2. 结算周期为每【周 / 半月】（不超过 15 日）转账结算一次；**甲方承诺绝不收取任何入职押金、工服押金，绝不押扣首期报酬**。

### 第三条 上岗商业意外险兜底与安全操作规范（替代无效“概不负责”条款）
1. 甲方应于乙方首次上岗前为其投保**雇主责任险或商业团体人身意外伤害险**（保费由甲方承担），并对厨房热油、电器、湿滑地面等进行岗前安全培训。
2. 乙方在岗期间须严格穿戴防滑鞋等防护用品并遵守安全操作规程，严禁酒后上岗或违规操作设备。

### 第四条 客户隐私保密与体面退出交接
1. 乙方对在岗知悉的门店配方参数、进货渠道及顾客联系方式负有保密义务。
2. 任何一方拟结束兼职合作的，提前 **3 日**告知对方并归还门店围裙、门禁卡等物资，甲方于交接当日结清全部已出勤报酬，互不恶意克扣。
3. 本补充协议与原用工协议或门店制度冲突之处，一律以本补充协议为准。

**甲方签章**：________________    **乙方签字**：________________  
**签署日期**：____年____月____日
`,
  },
];

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function base64UrlToBytes(b64url) {
  const normalized = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (normalized.length % 4)) % 4;
  return base64ToBytes(normalized + "=".repeat(padLen));
}

/**
 * 本地离线 Ed25519 公钥验签（支持 `OPC1.<payload>.<sig>`）。
 */
export async function verifyLicenseToken(token, options = {}) {
  const {
    expectedProduct = PRODUCT_SLUG,
    publicSpkiBase64 = PUBLIC_SPKI_BASE64,
    nowSec = Math.floor(Date.now() / 1000),
  } = options;

  if (typeof token !== "string" || !token.trim()) {
    return { valid: false, reason: "EMPTY_TOKEN", message: "请输入激活码" };
  }

  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "OPC1" || !parts[1] || !parts[2]) {
    return { valid: false, reason: "BAD_FORMAT", message: "激活码格式应为 OPC1.<payload>.<sig>" };
  }

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    return { valid: false, reason: "NO_WEBCRYPTO", message: "当前环境不支持 WebCrypto" };
  }

  try {
    const [, payloadB64, sigB64] = parts;
    const spkiBytes = base64ToBytes(publicSpkiBase64);
    const sigBytes = base64UrlToBytes(sigB64);
    const signedBytes = new TextEncoder().encode(`OPC1.${payloadB64}`);

    const key = await subtle.importKey("spki", spkiBytes, { name: "Ed25519" }, false, ["verify"]);
    const verified = await subtle.verify("Ed25519", key, sigBytes, signedBytes);
    if (!verified) {
      return { valid: false, reason: "BAD_SIGNATURE", message: "Ed25519 数字签名校验未通过" };
    }

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
    if (expectedProduct && payload.p !== expectedProduct && payload.p !== "*") {
      return {
        valid: false,
        reason: "PRODUCT_MISMATCH",
        message: `该激活码归属产品为 "${payload.p}"，不适用于 "${expectedProduct}"`,
        payload,
      };
    }

    if (payload.exp && Number(payload.exp) > 0 && nowSec > Number(payload.exp)) {
      return { valid: false, reason: "EXPIRED", message: "该激活码已过期", payload };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, reason: "VERIFY_ERROR", message: err?.message || "验签解析失败" };
  }
}

/**
 * 自动识别合同所属高频场景（也可由用户显式指定）。
 */
export function inferContractScenario(text) {
  const s = String(text || "");
  if (/(商铺|档口|出租方|承租方|转租|房租|拆迁|物业费)/.test(s)) return "shop_lease";
  if (/(坑位费|直播|带货|主播|达人|MCN|GMV)/.test(s)) return "livestream_mcn";
  if (/(兼职|钟点工|时薪|劳务用工|工伤|上岗)/.test(s)) return "parttime_labor";
  if (/(源代码|小程序|委托开发|设计稿|验收合格|PSD)/.test(s)) return "outsourcing";
  return "shop_lease";
}

/**
 * 将合同原文按命中霸王条款区间切分为用于前端标红高亮的无重叠片段数组。
 */
export function buildHighlightedSegments(text, rawSpans) {
  const content = String(text || "");
  if (!content || !rawSpans || rawSpans.length === 0) {
    return [{ text: content, flagged: false }];
  }

  const sorted = [...rawSpans]
    .filter((sp) => sp.start >= 0 && sp.end > sp.start && sp.end <= content.length)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const merged = [];
  for (const sp of sorted) {
    const prev = merged[merged.length - 1];
    if (!prev || sp.start >= prev.end) {
      merged.push({ ...sp });
    } else if (sp.end > prev.end) {
      prev.end = sp.end;
    }
  }

  const segments = [];
  let cursor = 0;
  for (const sp of merged) {
    if (sp.start > cursor) {
      segments.push({ text: content.slice(cursor, sp.start), flagged: false });
    }
    segments.push({
      text: content.slice(sp.start, sp.end),
      flagged: true,
      ruleId: sp.ruleId,
      code: sp.code,
      severity: sp.severity,
    });
    cursor = sp.end;
  }
  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor), flagged: false });
  }
  return segments;
}

/**
 * 核心合同排雷扫描器：
 * - 免费版：全篇霸王条款精准标红 + 风险评级 + 前 3 条完整商业谈判替换话术 (`FREE_SUGGESTION_LIMIT = 3`)
 * - 激活版 (`unlocked = true`)：解锁全部命中条款谈判话术、对等替换条文及 4 套《防坑补充协议》完整模板
 */
export function scanContractText(contractText, options = {}) {
  const text = String(contractText || "");
  const unlocked = Boolean(options.unlocked);
  const scenario = options.scenario || inferContractScenario(text);

  const findings = [];
  const allSpans = [];

  for (const rule of RED_FLAG_RULES) {
    // Negative guard prevents false alarms on fair balanced clauses
    const matches = [];
    for (const pat of rule.patterns) {
      const re = new RegExp(pat.source, pat.flags.includes("g") ? pat.flags : `${pat.flags}g`);
      let m;
      while ((m = re.exec(text)) !== null) {
        const matchedStr = m[0];
        // Check local sentence window around match for explicit negation guard
        const winStart = Math.max(0, m.index - 24);
        const winEnd = Math.min(text.length, m.index + matchedStr.length + 24);
        const contextSentence = text.slice(winStart, winEnd);
        if (rule.negationGuard && rule.negationGuard.test(contextSentence)) {
          continue;
        }
        matches.push({
          start: m.index,
          end: m.index + matchedStr.length,
          excerpt: matchedStr,
          ruleId: rule.id,
          code: rule.code,
          severity: rule.severity,
        });
      }
    }

    if (matches.length > 0) {
      allSpans.push(...matches);
      findings.push({
        id: rule.id,
        code: rule.code,
        title: rule.title,
        severity: rule.severity,
        matchCount: matches.length,
        matchedExcerpts: Array.from(new Set(matches.map((x) => x.excerpt))),
        riskImpact: rule.riskImpact,
        negotiationTalk: rule.negotiationTalk,
        replacementClause: rule.replacementClause,
      });
    }
  }

  // Sort CRITICAL findings first
  findings.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === "CRITICAL" ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  // Apply free preview limit (first 3 negotiation scripts free; remaining locked until OPC1. unlock)
  const gatedFindings = findings.map((f, idx) => {
    const isLocked = !unlocked && idx >= FREE_SUGGESTION_LIMIT;
    return {
      id: f.id,
      code: f.code,
      title: f.title,
      severity: f.severity,
      matchCount: f.matchCount,
      matchedExcerpts: f.matchedExcerpts,
      riskImpact: f.riskImpact,
      locked: isLocked,
      negotiationTalk: isLocked ? "🔒 完整谈判沟通话术已生成（输入 OPC1. 激活码或 ¥19.9 秒发解锁全部逐条话术 + 4 套补充协议）" : f.negotiationTalk,
      replacementClause: isLocked ? "🔒 解锁后可一键复制对等替换合同条文" : f.replacementClause,
    };
  });

  const criticalCount = findings.filter((f) => f.severity === "CRITICAL").length;
  const highCount = findings.filter((f) => f.severity === "HIGH").length;
  const rawPenalty = criticalCount * 24 + highCount * 14;
  const safetyScore = Math.max(5, 100 - rawPenalty);

  let riskLevel = "LOW";
  let riskSummary = "未检出明显典型霸王条款（仍建议结合具体金额期限核对付款与违约细节）";
  if (criticalCount >= 2 || findings.length >= 4) {
    riskLevel = "DANGER";
    riskSummary = `高危预警！检出 ${findings.length} 类典型不对等霸王条款（含 ${criticalCount} 项致命资金/权属深坑），切勿直接签字转账！`;
  } else if (findings.length >= 1) {
    riskLevel = "WARNING";
    riskSummary = `中度风险：检出 ${findings.length} 类不对等条款，建议签约前发去修改话术或加签《防坑补充协议》。`;
  }

  const recommendedTemplate =
    SUPPLEMENTAL_TEMPLATES.find((t) => t.scenario === scenario) || SUPPLEMENTAL_TEMPLATES[0];

  return {
    disclaimer: LEGAL_DISCLAIMER,
    scenario,
    safetyScore,
    riskLevel,
    riskSummary,
    totalRedFlags: findings.length,
    criticalCount,
    highCount,
    freeUnlockedCount: Math.min(findings.length, unlocked ? findings.length : FREE_SUGGESTION_LIMIT),
    lockedCount: unlocked ? 0 : Math.max(0, findings.length - FREE_SUGGESTION_LIMIT),
    findings: gatedFindings,
    highlightedSegments: buildHighlightedSegments(text, allSpans),
    recommendedTemplate: unlocked
      ? recommendedTemplate
      : {
          id: recommendedTemplate.id,
          scenario: recommendedTemplate.scenario,
          title: recommendedTemplate.title,
          locked: true,
          previewSnippet: recommendedTemplate.content.split("\n").slice(0, 12).join("\n") + "\n\n...（完整可打印补充协议需 OPC1. 激活码解锁）",
        },
  };
}

/**
 * 导出完整的《合同霸王条款谈判修改清单》Markdown（始终置顶非律所参考声明）。
 */
export function exportScanReportMarkdown(scanResult, { unlocked = false } = {}) {
  const lines = [
    `# 个体户/小微商家合同霸王条款自查与谈判清单`,
    ``,
    `> ${LEGAL_DISCLAIMER}`,
    ``,
    `- **安全健康分**：${scanResult.safetyScore} / 100（风险等级：${scanResult.riskLevel}）`,
    `- **扫描结论**：${scanResult.riskSummary}`,
    ``,
    `## 一、检出霸王条款与商业谈判修改话术`,
    ``,
  ];

  if (scanResult.findings.length === 0) {
    lines.push(`未检出内置 12 类高频霸王条款。`);
  } else {
    for (const f of scanResult.findings) {
      lines.push(`### ${f.code}：${f.title}（严重度：${f.severity}）`);
      lines.push(`- **原合同命中原句**：\`${f.matchedExcerpts.join("` / `")}\``);
      lines.push(`- **踩坑后果大白话**：${f.riskImpact}`);
      if (!f.locked || unlocked) {
        lines.push(`- **微信谈判沟通话术**：${f.negotiationTalk}`);
        lines.push(`- **建议对等替换条文**：${f.replacementClause}`);
      } else {
        lines.push(`- **谈判话术与替换条文**：（需解锁完整版查看）`);
      }
      lines.push(``);
    }
  }

  return lines.join("\n");
}
