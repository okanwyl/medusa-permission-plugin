import type {CustomerGroup} from "@medusajs/medusa"
import {
    Checkbox,
    Heading,
    Input,
    Text,
    Textarea,
    clx,
} from "@medusajs/ui"
import {
    createColumnHelper,
} from "@tanstack/react-table"
import * as React from "react"

import {useTranslation} from "react-i18next"
import { Form } from "../../../../shared/form"
import {NestedForm} from "../../../../shared/form/nested-form";
import { PriceListDetailsSchema } from "./types"


interface PriceListDetailsFormProps {
    form: NestedForm<PriceListDetailsSchema>
    layout: "drawer" | "focus"
    enableTaxToggle?: boolean
}

const PriceListDetailsForm = ({
                                  form,
                                  layout,
                                  enableTaxToggle,
                              }: PriceListDetailsFormProps) => {
    return (
        <div className="flex w-full flex-col gap-y-12">
            <PriceListGeneral
                form={form}
                layout={layout}
                enableTaxToggle={enableTaxToggle}
            />
        </div>
    )
}


const PriceListGeneral = ({
                              form,
                              layout,
                          }: PriceListDetailsFormProps) => {

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <Heading level="h2">
                    {"General"}
                </Heading>
                <Text className="text-ui-fg-subtle">
                    {"Choose a group name and give a description for new group policy."}
                </Text>
            </div>
            <div
                className={clx("grid gap-4", {
                    "grid-cols-1": layout === "drawer",
                    "grid-cols-2": layout === "focus",
                })}
            >
                <Form.Field
                    control={form.control}
                    name={form.path("general.name")}
                    render={({field}) => {
                        return (
                            <Form.Item>
                                <Form.Label>
                                    {"Name"}
                                </Form.Label>
                                <Form.Control>
                                    <Input
                                        {...field}
                                        placeholder={
                                        "Agents"
                                        }
                                    />
                                </Form.Control>
                                <Form.ErrorMessage/>
                            </Form.Item>
                        )
                    }}
                />
            </div>
            <Form.Field
                control={form.control}
                name={form.path("general.description")}
                render={({field}) => {
                    return (
                        <Form.Item>
                            <Form.Label>
                                {"Description"}
                            </Form.Label>
                            <Form.Control>
                                <Textarea
                                    {...field}
                                    placeholder={
                                        "This agent group can't change products, and can only list orders."
                                    }
                                />
                            </Form.Control>
                            <Form.ErrorMessage/>
                        </Form.Item>
                    )
                }}
            />
        </div>
    )
}

/** Dates */

/** Customer groups */
const columnHelper = createColumnHelper<CustomerGroup>()

const useCustomerGroupsColumns = () => {
    const {t} = useTranslation()

    const columns = React.useMemo(
        () => [
            columnHelper.display({
                id: "select",
                header: ({table}) => {
                    return (
                        <Checkbox
                            checked={
                                table.getIsSomePageRowsSelected()
                                    ? "indeterminate"
                                    : table.getIsAllPageRowsSelected()
                            }
                            onCheckedChange={(value) =>
                                table.toggleAllPageRowsSelected(!!value)
                            }
                            aria-label="Select all customer groups on the current page"
                        />
                    )
                },
                cell: ({row}) => {
                    return (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                    )
                },
            }),
            columnHelper.accessor("name", {
                header: () => t("price-list-details-form-customer-groups-name", "Name"),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("customers", {
                header: () => (
                    <div className="w-full text-right">
                        {t("price-list-details-form-customer-groups-members", "Members")}
                    </div>
                ),
                cell: (info) => (
                    <div className="w-full text-right">
                        {info.getValue()?.length || "-"}
                    </div>
                ),
            }),
        ],
        [t]
    )

    return {
        columns,
    }
}


export {PriceListDetailsForm}
