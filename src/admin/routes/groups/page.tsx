import {useMemo, useState} from "react"
import GroupsTable from "../../components/custom/groups/groups-table"
import BodyCard from "../../components/shared/body-card"
import PlusIcon from "../../components/shared/icons/plus-icon"
import { useNavigate } from "react-router-dom"
import TableViewHeader from "../../components/shared/custom-table/table-view-header"
import BackButton from "../../components/shared/back-button"
import CreateNewGroupModal from "../../components/custom/groups/create-new-group-modal/page";

type DeletePromptData = {
  resource: string
  onDelete: () => any
  show: boolean
}

const GroupsPage = () => {
  const navigate = useNavigate()
  const view = "groups"

    const actions = useMemo(() => {
    return [
      {
        label: "Create group",
          onClick: () => {},
        icon: <PlusIcon size={20} />,
      },
    ]
  }, [view])

  return (
    <div>
        <BackButton
            label="Back to settings"
            path="/a/settings"
            className="mb-xsmall"
        />
        <div className="gap-y-xsmall flex h-full grow flex-col">
            <div className="flex w-full grow flex-col">
                <BodyCard
                    customHeader={
                        <TableViewHeader
                            views={["policies", "groups"]}
                            setActiveView={(v) => {
                                if (v === "policies") {
                                    navigate(`/a/settings/custom`)
                                }
                            }}
                            activeView={view}
                        />
                    }
                    actionables={[]}
                    className="h-fit"
                >
                    <CreateNewGroupModal/>
                    <GroupsTable />
                </BodyCard>
            </div>
            <div className="h-xlarge w-full" />
        </div>
    </div>
  )
}

export default GroupsPage
