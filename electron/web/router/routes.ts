import { Express } from 'express'
import bodyParser from 'body-parser';
import IndexController from '../controller/index'
import TranslateController from '../controller/translate'

export const initRoutes = (service: Express) => {
    service.use(bodyParser.json())

    service.get('/', IndexController.index)
    service.get('/document', TranslateController.document)
}