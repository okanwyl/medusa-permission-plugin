import { Request, Response } from "express"
import PoliciesService from "../../../../services/policies"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policiesService: PoliciesService = req.scope.resolve("policiesService")

  const policy = await policiesService.retrieve(id, {})
  res.status(200).json({ policy })
}
