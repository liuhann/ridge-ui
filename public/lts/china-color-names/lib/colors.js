(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD 环境，使用 define 定义模块
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS 环境，使用 module.exports 导出模块
    module.exports = factory()
  } else {
    // 浏览器全局环境，将模块挂载到全局对象上
    root.CHINA_COLOR_NAMES = factory()
  }
}(typeof self !== 'undefined' ? self : this, function () {
  const COLORS = [
    {
      name: '乳白',
      color: '#f9f4dc'
    },
    {
      name: '杏仁黄',
      color: '#f7e8aa'
    },
    {
      name: '茉莉黄',
      color: '#f8df72'
    },
    {
      name: '麦秆黄',
      color: '#f8df70'
    },
    {
      name: '油菜花黄',
      color: '#fbda41'
    },
    {
      name: '佛手黄',
      color: '#fed71a'
    },
    {
      name: '篾黄',
      color: '#f7de98'
    },
    {
      name: '葵扇黄',
      color: '#f8d86a'
    },
    {
      name: '柠檬黄',
      color: '#fcd337'
    },
    {
      name: '金瓜黄',
      color: '#fcd217'
    },
    {
      name: '藤黄',
      color: '#ffd111'
    },
    {
      name: '酪黄',
      color: '#f6dead'
    },
    {
      name: '香水玫瑰黄',
      color: '#f7da94'
    },
    {
      name: '淡密黄',
      color: '#f9d367'
    },
    {
      name: '大豆黄',
      color: '#fbcd31'
    },
    {
      name: '素馨黄',
      color: '#fccb16'
    },
    {
      name: '向日葵黄',
      color: '#fecc11'
    },
    {
      name: '雅梨黄',
      color: '#fbc82f'
    },
    {
      name: '黄连黄',
      color: '#fcc515'
    },
    {
      name: '金盏黄',
      color: '#fcc307'
    },
    {
      name: '蛋壳黄',
      color: '#f8c387'
    },
    {
      name: '肉色',
      color: '#f7c173'
    },
    {
      name: '鹅掌黄',
      color: '#fbb929'
    },
    {
      name: '鸡蛋黄',
      color: '#fbb612'
    },
    {
      name: '鼬黄',
      color: '#fcb70a'
    },
    {
      name: '榴萼黄',
      color: '#f9a633'
    },
    {
      name: '淡橘橙',
      color: '#fba414'
    },
    {
      name: '枇杷黄',
      color: '#fca106'
    },
    {
      name: '橙皮黄',
      color: '#fca104'
    },
    {
      name: '北瓜黄',
      color: '#fc8c23'
    },
    {
      name: '杏黄',
      color: '#f28e16'
    },
    {
      name: '雄黄',
      color: '#ff9900'
    },
    {
      name: '万寿菊黄',
      color: '#fb8b05',
      poem: '山青水秀碧云天，万寿菊黄惹人怜'
    },
    {
      name: '菊蕾白',
      color: '#e9ddb6',
      poem: '满园花菊郁金黄，中有孤丛色似霜'
    },
    {
      name: '秋葵黄',
      color: '#eed045'
    },
    {
      name: '硫华黄',
      color: '#f2ce2b'
    },
    {
      name: '柚黄',
      color: '#f1ca17'
    },
    {
      name: '芒果黄',
      color: '#ddc871'
    },
    {
      name: '蒿黄',
      color: '#dfc243'
    },
    {
      name: '姜黄',
      color: '#e2c027'
    },
    {
      name: '香蕉黄',
      color: '#e4bf11'
    },
    {
      name: '草黄',
      color: '#d2b42c'
    },
    {
      name: '新禾绿',
      color: '#d2b116'
    },
    {
      name: '月灰',
      color: '#b7ae8f'
    },
    {
      name: '淡灰绿',
      color: '#ad9e5f'
    },
    {
      name: '草灰绿',
      color: '#8e804b'
    },
    {
      name: '苔绿',
      color: '#887322'
    },
    {
      name: '碧螺春绿',
      color: '#867018'
    },
    {
      name: '燕羽灰',
      color: '#685e48'
    },
    {
      name: '蟹壳灰',
      color: '#695e45'
    },
    {
      name: '潭水绿',
      color: '#645822'
    },
    {
      name: '橄榄绿',
      color: '#5e5314'
    },
    {
      name: '蚌肉白',
      color: '#f9f1db'
    },
    {
      name: '豆汁黄',
      color: '#f8e8c1'
    },
    {
      name: '淡茧黄',
      color: '#f9d770'
    },
    {
      name: '乳鸭黄',
      color: '#ffc90c'
    },
    {
      name: '荔肉白',
      color: '#f2e6ce'
    },
    {
      name: '象牙黄',
      color: '#f0d695'
    },
    {
      name: '炒米黄',
      color: '#f4ce69'
    },
    {
      name: '鹦鹉冠黄',
      color: '#f6c430'
    },
    {
      name: '木瓜黄',
      color: '#f9c116'
    },
    {
      name: '浅烙黄',
      color: '#f9bd10'
    },
    {
      name: '莲子白',
      color: '#e5d3aa'
    },
    {
      name: '谷黄',
      color: '#e8b004'
    },
    {
      name: '栀子黄',
      color: '#ebb10d'
    },
    {
      name: '芥黄',
      color: '#d9a40e'
    },
    {
      name: '银鼠灰',
      color: '#b5aa90'
    },
    {
      name: '尘灰',
      color: '#b6a476'
    },
    {
      name: '枯绿',
      color: '#b78d12'
    },
    {
      name: '鲛青',
      color: '#87723e'
    },
    {
      name: '粽叶绿',
      color: '#876818'
    },
    {
      name: '灰绿',
      color: '#8a6913'
    },
    {
      name: '鹤灰',
      color: '#4a4035'
    },
    {
      name: '淡松烟',
      color: '#4d4030'
    },
    {
      name: '暗海水绿',
      color: '#584717'
    },
    {
      name: '棕榈绿',
      color: '#5b4913'
    },
    {
      name: '米色',
      color: '#f9e9cd'
    },
    {
      name: '淡肉色',
      color: '#f8e0b0'
    },
    {
      name: '麦芽糖黄',
      color: '#f9d27d'
    },
    {
      name: '琥珀黄',
      color: '#feba07'
    },
    {
      name: '甘草黄',
      color: '#f3bf4c'
    },
    {
      name: '初熟杏黄',
      color: '#f8bc31'
    },
    {
      name: '浅驼色',
      color: '#e2c17c'
    },
    {
      name: '沙石黄',
      color: '#e5b751'
    },
    {
      name: '虎皮黄',
      color: '#eaad1a'
    },
    {
      name: '土黄',
      color: '#d6a01d'
    },
    {
      name: '百灵鸟灰',
      color: '#b4a992'
    },
    {
      name: '山鸡黄',
      color: '#b78b26'
    },
    {
      name: '龟背黄',
      color: '#826b48'
    },
    {
      name: '苍黄',
      color: '#806332'
    },
    {
      name: '莱阳梨黄',
      color: '#815f25'
    },
    {
      name: '蜴蜊绿',
      color: '#835e1d'
    },
    {
      name: '松鼠灰',
      color: '#4f4032'
    },
    {
      name: '橄榄灰',
      color: '#503e2a'
    },
    {
      name: '蟹壳绿',
      color: '#513c20'
    },
    {
      name: '古铜绿',
      color: '#533c1b'
    },
    {
      name: '焦茶绿',
      color: '#553b18'
    },
    {
      name: '粉白',
      color: '#fbf2e3'
    },
    {
      name: '落英淡粉',
      color: '#f9e8d0'
    },
    {
      name: '瓜瓤粉',
      color: '#f9cb8b'
    },
    {
      name: '蜜黄',
      color: '#fbb957'
    },
    {
      name: '金叶黄',
      color: '#ffa60f'
    },
    {
      name: '金莺黄',
      color: '#f4a83a'
    },
    {
      name: '鹿角棕',
      color: '#e3bd8d'
    },
    {
      name: '凋叶棕',
      color: '#e7a23f'
    },
    {
      name: '玳瑁黄',
      color: '#daa45a'
    },
    {
      name: '软木黄',
      color: '#de9e44'
    },
    {
      name: '风帆黄',
      color: '#dc9123'
    },
    {
      name: '桂皮淡棕',
      color: '#c09351'
    },
    {
      name: '猴毛灰',
      color: '#97846c'
    },
    {
      name: '山鸡褐',
      color: '#986524'
    },
    {
      name: '驼色',
      color: '#66462a'
    },
    {
      name: '茶褐',
      color: '#5d3d21'
    },
    {
      name: '古铜褐',
      color: '#5c3719'
    },
    {
      name: '荷花白',
      color: '#fbecde'
    },
    {
      name: '玫瑰粉',
      color: '#f8b37f'
    },
    {
      name: '橘橙',
      color: '#f97d1c'
    },
    {
      name: '美人焦橙',
      color: '#fa7e23'
    },
    {
      name: '润红',
      color: '#f7cdbc'
    },
    {
      name: '淡桃红',
      color: '#f6cec1'
    },
    {
      name: '海螺橙',
      color: '#f0945d'
    },
    {
      name: '桃红',
      color: '#f0ada0'
    },
    {
      name: '颊红',
      color: '#eeaa9c'
    },
    {
      name: '淡罂粟红',
      color: '#eea08c'
    },
    {
      name: '晨曦红',
      color: '#ea8958'
    },
    {
      name: '蟹壳红',
      color: '#f27635'
    },
    {
      name: '金莲花橙',
      color: '#f86b1d'
    },
    {
      name: '草莓红',
      color: '#ef6f48'
    },
    {
      name: '龙睛鱼红',
      color: '#ef632b'
    },
    {
      name: '蜻蜓红',
      color: '#f1441d'
    },
    {
      name: '大红',
      color: '#f04b22'
    },
    {
      name: '柿红',
      color: '#f2481b'
    },
    {
      name: '榴花红',
      color: '#f34718'
    },
    {
      name: '银朱',
      color: '#f43e06'
    },
    {
      name: '朱红',
      color: '#ed5126'
    },
    {
      name: '鲑鱼红',
      color: '#f09c5a'
    },
    {
      name: '金黄',
      color: '#f26b1f'
    },
    {
      name: '鹿皮褐',
      color: '#d99156'
    },
    {
      name: '醉瓜肉',
      color: '#db8540'
    },
    {
      name: '麂棕',
      color: '#de7622'
    },
    {
      name: '淡银灰',
      color: '#c1b2a3'
    },
    {
      name: '淡赭',
      color: '#be7e4a'
    },
    {
      name: '槟榔综',
      color: '#c1651a'
    },
    {
      name: '银灰',
      color: '#918072'
    },
    {
      name: '海鸥灰',
      color: '#9a8878'
    },
    {
      name: '淡咖啡',
      color: '#945833'
    },
    {
      name: '岩石棕',
      color: '#964d22'
    },
    {
      name: '芒果棕',
      color: '#954416'
    },
    {
      name: '石板灰',
      color: '#624941'
    },
    {
      name: '珠母灰',
      color: '#64483d'
    },
    {
      name: '丁香棕',
      color: '#71361d'
    },
    {
      name: '咖啡',
      color: '#753117'
    },
    {
      name: '筍皮棕',
      color: '#732e12'
    },
    {
      name: '燕颔红',
      color: '#fc6315'
    },
    {
      name: '玉粉红',
      color: '#e8b49a'
    },
    {
      name: '金驼',
      color: '#e46828'
    },
    {
      name: '铁棕',
      color: '#d85916'
    },
    {
      name: '蛛网灰',
      color: '#b7a091'
    },
    {
      name: '淡可可棕',
      color: '#b7511d'
    },
    {
      name: '中红灰',
      color: '#8b614d'
    },
    {
      name: '淡土黄',
      color: '#8c4b31'
    },
    {
      name: '淡豆沙',
      color: '#873d24'
    },
    {
      name: '椰壳棕',
      color: '#883a1e'
    },
    {
      name: '淡铁灰',
      color: '#5b423a'
    },
    {
      name: '中灰驼',
      color: '#603d30'
    },
    {
      name: '淡栗棕',
      color: '#673424'
    },
    {
      name: '可可棕',
      color: '#652b1c'
    },
    {
      name: '柞叶棕',
      color: '#692a1b'
    },
    {
      name: '野蔷薇红',
      color: '#fb9968'
    },
    {
      name: '菠萝红',
      color: '#fc7930'
    },
    {
      name: '藕荷',
      color: '#edc3ae'
    },
    {
      name: '陶瓷红',
      color: '#e16723'
    },
    {
      name: '晓灰',
      color: '#d4c4b7'
    },
    {
      name: '余烬红',
      color: '#cf7543'
    },
    {
      name: '火砖红',
      color: '#cd6227'
    },
    {
      name: '火泥棕',
      color: '#aa6a4c'
    },
    {
      name: '绀红',
      color: '#a6522c'
    },
    {
      name: '橡树棕',
      color: '#773d31'
    },
    {
      name: '海报灰',
      color: '#483332'
    },
    {
      name: '玫瑰灰',
      color: '#4b2e2b'
    },
    {
      name: '火山棕',
      color: '#482522'
    },
    {
      name: '豆沙',
      color: '#481e1c'
    },
    {
      name: '淡米粉',
      color: '#fbeee2'
    },
    {
      name: '初桃粉红',
      color: '#f6dcce'
    },
    {
      name: '介壳淡粉红',
      color: '#f7cfba'
    },
    {
      name: '淡藏花红',
      color: '#f6ad8f'
    },
    {
      name: '瓜瓤红',
      color: '#f68c60'
    },
    {
      name: '芙蓉红',
      color: '#f9723d'
    },
    {
      name: '莓酱红',
      color: '#fa5d19'
    },
    {
      name: '法螺红',
      color: '#ee8055'
    },
    {
      name: '落霞红',
      color: '#cf4813'
    },
    {
      name: '淡玫瑰灰',
      color: '#b89485'
    },
    {
      name: '蟹蝥红',
      color: '#b14b28'
    },
    {
      name: '火岩棕',
      color: '#863020'
    },
    {
      name: '赭石',
      color: '#862617'
    },
    {
      name: '暗驼棕',
      color: '#592620'
    },
    {
      name: '酱棕',
      color: '#5a1f1b'
    },
    {
      name: '栗棕',
      color: '#5c1e19'
    },
    {
      name: '洋水仙红',
      color: '#f4c7ba'
    },
    {
      name: '谷鞘红',
      color: '#f17666'
    },
    {
      name: '苹果红',
      color: '#f15642'
    },
    {
      name: '铁水红',
      color: '#f5391c'
    },
    {
      name: '桂红',
      color: '#f25a47'
    },
    {
      name: '极光红',
      color: '#f33b1f'
    },
    {
      name: '粉红',
      color: '#f2b9b2'
    },
    {
      name: '舌红',
      color: '#f19790'
    },
    {
      name: '曲红',
      color: '#f05a46'
    },
    {
      name: '红汞红',
      color: '#f23e23'
    },
    {
      name: '淡绯',
      color: '#f2cac9'
    },
    {
      name: '无花果红',
      color: '#efafad'
    },
    {
      name: '榴子红',
      color: '#f1908c'
    },
    {
      name: '胭脂红',
      color: '#f03f24'
    },
    {
      name: '合欢红',
      color: '#f0a1a8'
    },
    {
      name: '春梅红',
      color: '#f1939c'
    },
    {
      name: '香叶红',
      color: '#f07c82'
    },
    {
      name: '珊瑚红',
      color: '#f04a3a'
    },
    {
      name: '萝卜红',
      color: '#f13c22'
    },
    {
      name: '淡茜红',
      color: '#e77c8e'
    },
    {
      name: '艳红',
      color: '#ed5a65'
    },
    {
      name: '淡菽红',
      color: '#ed4845'
    },
    {
      name: '鱼鳃红',
      color: '#ed3b2f'
    },
    {
      name: '樱桃红',
      color: '#ed3321'
    },
    {
      name: '淡蕊香红',
      color: '#ee4866'
    },
    {
      name: '石竹红',
      color: '#ee4863'
    },
    {
      name: '草茉莉红',
      color: '#ef475d'
    },
    {
      name: '茶花红',
      color: '#ee3f4d'
    },
    {
      name: '枸枢红',
      color: '#ed3333'
    },
    {
      name: '秋海棠红',
      color: '#ec2b24'
    },
    {
      name: '丽春红',
      color: '#eb261a'
    },
    {
      name: '夕阳红',
      color: '#de2a18'
    },
    {
      name: '鹤顶红',
      color: '#d42517'
    },
    {
      name: '鹅血石红',
      color: '#ab372f'
    },
    {
      name: '覆盆子红',
      color: '#ac1f18'
    },
    {
      name: '貂紫',
      color: '#5d3131'
    },
    {
      name: '暗玉紫',
      color: '#5c2223'
    },
    {
      name: '栗紫',
      color: '#5a191b'
    },
    {
      name: '葡萄酱紫',
      color: '#5a1216'
    },
    {
      name: '牡丹粉红',
      color: '#eea2a4'
    },
    {
      name: '山茶红',
      color: '#ed556a'
    },
    {
      name: '海棠红',
      color: '#f03752'
    },
    {
      name: '玉红',
      color: '#c04851'
    },
    {
      name: '高粱红',
      color: '#c02c38'
    },
    {
      name: '满江红',
      color: '#a7535a'
    },
    {
      name: '枣红',
      color: '#7c1823'
    },
    {
      name: '葡萄紫',
      color: '#4c1f24'
    },
    {
      name: '酱紫',
      color: '#4d1018'
    },
    {
      name: '淡曙红',
      color: '#ee2746',
      poem: '晓日初升露未干，深红淡紫映阑干'
    },
    {
      name: '唐菖蒲红',
      color: '#de1c31',
      poem: '生在水边呈淡红，清香浓郁引蝶蜂'
    },
    {
      name: '鹅冠红',
      color: '#d11a2d',
      poem: '雪颈霜毛红网掌，请看何处不如君'
    },
    {
      name: '莓红',
      color: '#c45a65',
      poem: '山上草莓红十里，短筇正是消閒计'
    },
    {
      name: '枫叶红',
      color: '#c21f30',
      poem: '停车坐爱枫林晚，霜叶红于二月花'
    },
    {
      name: '苋菜红',
      color: '#a61b29'
    },
    {
      name: '烟红',
      color: '#894e54'
    },
    {
      name: '暗紫苑红',
      color: '#82202b'
    },
    {
      name: '殷红',
      color: '#82111f'
    },
    {
      name: '猪肝紫',
      color: '#541e24'
    },
    {
      name: '金鱼紫',
      color: '#500a16'
    },
    {
      name: '草珠红',
      color: '#f8ebe6'
    },
    {
      name: '淡绛红',
      color: '#ec7696'
    },
    {
      name: '品红',
      color: '#ef3473'
    },
    {
      name: '凤仙花红',
      color: '#ea7293'
    },
    {
      name: '粉团花红',
      color: '#ec9bad'
    },
    {
      name: '夹竹桃红',
      color: '#eb507e'
    },
    {
      name: '榲桲红',
      color: '#ed2f6a'
    },
    {
      name: '姜红',
      color: '#eeb8c3'
    },
    {
      name: '莲瓣红',
      color: '#ea517f'
    },
    {
      name: '水红',
      color: '#f1c4cd'
    },
    {
      name: '报春红',
      color: '#ec8aa4'
    },
    {
      name: '月季红',
      color: '#ce5777'
    },
    {
      name: '豇豆红',
      color: '#ed9db2'
    },
    {
      name: '霞光红',
      color: '#ef82a0'
    },
    {
      name: '松叶牡丹红',
      color: '#eb3c70'
    },
    {
      name: '喜蛋红',
      color: '#ec2c64'
    },
    {
      name: '鼠鼻红',
      color: '#e3b4b8'
    },
    {
      name: '尖晶玉红',
      color: '#cc163a'
    },
    {
      name: '山黎豆红',
      color: '#c27c88'
    },
    {
      name: '锦葵红',
      color: '#bf3553'
    },
    {
      name: '鼠背灰',
      color: '#73575c'
    },
    {
      name: '甘蔗紫',
      color: '#621624'
    },
    {
      name: '石竹紫',
      color: '#63071c'
    },
    {
      name: '苍蝇灰',
      color: '#36282b'
    },
    {
      name: '卵石紫',
      color: '#30161c'
    },
    {
      name: '李紫',
      color: '#2b1216'
    },
    {
      name: '茄皮紫',
      color: '#2d0c13'
    },
    {
      name: '吊钟花红',
      color: '#ce5e8a'
    },
    {
      name: '兔眼红',
      color: '#ec4e8a'
    },
    {
      name: '紫荆红',
      color: '#ee2c79'
    },
    {
      name: '菜头紫',
      color: '#951c48'
    },
    {
      name: '鹞冠紫',
      color: '#621d34'
    },
    {
      name: '葡萄酒红',
      color: '#62102e'
    },
    {
      name: '磨石紫',
      color: '#382129'
    },
    {
      name: '檀紫',
      color: '#381924'
    },
    {
      name: '火鹅紫',
      color: '#33141e'
    },
    {
      name: '墨紫',
      color: '#310f1b'
    },
    {
      name: '晶红',
      color: '#eea6b7'
    },
    {
      name: '扁豆花红',
      color: '#ef498b'
    },
    {
      name: '白芨红',
      color: '#de7897'
    },
    {
      name: '嫩菱红',
      color: '#de3f7c'
    },
    {
      name: '菠根红',
      color: '#d13c74'
    },
    {
      name: '酢酱草红',
      color: '#c5708b'
    },
    {
      name: '洋葱紫',
      color: '#a8456b'
    },
    {
      name: '海象紫',
      color: '#4b1e2f'
    },
    {
      name: '绀紫',
      color: '#461629'
    },
    {
      name: '古铜紫',
      color: '#440e25'
    },
    {
      name: '石蕊红',
      color: '#f0c9cf'
    },
    {
      name: '芍药耕红',
      color: '#eba0b3'
    },
    {
      name: '藏花红',
      color: '#ec2d7a'
    },
    {
      name: '初荷红',
      color: '#e16c96'
    },
    {
      name: '马鞭草紫',
      color: '#ede3e7'
    },
    {
      name: '丁香淡紫',
      color: '#e9d7df'
    },
    {
      name: '丹紫红',
      color: '#d2568c'
    },
    {
      name: '玫瑰红',
      color: '#d2357d'
    },
    {
      name: '淡牵牛紫',
      color: '#d1c2d3'
    },
    {
      name: '凤信紫',
      color: '#c8adc4',
      poem: '含光紫瓣如甄女，弄影蓝苞若谢娘'
    },
    {
      name: '萝兰紫',
      color: '#c08eaf'
    },
    {
      name: '玫瑰紫',
      color: '#ba2f7b'
    },
    {
      name: '藤萝紫',
      color: '#8076a3'
    },
    {
      name: '槿紫',
      color: '#806d9e',
      poem: '紫雾函灯檠，彤霞逼绮寮'
    },
    {
      name: '蕈紫',
      color: '#815c94',
      poem: '蕈紫花中最可人，翠凤衣裳玉面新'
    },
    {
      name: '桔梗紫',
      color: '#813c85',
      poem: '桔梗花开映碧霄，紫蓝烂漫韵千条'
    },
    {
      name: '魏紫',
      color: '#7e1671'
    },
    {
      name: '芝兰紫',
      color: '#e9ccd3'
    },
    {
      name: '菱锰红',
      color: '#d276a3'
    },
    {
      name: '龙须红',
      color: '#cc5595'
    },
    {
      name: '蓟粉红',
      color: '#e6d2d5'
    },
    {
      name: '电气石红',
      color: '#c35691'
    },
    {
      name: '樱草紫',
      color: '#c06f98'
    },
    {
      name: '芦穗灰',
      color: '#bdaead'
    },
    {
      name: '隐红灰',
      color: '#b598a1'
    },
    {
      name: '苋菜紫',
      color: '#9b1e64'
    },
    {
      name: '芦灰',
      color: '#856d72'
    },
    {
      name: '暮云灰',
      color: '#4f383e'
    },
    {
      name: '斑鸠灰',
      color: '#482936'
    },
    {
      name: '淡藤萝紫',
      color: '#f2e7e5'
    },
    {
      name: '淡青紫',
      color: '#e0c8d1'
    },
    {
      name: '青蛤壳紫',
      color: '#bc84a8'
    },
    {
      name: '豆蔻紫',
      color: '#ad6598'
    },
    {
      name: '扁豆紫',
      color: '#a35c8f'
    },
    {
      name: '芥花紫',
      color: '#983680'
    },
    {
      name: '青莲',
      color: '#8b2671'
    },
    {
      name: '芓紫',
      color: '#894276'
    },
    {
      name: '葛巾紫',
      color: '#7e2065'
    },
    {
      name: '牵牛紫',
      color: '#681752'
    },
    {
      name: '紫灰',
      color: '#5d3f51'
    },
    {
      name: '龙睛鱼紫',
      color: '#4e2a40'
    },
    {
      name: '荸荠紫',
      color: '#411c35'
    },
    {
      name: '古鼎灰',
      color: '#36292f'
    },
    {
      name: '乌梅紫',
      color: '#1e131d'
    },
    {
      name: '深牵牛紫',
      color: '#1c0d1a'
    },
    {
      name: '银白',
      color: '#f1f0ed'
    },
    {
      name: '芡食白',
      color: '#e2e1e4'
    },
    {
      name: '远山紫',
      color: '#ccccd6'
    },
    {
      name: '淡蓝紫',
      color: '#a7a8bd'
    },
    {
      name: '山梗紫',
      color: '#61649f'
    },
    {
      name: '螺甸紫',
      color: '#74759b'
    },
    {
      name: '玛瑙灰',
      color: '#cfccc9'
    },
    {
      name: '野菊紫',
      color: '#525288'
    },
    {
      name: '满天星紫',
      color: '#2e317c'
    },
    {
      name: '锌灰',
      color: '#7a7374'
    },
    {
      name: '野葡萄紫',
      color: '#302f4b'
    },
    {
      name: '剑锋紫',
      color: '#3e3841'
    },
    {
      name: '龙葵紫',
      color: '#322f3b'
    },
    {
      name: '暗龙胆紫',
      color: '#22202e'
    },
    {
      name: '晶石紫',
      color: '#1f2040'
    },
    {
      name: '暗蓝紫',
      color: '#131124'
    },
    {
      name: '景泰蓝',
      color: '#2775b6'
    },
    {
      name: '尼罗蓝',
      color: '#2474b5'
    },
    {
      name: '远天蓝',
      color: '#d0dfe6'
    },
    {
      name: '星蓝',
      color: '#93b5cf'
    },
    {
      name: '羽扇豆蓝',
      color: '#619ac3'
    },
    {
      name: '花青',
      color: '#2376b7'
    },
    {
      name: '睛蓝',
      color: '#5698c3'
    },
    {
      name: '虹蓝',
      color: '#2177b8'
    },
    {
      name: '湖水蓝',
      color: '#b0d5df'
    },
    {
      name: '秋波蓝',
      color: '#8abcd1'
    },
    {
      name: '涧石蓝',
      color: '#66a9c9'
    },
    {
      name: '潮蓝',
      color: '#2983bb'
    },
    {
      name: '群青',
      color: '#1772b4'
    },
    {
      name: '霁青',
      color: '#63bbd0'
    },
    {
      name: '碧青',
      color: '#5cb3cc'
    },
    {
      name: '宝石蓝',
      color: '#2486b9'
    },
    {
      name: '天蓝',
      color: '#1677b3'
    },
    {
      name: '柏林蓝',
      color: '#126bae'
    },
    {
      name: '海青',
      color: '#22a2c3'
    },
    {
      name: '钴蓝',
      color: '#1a94bc'
    },
    {
      name: '鸢尾蓝',
      color: '#158bb8'
    },
    {
      name: '牵牛花蓝',
      color: '#1177b0'
    },
    {
      name: '飞燕草蓝',
      color: '#0f59a4'
    },
    {
      name: '品蓝',
      color: '#2b73af'
    },
    {
      name: '银鱼白',
      color: '#cdd1d3'
    },
    {
      name: '安安蓝',
      color: '#3170a7'
    },
    {
      name: '鱼尾灰',
      color: '#5e616d'
    },
    {
      name: '鲸鱼灰',
      color: '#475164'
    },
    {
      name: '海参灰',
      color: '#fffefa'
    },
    {
      name: '沙鱼灰',
      color: '#35333c'
    },
    {
      name: '钢蓝',
      color: '#0f1423'
    },
    {
      name: '云水蓝',
      color: '#baccd9'
    },
    {
      name: '晴山蓝',
      color: '#8fb2c9'
    },
    {
      name: '靛青',
      color: '#1661ab'
    },
    {
      name: '大理石灰',
      color: '#c4cbcf'
    },
    {
      name: '海涛蓝',
      color: '#15559a'
    },
    {
      name: '蝶翅蓝',
      color: '#4e7ca1'
    },
    {
      name: '海军蓝',
      color: '#346c9c'
    },
    {
      name: '水牛灰',
      color: '#2f2f35'
    },
    {
      name: '牛角灰',
      color: '#2d2e36'
    },
    {
      name: '燕颔蓝',
      color: '#131824'
    },
    {
      name: '云峰白',
      color: '#d8e3e7'
    },
    {
      name: '井天蓝',
      color: '#c3d7df'
    },
    {
      name: '云山蓝',
      color: '#2f90b9'
    },
    {
      name: '釉蓝',
      color: '#1781b5'
    },
    {
      name: '鸥蓝',
      color: '#c7d2d4'
    },
    {
      name: '搪磁蓝',
      color: '#11659a'
    },
    {
      name: '月影白',
      color: '#c0c4c3'
    },
    {
      name: '星灰',
      color: '#b2bbbe'
    },
    {
      name: '淡蓝灰',
      color: '#5e7987'
    },
    {
      name: '鷃蓝',
      color: '#144a74'
    },
    {
      name: '嫩灰',
      color: '#74787a'
    },
    {
      name: '战舰灰',
      color: '#495c69'
    },
    {
      name: '瓦罐灰',
      color: '#47484c'
    },
    {
      name: '青灰',
      color: '#2b333e'
    },
    {
      name: '鸽蓝',
      color: '#1c2938'
    },
    {
      name: '钢青',
      color: '#142334'
    },
    {
      name: '暗蓝',
      color: '#101f30'
    },
    {
      name: '月白',
      color: '#eef7f2'
    },
    {
      name: '海天蓝',
      color: '#c6e6e8'
    },
    {
      name: '清水蓝',
      color: '#93d5dc'
    },
    {
      name: '瀑布蓝',
      color: '#51c4d3'
    },
    {
      name: '蔚蓝',
      color: '#29b7cb'
    },
    {
      name: '孔雀蓝',
      color: '#0eb0c9'
    },
    {
      name: '甸子蓝',
      color: '#10aec2'
    },
    {
      name: '石绿',
      color: '#57c3c2'
    },
    {
      name: '竹篁绿',
      color: '#b9dec9'
    },
    {
      name: '粉绿',
      color: '#83cbac'
    },
    {
      name: '美蝶绿',
      color: '#12aa9c'
    },
    {
      name: '毛绿',
      color: '#66c18c'
    },
    {
      name: '蔻梢绿',
      color: '#5dbe8a'
    },
    {
      name: '麦苗绿',
      color: '#55bb8a'
    },
    {
      name: '蛙绿',
      color: '#45b787'
    },
    {
      name: '铜绿',
      color: '#2bae85'
    },
    {
      name: '竹绿',
      color: '#1ba784'
    },
    {
      name: '蓝绿',
      color: '#12a182'
    },
    {
      name: '穹灰',
      color: '#c4d7d6'
    },
    {
      name: '翠蓝',
      color: '#1e9eb3'
    },
    {
      name: '胆矾蓝',
      color: '#0f95b0'
    },
    {
      name: '樫鸟蓝',
      color: '#1491a8'
    },
    {
      name: '闪蓝',
      color: '#7cabb1'
    },
    {
      name: '冰山蓝',
      color: '#a4aca7'
    },
    {
      name: '虾壳青',
      color: '#869d9d'
    },
    {
      name: '晚波蓝',
      color: '#648e93'
    },
    {
      name: '蜻蜓蓝',
      color: '#3b818c'
    },
    {
      name: '玉鈫蓝',
      color: '#126e82'
    },
    {
      name: '垩灰',
      color: '#737c7b'
    },
    {
      name: '夏云灰',
      color: '#617172'
    },
    {
      name: '苍蓝',
      color: '#134857'
    },
    {
      name: '黄昏灰',
      color: '#474b4c'
    },
    {
      name: '灰蓝',
      color: '#21373d'
    },
    {
      name: '深灰蓝',
      color: '#132c33'
    },
    {
      name: '玉簪绿',
      color: '#a4cab6'
    },
    {
      name: '青矾绿',
      color: '#2c9678'
    },
    {
      name: '草原远绿',
      color: '#9abeaf'
    },
    {
      name: '梧枝绿',
      color: '#69a794'
    },
    {
      name: '浪花绿',
      color: '#92b3a5'
    },
    {
      name: '海王绿',
      color: '#248067'
    },
    {
      name: '亚丁绿',
      color: '#428675'
    },
    {
      name: '镍灰',
      color: '#9fa39a'
    },
    {
      name: '明灰',
      color: '#8a988e'
    },
    {
      name: '淡绿灰',
      color: '#70887d'
    },
    {
      name: '飞泉绿',
      color: '#497568'
    },
    {
      name: '狼烟灰',
      color: '#5d655f'
    },
    {
      name: '绿灰',
      color: '#314a43'
    },
    {
      name: '苍绿',
      color: '#223e36'
    },
    {
      name: '深海绿',
      color: '#1a3b32'
    },
    {
      name: '长石灰',
      color: '#363433'
    },
    {
      name: '苷蓝绿',
      color: '#1f2623'
    },
    {
      name: '莽丛绿',
      color: '#141e1b'
    },
    {
      name: '淡翠绿',
      color: '#c6dfc8'
    },
    {
      name: '明绿',
      color: '#9eccab'
    },
    {
      name: '田园绿',
      color: '#68b88e'
    },
    {
      name: '翠绿',
      color: '#20a162'
    },
    {
      name: '淡绿',
      color: '#61ac85'
    },
    {
      name: '葱绿',
      color: '#40a070'
    },
    {
      name: '孔雀绿',
      color: '#229453'
    },
    {
      name: '艾绿',
      color: '#cad3c3'
    },
    {
      name: '蟾绿',
      color: '#3c9566'
    },
    {
      name: '宫殿绿',
      color: '#20894d'
    },
    {
      name: '松霜绿',
      color: '#83a78d'
    },
    {
      name: '蛋白石绿',
      color: '#579572'
    },
    {
      name: '薄荷绿',
      color: '#207f4c'
    },
    {
      name: '瓦松绿',
      color: '#6e8b74'
    },
    {
      name: '荷叶绿',
      color: '#1a6840'
    },
    {
      name: '田螺绿',
      color: '#5e665b'
    },
    {
      name: '白屈菜绿',
      color: '#485b4d'
    },
    {
      name: '河豚灰',
      color: '#393733'
    },
    {
      name: '蒽油绿',
      color: '#373834'
    },
    {
      name: '槲寄生绿',
      color: '#2b312c'
    },
    {
      name: '云杉绿',
      color: '#15231b'
    },
    {
      name: '嫩菊绿',
      color: '#f0f5e5'
    },
    {
      name: '艾背绿',
      color: '#dfecd5'
    },
    {
      name: '嘉陵水绿',
      color: '#add5a2'
    },
    {
      name: '玉髓绿',
      color: '#41b349'
    },
    {
      name: '鲜绿',
      color: '#43b244'
    },
    {
      name: '宝石绿',
      color: '#41ae3c'
    },
    {
      name: '海沬绿',
      color: '#e2e7bf'
    },
    {
      name: '姚黄',
      color: '#d0deaa'
    },
    {
      name: '橄榄石绿',
      color: '#b2cf87'
    },
    {
      name: '水绿',
      color: '#8cc269'
    },
    {
      name: '芦苇绿',
      color: '#b7d07a'
    },
    {
      name: '槐花黄绿',
      color: '#d2d97a'
    },
    {
      name: '苹果绿',
      color: '#bacf65'
    },
    {
      name: '芽绿',
      color: '#96c24e'
    },
    {
      name: '蝶黄',
      color: '#e2d849'
    },
    {
      name: '橄榄黄绿',
      color: '#bec936'
    },
    {
      name: '鹦鹉绿',
      color: '#5bae23'
    },
    {
      name: '油绿',
      color: '#253d24'
    },
    {
      name: '象牙白',
      color: '#fffef8'
    },
    {
      name: '汉白玉',
      color: '#f8f4ed'
    },
    {
      name: '雪白',
      color: '#fffef9'
    },
    {
      name: '鱼肚白',
      color: '#f7f4ed'
    },
    {
      name: '珍珠灰',
      color: '#e4dfd7'
    },
    {
      name: '浅灰',
      color: '#dad4cb'
    },
    {
      name: '铅灰',
      color: '#bbb5ac'
    },
    {
      name: '中灰',
      color: '#bbb5ac'
    },
    {
      name: '瓦灰',
      color: '#867e76'
    },
    {
      name: '夜灰',
      color: '#847c74'
    },
    {
      name: '雁灰',
      color: '#80766e'
    },
    {
      name: '深灰',
      color: '#81776e'
    },
    {
      name: '黄白游',
      color: '#fff799'
    },
    {
      name: '松花',
      color: '#ffee6f'
    },
    {
      name: '缃叶',
      color: '#ecd452'
    },
    {
      name: '天缥',
      color: '#d5ebe1'
    },
    {
      name: '沧浪',
      color: '#b1d5c8'
    },
    {
      name: '苍筤',
      color: '#99bcac'
    },
    {
      name: '缥碧',
      color: '#80a492'
    },
    {
      name: '流黄',
      color: '#8b7042'
    },
    {
      name: '栗壳',
      color: '#775039'
    },
    {
      name: '龙战',
      color: '#5f4321'
    },
    {
      name: '青骊',
      color: '#422517'
    },
    {
      name: '海天霞',
      color: '#f3a694'
    },
    {
      name: '缙云',
      color: '#ee7959'
    },
    {
      name: '纁黄',
      color: '#ba5140'
    },
    {
      name: '珊瑚赫',
      color: '#c12c1f'
    },
    {
      name: '盈盈',
      color: '#f9d3e3'
    },
    {
      name: '苏梅',
      color: '#dd7694'
    },
    {
      name: '紫茎屏风',
      color: '#a76283'
    },
    {
      name: '葭灰',
      color: '#beb1aa'
    },
    {
      name: '黄埃',
      color: '#b49273'
    },
    {
      name: '老僧衣',
      color: '#a46244'
    },
    {
      name: '玄天',
      color: '#6b5458'
    },
    {
      name: '黄河琉璃',
      color: '#e5a84b'
    },
    {
      name: '库金',
      color: '#e18a3b'
    },
    {
      name: '缊韨',
      color: '#984f31'
    },
    {
      name: '紫瓯',
      color: '#7c461e'
    },
    {
      name: '欧碧',
      color: '#c0d695'
    },
    {
      name: '春辰',
      color: '#a9be7b'
    },
    {
      name: '碧山',
      color: '#779649'
    },
    {
      name: '青青',
      color: '#4f6f46     '
    },
    {
      name: '赤缇',
      color: '#ba5b49'
    },
    {
      name: '朱草',
      color: '#a64036'
    },
    {
      name: '綪茷',
      color: '#9e2a22'
    },
    {
      name: '顺圣',
      color: '#7c191e'
    },
    {
      name: '桃夭',
      color: '#f6bec8'
    },
    {
      name: '杨妃',
      color: '#f091a0'
    },
    {
      name: '长春',
      color: '#dc6b82'
    },
    {
      name: '牙绯',
      color: '#c35c5d'
    },
    {
      name: '黄栗留',
      color: '#fedc5e'
    },
    {
      name: '栀子',
      color: '#fac03d'
    },
    {
      name: '黄不老',
      color: '#db9b34'
    },
    {
      name: '柘黄',
      color: '#c67915'
    },
    {
      name: '青鸾',
      color: '#9aa7b1'
    },
    {
      name: '菘蓝',
      color: '#6b798e'
    },
    {
      name: '青黛',
      color: '#45465e'
    },
    {
      name: '绀蝶',
      color: '#2c2f3b'
    },
    {
      name: '皦玉',
      color: '#ebeee8'
    },
    {
      name: '吉量',
      color: '#ebeddf'
    },
    {
      name: '韶粉',
      color: '#e0e0d0'
    },
    {
      name: '霜地',
      color: '#c7c6b6'
    },
    {
      name: '夏籥',
      color: '#d2af9d'
    },
    {
      name: '紫磨金',
      color: '#bc836b'
    },
    {
      name: '檀色',
      color: '#b26d5d'
    },
    {
      name: '赭罗',
      color: '#9a6655'
    },
    {
      name: '洛神珠',
      color: '#d23918'
    },
    {
      name: '丹雘',
      color: '#c8161d'
    },
    {
      name: '水华朱',
      color: '#a72126'
    },
    {
      name: '青冥',
      color: '#3271ae'
    },
    {
      name: '青雘',
      color: '#007175'
    },
    {
      name: '青緺',
      color: '#284852'
    },
    {
      name: '骐驎',
      color: '#12264f'
    },
    {
      name: '紫蒲',
      color: '#a6559d'
    },
    {
      name: '赪紫',
      color: '#8a1874'
    },
    {
      name: '齐紫',
      color: '#6c216d'
    },
    {
      name: '凝夜紫',
      color: '#422256'
    },
    {
      name: '冻缥',
      color: '#bec2b3'
    },
    {
      name: '春碧',
      color: '#9d9d82'
    },
    {
      name: '执大象',
      color: '#919177'
    },
    {
      name: '苔古',
      color: '#79836c'
    },
    {
      name: '香炉紫烟',
      color: '#d3ccd6'
    },
    {
      name: '紫菂',
      color: '#9b8ea9'
    },
    {
      name: '拂紫绵',
      color: '#7e527f'
    },
    {
      name: '三公子',
      color: '#663d74'
    },
    {
      name: '琅玕紫',
      color: '#cb5c83'
    },
    {
      name: '红踯躅',
      color: '#b83570'
    },
    {
      name: '魏红',
      color: '#a73766'
    },
    {
      name: '昌荣',
      color: '#dcc7e1'
    },
    {
      name: '紫薄汗',
      color: '#bba1cb'
    },
    {
      name: '茈藐',
      color: '#a67eb7'
    },
    {
      name: '紫紶',
      color: '#7d5284'
    },
    {
      name: '苍葭',
      color: '#a8bf8f'
    },
    {
      name: '庭芜绿',
      color: '#68945c'
    },
    {
      name: '翠微',
      color: '#4c8045'
    },
    {
      name: '翠虬',
      color: '#446a37'
    },
    {
      name: '碧落',
      color: '#aed0ee'
    },
    {
      name: '挼蓝',
      color: '#6e9bc5'
    },
    {
      name: '青雀头黛',
      color: '#354e6b'
    },
    {
      name: '螺子黛',
      color: '#13393e'
    },
    {
      name: '露褐',
      color: '#bd8253'
    },
    {
      name: '檀褐',
      color: '#945635'
    },
    {
      name: '緅絺',
      color: '#804c2e'
    },
    {
      name: '目童子',
      color: '#5b3222'
    },
    {
      name: '青粲',
      color: '#c3d94e'
    },
    {
      name: '翠缥',
      color: '#b7d332'
    },
    {
      name: '人籁',
      color: '#9ebc19'
    },
    {
      name: '水龙吟',
      color: '#84a729'
    },
    {
      name: '地籁',
      color: '#dfceb4'
    },
    {
      name: '大块',
      color: '#bfa782'
    },
    {
      name: '养生主',
      color: '#b49b7f'
    },
    {
      name: '大云',
      color: '#94784f'
    },
    {
      name: '溶溶月',
      color: '#bec2bc'
    },
    {
      name: '绍衣',
      color: '#a8a19c'
    },
    {
      name: '石莲褐',
      color: '#92897b'
    },
    {
      name: '黑朱',
      color: '#70695d'
    },
    {
      name: '朱颜酡',
      color: '#f29a76'
    },
    {
      name: '苕荣',
      color: '#ed6d3d'
    },
    {
      name: '檎丹',
      color: '#e94829'
    },
    {
      name: '丹罽',
      color: '#e60012'
    },
    {
      name: '彤管',
      color: '#e2a2ac'
    },
    {
      name: '渥赭',
      color: '#dd6b7b'
    },
    {
      name: '唇脂',
      color: '#c25160'
    },
    {
      name: '朱孔阳',
      color: '#b81a35'
    },
    {
      name: '石发',
      color: '#6a8d52'
    },
    {
      name: '漆姑',
      color: '#5d8351'
    },
    {
      name: '芰荷',
      color: '#4f794a'
    },
    {
      name: '官绿',
      color: '#2a6e3f'
    },
    {
      name: '仙米',
      color: '#d4c9aa'
    },
    {
      name: '黄螺',
      color: '#b4a379'
    },
    {
      name: '降真香',
      color: '#9e8358'
    },
    {
      name: '远志',
      color: '#81663b'
    },
    {
      name: '嫩鹅黄',
      color: '#f2c867'
    },
    {
      name: '鞠衣',
      color: '#d3a237'
    },
    {
      name: '郁金裙',
      color: '#d08635'
    },
    {
      name: '黄流',
      color: '#9f6027'
    },
    {
      name: '筠雾',
      color: '#d5d1ae'
    },
    {
      name: '瓷秘',
      color: '#bfc096'
    },
    {
      name: '琬琰',
      color: '#a9a886'
    },
    {
      name: '青圭',
      color: '#92905d'
    },
    {
      name: '鸣珂',
      color: '#b3b59c'
    },
    {
      name: '青玉案',
      color: '#a8b092'
    },
    {
      name: '出岫',
      color: '#a9a773'
    },
    {
      name: '风入松',
      color: '#868c4e'
    },
    {
      name: '如梦令',
      color: '#ddbb99'
    },
    {
      name: '芸黄',
      color: '#d2a36c'
    },
    {
      name: '金埒',
      color: '#be9457'
    },
    {
      name: '雌黄',
      color: '#b4884d'
    },
    {
      name: '曾青',
      color: '#535164'
    },
    {
      name: '䒌靘',
      color: '#454659'
    },
    {
      name: '璆琳',
      color: '#343041'
    },
    {
      name: '瑾瑜',
      color: '#1e2732'
    },
    {
      name: '赩炽',
      color: '#cb523e'
    },
    {
      name: '石榴裙',
      color: '#b13b2e'
    },
    {
      name: '朱湛',
      color: '#95302e'
    },
    {
      name: '大繎',
      color: '#822327'
    },
    {
      name: '月魄',
      color: '#b2b6b6'
    },
    {
      name: '不皂',
      color: '#a7aaa1'
    },
    {
      name: '雷雨垂',
      color: '#7a7b78'
    },
    {
      name: '石涅',
      color: '#686a67'
    },
    {
      name: '扶光',
      color: '#f0c2a2'
    },
    {
      name: '椒房',
      color: '#db9c5e'
    },
    {
      name: '红友',
      color: '#d9883d'
    },
    {
      name: '光明砂',
      color: '#cc5d20'
    },
    {
      name: '山矾',
      color: '#f5f3f2'
    },
    {
      name: '玉頩',
      color: '#eae5e3'
    },
    {
      name: '二目鱼',
      color: '#dfe0d9'
    },
    {
      name: '明月珰',
      color: '#d4d3ca'
    },
    {
      name: '骍刚',
      color: '#f5b087'
    },
    {
      name: '赪霞',
      color: '#f18f60'
    },
    {
      name: '赪尾',
      color: '#ef845d'
    },
    {
      name: '朱柿',
      color: '#ed6d46'
    },
    {
      name: '天球',
      color: '#e0dfc6'
    },
    {
      name: '行香子',
      color: '#bfb99c'
    },
    {
      name: '王刍',
      color: '#a99f70'
    },
    {
      name: '荩箧',
      color: '#877d52'
    },
    {
      name: '赤灵',
      color: '#954024'
    },
    {
      name: '丹秫',
      color: '#873424'
    },
    {
      name: '木兰',
      color: '#662b1f'
    },
    {
      name: '麒麟竭',
      color: '#4c1e1a'
    },
    {
      name: '柔蓝',
      color: '#106898'
    },
    {
      name: '碧城',
      color: '#12507b'
    },
    {
      name: '蓝采和',
      color: '#06436f'
    },
    {
      name: '帝释青',
      color: '#003460'
    },
    {
      name: '夕岚',
      color: '#e3adb9'
    },
    {
      name: '雌霓',
      color: '#cf929e'
    },
    {
      name: '绛纱',
      color: '#b27777'
    },
    {
      name: '茹藘',
      color: '#a35f65'
    },
    {
      name: '葱青',
      color: '#edf1bb'
    },
    {
      name: '少艾',
      color: '#e3eb98'
    },
    {
      name: '绮钱',
      color: '#d8de8a'
    },
    {
      name: '翠樽',
      color: '#cdd171'
    },
    {
      name: '石蜜',
      color: '#d4bf89'
    },
    {
      name: '沙饧',
      color: '#bfa670'
    },
    {
      name: '巨吕',
      color: '#aa8e59'
    },
    {
      name: '吉金',
      color: '#896d47'
    },
    {
      name: '山岚',
      color: '#bed2bb'
    },
    {
      name: '渌波',
      color: '#9bb496'
    },
    {
      name: '青楸',
      color: '#81a380'
    },
    {
      name: '菉竹',
      color: '#698e6a'
    },
    {
      name: '窃蓝',
      color: '#88abda'
    },
    {
      name: '监德',
      color: '#6f94cd'
    },
    {
      name: '苍苍',
      color: '#5976ba'
    },
    {
      name: '白青',
      color: '#98b6c2'
    },
    {
      name: '竹月',
      color: '#7f9faf'
    },
    {
      name: '空青',
      color: '#66889e'
    },
    {
      name: '太师青',
      color: '#547689'
    },
    {
      name: '缟羽',
      color: '#efefef'
    },
    {
      name: '香皮',
      color: '#d8d1c5'
    },
    {
      name: '云母',
      color: '#c6beb1'
    },
    {
      name: '佩玖',
      color: '#ac9f8a'
    },
    {
      name: '麹尘',
      color: '#c0d09d'
    },
    {
      name: '绿沈',
      color: '#938f4c'
    },
    {
      name: '绞衣',
      color: '#7f754c'
    },
    {
      name: '素綦',
      color: '#595333'
    },
    {
      name: '退红',
      color: '#f0cfe3'
    },
    {
      name: '樱花',
      color: '#e4b8d5'
    },
    {
      name: '丁香',
      color: '#ce93bf'
    },
    {
      name: '木槿',
      color: '#ba79b1'
    },
    {
      name: '余白',
      color: '#c9cfc1'
    },
    {
      name: '兰苕',
      color: '#a8b78c'
    },
    {
      name: '碧滋',
      color: '#90a07d'
    },
    {
      name: '葱倩',
      color: '#6c8650'
    },
    {
      name: '云门',
      color: '#a2d2e2'
    },
    {
      name: '西子',
      color: '#87c0ca'
    },
    {
      name: '天水碧',
      color: '#5aa4ae'
    },
    {
      name: '法翠',
      color: '#108b96'
    },
    {
      name: '桑蕾',
      color: '#ead89a'
    },
    {
      name: '太一余粮',
      color: '#d5b45c'
    },
    {
      name: '秋香',
      color: '#bf9c46'
    },
    {
      name: '老茯神',
      color: '#aa8534'
    },
    {
      name: '凝脂',
      color: '#f5f2e9'
    },
    {
      name: '玉色',
      color: '#eae4d1'
    },
    {
      name: '黄润',
      color: '#dfd6b8'
    },
    {
      name: '缣缃',
      color: '#d5c8a0'
    },
    {
      name: '蕉月',
      color: '#86908a'
    },
    {
      name: '千山翠',
      color: '#6b7d73'
    },
    {
      name: '结绿',
      color: '#555f4d'
    },
    {
      name: '绿云',
      color: '#45493d'
    },
    {
      name: '藕丝秋半',
      color: '#d3cbc5'
    },
    {
      name: '苍烟落照',
      color: '#c8b5b3'
    },
    {
      name: '红藤杖',
      color: '#928187'
    },
    {
      name: '紫鼠',
      color: '#594c57'
    },
    {
      name: '黄粱',
      color: '#c4b798'
    },
    {
      name: '蒸栗',
      color: '#a58a5f'
    },
    {
      name: '射干',
      color: '#7c623f'
    },
    {
      name: '油葫芦',
      color: '#644d31'
    },
    {
      name: '卵色',
      color: '#d5e3d4'
    },
    {
      name: '葭菼',
      color: '#cad7c5'
    },
    {
      name: '冰台',
      color: '#becab7'
    },
    {
      name: '青古',
      color: '#b3bda9'
    },
    {
      name: '栾华',
      color: '#c0ad5e'
    },
    {
      name: '大赤',
      color: '#aa9649'
    },
    {
      name: '佛赤',
      color: '#8f3d2c'
    },
    {
      name: '蜜褐',
      color: '#683632'
    },
    {
      name: '吐绶蓝',
      color: '#4182a4'
    },
    {
      name: '鱼师青',
      color: '#32788a'
    },
    {
      name: '软翠',
      color: '#006d87'
    },
    {
      name: '浅云',
      color: '#eaeef1'
    },
    {
      name: '素采',
      color: '#d4dde1'
    },
    {
      name: '影青',
      color: '#bdcbd2'
    },
    {
      name: '逍遥游',
      color: '#b2bfc3'
    },
    {
      name: '醽醁',
      color: '#a6bab1'
    },
    {
      name: '翠涛',
      color: '#819d8e'
    },
    {
      name: '青梅',
      color: '#778a77'
    },
    {
      name: '翕赩',
      color: '#5f766a'
    },
    {
      name: '九斤黄',
      color: '#ddb078'
    },
    {
      name: '杏子',
      color: '#da9233'
    },
    {
      name: '媚蝶',
      color: '#bc6e37'
    },
    {
      name: '韎韐',
      color: '#9f5221'
    },
    {
      name: '东方既白',
      color: '#8ba3c7'
    },
    {
      name: '绀宇',
      color: '#003d74'
    },
    {
      name: '佛头青',
      color: '#19325f'
    },
    {
      name: '弗肯红',
      color: '#ecd9c7'
    },
    {
      name: '赤璋',
      color: '#e1c199'
    },
    {
      name: '茧色',
      color: '#c6a268'
    },
    {
      name: '密陀僧',
      color: '#b3934b'
    },
    {
      name: '胭脂虫',
      color: '#ab1d22'
    },
    {
      name: '朱樱',
      color: '#8f1d22'
    },
    {
      name: '爵头',
      color: '#631216'
    },
    {
      name: '甘石',
      color: '#bdb2b2'
    },
    {
      name: '迷楼灰',
      color: '#91828f'
    },
    {
      name: '鸦雏',
      color: '#6a5b6d'
    },
    {
      name: '烟墨',
      color: '#5c4f55'
    },
    {
      name: '十样锦',
      color: '#f8c6b5'
    },
    {
      name: '檀唇',
      color: '#da9e8c'
    },
    {
      name: '琼琚',
      color: '#d77f66'
    },
    {
      name: '棠梨',
      color: '#b15a43'
    },
    {
      name: '蜜合',
      color: '#dfd7c2'
    },
    {
      name: '假山南',
      color: '#d4c1a6'
    },
    {
      name: '紫花布',
      color: '#bea78b'
    },
    {
      name: '沉香',
      color: '#99806c'
    },
    {
      name: '半见',
      color: '#fffbc7'
    },
    {
      name: '女贞黄',
      color: '#f7eead'
    },
    {
      name: '绢纨',
      color: '#ece093'
    },
    {
      name: '繱犗',
      color: '#88bfb8'
    },
    {
      name: '二绿',
      color: '#5da39d'
    },
    {
      name: '铜青',
      color: '#3d8e86'
    },
    {
      name: '黄琮',
      color: '#9e8c6b'
    },
    {
      name: '茶色',
      color: '#887657'
    },
    {
      name: '伽罗',
      color: '#6d5c3d'
    },
    {
      name: '苍艾',
      color: '#5a4b3b'
    },
    {
      name: '藕丝褐',
      color: '#a88787'
    },
    {
      name: '葡萄褐',
      color: '#9e696d'
    },
    {
      name: '苏方',
      color: '#81474c'
    },
    {
      name: '福色',
      color: '#662b2f'
    },
    {
      name: '龙膏烛',
      color: '#de82a7'
    },
    {
      name: '黪紫',
      color: '#cc73a0'
    },
    {
      name: '胭脂水',
      color: '#b95a89'
    },
    {
      name: '胭脂紫',
      color: '#b0436f'
    },
    {
      name: '小红',
      color: '#e67762'
    },
    {
      name: '岱赭',
      color: '#dd6b4f'
    },
    {
      name: '朱殷',
      color: '#b93a26'
    },
    {
      name: '星郎',
      color: '#bcd4e7'
    },
    {
      name: '晴山',
      color: '#a3bbdb'
    },
    {
      name: '品月',
      color: '#8aabcc'
    },
    {
      name: '明茶褐',
      color: '#9e8368'
    },
    {
      name: '荆褐',
      color: '#906c4a'
    },
    {
      name: '驼褐',
      color: '#7c5b3e'
    },
    {
      name: '椒褐',
      color: '#72453a'
    },
    {
      name: '粉米',
      color: '#efc4ce'
    },
    {
      name: '縓缘',
      color: '#ce8892'
    },
    {
      name: '美人祭',
      color: '#c35c6a'
    },
    {
      name: '鞓红',
      color: '#b04552'
    },
    {
      name: '米汤娇',
      color: '#eeead9'
    },
    {
      name: '草白',
      color: '#bfc1a9'
    },
    {
      name: '玄校',
      color: '#a9a082'
    },
    {
      name: '綟绶',
      color: '#756c4b'
    },
    {
      name: '雀梅',
      color: '#788a6f'
    },
    {
      name: '莓莓',
      color: '#4e6548'
    },
    {
      name: '螺青',
      color: '#3f503b'
    },
    {
      name: '暮山紫',
      color: '#a4abd6'
    },
    {
      name: '紫苑',
      color: '#757cbb'
    },
    {
      name: '优昙瑞',
      color: '#615ea8'
    },
    {
      name: '延维',
      color: '#4a4b9d'
    },
    {
      name: '银红',
      color: '#e7cad3'
    },
    {
      name: '莲红',
      color: '#d9a0b3'
    },
    {
      name: '紫梅',
      color: '#bb7a8c'
    },
    {
      name: '紫矿',
      color: '#9e4e56'
    },
    {
      name: '咸池',
      color: '#daa9a9'
    },
    {
      name: '红䵂',
      color: '#cd7372'
    },
    {
      name: '蚩尤旗',
      color: '#a85858'
    },
    {
      name: '霁红',
      color: '#7c4449'
    },
    {
      name: '莺儿',
      color: '#ebe1a9'
    },
    {
      name: '禹余粮',
      color: '#e1d279'
    },
    {
      name: '蛾黄',
      color: '#be8a2f'
    },
    {
      name: '濯绛',
      color: '#796860'
    },
    {
      name: '墨黪',
      color: '#585248'
    },
    {
      name: '驖骊',
      color: '#46433b'
    },
    {
      name: '京元',
      color: '#31322c'
    },
    {
      name: '酂白',
      color: '#f6f9e4'
    },
    {
      name: '断肠',
      color: '#ecebc2'
    },
    {
      name: '田赤',
      color: '#e1d384'
    },
    {
      name: '黄封',
      color: '#cab272'
    },
    {
      name: '丁香褐',
      color: '#bd9683'
    },
    {
      name: '棠梨褐',
      color: '#955a42'
    },
    {
      name: '朱石栗',
      color: '#81492c'
    },
    {
      name: '枣褐',
      color: '#68361a'
    },
    {
      name: '秋蓝',
      color: '#7d929f'
    },
    {
      name: '育阳染',
      color: '#576470'
    },
    {
      name: '霁蓝',
      color: '#3c4654'
    },
    {
      name: '獭见',
      color: '#151d29'
    },
    {
      name: '井天',
      color: '#a4c9cc'
    },
    {
      name: '正青',
      color: '#6ca8af'
    },
    {
      name: '扁青',
      color: '#509296'
    },
    {
      name: '䌦色',
      color: '#226b68'
    },
    {
      name: '紫府',
      color: '#995d7f'
    },
    {
      name: '地血',
      color: '#814662'
    },
    {
      name: '芥拾紫',
      color: '#602641'
    },
    {
      name: '油紫',
      color: '#420b2f'
    },
    {
      name: '骨缥',
      color: '#ebe3c7'
    },
    {
      name: '青白玉',
      color: '#cac5a0'
    },
    {
      name: '绿豆褐',
      color: '#92896b'
    },
    {
      name: '冥色',
      color: '#665f4d'
    },
    {
      name: '肉红',
      color: '#ddc5b8'
    },
    {
      name: '珠子褐',
      color: '#bea89d'
    },
    {
      name: '鹰背褐',
      color: '#8f6d5f'
    },
    {
      name: '麝香褐',
      color: '#694b3c'
    },
    {
      name: '石英',
      color: '#c8b6bb'
    },
    {
      name: '银褐',
      color: '#9c8d9b'
    },
    {
      name: '紫诰',
      color: '#76555d'
    }
  ]
  return COLORS
}))
