import req, { Response } from '../utils/request'


type LangMap = {[key: string]: string}

export const getLangList = () => {
    return req<Response<LangMap>>({
        url: '/api/getLangList',
        method: 'GET'
    })
}

type TranslationData = {
    from: string;
    originalText: string;
    originalTextLen: number;
    platform: string;
    to: string;
    translate: string[];
    translationLen: number;
};

export const translate = (text: string, from: string, to: string) => {
    return req<Response<TranslationData>>({
        url: '/api/translate',
        method: 'POST',
        data: {
            text,
            from,
            to
        }
    })
}