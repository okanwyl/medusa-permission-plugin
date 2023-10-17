import {Router} from "express"
import "reflect-metadata"
import {PaginatedResponse, transformBody} from "@medusajs/medusa"
import middlewares, {transformQuery} from "@medusajs/medusa/dist/api/middlewares"
import {AdminPoliciesGroupReq} from "./create-policy-group";
import {AdminGetUniversityParams} from "./list-policy-group";
import {AdminPostPoliciesGroupReq} from "./update-policy-group";

export default (app) => {
    const route = Router()
    app.use("/policy-groups", route)


    route.post(
        "/",
        middlewares.wrap(require("./create-policy-group").default)
    )

    route.get(
        "/",
        transformQuery(AdminGetUniversityParams, {
            defaultRelations: defaultAdminPolicyGroupRelations,
            isList: true,
        }),
        middlewares.wrap(require("./list-policy-group").default)
    )

    const policiesRouter = Router({mergeParams: true})
    route.use("/:id", policiesRouter)


    policiesRouter.post(
        "/",
        transformBody(AdminPostPoliciesGroupReq),
        middlewares.wrap(require("./update-policy-group").default)
    )

    policiesRouter.delete(
        "/",
        middlewares.wrap(require("./delete-policy-group").default)
    )

    policiesRouter.get(
        "/",
        middlewares.wrap(require("./get-policy-group").default)
    )

    return app
};


export const defaultAdminPolicyGroupRelations = [
    "policies"
]


export * from "./list-policy-group"
export * from "./create-policy-group"
export * from "./delete-policy-group"
export * from "./get-policy-group"
export * from "./update-policy-group"
