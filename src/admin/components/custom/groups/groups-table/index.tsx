import { Fragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import TableContainer from "../../../shared/custom-table/table-container"
import useGroupColumn from "./use-policy-columns"
import { useGroupFilters } from "./use-policy-filters"
import Table from "../../../shared/custom-table"
import useAdminGroupPolicies from "../../../../components/hooks/groups"

const DEFAULT_PAGE_SIZE = 15

const GroupsTable = () => {
  const location = useLocation()

  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
  } = useGroupFilters(location.search, {})

  const filtersOnLoad = queryObject

  const offs = parseInt(filtersOnLoad?.offset) || 0
  const lim = parseInt(filtersOnLoad?.limit) || DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState(filtersOnLoad?.query)
  const [numPages, setNumPages] = useState(0)

  // const { data, isLoading, isRefetching, count } = useAdminPolicies(queryObject);
  const { data, isLoading, isRefetching, count } =
    useAdminGroupPolicies(queryObject)

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [count, queryObject])

  const [columns] = useGroupColumn()

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
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: data?.policy_groups || [],
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

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query)
        gotoPage(0)
      } else {
        // if we delete query string, we reset the table view
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
          title: "Groups",
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
                        {col.render("Header", { customIndex: index })}
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
                  linkTo={`/a/groups/${row.original.id}`}
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

export default GroupsTable
