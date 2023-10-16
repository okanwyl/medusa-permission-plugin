import configLoader from "@medusajs/medusa/dist/loaders/config"
import connectRouterOverrider from "./routes/create-product";
import {getAdminRouter} from "./routes/admin";

export default function (rootDirectory: string) {
    const config = configLoader(rootDirectory)

    const adminCors = {
        origin: config.projectConfig.admin_cors.split(","),
        credentials: true,
    }

    const defaultRouters = [
        connectRouterOverrider(adminCors),
    ]

    const permissionRouter = getAdminRouter(adminCors);

    return [ permissionRouter]
}