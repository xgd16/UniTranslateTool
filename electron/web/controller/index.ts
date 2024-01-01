import { Request, Response } from 'express';
import httpResp from '../lib/httpResp';

const IndexController = {
    index: (req: Request, res: Response) => {
        return httpResp(res).send({msg: "http service ok!!!"})
    }
}

export default IndexController