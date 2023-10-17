import {IsNotEmpty, IsOptional, IsString} from "class-validator"
import {Request, Response} from "express"
import {EntityManager} from "typeorm"
import {defaultAdminUniversityRelations} from "."
import PoliciesService from "../../../../services/policies";
import PoliciesGroupService from "../../../../services/policies-group";

export default async (req: Request, res: Response) => {
    const {id} = req.params
    const {validatedBody} = req as {
        validatedBody: AdminPostPoliciesGroupReq
    }

    const policiesGroupService: PoliciesGroupService =
        req.scope.resolve("policiesGroupService")

    const manager: EntityManager = req.scope.resolve("manager")
    const updated = await manager.transaction(async (transactionManager) => {
        return await policiesGroupService
            .withTransaction(transactionManager)
            .update(id, validatedBody)
    })

    const policiesGroup = await policiesGroupService.retrieve(updated.id, {
        relations: defaultAdminUniversityRelations,
    })

    res.status(200).json({policy: policiesGroup})
}

export class AdminPostPoliciesGroupReq {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsOptional()
    handle?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
