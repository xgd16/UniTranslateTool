import express from 'express'
import {type Server as HttpServer} from 'http'
import {initRoutes} from './router/routes'

const service = express()
let expressService: HttpServer

export async function createWebService(host: string, port: number) {
    expressService = service.listen(port, host, () => {
        console.log(`Web server is running at http://${host}:${port}`)
    })
}


initRoutes(service)

export async function closeWebService() {
    expressService.close()
}