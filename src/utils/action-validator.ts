import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator"

@ValidatorConstraint({ async: false })
export class IsValidActionStructureConstraint
  implements ValidatorConstraintInterface
{
  validate(bjson: Record<string, unknown>, args: ValidationArguments) {
    if (typeof bjson !== "object" || Array.isArray(bjson) || bjson === null) {
      return false
    }

    if (!bjson.actions || !Array.isArray(bjson.actions)) {
      return false
    }

    for (const action of bjson.actions) {
      if (typeof action.route !== "string") {
        return false
      }
      if (!Array.isArray(action.methods)) {
        return false
      }

      for (const method of action.methods) {
        if (
          typeof method.method !== "string" ||
          !["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method.method)
        ) {
          return false
        }
        if (typeof method.permitted !== "boolean") {
          return false
        }
      }
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    return "Action structure is invalid!"
  }
}

export function IsValidActionStructure(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidActionStructureConstraint,
    })
  }
}
