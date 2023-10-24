import { Router } from "express"
import "reflect-metadata"
import { PaginatedResponse, transformBody } from "@medusajs/medusa"
import middlewares, {
  transformQuery,
} from "@medusajs/medusa/dist/api/middlewares"
import { AdminPolicyClusterReq } from "./create-policy-cluster"
import { AdminGetPolicyClusterParams } from "./list-policy-cluster"
import { AdminPostPolicyClusterReq } from "./update-policy-cluster"

export default (app) => {
  const route = Router()
  app.use("/policy-cluster", route)

  route.post("/", middlewares.wrap(require("./create-policy-cluster").default))

  route.get(
    "/",
    transformQuery(AdminGetPolicyClusterParams, {
      defaultRelations: defaultAdminPolicyClusterRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-policy-cluster").default)
  )

  const policiesRouter = Router({ mergeParams: true })
  route.use("/:id", policiesRouter)

  policiesRouter.post(
    "/",
    transformBody(AdminPostPolicyClusterReq),
    middlewares.wrap(require("./update-policy-cluster").default)
  )

  policiesRouter.delete(
    "/",
    middlewares.wrap(require("./delete-policy-cluster").default)
  )

  policiesRouter.get(
    "/",
    middlewares.wrap(require("./get-policy-cluster").default)
  )

  return app
}
export const defaultAdminPolicyClusterRelations = []

export * from "./list-policy-cluster"
export * from "./create-policy-cluster"
export * from "./delete-policy-cluster"
export * from "./get-policy-cluster"
export * from "./update-policy-cluster"
