import {dataSource} from "@medusajs/medusa/dist/loaders/database";
import {PoliciesGroup} from "../models/policies-group";

export const PoliciesGroupRepository = dataSource
    .getRepository(PoliciesGroup)
    .extend({})
export default PoliciesGroupRepository