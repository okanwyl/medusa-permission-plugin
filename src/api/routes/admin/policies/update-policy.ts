import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator"
import {Request, Response} from "express"
import {EntityManager} from "typeorm"
import PoliciesService from "../../../../services/policies";

export default async (req: Request, res: Response) => {
    const {id} = req.params
    const {validatedBody} = req as {
        validatedBody: AdminPostPoliciesReq
    }

    const policiesService: PoliciesService =
        req.scope.resolve("policiesService")

    const manager: EntityManager = req.scope.resolve("manager")
    const updated = await manager.transaction(async (transactionManager) => {
        return await policiesService
            .withTransaction(transactionManager)
            .update(id, validatedBody)
    })

    const policy = await policiesService.retrieve(updated.id, {})

    res.status(200).json({policy})
}

export class AdminPostPoliciesReq {
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

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    method?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    base_router?: string;

    @IsString()
    @IsOptional()
    custom_regex?: string;
}
