import cors from "cors";
import {Router} from "express";
import
    authenticate
    from "@medusajs/medusa/dist/api/middlewares/authenticate"
import {permissionMiddleware} from "./middlewares/logged-in-user";
import {errorHandler} from "@medusajs/medusa";


const router = Router();
export default function createProductRouter(adminConfiguration) {


    router.use(
        /^\/admin(?!\/auth(\/|$))/,
        cors(adminConfiguration),
        authenticate(),
        permissionMiddleware,
        errorHandler()
    )


    return router

}
