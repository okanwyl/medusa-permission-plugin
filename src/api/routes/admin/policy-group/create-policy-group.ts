import {
    IsArray,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString, ValidateNested,
} from "class-validator"
import {Request, Response} from "express"
import {EntityManager} from "typeorm"
import {defaultAdminUniversityRelations} from "./index"
import PoliciesGroupService from "../../../../services/policies-group";
import {ProductProductCategoryReq} from "../../../../types/policies-group";
import {Type} from "class-transformer";
import {validator} from "@medusajs/medusa";

export default async (req: Request, res: Response) => {
    // const {validatedBody} = req as { validatedBody: AdminPoliciesGroupReq }
    const validated = await validator(AdminPoliciesGroupReq, req.body)

    console.log(validated);
    const policiesGroupService: PoliciesGroupService =
        req.scope.resolve("policiesGroupService")

    const manager: EntityManager = req.scope.resolve("manager")

    const created = await manager.transaction(async (transactionManager) => {
        return await policiesGroupService
            .withTransaction(transactionManager)
            .create(validated)
    })

    const policiesGroup = await policiesGroupService.retrieve(created.id, {
        relations: defaultAdminUniversityRelations,
    })

    res.status(200).json({policiesGroup})
}


export class AdminPoliciesGroupReq {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    handle?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @Type(() => ProductProductCategoryReq)
    @ValidateNested({ each: true })
    @IsArray()
    policies?: ProductProductCategoryReq[]
}