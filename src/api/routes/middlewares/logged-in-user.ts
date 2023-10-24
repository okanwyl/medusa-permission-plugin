import { UserService } from "@medusajs/medusa"
import {User} from "../../../models/user";
import PermissionsService from "../../../services/permissions";

export async function permissionMiddleware(req, res, next) {
  let loggedInUser: User | null = null

  if (req.user && req.user.userId) {
    const userService = req.scope.resolve("userService") as UserService
    // @ts-ignore
    loggedInUser = await userService.retrieve(req.user.userId,  {relations: ["policy_cluster"]})
  }


  const permissionsService : PermissionsService = req.scope.resolve("permissionsService") as PermissionsService

  // const policies = await permissionsService.fetchPolicies()
  console.log(permissionsService.policiesHashmap)
  console.log(loggedInUser)
  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  })


  console.log(req.originalUrl)
  console.log(req.method)

  next()
}
