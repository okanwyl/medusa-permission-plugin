import * as z from "zod"
import { groupPoliciesPoliciesSchema } from "./schema"
export type GroupPoliciesPoliciesSchema = z.infer<typeof groupPoliciesPoliciesSchema>
