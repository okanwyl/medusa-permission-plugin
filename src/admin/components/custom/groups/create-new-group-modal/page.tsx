import { zodResolver } from "@hookform/resolvers/zod"
import {
    Button,
    FocusModal,
    ProgressTabs,
    Text,
    usePrompt,
    type ProgressStatus,
} from "@medusajs/ui"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import {
    GroupPoliciesPoliciesForm,
    groupPoliciesPoliciesSchema
} from "../forms/group-policies-policies-form";
import { Form } from "../../../shared/form"
import {nestedForm} from "../../../shared/form/nested-form";
import {mutateGroupAdminPolicy} from "../../../hooks/groups";
import {groupPoliciesDetailsSchema, GroupPolicyDetailsForm, PriceListStatus} from "../forms/group-policy-details-form";
import {
    GroupPoliciesUsersForm,
    groupPoliciesUsersSchema
} from "../forms/group-policies-users-form";
import {ExclamationCircle, Spinner } from "@medusajs/icons"

enum Tab {
    DETAILS = "details",
    POLICIES = "products",
    USERS = "prices",
}

const priceListNewSchema = z.object({
    details: groupPoliciesDetailsSchema,
    products: groupPoliciesPoliciesSchema,
    users: groupPoliciesUsersSchema
})

type PriceListNewSchema = z.infer<typeof priceListNewSchema>

type StepStatus = {
    [key in Tab]: ProgressStatus
}

const CreateNewGroupModal = ({open, setOpen}) => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])

    const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)
    const [status, setStatus] = React.useState<StepStatus>({
        [Tab.DETAILS]: "not-started",
        [Tab.POLICIES]: "not-started",
        [Tab.USERS]: "not-started",
    })

    const { t } = useTranslation()

    const promptTitle =  "Are you sure?"
    const promptExitDescription = "You have unsaved changes, are you sure you want to exit?"

    const promptBackDescription = "You have unsaved changes, are you sure you want to go back?"


    const prompt = usePrompt()

    const form = useForm<PriceListNewSchema>({
        resolver: zodResolver(priceListNewSchema),
        defaultValues: {
            details: {
                general: {
                    name: "",
                    description: "",
                },
            },
            products: {
                ids: [],
            },
            users: {
                ids: []
            }
        },
    })

    const {
        trigger,
        reset,
        getValues,
        setError,
        handleSubmit,
        formState: { isDirty },
    } = form




    const { mutate, isLoading, isError } = mutateGroupAdminPolicy()



    const onCloseModal = React.useCallback(() => {
        setOpen(false)
        setTab(Tab.DETAILS)
        setSelectedIds([])
        setStatus({
            [Tab.DETAILS]: "not-started",
            [Tab.POLICIES]: "not-started",
            [Tab.USERS]: "not-started",
        })
        // resetEdit()
        reset()
    }, [reset])

    const onModalStateChange = React.useCallback(
        async (open: boolean) => {
            if (!open && (isDirty)) {
                const response = await prompt({
                    title: promptTitle,
                    description: promptExitDescription,
                })

                if (!response) {
                    setOpen(true)
                    return
                }

                onCloseModal()
            }

            setOpen(open)
        },
        [
            isDirty,
            promptTitle,
            promptExitDescription,
            prompt,
            onCloseModal,
        ]
    )


    const onSubmit = React.useCallback(
        async () => {
            await handleSubmit(async (data) => {
                const productIds = data.products.ids
                const payloadPolicies = []
                productIds.forEach((payloadId) => {
                    payloadPolicies.push({id:payloadId })
                });

                const userIds = data.users.ids

                const payloadUsers = []
                userIds.forEach((payloadId) => {
                    payloadUsers.push(payloadId)
                })

                    const res = await prompt({
                        title: "Are you sure?",
                        description: "You are going to create a group policy and give selected users the permissions."
                    })

                    if (!res) {
                        return
                    }


                mutate(
                    {
                        name: data.details.general.name,
                        description: data.details.general.description,
                        policies: payloadPolicies,
                        users : payloadUsers
                    },
                    {
                        onSuccess: () => {
                            onCloseModal()
                        },
                        onError: (err) => {
                        },
                    }
                )
            })()
        },
        [
            handleSubmit,
            mutate,
            onCloseModal,
            setError,
            prompt,
            t,
        ]
    )


    /**
     * If the current tab is edit, we need to
     * check if the user wants to exit the edit
     * tab or if they want to save the changes
     * before continuing.
     */
    const onTabChange = React.useCallback(
        async (value: Tab) => {


            setTab(value)
        },
        [tab]
    )



    /**
     * Callback for validating the details form.
     */
    const onValidateDetails = React.useCallback(async () => {
        const result = await trigger("details")

        if (!result) {
            setStatus((prev) => ({
                ...prev,
                [Tab.DETAILS]: "in-progress",
            }))

            return
        }

        setTab(Tab.POLICIES)
        setStatus((prev) => ({
            ...prev,
            [Tab.DETAILS]: "completed",
        }))
    }, [trigger])

    /**
     * Callback for validating the products form.
     */
    const onValidateProducts = React.useCallback(async () => {
        const result = await trigger("products")

        if (!result) {
            setStatus((prev) => ({
                ...prev,
                [Tab.POLICIES]: "in-progress",
            }))

            return
        }

        const ids = getValues("products.ids")


        setTab(Tab.USERS)
        setStatus((prev) => ({
            ...prev,
            [Tab.POLICIES]: "completed",
        }))
    }, [trigger, getValues])

    /**
     * Depending on the current tab, the next button
     * will have different functionality.
     */
    const onNext = React.useCallback(async () => {
        switch (tab) {
            case Tab.DETAILS:
                await onValidateDetails()
                break
            case Tab.POLICIES:
                await onValidateProducts()
                break
            case Tab.USERS:
                await onSubmit()
                break
        }
    }, [onValidateDetails, onValidateProducts, onSubmit, tab])

    const nextButtonText = React.useMemo(() => {
        switch (tab) {
            case Tab.USERS:
                return "Save"
            default:
                return "Continue"
        }
    }, [tab, t])


    const onBack = React.useCallback(async () => {
        switch (tab) {
            case Tab.DETAILS:
                await onModalStateChange(false)
                break
            case Tab.POLICIES:
                setTab(Tab.DETAILS)
                break
            case Tab.USERS:
                setTab(Tab.POLICIES)
                break

        }
    }, [onModalStateChange, tab])

    const backButtonText = React.useMemo(() => {
        switch (tab) {
            case Tab.DETAILS:
                return "Cancel"
            default:
                return  "Back"
        }
    }, [tab, t])


    return (
        <FocusModal open={open} onOpenChange={onModalStateChange}>
            <ProgressTabs
                value={tab}
                onValueChange={(tab) => onTabChange(tab as Tab)}
            >
                <FocusModal.Content>
                    <FocusModal.Header className="flex w-full items-center justify-start">
                        <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
                            <ProgressTabs.Trigger
                                value={Tab.DETAILS}
                                className="w-full min-w-0 max-w-[200px]"
                                status={status[Tab.DETAILS]}
                            >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Create Group Policy"}
                </span>
                            </ProgressTabs.Trigger>
                            <ProgressTabs.Trigger
                                value={Tab.POLICIES}
                                disabled={status[Tab.DETAILS] !== "completed"}
                                className="w-full min-w-0  max-w-[200px]"
                                status={status[Tab.POLICIES]}
                            >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Attach Policies"}
                </span>
                            </ProgressTabs.Trigger>
                            <ProgressTabs.Trigger
                                value={Tab.USERS}
                                disabled={
                                    status[Tab.DETAILS] !== "completed" &&
                                    status[Tab.POLICIES] !== "completed"
                                }
                                className="w-full min-w-0 max-w-[200px]"
                                status={status[Tab.USERS]}
                            >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Attach Users"}
                </span>
                            </ProgressTabs.Trigger>
                        </ProgressTabs.List>
                        <div className="ml-auto flex items-center justify-end gap-x-2">
                            <Button
                                variant="secondary"
                                onClick={onBack}
                                disabled={isLoading}
                            >
                                {backButtonText}
                            </Button>
                            <Button type="button" onClick={onNext} isLoading={isLoading}>
                                {nextButtonText}
                            </Button>
                        </div>
                    </FocusModal.Header>
                    {open && (
                        <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
                            <Form {...form}>
                                <ProgressTabs.Content
                                    value={Tab.DETAILS}
                                    className="h-full w-full max-w-[720px]"
                                >
                                    <div className="px-8 py-12">
                                        <GroupPolicyDetailsForm
                                            form={nestedForm(form, "details")}
                                            layout="focus"
                                            enableTaxToggle={false}
                                        />
                                    </div>
                                </ProgressTabs.Content>
                                <ProgressTabs.Content
                                    value={Tab.POLICIES}
                                    className="h-full w-full"
                                >
                                    <GroupPoliciesPoliciesForm form={nestedForm(form, "products")} />
                                </ProgressTabs.Content>
                                {isLoading ? (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Spinner className="text-ui-fg-subtle animate-spin" />
                                    </div>
                                ) : isError ? (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <div className="text-ui-fg-subtle flex items-center gap-x-2">
                                            <ExclamationCircle />
                                            <Text>
                                                {"An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later."}
                                            </Text>
                                        </div>
                                    </div>
                                ) : (
                                    <React.Fragment>
                                        <ProgressTabs.Content
                                            value={Tab.USERS}
                                            className="h-full w-full"
                                        >
                                            <GroupPoliciesUsersForm form={nestedForm(form,"users")}/>
                                        </ProgressTabs.Content>
                                    </React.Fragment>
                                )}
                            </Form>
                        </FocusModal.Body>
                    )}
                </FocusModal.Content>
            </ProgressTabs>
        </FocusModal>
    )
}

export default CreateNewGroupModal