import { Express } from 'express'
import bodyParser from 'body-parser';
import IndexController from '../controller/index'

export const initRoutes = (service: Express) => {
    service.use(bodyParser.json())

    service.get('/', IndexController.index)
}