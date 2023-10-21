import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import PoliciesGroupService from "../../../../services/policies-group"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policiesGroupService: PoliciesGroupService = req.scope.resolve(
    "policiesGroupService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await policiesGroupService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id,
    object: "policy-group-object",
    deleted: true,
  })
}
