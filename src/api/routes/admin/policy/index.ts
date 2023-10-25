import { Router } from "express"
import "reflect-metadata"
import { transformBody } from "@medusajs/medusa"
import { AdminGetPolicyParams } from "./list-policy"
import { AdminPolicyReq } from "./create-policy"
import { AdminPostPolicyReq } from "./update-policy"
import { transformQuery } from "@medusajs/medusa"
import middlewares from "@medusajs/medusa/dist/api/middlewares"

export default (app) => {
  const route = Router()
  app.use("/policy", route)

  route.post(
    "/",
    transformBody(AdminPolicyReq),
    middlewares.wrap(require("./create-policy").default)
  )

  route.get(
    "/",
    transformQuery(AdminGetPolicyParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list-policy").default)
  )

  const policiesRouter = Router({ mergeParams: true })

  route.use("/:id", policiesRouter)

  policiesRouter.post(
    "/",
    transformBody(AdminPostPolicyReq),
    middlewares.wrap(require("./update-policy").default)
  )

  policiesRouter.delete(
    "/",
    middlewares.wrap(require("./delete-policy").default)
  )

  policiesRouter.get("/", middlewares.wrap(require("./get-policy").default))

  return app
}

export * from "./list-policy"
export * from "./create-policy"
export * from "./delete-policy"
export * from "./update-policy"
export * from "./get-policy"
