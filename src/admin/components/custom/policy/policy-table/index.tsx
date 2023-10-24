import {Fragment, useEffect, useState} from "react"
import {useLocation} from "react-router-dom"
import {usePagination, useTable} from "react-table"
import TableContainer from "../../../shared/custom-table/table-container"
import usePolicyColumn from "./use-policy-columns"
import {usePolicyFilters} from "./use-policy-filters"
import Table from "../../../shared/custom-table"
import {useAdminPolicy} from "../../../hooks/policy";
import {ExclamationCircle} from "@medusajs/icons";
import {Text} from "@medusajs/ui";
import * as React from "react";

const DEFAULT_PAGE_SIZE = 15

const PolicyTable = () => {
    const location = useLocation()

    const {
        reset,
        paginate,
        setQuery: setFreeText,
        queryObject,
    } = usePolicyFilters(location.search, {})

    const filtersOnLoad = queryObject

    const offs = parseInt(filtersOnLoad?.offset) || 0
    const lim = parseInt(filtersOnLoad?.limit) || DEFAULT_PAGE_SIZE

    const [query, setQuery] = useState(filtersOnLoad?.query)
    const [numPages, setNumPages] = useState(0)

    const {policy, isLoading, isRefetching, count, isError} = useAdminPolicy(queryObject)

    useEffect(() => {
        const controlledPageCount = Math.ceil(count! / queryObject.limit)
        setNumPages(controlledPageCount)
    }, [count, queryObject])

    const [columns] = usePolicyColumn()

    if(isError) {
        return (
            <div className="flex h-full w-full items-center justify-center gap-x-2">
                <ExclamationCircle/>
                <Text className="text-ui-fg-subtle">
                    {"Something happened, try again later."}
                </Text>
            </div>
        )
    }

    if (!policy) {
        return (
            <div className="flex h-full w-full items-center justify-center gap-x-2">
                <ExclamationCircle/>
                <Text className="text-ui-fg-subtle">
                    {"No policy found."}
                </Text>
            </div>
        )
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: {pageIndex},
    } = useTable(
        {
            columns,
            data: policy ??  [],
            manualPagination: true,
            initialState: {
                pageSize: lim,
                pageIndex: offs / lim,
            },
            pageCount: numPages,
            autoResetPage: false,
        },
        usePagination
    )

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) {
                setFreeText(query)
                gotoPage(0)
            } else {
                reset()
            }
        }, 400)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    const handleNext = () => {
        if (canNextPage) {
            paginate(1)
            nextPage()
        }
    }

    const handlePrev = () => {
        if (canPreviousPage) {
            paginate(-1)
            previousPage()
        }
    }

    return (
        <>
            <TableContainer
                hasPagination
                numberOfRows={DEFAULT_PAGE_SIZE}
                pagingState={{
                    count: count!,
                    offset: queryObject.offset,
                    pageSize: queryObject.offset + rows.length,
                    title: "Policy",
                    currentPage: pageIndex + 1,
                    pageCount: pageCount,
                    nextPage: handleNext,
                    prevPage: handlePrev,
                    hasNext: canNextPage,
                    hasPrev: canPreviousPage,
                }}
                isLoading={isLoading || isRefetching}
            >
                <Table
                    filteringOptions={[]}
                    enableSearch
                    handleSearch={setQuery}
                    searchValue={query}
                    {...getTableProps()}
                >
                    <Table.Head>
                        {headerGroups?.map((headerGroup) => {
                            return (
                                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((col, index) => {
                                        return (
                                            <Table.HeadCell
                                                className="w-[100px]"
                                                {...col.getHeaderProps()}
                                            >
                                                {col.render("Header", {customIndex: index})}
                                            </Table.HeadCell>
                                        )
                                    })}
                                </Table.HeadRow>
                            )
                        })}
                    </Table.Head>
                    <Table.Body {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row)
                            return (
                                <Table.Row
                                    color={"inherit"}
                                    {...row.getRowProps()}
                                >
                                    {row.cells.map((cell, index) => {
                                        return (
                                            <Fragment key={index}>{cell.render("Cell")}</Fragment>
                                        )
                                    })}
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </TableContainer>
        </>
    )
}

export default PolicyTable
