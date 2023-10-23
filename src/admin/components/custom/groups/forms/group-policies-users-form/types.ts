import * as z from "zod"
import { groupPoliciesUsersSchema } from "./schema"
export type GroupPoliciesUsersSchema = z.infer<typeof groupPoliciesUsersSchema>
