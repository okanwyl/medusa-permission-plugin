import { User, UserService } from "@medusajs/medusa"

export async function permissionMiddleware(req, res, next) {
  let loggedInUser: User | null = null

  if (req.user && req.user.userId) {
    const userService = req.scope.resolve("userService") as UserService
    loggedInUser = await userService.retrieve(req.user.userId)
  }

  console.log(loggedInUser)

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  })

  // console.log(loggedInUser);

  console.log(req.originalUrl)
  console.log(req.method)

  next()
}
