import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import PoliciesService from "../../../../services/policies"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policiesService: PoliciesService = req.scope.resolve("policiesService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await policiesService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id,
    object: "policy-object",
    deleted: true,
  })
}
