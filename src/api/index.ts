import configLoader from "@medusajs/medusa/dist/loaders/config"
import connectRouterOverrider from "./routes/create-product";

export default function (rootDirectory: string) {
    const config = configLoader(rootDirectory)

    const adminCors = {
        origin: config.projectConfig.admin_cors.split(","),
        credentials: true,
    }

    const defaultRouters = [
        connectRouterOverrider(adminCors),
    ]

    return [...defaultRouters]
}