import {Route, Routes, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useMemo, useState} from "react";
import BodyCard from "../../../components/body-card";
import TableViewHeader from "../../../components/table-view-header";
import DraftOrderTable from "../../../components/draft-order-table";
import PlusIcon from "../../../components/icons/plus-icon";
import NewOrderFormProvider from "../../../components/form";
import NewOrder from "../../../components/new-order";

const DraftOrderIndex = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()

    const view = "drafts"
    const [showNewOrder, setShowNewOrder] = useState(false)


    const actions = useMemo(() => {
        return [
            {
                label: t("draft-orders-create-draft-order", "Create draft order"),
                onClick: () => setShowNewOrder(true),
                // icon: <Plus/>,
                icon: <PlusIcon size={20}/>,
            },
        ]
    }, [view])

    return (
        <div className="gap-y-xsmall flex h-full grow flex-col">
            <div className="flex w-full grow flex-col">
                <BodyCard
                    customHeader={
                        <TableViewHeader
                            views={["drafts"]}
                            // setActiveView={(v) => {
                            //     if (v === "orders") {
                            //         navigate(`/a/orders`)
                            //     }
                            // }}
                            activeView={view}
                        />
                    }
                    actionables={actions}
                    className="h-fit"
                >
                    <DraftOrderTable/>
                </BodyCard>
            </div>
            <div className="h-xlarge w-full"/>
            {showNewOrder && (
                <NewOrderFormProvider>
                    <NewOrder onDismiss={() => setShowNewOrder(false)}/>
                </NewOrderFormProvider>
            )}
        </div>
    )
}

const DraftOrders = () => {
    return (
        <Routes>
            <Route index element={<DraftOrderIndex/>}/>
            {/*<Route path="/:id" element={<DraftOrderDetails />} />*/}
        </Routes>
    )
}

export default DraftOrders
