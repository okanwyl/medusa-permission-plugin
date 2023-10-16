import cors from "cors"
import {Router} from "express"
import bodyParser from "body-parser"
import initializeUniversityRoutes from "./permissions"
import {authenticate, errorHandler} from "@medusajs/medusa"

const adminRouter = Router()

export function getAdminRouter(adminCorsOptions): Router {
    adminRouter.use(cors(adminCorsOptions), bodyParser.json())

    const permissionsRouter = initializeUniversityRoutes(adminRouter)

    adminRouter.use(
        "/admin/",
        permissionsRouter,
        errorHandler()
    )

    return adminRouter
}
