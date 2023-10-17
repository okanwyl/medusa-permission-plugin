import cors from "cors"
import {Router} from "express"
import bodyParser from "body-parser"
import getPermissionsRouter from "./policies"
import getPolicyGroupRouter from "./policy-group"
import {errorHandler} from "@medusajs/medusa"

const adminRouter = Router()

export function getAdminRouter(adminCorsOptions): Router {
    adminRouter.use(cors(adminCorsOptions), bodyParser.json())

    const permissionsRouter = getPermissionsRouter(adminRouter)
    const policyGroupRouter = getPolicyGroupRouter(adminRouter)

    adminRouter.use(
        "/admin/",
        permissionsRouter,
        policyGroupRouter,
        errorHandler()
    )

    return adminRouter
}
