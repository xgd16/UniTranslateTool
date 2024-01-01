// 判断是否是json字符串
export function isJSON(str: any): boolean {
    try {
        JSON.parse(str)
        return true
    } catch(e) {
        return false
    }
}

// 语言列表
export const langArr:{[key: string]: string} = JSON.parse('{"ar":"阿拉伯语","de":"德语","en":"英语","es":"西班牙语","fr":"法语","hi":"印地语","id":"印度尼西亚语","it":"意大利语","ja":"日语","ko":"韩语","nl":"荷兰语","pt":"葡萄牙语","ru":"俄语","th":"泰语","vi":"越南语","zh-CHS":"简体中文","zh-CHT":"繁体中文","af":"南非荷兰语","am":"阿姆哈拉语","az":"阿塞拜疆语","be":"白俄罗斯语","bg":"保加利亚语","bn":"孟加拉语","bs":"波斯尼亚语","ca":"加泰隆语","ceb":"宿务语","co":"科西嘉语","cs":"捷克语","cy":"威尔士语","da":"丹麦语","el":"希腊语","eo":"世界语","et":"爱沙尼亚语","eu":"巴斯克语","fa":"波斯语","fi":"芬兰语","fj":"斐济语","fy":"弗里西语","ga":"爱尔兰语","gd":"苏格兰盖尔语","gl":"加利西亚语","gu":"古吉拉特语","ha":"豪萨语","haw":"夏威夷语","he":"希伯来语","hr":"克罗地亚语","ht":"海地克里奥尔语","hu":"匈牙利语","hy":"亚美尼亚语","ig":"伊博语","is":"冰岛语","jw":"爪哇语","ka":"格鲁吉亚语","kk":"哈萨克语","km":"高棉语","kn":"卡纳达语","ku":"库尔德语","ky":"柯尔克孜语","la":"拉丁语","lb":"卢森堡语","lo":"老挝语","lt":"立陶宛语","lv":"拉脱维亚语","mg":"马尔加什语","mi":"毛利语","mk":"马其顿语","ml":"马拉雅拉姆语","mn":"蒙古语","mr":"马拉地语","ms":"马来语","mt":"马耳他语","mww":"白苗语","my":"缅甸语","ne":"尼泊尔语","no":"挪威语","ny":"齐切瓦语","otq":"克雷塔罗奥托米语","pa":"旁遮普语","pl":"波兰语","ps":"普什图语","ro":"罗马尼亚语","sd":"信德语","si":"僧伽罗语","sk":"斯洛伐克语","sl":"斯洛文尼亚语","sm":"萨摩亚语","sn":"修纳语","so":"索马里语","sq":"阿尔巴尼亚语","sr-Cyrl":"塞尔维亚语(西里尔文)","sr-Latn":"塞尔维亚语(拉丁文)","st":"塞索托语","su":"巽他语","sv":"瑞典语","sw":"斯瓦希里语","ta":"泰米尔语","te":"泰卢固语","tg":"塔吉克语","tl":"菲律宾语","tlh":"克林贡语","to":"汤加语","tr":"土耳其语","ty":"塔希提语","uk":"乌克兰语","ur":"乌尔都语","uz":"乌兹别克语","xh":"南非科萨语","yi":"意第绪语","yo":"约鲁巴语","yua":"尤卡坦玛雅语","yue":"粤语","zu":"南非祖鲁语"}')

// 分割句子
export const clause = (text: string): string[] => {
    // 使用正则表达式匹配句子的常见结尾标点符号
    let sentences = text.match(/[^\.!\?。\！\？]+[\.!\?。\！\？]+/g);
    // 如果没有匹配到句子，直接返回原始文本
    if (!sentences) {
        return [text];
    }
    // 返回分割后的句子数组
    return sentences.map(sentence => sentence.trim());
}

// 滚动到指定元素
export const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}