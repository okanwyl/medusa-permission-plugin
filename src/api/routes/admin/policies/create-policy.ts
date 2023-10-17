import {
    IsArray,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator"
import {Request, Response} from "express"
import {EntityManager} from "typeorm"
import {defaultAdminUniversityRelations} from "./index"
import PoliciesService from "../../../../services/policies";

export default async (req: Request, res: Response) => {
    const {validatedBody} = req as { validatedBody: AdminPoliciesReq }

    const policiesService: PoliciesService =
        req.scope.resolve("policiesService")

    const manager: EntityManager = req.scope.resolve("manager")

    const created = await manager.transaction(async (transactionManager) => {
        return await policiesService
            .withTransaction(transactionManager)
            .create(validatedBody)
    })

    const policy = await policiesService.retrieve(created.id, {
        relations: defaultAdminUniversityRelations,
    })

    res.status(200).json({university: policy})
}


export class AdminPoliciesReq {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    handle?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    method: string;

    @IsString()
    @IsNotEmpty()
    base_router: string;

    @IsString()
    @IsOptional()
    custom_regex?: string;
}