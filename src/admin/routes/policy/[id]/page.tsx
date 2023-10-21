import { useNavigate, useParams } from "react-router-dom"
import BodyCard from "../../../components/shared/body-card"
import Spinner from "../../../components/shared/spinner"
import BackButton from "../../../components/shared/back-button"
import { useAdminPolicyId } from "../../../components/hooks/policies"
import moment from "moment"

type DeletePromptData = {
  resource: string
  onDelete: () => any
  show: boolean
}

const EditPolicyPage = () => {
  const { id } = useParams()

  const { data, isLoading } = useAdminPolicyId(id)

  console.log(typeof data)
  console.log(data)
  if (data && data.policy && data.policy.name) {
    console.log(data.policy)
    console.log(data.policy.name)
  }

  const navigate = useNavigate()

  const errors = {}

  const method = 1

  // const handleDeleteOrder = async () => {
  //     return cancelOrder.mutate(void {}, {
  //         onSuccess: () =>
  //             notification(
  //                 t("draft-orders-success", "Success"),
  //                 t(
  //                     "draft-orders-successfully-canceled-order",
  //                     "Successfully canceled order"
  //                 ),
  //                 "success"
  //             ),
  //         onError: (err) =>
  //             notification(
  //                 t("draft-orders-error", "Error"),
  //                 getErrorMessage(err),
  //                 "error"
  //             ),
  //     })
  // }
  //

  return (
    <div>
      <BackButton
        path="/a/settings/custom"
        label="Back to settings "
        className="mb-xsmall"
      />
      {isLoading ? (
        <BodyCard className="pt-2xlarge flex w-full items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <div className={"flex space-x-4"}>
          <BodyCard
            className={"mb-4 min-h-[200px] w-full"}
            title={`Policy ${data.policy.name}`}
            subtitle={moment(data.policy.created_at).format(
              "D MMMM YYYY hh:mm a"
            )}
            // status={<OrderStatusComponent />}
            // customActionable={
            // }
            // forceDropdown={draft_order?.status === "completed" ? false : true}
            // actionables={
            // }
          >
            <div className="mt-6 flex space-x-6 divide-x">
              <div className="flex flex-col">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {"Email"}
                </div>
                <div>{data.policy?.name}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {"Phone"}
                </div>
                <div>{data.policy?.method || "N/A"}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {"Phone"}
                </div>
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  {data.policy.description}
                </div>
                <div></div>
              </div>
            </div>
          </BodyCard>
        </div>
      )}
    </div>
  )
}

export default EditPolicyPage
