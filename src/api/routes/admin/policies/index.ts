import { Router } from "express"
import "reflect-metadata"
import { transformBody } from "@medusajs/medusa"
import middlewares, {
  transformQuery,
} from "@medusajs/medusa/dist/api/middlewares"
import { AdminGetUniversityParams } from "./list-policies"
import { AdminPoliciesReq } from "./create-policy"
import { AdminPostPoliciesReq } from "./update-policy"

export default (app) => {
  const route = Router()
  app.use("/policies", route)

  route.post(
    "/",
    transformBody(AdminPoliciesReq),
    middlewares.wrap(require("./create-policy").default)
  )

  route.get(
    "/",
    transformQuery(AdminGetUniversityParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list-policies").default)
  )

  const policiesRouter = Router({ mergeParams: true })

  route.use("/:id", policiesRouter)

  policiesRouter.post(
    "/",
    transformBody(AdminPostPoliciesReq),
    middlewares.wrap(require("./update-policy").default)
  )

  policiesRouter.delete(
    "/",
    middlewares.wrap(require("./delete-policy").default)
  )

  policiesRouter.get("/", middlewares.wrap(require("./get-policy").default))

  return app
}

export * from "./list-policies"
export * from "./create-policy"
export * from "./delete-policy"
export * from "./update-policy"
