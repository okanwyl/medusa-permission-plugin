import {Router} from "express"
import "reflect-metadata"
import {PaginatedResponse, transformBody} from "@medusajs/medusa"
import middlewares, {
    transformQuery,
} from "@medusajs/medusa/dist/api/middlewares"
import {AdminGetUniversityParams} from "./list-permissions"
import {Permissions} from "../../../../models/permissions"

export default (app) => {
    const route = Router()
    app.use("/university", route)


    route.get(
        "/",
        transformQuery(AdminGetUniversityParams, {
            defaultRelations: defaultAdminUniversityRelations,
            defaultFields: defaultAdminUniversityFields,
            isList: true,
        }),
        middlewares.wrap(require("./list-permissions").default)
    )

    return app
}

export const defaultAdminUniversityFields = []

export const defaultAdminUniversityRelations = []

export type AdminUniversityListRes = PaginatedResponse & {
    permissions: Permissions[]
}


export type DeleteResponse = {
    id: string
    object: string
    deleted: boolean
}

export * from "./list-permissions"