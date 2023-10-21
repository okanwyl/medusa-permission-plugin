import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { Policies } from "../models/policies"

export const PoliciesRepository = dataSource.getRepository(Policies).extend({})
export default PoliciesRepository
