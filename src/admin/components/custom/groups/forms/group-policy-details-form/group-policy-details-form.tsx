import {
    Heading,
    Input,
    Text,
    Textarea,
    clx,
} from "@medusajs/ui"

import * as React from "react"

import { Form } from "../../../../shared/form"
import {NestedForm} from "../../../../shared/form/nested-form";
import { GroupPolicyDetailsScheme } from "./types"


interface GroupPolicyDetailsFormProps {
    form: NestedForm<GroupPolicyDetailsScheme>
    layout: "drawer" | "focus"
    enableTaxToggle?: boolean
}

const GroupPolicyDetailsForm = ({
                                  form,
                                  layout,
                                  enableTaxToggle,
                              }: GroupPolicyDetailsFormProps) => {
    return (
        <div className="flex w-full flex-col gap-y-12">
            <GroupPolicyGeneral
                form={form}
                layout={layout}
                enableTaxToggle={enableTaxToggle}
            />
        </div>
    )
}


const GroupPolicyGeneral = ({
                              form,
                              layout,
                          }: GroupPolicyDetailsFormProps) => {

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


export {GroupPolicyDetailsForm}
