import cors from "cors"
import {Router} from "express"
import bodyParser from "body-parser"
import getPermissionsRouter from "./permissions"
import {errorHandler} from "@medusajs/medusa"

const adminRouter = Router()

export function getAdminRouter(adminCorsOptions): Router {
    adminRouter.use(cors(adminCorsOptions), bodyParser.json())

    const permissionsRouter = getPermissionsRouter(adminRouter)

    adminRouter.use(
        "/admin/",
        permissionsRouter,
        errorHandler()
    )

    return adminRouter
}
