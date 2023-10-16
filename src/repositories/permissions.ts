import {dataSource} from "@medusajs/medusa/dist/loaders/database";
import {Permissions} from "../models/permissions";
import {ExtendedFindConfig} from "@medusajs/types"

export const PermissionsRepository = dataSource
    .getRepository(Permissions)
    .extend({})
export default PermissionsRepository