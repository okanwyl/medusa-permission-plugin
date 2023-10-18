import qs from "query-string"
import {useContext, useEffect, useMemo, useState} from "react"
import {Controller, useWatch} from "react-hook-form"
import {useTranslation} from "react-i18next"
import {RadioGroup} from "@medusajs/ui";

import {useAdminCustomer, useMedusa} from "medusa-react"

import {useNewOrderForm} from "../form"
import {SteppedContext} from "../modal/stepped-modal"
import {Option} from "../../../types/shared";
import Select from "../next-select/select";
import InputField from "../input";
import PlusIcon from "../icons/plus-icon";
import Button from "../button";
import AddressForm, {AddressType} from "../address-form";
import {nestedForm} from "../../../utils/nested-form";
import isNullishObject from "../../../utils/is-nullish-object";
import PolicyForm from "../policy-form";

const ShippingDetails = () => {
    const {t} = useTranslation()
    const [addNew, setAddNew] = useState(false)
    const {disableNextPage, enableNextPage} = useContext(SteppedContext)
    const {client} = useMedusa()

    const {
        context: {validCountries},
        form,
    } = useNewOrderForm()


    const validMethods: Option[] = [
        {value: "GET", label: "GET"},
        {value: "POST", label: "POST"},
        {value: "PUT", label: "PUT"},
        {value: "PATCH", label: "PATCH"},
        {value: "DELETE", label: "DELETE"},
    ]
    const debouncedFetch = async (filter: string): Promise<Option[]> => {
        const prepared = qs.stringify(
            {
                q: filter,
                offset: 0,
                limit: 10,
            },
            {skipNull: true, skipEmptyString: true}
        )

        const asd = {
            q: filter,
            offset: 0,
            limit: 10
        }

        return []
        // .list(`?${prepared}`)
        // .then(({data}) =>
        //     data.customers.map(({id, first_name, last_name, email}) => ({
        //         label: `${first_name || ""} ${last_name || ""} (${email})`,
        //         value: id,
        //     }))
        // )
        // .catch(() => [])
    }

    const customerId = useWatch({
        control: form.control,
        name: "customer_id",
    })

    const {customer} = useAdminCustomer(customerId?.value!, {
        enabled: !!customerId?.value,
    })

    const validAddresses = useMemo(() => {
        if (!customer) {
            return []
        }

        const validCountryCodes = validCountries.map(({value}) => value)

        return customer.shipping_addresses.filter(
            ({country_code}) =>
                !country_code || validCountryCodes.includes(country_code)
        )
    }, [customer, validCountries])

    const onCustomerSelect = (val: Option) => {
        const email = /\(([^()]*)\)$/.exec(val?.label)

        if (email) {
            form.setValue("email", email[1])
        } else {
            form.setValue("email", "")
        }
    }

    const onCreateNew = () => {
        form.setValue("shipping_address_id", undefined)
        setAddNew(true)
    }

    const onSelectExistingAddress = (id: string) => {
        if (!customer) {
            return
        }

        const address = customer.shipping_addresses?.find((a) => a.id === id)

        if (address) {
            form.setValue("shipping_address", address)
        }
    }

    const email = useWatch({
        control: form.control,
        name: "email",
    })

    const shippingAddress = useWatch({
        control: form.control,
        name: "shipping_address",
    })

    /**
     * Effect used to enable next step.
     * A user can go to the next step if valid email is provided and all required address info is filled.
     */
    useEffect(() => {
        if (!email) {
            disableNextPage()
            return
        }

        if (shippingAddress && !isNullishObject(shippingAddress)) {
            if (
                !shippingAddress.first_name ||
                !shippingAddress.last_name ||
                !shippingAddress.address_1 ||
                !shippingAddress.city ||
                !shippingAddress.country_code ||
                !shippingAddress.postal_code
            ) {
                disableNextPage()
            } else {
                enableNextPage()
            }
        }
    }, [shippingAddress, email])

    useEffect(() => {
        // reset shipping address info when a different customer is selected
        // or when "Create new" is clicked
        form.setValue("shipping_address.first_name", "")
        form.setValue("shipping_address.last_name", "")
        form.setValue("shipping_address.phone", "")
        form.setValue("shipping_address.address_1", "")
        form.setValue("shipping_address.address_2", "")
        form.setValue("shipping_address.city", "")
        form.setValue("shipping_address.country_code", null)
        form.setValue("shipping_address.province", "")
        form.setValue("shipping_address.postal_code", "")
    }, [customerId?.value, addNew])

    useEffect(() => {
        setAddNew(false)
    }, [customerId?.value])

    return (
        <div>
            <PolicyForm
                form={nestedForm(form, "shipping_address")}
                countryOptions={validMethods}
                type={AddressType.SHIPPING}
            />
        </div>

    )
}

export default ShippingDetails
