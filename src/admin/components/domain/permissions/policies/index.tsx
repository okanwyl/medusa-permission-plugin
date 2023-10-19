import { Route, Routes } from "react-router-dom";
import React, { useMemo, useState } from "react";
import BodyCard from "../../../shared/body-card";
import TableViewHeader from "../../../shared/custom-table/table-view-header";
import PlusIcon from "../../../shared/icons/plus-icon";
import PoliciesTable from "../../../custom/policies/policies-table";
import {
  CreatePolicyModalProvider,
  CreatePolicyModal,
  useCreatePolicyModal
} from "../../../custom/policies/create-new-policy-modal";
import EditPolicyPage from "../../../../routes/policy/[id]/page";
import { SettingProps } from "@medusajs/admin";
import { useNavigate } from "react-router-dom"
import GroupsPage from "../../../../routes/groups/page";

const PoliciesIndex = ({ notify }: SettingProps) => {
  const navigate = useNavigate()

  const view = "policies"
  const { showNewPolicy, setShowNewPolicy } = useCreatePolicyModal();


  const actions = useMemo(() => {
    return [
      {
        label: "Create policy",
        onClick: () => setShowNewPolicy(true),
        // icon: <Plus/>,
        icon: <PlusIcon size={20} />,
      },
    ]
  }, [view])

  return (

    <div className="gap-y-xsmall flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={
            <TableViewHeader
              views={["policies", "groups"]}
              setActiveView={(v) => {
                if (v === "groups") {
                  navigate(`/a/groups`)
                }
              }}
              activeView={view}
            />
          }
          actionables={actions}
          className="h-fit"
        >
          <PoliciesTable />
        </BodyCard>
      </div>
      <div className="h-xlarge w-full" />
      <CreatePolicyModal notify={notify} />
    </div>
  )
}

const Policies = ({ notify }: SettingProps) => {
  return (
    <CreatePolicyModalProvider>
      <Routes>
        <Route index element={<PoliciesIndex notify={notify} />} />
        <Route path="/a/policy/:id" element={<EditPolicyPage />} />
        <Route path="/a/groups/" element={<GroupsPage />} />
      </Routes>
    </CreatePolicyModalProvider>
  )
}

export default Policies
