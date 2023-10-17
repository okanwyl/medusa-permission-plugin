import {IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator"
import {Request, Response} from "express"
import {EntityManager} from "typeorm"
import {defaultAdminPolicyGroupRelations} from "."
import PoliciesService from "../../../../services/policies";
import PoliciesGroupService from "../../../../services/policies-group";
import {Type} from "class-transformer";
import {PoliciesGroupPolicyReq} from "../../../../types/policies-group";

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
        relations: defaultAdminPolicyGroupRelations,
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

    @IsOptional()
    @Type(() => PoliciesGroupPolicyReq)
    @ValidateNested({each: true})
    @IsArray()
    policies?: PoliciesGroupPolicyReq[]
}
