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


    let a;
    // region_id: data.region.value,
    const onSubmit = handleSubmit((data) => {

        a = data.region.value;
        console.log("SUBMITTEDDDDD");
        console.log("THIS IS AAAA", a);
    })

    return (
        <SteppedModal
            layeredContext={layeredContext}
            context={steppedContext}
            onSubmit={onSubmit}
            steps={[
                <SelectRegionScreen/>,
                // <Items/>,
                // <SelectShippingMethod />,
                // <ShippingDetails />,
                // <Billing />,
                // <Summary />,
            ]}
            lastScreenIsSummary={true}
            title={t("new-create-draft-order", "Create Draft Order")}
            handleClose={onDismiss}
        />
    )
}

export default NewOrder
