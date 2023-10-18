import {Controller} from "react-hook-form"
import {useTranslation} from "react-i18next"
import {Input} from "@medusajs/ui";
import {Option} from "../../../types/shared";
import MetadataForm, {MetadataFormType} from "../metadata-form";
import {nestedForm, NestedForm} from "../../../utils/nested-form";
import FormValidator from "../../../utils/form-validator";
import {NextSelect} from "../next-select";

export type AddressPayload = {
    name: string
    handle: string | null
    description: string | null
    method: Option
    base_router: string
    custom_regex: string | null
}

export enum AddressType {
    SHIPPING = "shipping",
    BILLING = "billing",
    LOCATION = "location",
}

type AddressFormProps = {
    form: NestedForm<AddressPayload>
    countryOptions: Option[]
    type: AddressType
    required?: boolean
    noTitle?: boolean
}

const PolicyForm = ({
                        form,
                        countryOptions,
                        type,
                        required = true,
                        noTitle = false,
                    }: AddressFormProps) => {
    const {
        register,
        path,
        control,
        formState: {errors},
    } = form
    // const {t} = useTranslation()
    return (
        <div>
            {(type === AddressType.SHIPPING || type === AddressType.BILLING) && (
                <>
          <span className="inter-base-semibold">
            {"General"}
          </span>
                    <div className="gap-large mt-4 mb-8 grid grid-cols-2">
                        <Input
                            {...register(path("name"), {
                                required: required
                                    ? FormValidator.required("Policy name")
                                    : false,
                                pattern: FormValidator.whiteSpaceRule("Policy name"),
                            })}
                            placeholder={"Policy name"}
                            label={"policy name"}
                            required={required}
                            errors={errors}
                        />
                        <Input
                            {...form.register(path("handle"), {
                                pattern: FormValidator.whiteSpaceRule("Handle"),
                            })}
                            placeholder={"Handle"}
                            label={"Handle"}
                            errors={errors}
                        />
                        <Input
                            {...form.register(path("description"))}
                            placeholder={"Description"}
                            label={"Description"}
                            errors={errors}
                        />
                    </div>
                </>
            )}
            <span className="inter-base-semibold">
                    Logic
        </span>
            <div className="gap-y-large gap-x-large mt-4 grid grid-cols-2">
                <Input
                    {...form.register(path("base_router"), {
                        required: required ? FormValidator.required("Base router") : false,
                        pattern: FormValidator.whiteSpaceRule("Base router"),
                    })}
                    placeholder={"Base router"}
                    label={"Base router"}
                    required={required}
                    errors={errors}
                />
                <Input
                    {...form.register(path("custom_regex"), {
                        pattern: FormValidator.whiteSpaceRule("Custom regex"),
                    })}
                    placeholder={"Custom regex"}
                    label={"Custom regex"}
                    errors={errors}
                />
                <Controller
                    control={control}
                    name={path("method")}
                    rules={{
                        required: required ? FormValidator.required("Method") : false,
                    }}
                    render={({field: {value, onChange}}) => {
                        return (
                            <NextSelect
                                label={"Method"}
                                required={required}
                                value={value}
                                options={countryOptions}
                                onChange={onChange}
                                name={path("method")}
                                errors={errors}
                                isClearable={!required}
                            />
                        )
                    }}
                />
            </div>
            <div className="mt-xlarge gap-y-base flex flex-col">
        <span className="inter-base-semibold">
        </span>
            </div>
        </div>
    )
}
export default PolicyForm
