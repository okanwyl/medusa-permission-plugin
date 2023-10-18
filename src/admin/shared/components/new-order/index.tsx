import {useAdminCreateDraftOrder} from "medusa-react"
import React from "react"
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import SteppedModal, {SteppedContext} from "../modal/stepped-modal"
import {LayeredModalContext} from "../modal/layered-modal";
import {useNewOrderForm} from "../form";
import useNotification from "../../hooks/use-notification/use-notification";
import isNullishObject from "../../../utils/is-nullish-object";
import SelectRegionScreen from "../select-region";
import Items from "../items"
import SelectShippingMethod from "../select-shipping-method"
import CreatePolicy from "../../../../api/routes/admin/policies/create-policy";
import CreatePolicyScreen from "../create-policy-screen";
import ShippingDetails from "../shipping-details";
// import Summary from "../../../../../.cache/admin/src/domain/orders/new/components/summary";

type NewOrderProps = {
    onDismiss: () => void
}

const NewOrder = ({onDismiss}: NewOrderProps) => {
    const steppedContext = React.useContext(SteppedContext)
    const layeredContext = React.useContext(LayeredModalContext)

    const {t} = useTranslation()
    const navigate = useNavigate()
    const notification = useNotification()
    const {mutate} = useAdminCreateDraftOrder()

    const {
        form: {handleSubmit, reset},
        context: {region},
    } = useNewOrderForm()


    const onSubmit = handleSubmit((data) => {
        mutate(
            // @ts-ignore
            {
                region_id: data.region.value,
            },
            {
                onSuccess: ({draft_order}) => {
                    notification(
                        t("new-success", "Success"),
                        t("new-order-created", "Order created"),
                        "success"
                    )
                    reset()
                    onDismiss()
                    steppedContext.reset()
                    navigate(`/a/draft-orders/${draft_order.id}`)
                },
                onError: (error) => {
                    notification(t("new-error", "Error"), error.message, "error")
                },
            }
        )
    })

    return (
        <SteppedModal
            layeredContext={layeredContext}
            context={steppedContext}
            onSubmit={onSubmit}
            steps={[
                // <SelectRegionScreen/>,
                <ShippingDetails/>,
                <CreatePolicyScreen/>
                // <Items/>,
                // <SelectShippingMethod/>,
                // <ShippingDetails />,
                // <Billing />,
                // <Summary />,
            ]}
            lastScreenIsSummary={false}
            title={t("new-create-draft-order", "Create Draft Order")}
            handleClose={onDismiss}
        />
    )
}

export default NewOrder
