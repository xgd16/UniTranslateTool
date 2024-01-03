import { clause } from "./common"
import { translate as translateApi } from "../api/translate"

// 调用翻译处理
export const translate = async (text: string, from: string, to: string, platform: string = '') => {
    let toText: string = ''

    const branch = text.split('\n')

    for (const key1 in branch) {

        const item1 = branch[key1]
        const boomText = clause(item1)

        for (const key in boomText) {
            
            const item = boomText[key]
            const respData = await translateApi(item, from, to, platform)
            
            if (respData.code != 1000) {
                toText = '翻译失败'
                return toText
            }

            toText += respData.data.translate.join('')
        }
        toText += '\n'
    }
    return toText
}