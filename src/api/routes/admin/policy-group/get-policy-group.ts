import {Request, Response} from "express"
import {defaultAdminUniversityRelations} from "./index"
import PoliciesGroupService from "../../../../services/policies-group";

export default async (req: Request, res: Response) => {
    const {id} = req.params

    const policiesGroupService: PoliciesGroupService =
        req.scope.resolve("policiesGroupService")

    const policyGroup = await policiesGroupService.retrieve(id, {
        relations: defaultAdminUniversityRelations,
    })
    res.status(200).json({policy: policyGroup})
}
