import { useNavigate, useParams } from "react-router-dom";
import BodyCard from "../../../components/shared/body-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminCustomerGroups, useAdminProducts} from "medusa-react"
import Spinner from "../../../components/shared/spinner";
import * as Collapsible from "@radix-ui/react-collapsible"
import BackButton from "../../../components/shared/back-button";
import moment from "moment";
import { useAdminGroupPolicyId } from "../../../components/hooks/groups";
import { FocusModal, ProgressTabs, ProgressStatus, Heading, RadioGroup, Text, clx, Input, Textarea, Switch, DatePicker, Container, Checkbox, Table, StatusBadge} from "@medusajs/ui";
import { useState, Fragment, useCallback , useMemo, useEffect} from "react";
import Button from "../../../components/shared/button";
import { Form } from "../../../components/shared/form";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { PriceListPricesForm, ProductFilter, ProductFilterMenu } from "../../../components/custom/groups/price-list-prices-form";
import { NestedForm, nestedForm } from "../../../components/shared/form/nested-form";
import { CustomerGroup, DateComparisonOperator, Product } from "@medusajs/medusa";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { useDebounce } from "../../../components/hooks/use-debounce";
import { ExclamationCircle, PhotoSolid } from "@medusajs/icons";
import { FilterMenu } from "../../../components/shared/filter-menu";

const columnHelper2 = createColumnHelper<Product>()

const usePriceListProductsFormColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      columnHelper2.display({
        id: "select",
        header: ({ table }) => {
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
              aria-label={
                t(
                  "price-list-products-form-select-all",
                  "Select all products on the current page"
                ) ?? undefined
              }
            />
          )
        },
        cell: ({ table, row }) => {
          const { productIds } = table.options.meta as {
            productIds: string[]
          }

          const isSelected = row.getIsSelected() || productIds.includes(row.id)

          return (
            <Checkbox
              checked={isSelected}
              disabled={productIds.includes(row.id)}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label={
                t("price-list-products-form-select-row", "Select row") ??
                undefined
              }
            />
          )
        },
      }),
      columnHelper2.accessor("title", {
        header: () => t("price-list-products-form-product-label", "Product"),
        cell: (info) => {
          const title = info.getValue()
          const thumbnail = info.row.original.thumbnail

          return (
            <div className="flex items-center gap-x-3">
              <div className="bg-ui-bg-subtle flex h-8 w-6 items-center justify-center overflow-hidden rounded-[4px]">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={
                      t(
                        "price-list-products-form-product-thumbnail",
                        "{{title}} thumbnail",
                        {
                          title,
                        }
                      ) ?? undefined
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PhotoSolid />
                )}
              </div>
              <Text size="small" className="text-ui-fg-base">
                {title}
              </Text>
            </div>
          )
        },
      }),
      columnHelper2.accessor("collection", {
        header: () =>
          t("price-list-products-form-collection-label", "Collection"),
        cell: (info) => info.getValue()?.title ?? "-",
      }),
      columnHelper2.accessor("sales_channels", {
        header: () =>
          t("price-list-products-form-sales-channels-label", "Availability"),
        cell: (info) => {
          const salesChannels = info.getValue()

          if (!salesChannels || salesChannels.length === 0) {
            return "-"
          }

          const first = salesChannels[0].name

          const remaining = salesChannels.length - 1

          if (!remaining) {
            return <span>{first}</span>
          }

          return (
            <span>
              {t(
                "price-list-products-form-sales-channels-value",
                "{{first}} + {{remaining}} more",
                {
                  first,
                  remaining,
                }
              )}
            </span>
          )
        },
      }),
      columnHelper2.accessor("status", {
        header: () => t("price-list-products-form-status-label", "Status"),
        cell: (info) => {
          const status = info.getValue()

          return (
            <StatusBadge
              color={status === "published" ? "green" : "grey"}
              className="capitalize"
            >
              {status}
            </StatusBadge>
          )
        },
      }),
      columnHelper2.accessor("variants", {
        header: () => (
          <div className="text-right">
            {t("price-list-products-form-inventory-label", "Inventory")}
          </div>
        ),
        cell: (info) => {
          let content: string | undefined = "-"

          const variants = info.getValue()

          if (!variants || variants.length === 0) {
            content = "-"
          }

          const totalStock = variants.reduce((acc, curr) => {
            return acc + curr.inventory_quantity
          }, 0)

          content =
            t(
              "price-list-products-form-inventory-value",
              "{{totalStock}} in stock across {{variants}} variants",
              {
                totalStock,
                variants: variants.length,
              }
            ) ?? undefined

          return <div className="text-right">{content}</div>
        },
      }),
    ],
    [t]
  )

  return { columns }
}

export type PriceListDetailsSchema = z.infer<typeof priceListDetailsSchema>

/**
 * Re-implementation of enum from `@medusajs/medusa` as it cannot be imported
 */
// export enum PriceListStatus {
//   ACTIVE = "active",
//   DRAFT = "draft",
// }

// /**
//  * Re-implementation of enum from `@medusajs/medusa` as it cannot be imported
//  */
// export enum PriceListType {
//   SALE = "sale",
//   OVERRIDE = "override",
// }

const PriceListType = ({ form, layout }: PriceListDetailsFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <Heading level="h2">
          {t("price-list-details-form-type-heading", "Type")}
        </Heading>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-type-description",
            "Choose the type of price list you want to create."
          )}
        </Text>
      </div>
      <Form.Field
        control={form.control}
        name={form.path("type.value")}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Control>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  className={clx("grid gap-4", {
                    "grid-cols-2": layout === "focus",
                    "grid-cols-1": layout === "drawer",
                  })}
                >
                  <RadioGroup.ChoiceBox
                    id="type_opt_sale"
                    aria-describedby="type_opt_sale_desc"
                    value="sale"
                    label={t("price-list-details-form-type-label-sale", "Sale")}
                    description={t(
                      "price-list-details-form-type-hint-sale",
                      "Use this if you are creating a sale."
                    )}
                  />
                  <RadioGroup.ChoiceBox
                    id="type_opt_override"
                    aria-describedby="type_opt_override_desc"
                    value="override"
                    label={t(
                      "price-list-details-form-type-label-override",
                      "Override"
                    )}
                    description={t(
                      "price-list-details-form-type-hint-override",
                      "Use this if you are overriding prices."
                    )}
                  />
                </RadioGroup>
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}

const PriceListGeneral = ({
  form,
  layout,
  enableTaxToggle,
}: PriceListDetailsFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <Heading level="h2">
          {t("price-list-details-form-general-heading", "General")}
        </Heading>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-general-description",
            "Choose a title and description for the price list."
          )}
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
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>
                  {t("price-list-details-form-general-name-label", "Name")}
                </Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder={
                      t(
                        "price-list-details-form-general-name-placeholder",
                        "Black Friday Sale"
                      ) ?? undefined
                    }
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
      <Form.Field
        control={form.control}
        name={form.path("general.description")}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>
                {t(
                  "price-list-details-form-general-description-label",
                  "Description"
                )}
              </Form.Label>
              <Form.Control>
                <Textarea
                  {...field}
                  placeholder={
                    t(
                      "price-list-details-form-general-description-placeholder",
                      "Prices for the Black Friday sale..."
                    ) ?? undefined
                  }
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
      {enableTaxToggle && (
        <Form.Field
          control={form.control}
          name={form.path("general.tax_inclusive")}
          render={({ field: { value, onChange, ...rest } }) => {
            return (
              <Form.Item>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <Form.Label>
                      {t(
                        "price-list-details-form-tax-inclusive-label",
                        "Tax inclusive prices"
                      )}
                    </Form.Label>
                    <Form.Hint className="!txt-medium">
                      {t(
                        "price-list-details-form-tax-inclusive-hint",
                        "Choose to make all prices in this list inclusive of tax."
                      )}
                    </Form.Hint>
                  </div>
                  <Form.Control>
                    <Switch
                      {...rest}
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  </Form.Control>
                </div>
              </Form.Item>
            )
          }}
        />
      )}
    </div>
  )
}

const PriceListDates = ({ form, layout }: PriceListDetailsFormProps) => {
  const [startOpen, setStartOpen] = useState(
    !!form.getValues(form.path("dates.starts_at"))
  )
  const [endOpen, setEndOpen] = useState(
    !!form.getValues(form.path("dates.ends_at"))
  )

  const { t } = useTranslation()

  const toggleStart = (state: boolean) => {
    if (!state) {
      form.setValue(form.path("dates.starts_at"), undefined, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }

    setStartOpen(state)
  }

  const toggleEnd = (state: boolean) => {
    if (!state) {
      form.setValue(form.path("dates.ends_at"), undefined, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }

    setEndOpen(state)
  }

  return (
    <div className="flex flex-col gap-y-12">
      <div>
        <div>
          <div className="flex items-center justify-between">
            <Heading level="h2">
              {t(
                "price-list-details-form-dates-starts-at-heading",
                "Price list has a start date?"
              )}
            </Heading>
            <Switch checked={startOpen} onCheckedChange={toggleStart} />
          </div>
          <Text className="text-ui-fg-subtle">
            {t(
              "price-list-details-form-dates-starts-at-description",
              "Schedule the price overrides to activate in the future."
            )}
          </Text>
        </div>
        <Collapsible.Root open={startOpen}>
          <Collapsible.Content forceMount className="group">
            <div
              className={clx(
                "hidden gap-4 pt-6 group-data-[state='open']:grid",
                {
                  "grid-cols-2": layout === "focus",
                  "grid-cols-1": layout === "drawer",
                }
              )}
            >
              <Form.Field
                control={form.control}
                name={form.path("dates.starts_at")}
                render={({ field: { ref: _ref, value, ...rest } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t(
                          "price-list-details-form-dates-starts-at-label",
                          "Start date"
                        )}
                      </Form.Label>
                      <Form.Control>
                        <DatePicker
                          {...rest}
                          value={value ?? undefined}
                          showTimePicker
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
      <div>
        <div>
          <div className="flex items-center justify-between">
            <Heading level="h2">
              {t(
                "price-list-details-form-ends-at-heading",
                "Price list has an expiry date?"
              )}
            </Heading>
            <Switch checked={endOpen} onCheckedChange={toggleEnd} />
          </div>
          <Text className="text-ui-fg-subtle">
            {t(
              "price-list-details-form-ends-at-description",
              "Schedule the price overrides to deactivate in the future."
            )}
          </Text>
        </div>
        <Collapsible.Root open={endOpen}>
          <Collapsible.Content forceMount className="group">
            <div
              className={clx(
                "hidden gap-4 pt-6 group-data-[state='open']:grid",
                {
                  "grid-cols-2": layout === "focus",
                  "grid-cols-1": layout === "drawer",
                }
              )}
            >
              <Form.Field
                control={form.control}
                name={form.path("dates.ends_at")}
                render={({ field: { ref: _ref, value, ...rest } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t(
                          "price-list-details-form-ends-at-label",
                          "Expiry date"
                        )}
                      </Form.Label>
                      <Form.Control>
                        <DatePicker
                          {...rest}
                          value={value ?? undefined}
                          showTimePicker
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  )
}

const columnHelper = createColumnHelper<CustomerGroup>()

const useCustomerGroupsColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
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
        cell: ({ row }) => {
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


const PAGE_SIZE = 5
const PriceListCustomerGroups = ({
  form,
  layout,
}: PriceListDetailsFormProps) => {
  const { register, path, setValue } = form

  /**
   * Open state, used to toggle the collapsible.
   *
   * If the form has a value for customer_groups, we
   * default to open.
   */
  const [open, setOpen] = useState(
    !!form.getValues(form.path("customer_groups.ids"))?.length
  )

  const { t } = useTranslation()

  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)

  /**
   * Table state.
   */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    ...form.getValues(form.path("customer_groups.ids"))?.reduce(
      (acc, id) => ({
        ...acc,
        [id]: true,
      }),
      {}
    ),
  })
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  /**
   * Calculate the offset based on the pagination state.
   */
  const offset = useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination.pageIndex, pagination.pageSize]
  )

  const [filters, setFilters] = useState<{
    created_at?: DateComparisonOperator
    updated_at?: DateComparisonOperator
  }>({})

  useEffect(() => {
    if (!open) {
      setFilters({})
    }
  }, [open])

  const { customer_groups, count, isLoading, isError } = useAdminCustomerGroups(
    {
      limit: PAGE_SIZE,
      offset,
      expand: "customers",
      q: debouncedQuery,
    },
    {
      keepPreviousData: true,
    }
  )

  const pageCount = useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = useCustomerGroupsColumns()

  const table = useReactTable({
    columns,
    data: customer_groups ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
  })

  /**
   * Register the form field.
   */
  useEffect(() => {
    register(path("customer_groups.ids"))
  }, [register, path])

  /**
   * Update the form value when the row selection changes.
   *
   * The RowSelectionState will only contain the rows that are
   * selected, so we need to get the keys and set the value to
   * the array of keys.
   */
  useEffect(() => {
    setValue(path("customer_groups.ids"), Object.keys(rowSelection), {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, path, setValue])

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <Container>
        <div className="flex items-center gap-x-2">
          <ExclamationCircle />
          <Text className="text-ui-fg-subtle">
            {t(
              "price-list-details-form-customer-groups-error",
              "An error occurred while loading customer groups. Reload the page and try again. If the issue persists, try again later."
            )}
          </Text>
        </div>
      </Container>
    )
  }

  if (!customer_groups) {
    return (
      <Container>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-customer-groups-no-groups",
            "No customer groups found."
          )}
        </Text>
      </Container>
    )
  }

  return (
    <div className="w-full">
      <div>
        <div className="flex items-center justify-between">
          <Heading level="h2">
            {t(
              "price-list-details-form-customer-groups-heading",
              "Customer availability"
            )}
          </Heading>
          <Switch checked={open} onCheckedChange={setOpen} />
        </div>
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-details-form-customer-groups-description",
            "Specify which customer groups the price overrides should apply for."
          )}
        </Text>
      </div>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Content>
          <div className="pt-6">
            <Container className="overflow-hidden p-0 ">
              <div
                className={clx("flex px-8 pt-6 pb-4", {
                  "items-center justify-between": layout === "focus",
                  "flex-col gap-y-4": layout === "drawer",
                })}
              >
                <Heading>
                  {t(
                    "price-list-details-form-customer-groups-content-heading",
                    "Customer Groups"
                  )}
                </Heading>
                <div
                  className={clx("flex items-center gap-x-2", {
                    "w-full": layout === "drawer",
                  })}
                >
                  <FilterMenu onClearFilters={() => setFilters({})}>
                    <FilterMenu.Content side="top">
                      <FilterMenu.DateItem
                        name="Created at"
                        value={filters.created_at}
                        onChange={(v) => {
                          setFilters((prev) => ({
                            ...prev,
                            created_at: v,
                          }))
                        }}
                      />
                      <FilterMenu.Seperator />
                      <FilterMenu.DateItem
                        name="Updated at"
                        value={filters.updated_at}
                        onChange={(v) => {
                          setFilters((prev) => ({
                            ...prev,
                            updated_at: v,
                          }))
                        }}
                      />
                    </FilterMenu.Content>
                  </FilterMenu>
                  <Input
                    className={clx({
                      "w-full": layout === "drawer",
                    })}
                    type="search"
                    placeholder={
                      t(
                        "price-list-details-form-customer-groups-search-placeholder",
                        "Search"
                      ) ?? undefined
                    }
                    size="small"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <Table.Header>
                  {table.getHeaderGroups().map((headerGroup) => {
                    return (
                      <Table.Row
                        key={headerGroup.id}
                        className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
                      >
                        {headerGroup.headers.map((header) => {
                          return (
                            <Table.HeaderCell key={header.id}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Table.HeaderCell>
                          )
                        })}
                      </Table.Row>
                    )
                  })}
                </Table.Header>
                <Table.Body className="border-b-0">
                  {table.getRowModel().rows.map((row) => (
                    <Table.Row key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <Table.Pagination
                count={count ?? 0}
                canNextPage={table.getCanNextPage()}
                canPreviousPage={table.getCanPreviousPage()}
                nextPage={table.nextPage}
                previousPage={table.previousPage}
                pageIndex={pagination.pageIndex}
                pageCount={pageCount}
                pageSize={pagination.pageSize}
              />
            </Container>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

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
      <PriceListType form={form} layout={layout} />
      <PriceListGeneral
        form={form}
        layout={layout}
        enableTaxToggle={enableTaxToggle}
      />
      <PriceListDates form={form} layout={layout} />
      <PriceListCustomerGroups form={form} layout={layout} />
    </div>
  )
}

export const priceListDetailsSchema = z.object({
  type: z.object({
    value: z.enum(["sale", "override"], {
      required_error: "Type is required",
    }),
  }),
  general: z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    tax_inclusive: z.boolean(),
  }),
  dates: z
    .object({
      starts_at: z.date().nullable().optional(),
      ends_at: z.date().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.starts_at && data.ends_at && data.starts_at > data.ends_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date cannot be after end date",
          path: ["starts_at"],
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date cannot be before start date",
          path: ["ends_at"],
        });
      }
    }),
  customer_groups: z.object({
    ids: z.array(z.string()),
  }),
});

export const priceListPricesSchema = z.object({
  products: z.record(
    z.string(),
    z.object({
      variants: z.record(
        z.string(),
        z.object({
          currency: z
            .record(
              z.string(),
              z.object({
                id: z.string().nullable().optional(),
                amount: z.string().nullable(),
              })
            )
            .optional(),
          region: z
            .record(
              z.string(),
              z.object({
                id: z.string().nullable().optional(),
                amount: z.string().nullable(),
              })
            )
            .optional(),
        })
      ),
    })
  ),
});

export const priceListProductsSchema = z.object({
  ids: z.string().array().min(1, {
    message: "At least one product must be selected",
  }),
});

const priceListNewSchema = z.object({
  details: priceListDetailsSchema,
  products: priceListProductsSchema,
  prices: priceListPricesSchema,
});

enum Tab {
  PRODUCTS = "products",
  PRICES = "prices",
  EDIT = "edit",
}

type StepStatus = {
  [key in Tab]: ProgressStatus;
};

type DeletePromptData = {
  resource: string;
  onDelete: () => any;
  show: boolean;
};

type PriceListNewSchema = z.infer<typeof priceListNewSchema>;

export const priceListProductPricesSchema = z.object({
  variants: z.record(
    z.string(),
    z.object({
      currency: z
        .record(
          z.string(),
          z.object({
            id: z.string().nullable().optional(),
            amount: z.string().nullable(),
          })
        )
        .optional(),
      region: z
        .record(
          z.string(),
          z.object({
            id: z.string().nullable().optional(),
            amount: z.string().nullable(),
          })
        )
        .optional(),
    })
  ),
});

export type PriceListProductsSchema = z.infer<typeof priceListProductsSchema>

export type PriceListProductPricesSchema = z.infer<
  typeof priceListProductPricesSchema
>;

interface PriceListProductsFormProps {
  form: NestedForm<PriceListProductsSchema>
  /**
   * Products that are already part of the price list.
   */
  productIds?: string[]
}


const PriceListProductsForm = ({
  form,
  productIds,
}: PriceListProductsFormProps) => {
  const {
    register,
    path,
    setValue,
    getValues,
    control,
    formState: { isDirty },
  } = form

  const { t } = useTranslation()

  /**
   * Table state.
   */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    (getValues(path("ids")) ?? []).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: true,
      }
    }, {} as RowSelectionState)
  )

  useEffect(() => {
    const values = getValues(path("ids")) ?? []

    setRowSelection(
      values.reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: true,
        }
      }, {} as RowSelectionState)
    )
  }, [getValues, path])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  /**
   * Calculate the offset based on the pagination state.
   */
  const offset = useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination.pageIndex, pagination.pageSize]
  )

  const [filters, setFilters] = useState<ProductFilter>({
    created_at: undefined,
    updated_at: undefined,
  })

  /**
   * Search query.
   */
  const [query, setQuery] = useState<string>("")
  const debouncedQuery = useDebounce(query, 500)

  const { products, count, isLoading, isError } = useAdminProducts(
    {
      limit: PAGE_SIZE,
      offset,
      expand: "variants,sales_channels,collection",
      q: debouncedQuery,
      ...filters,
    },
    {
      keepPreviousData: true,
    }
  )

  const pageCount = useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = usePriceListProductsFormColumns()

  const table = useReactTable({
    columns,
    data: (products as Product[] | undefined) ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    meta: {
      productIds: productIds ?? [],
    },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
  })

  /**
   * Register the form field.
   */
  useEffect(() => {
    register(path("ids"))
  }, [register, path])

  /**
   * Update the form value when the row selection changes.
   *
   * The RowSelectionState will only contain the rows that are
   * selected, so we need to get the keys and set the value to
   * the array of keys.
   */
  useEffect(() => {
    setValue(path("ids"), Object.keys(rowSelection), {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, path, setValue])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
        <span className="sr-only">
          {t("price-list-products-form-loading", "Loading products")}
        </span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2">
        <ExclamationCircle />
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-products-form-error",
            "An error occurred while loading products. Reload the page and try again. If the issue persists, try again later."
          )}
        </Text>
      </div>
    )
  }

  if (!products) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2">
        <ExclamationCircle />
        <Text className="text-ui-fg-subtle">
          {t("price-list-products-form-no-products", "No products found.")}
        </Text>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-ui-border-base flex items-center justify-between border-b px-8 pt-6 pb-4">
        <div className="flex items-center gap-x-3">
          <Heading>
            {t("price-list-products-form-heading", "Choose products")}
          </Heading>
          {isDirty && (
            <Form.Field
              control={control}
              name={path("ids")}
              render={() => {
                return (
                  <Form.Item>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          )}
        </div>
        <div className={clx("flex items-center gap-x-2")}>
          <ProductFilterMenu
            onClearFilters={() =>
              setFilters({
                created_at: undefined,
                updated_at: undefined,
              })
            }
            onFilterChange={setFilters}
            value={filters}
          />
          <Input
            type="search"
            placeholder={
              t("price-list-products-form-search-placeholder", "Search") ??
              undefined
            }
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="border-ui-border-base relative h-full flex-1 overflow-y-auto border-b">
        <Table>
          <Table.Header className="border-t-0">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.HeaderCell key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Table.HeaderCell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Header>
          <Table.Body className="border-b-0">
            {table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                className={clx(
                  {
                    "bg-ui-bg-disabled hover:bg-ui-bg-disabled":
                      productIds?.includes(row.id),
                  },
                  {
                    "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                      row.getIsSelected(),
                  }
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Table.Pagination
        count={count ?? 0}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        pageIndex={pagination.pageIndex}
        pageCount={pageCount}
        pageSize={pagination.pageSize}
      />
    </div>
  )
}

const EditGroupPolicyPage = () => {
  const { id } = useParams();

  const form = useForm<PriceListNewSchema>({
    resolver: zodResolver(priceListNewSchema),
    defaultValues: {
      details: {
        type: {
          value: "sale",
        },
        general: {
          name: "",
          description: "",
          tax_inclusive: false,
        },
        customer_groups: {
          ids: [],
        },
        dates: {
          ends_at: null,
          starts_at: null,
        },
      },
      products: {
        ids: [],
      },
      prices: {
        products: {},
      },
    },
  });

  const {
    trigger,
    reset,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { data, isLoading } = useAdminGroupPolicyId(id);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [product, setProduct] = useState<Product | null>(null);

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { isDirty: isEditDirty },
    setValue: setEditValue,
    getValues: getEditValues,
  } = useForm<PriceListProductPricesSchema>({
    resolver: zodResolver(priceListProductPricesSchema),
  });
  // const product = {}

  console.log(typeof data);
  console.log(data);
  if (data && data.group_policy && data.group_policy.name) {
    console.log(data.group_policy);
    console.log(data.group_policy.name);
  }

  const onSetProduct = useCallback(
    (product: Product | null) => {
      if (!product) {
        setProduct(null);
        setTab(Tab.PRICES);
        return;
      }

      const defaultValues = getValues(`prices.products.${product.id}`);
      resetEdit(defaultValues);
      setProduct(product);
      setTab(Tab.EDIT);
    },
    [resetEdit, getValues]
  );

  const [tab, setTab] = useState<Tab>(Tab.PRODUCTS);
  const [status, setStatus] = useState<StepStatus>({
    [Tab.PRODUCTS]: "not-started",
    [Tab.PRICES]: "not-started",
    [Tab.EDIT]: "not-started",
  });

  const navigate = useNavigate();

  const errors = {};

  const method = 1;

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

  // return (
  //   <div>
  //     <BackButton
  //       path="/a/settings/custom"
  //       label="Back to settings "
  //       className="mb-xsmall"
  //     />
  //     {isLoading ? (
  //       <BodyCard className="pt-2xlarge flex w-full items-center justify-center">
  //         <Spinner size={"large"} variant={"secondary"} />
  //       </BodyCard>
  //     ) : (
  //       <div>
  //         <div className={"flex space-x-4"}>
  //           <BodyCard
  //             className={"mb-4 min-h-[200px] w-full"}
  //             title={`Policy ${data.group_policy.name}`}
  //             subtitle={moment(data.group_policy.created_at).format(
  //               "D MMMM YYYY hh:mm a"
  //             )}
  //             // status={<OrderStatusComponent />}
  //             // customActionable={
  //             // }
  //             // forceDropdown={draft_order?.status === "completed" ? false : true}
  //             // actionables={
  //             // }
  //           >
  //             <div className="mt-6 flex space-x-6 divide-x">
  //               <div className="flex flex-col">
  //                 <div className="inter-smaller-regular text-grey-50 mb-1">
  //                   {"Email"}
  //                 </div>
  //                 <div>{data.group_policy?.name}</div>
  //               </div>
  //               <div className="flex flex-col pl-6">
  //                 <div className="inter-smaller-regular text-grey-50 mb-1">
  //                   {"Phone"}
  //                 </div>
  //                 <div>{data.group_policy?.description || "N/A"}</div>
  //               </div>
  //               <div className="flex flex-col pl-6">
  //                 <div className="inter-smaller-regular text-grey-50 mb-1">
  //                   {"Phone"}
  //                 </div>
  //                 {/* <div className="inter-smaller-regular text-grey-50 mb-1"> */}
  //                 {/*     {data.policy.description} */}
  //                 {/* </div> */}
  //                 <div></div>
  //               </div>
  //             </div>
  //           </BodyCard>
  //         </div>
  //         <div>
  //           <FocusModal open={true}>
  //             <ProgressTabs
  //               value={tab}
  //               // onValueChange={(tab) => onTabChange(tab as Tab)}
  //             >
  //               <FocusModal.Content>
  //                 <FocusModal.Header className="flex w-full items-center justify-between">
  //                   <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
  //                     <ProgressTabs.Trigger
  //                       value={Tab.PRODUCTS}
  //                       className="w-full max-w-[200px]"
  //                       status={status[Tab.PRODUCTS]}
  //                     >
  //                       <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
  //                         "Choose Products"
  //                       </span>
  //                     </ProgressTabs.Trigger>
  //                     <ProgressTabs.Trigger
  //                       disabled={selectedIds.length === 0}
  //                       value={Tab.PRICES}
  //                       className="w-full max-w-[200px]"
  //                       status={status[Tab.PRICES]}
  //                     >
  //                       <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
  //                         Edit prices
  //                       </span>
  //                     </ProgressTabs.Trigger>
  //                     {product && (
  //                       <ProgressTabs.Trigger
  //                         value={Tab.EDIT}
  //                         className="w-full max-w-[200px]"
  //                         status={"not-started"}
  //                       >
  //                         <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
  //                           "TESTEST"
  //                         </span>
  //                       </ProgressTabs.Trigger>
  //                     )}
  //                   </ProgressTabs.List>
  //                   <div className="flex flex-1 items-center justify-end gap-x-2">
  //                     <Button
  //                       // disabled={isSubmitting}
  //                       variant="secondary"
  //                       // onClick={onBack}
  //                     >
  //                       "TEST"TEST
  //                     </Button>
  //                     <Button
  //                       type="button"
  //                       variant="primary"
  //                       className="whitespace-nowrap"
  //                       // isLoading={isSubmitting}
  //                       // onClick={onNext}
  //                     >
  //                       NEXTTEST
  //                     </Button>
  //                   </div>
  //                 </FocusModal.Header>
  //                 <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
  //                   <Form {...form}>
  //                     {/*   <ProgressTabs.Content */}
  //                     {/*     value={Tab.PRODUCTS} */}
  //                     {/*     className="h-full w-full" */}
  //                     {/*   > */}
  //                     {/*     <PriceListProductsForm */}
  //                     {/*       form={nestedForm(form, "products")} */}
  //                     {/*       productIds={productIds} */}
  //                     {/*     /> */}
  //                     {/*   </ProgressTabs.Content> */}
  //                     {/*   {isLoading ? ( */}
  //                     {/*     <div className="flex h-full w-full items-center justify-center"> */}
  //                     {/*       <Spinner className="text-ui-fg-subtle animate-spin" /> */}
  //                     {/*     </div> */}
  //                     {/*   ) : isError || isNotFound ? ( */}
  //                     {/*     <div className="flex h-full w-full items-center justify-center"> */}
  //                     {/*       <div className="text-ui-fg-subtle flex items-center gap-x-2"> */}
  //                     {/*         <ExclamationCircle /> */}
  //                     {/*         <Text> */}
  //                     {/*           {t( */}
  //                     {/*             "price-list-add-products-modal-error", */}
  //                     {/*             "An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later." */}
  //                     {/*           )} */}
  //                     {/*         </Text> */}
  //                     {/*       </div> */}
  //                     {/*     </div> */}
  //                     {/*   ) : ( */}
  //                     <Fragment>
  //                       <ProgressTabs.Content
  //                         value={Tab.PRICES}
  //                         className="h-full w-full"
  //                       >
  //                         <PriceListPricesForm
  //                           setProduct={onSetProduct}
  //                           form={nestedForm(form, "prices")}
  //                           productIds={selectedIds}
  //                         />
  //                       </ProgressTabs.Content>
  //                       {/* {product && (
  //                            <ProgressTabs.Content
  //                              value={Tab.EDIT}
  //                              className="h-full w-full"
  //                            >
  //                              <PriceListProductPricesForm
  //                                product={product}
  //                                currencies={currencies}
  //                                regions={regions}
  //                                control={editControl}
  //                                priceListTaxInclusive={priceList.includes_tax}
  //                                taxInclEnabled={isTaxInclPricesEnabled}
  //                                setValue={setEditValue}
  //                                getValues={getEditValues}
  //                              />
  //                            </ProgressTabs.Content>
  //                          )}  */}
  //                     </Fragment>
  //                     {/* )}  */}
  //                   </Form>
  //                 </FocusModal.Body>
  //               </FocusModal.Content>
  //             </ProgressTabs>
  //           </FocusModal>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <Form {...form}>
      <Fragment>
        {/* <ProgressTabs.Content
                          value={Tab.PRICES}
                          className="h-full w-full"
                        > */}
        {/* <PriceListPricesForm
                            setProduct={onSetProduct}
                            form={nestedForm(form, "prices")}
                            productIds={selectedIds}
                          /> */}
        {/* <PriceListDetailsForm
          form={nestedForm(form, "details")}
          layout="focus"
          enableTaxToggle={false}
        /> */}
        <PriceListProductsForm form={nestedForm(form, "products")} />

        {/* </ProgressTabs.Content> */}
        {/* {product && ( 
                             <ProgressTabs.Content 
                               value={Tab.EDIT} 
                               className="h-full w-full" 
                             > 
                               <PriceListProductPricesForm 
                                 product={product} 
                                 currencies={currencies} 
                                 regions={regions} 
                                 control={editControl} 
                                 priceListTaxInclusive={priceList.includes_tax} 
                                 taxInclEnabled={isTaxInclPricesEnabled} 
                                 setValue={setEditValue} 
                                 getValues={getEditValues} 
                               /> 
                             </ProgressTabs.Content> 
                           )}  */}
      </Fragment>
    </Form>
  );
};

export default EditGroupPolicyPage;