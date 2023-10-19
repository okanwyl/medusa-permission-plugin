
import { useNavigate, useParams } from "react-router-dom"
import BodyCard from "../../../components/shared/body-card";
import Spinner from "../../../components/shared/spinner";
import BackButton from "../../../components/shared/back-button";
import moment from "moment";
import { useAdminGroupPolicyId } from "../../../components/hooks/groups";
import { FocusModal, ProgressTabs, ProgressStatus } from "@medusajs/ui"
import { useState, Fragment } from "react"
import Button from "../../../components/shared/button"

enum Tab {
  PRODUCTS = "products",
  PRICES = "prices",
  EDIT = "edit",
}

type StepStatus = {
  [key in Tab]: ProgressStatus
}

type DeletePromptData = {
  resource: string
  onDelete: () => any
  show: boolean
}

const EditGroupPolicyPage = () => {
  const { id } = useParams()


  const { data, isLoading } = useAdminGroupPolicyId(id)

  const product = {}

  console.log(typeof data);
  console.log(data);
  if (data && data.group_policy && data.group_policy.name) {
    console.log(data.group_policy);
    console.log(data.group_policy.name);
  }



  const [tab, setTab] = useState<Tab>(Tab.PRODUCTS)
  const [status, setStatus] = useState<StepStatus>({
    [Tab.PRODUCTS]: "not-started",
    [Tab.PRICES]: "not-started",
    [Tab.EDIT]: "not-started",
  })



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
        <div>
          <div className={"flex space-x-4"}>

            <BodyCard
              className={"mb-4 min-h-[200px] w-full"}
              title={`Policy ${data.group_policy.name}`}
              subtitle={moment(data.group_policy.created_at).format(
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
                  <div>{data.group_policy?.name}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    {"Phone"}
                  </div>
                  <div>{data.group_policy?.description || "N/A"}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    {"Phone"}
                  </div>
                  {/* <div className="inter-smaller-regular text-grey-50 mb-1"> */}
                  {/*     {data.policy.description} */}
                  {/* </div> */}
                  <div>
                  </div>
                </div>
              </div>
            </BodyCard>
          </div>
          <div>
            <FocusModal open={true}>
              <ProgressTabs
                value={tab}
              // onValueChange={(tab) => onTabChange(tab as Tab)}
              >
                <FocusModal.Content>
                  <FocusModal.Header className="flex w-full items-center justify-between">
                    <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
                      <ProgressTabs.Trigger
                        value={Tab.PRODUCTS}
                        className="w-full max-w-[200px]"
                        status={status[Tab.PRODUCTS]}
                      >
                        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          "Choose Products"
                        </span>
                      </ProgressTabs.Trigger>
                      <ProgressTabs.Trigger
                        // disabled={selectedIds.length === 0}
                        value={Tab.PRICES}
                        className="w-full max-w-[200px]"
                        status={status[Tab.PRICES]}
                      >
                        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          Edit prices
                        </span>
                      </ProgressTabs.Trigger>
                      {product && (
                        <ProgressTabs.Trigger
                          value={Tab.EDIT}
                          className="w-full max-w-[200px]"
                          status={"not-started"}
                        >
                          <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            "TESTEST"
                          </span>
                        </ProgressTabs.Trigger>
                      )}
                    </ProgressTabs.List>
                    <div className="flex flex-1 items-center justify-end gap-x-2">
                      <Button
                        // disabled={isSubmitting}
                        variant="secondary"
                      // onClick={onBack}
                      >
                        "TEST"TEST
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        className="whitespace-nowrap"
                      // isLoading={isSubmitting}
                      // onClick={onNext}
                      >
                        NEXTTEST
                      </Button>
                    </div>
                  </FocusModal.Header>
                  <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
                    {/* <Form {...form}> */}
                    {/*   <ProgressTabs.Content */}
                    {/*     value={Tab.PRODUCTS} */}
                    {/*     className="h-full w-full" */}
                    {/*   > */}
                    {/*     <PriceListProductsForm */}
                    {/*       form={nestedForm(form, "products")} */}
                    {/*       productIds={productIds} */}
                    {/*     /> */}
                    {/*   </ProgressTabs.Content> */}
                    {/*   {isLoading ? ( */}
                    {/*     <div className="flex h-full w-full items-center justify-center"> */}
                    {/*       <Spinner className="text-ui-fg-subtle animate-spin" /> */}
                    {/*     </div> */}
                    {/*   ) : isError || isNotFound ? ( */}
                    {/*     <div className="flex h-full w-full items-center justify-center"> */}
                    {/*       <div className="text-ui-fg-subtle flex items-center gap-x-2"> */}
                    {/*         <ExclamationCircle /> */}
                    {/*         <Text> */}
                    {/*           {t( */}
                    {/*             "price-list-add-products-modal-error", */}
                    {/*             "An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later." */}
                    {/*           )} */}
                    {/*         </Text> */}
                    {/*       </div> */}
                    {/*     </div> */}
                    {/*   ) : ( */}
                    {/*     <Fragment> */}
                    {/*       <ProgressTabs.Content */}
                    {/*         value={Tab.PRICES} */}
                    {/*         className="h-full w-full" */}
                    {/*       > */}
                    {/*         <PriceListPricesForm */}
                    {/*           setProduct={onSetProduct} */}
                    {/*           form={nestedForm(form, "prices")} */}
                    {/*           productIds={selectedIds} */}
                    {/*         /> */}
                    {/*       </ProgressTabs.Content> */}
                    {/*       {product && ( */}
                    {/*         <ProgressTabs.Content */}
                    {/*           value={Tab.EDIT} */}
                    {/*           className="h-full w-full" */}
                    {/*         > */}
                    {/*           <PriceListProductPricesForm */}
                    {/*             product={product} */}
                    {/*             currencies={currencies} */}
                    {/*             regions={regions} */}
                    {/*             control={editControl} */}
                    {/*             priceListTaxInclusive={priceList.includes_tax} */}
                    {/*             taxInclEnabled={isTaxInclPricesEnabled} */}
                    {/*             setValue={setEditValue} */}
                    {/*             getValues={getEditValues} */}
                    {/*           /> */}
                    {/*         </ProgressTabs.Content> */}
                    {/*       )} */}
                    {/*     </Fragment> */}
                    {/*   )} */}
                    {/* </Form> */}
                  </FocusModal.Body>
                </FocusModal.Content>
              </ProgressTabs>
            </FocusModal>
          </div>

        </div>
      )
      }
    </div>
  )
}

export default EditGroupPolicyPage

