import cors from "cors"
import { Router } from "express"
import authenticate from "@medusajs/medusa/dist/api/middlewares/authenticate"
import { permissionMiddleware } from "./middlewares/permission-middleware"
import { errorHandler } from "@medusajs/medusa"

const router = Router()
export default function createPermissionMiddleware(adminConfiguration) {
  router.use(
    /^\/admin(?!\/auth(\/|$))(?!\/users(\/|$))(?!\/invites(\/|$))/,
    cors(adminConfiguration),
    authenticate(),
    permissionMiddleware,
    errorHandler()
  )

  return router
}
