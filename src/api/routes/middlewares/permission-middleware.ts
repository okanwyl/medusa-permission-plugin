import {UserService} from "@medusajs/medusa"
import {User} from "../../../models/user";
import PermissionsService from "../../../services/permissions";
import {Request, Response, NextFunction} from "express";

export async function permissionMiddleware(req: Request, res: Response, next: NextFunction) {
    let loggedInUser: User | null = null

    if (req.user && req.user.userId) {
        const userService = req.scope.resolve("userService") as UserService
        // @ts-ignore
        loggedInUser = await userService.retrieve(req.user.userId, {relations: ["policy_cluster"]})
    }


    const permissionsService: PermissionsService = req.scope.resolve("permissionsService") as PermissionsService


    await permissionsService.init();

    // TODO: use this
    console.log(req.path)
    console.log(loggedInUser)
    next()
}
