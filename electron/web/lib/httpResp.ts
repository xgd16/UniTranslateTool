import { Response } from "express"

type SendData = {
    code?: number
    data?: any
    msg?: string
}

class Resp {
    private _res: Response
    private _data: any = []
    private _code: number = 1000
    private _msg: string = 'success'

    constructor(res: Response) {
        this._res = res
    }

    public setCode(code: number): Resp {
        this._code = code
        return this
    }

    public setData(data: any): Resp {
        this._data = data
        return this
    }

    public send(data: SendData =  {
        code: this._code,
        data: this._data,
        msg: this._msg
    }): void {
        data.code && (this._code = data.code)
        data.data && (this._data = data.data)
        data.msg && (this._msg = data.msg)
        this._res.send({
            code: this._code,
            data: this._data,
            msg: this._msg,
            time: Date.now()
        })
    }
}

export default function (res: Response): Resp {
    return new Resp(res)
}