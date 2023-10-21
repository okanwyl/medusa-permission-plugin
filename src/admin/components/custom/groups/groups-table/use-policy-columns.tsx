import moment from "moment"
import { useMemo } from "react"
import StatusIndicator from "../../../shared/status-indicator"
import { Badge, Table } from "@medusajs/ui"
import Tooltip from "../../../shared/tooltip"

const usePolicyColumn = () => {
  const decideMethod = (status) => {
    switch (status) {
      case "GET":
        return (
          <Badge color="green" rounded="full">
            {status}
          </Badge>
        )
      case "POST":
        return (
          <Badge color="purple" rounded="full">
            {status}
          </Badge>
        )
      case "DELETE":
        return (
          <Badge color="red" rounded="full">
            {status}
          </Badge>
        )
      case "PUT":
        return (
          <Badge color="blue" rounded="full">
            {status}
          </Badge>
        )
      case "PATCH":
        return (
          <Badge color="orange" rounded="full">
            {status}
          </Badge>
        )
      default:
        return (
          <Tooltip content={"This is not a valid schema"}>
            <Badge color="red" rounded="full">
              {status}
            </Badge>
          </Tooltip>
        )
    }
  }

  const decideCustomRegex = (value) => {
    if (value) {
      return <StatusIndicator variant="primary" title={"Defined"} />
    }

    return <StatusIndicator variant="warning" title={"Not defined"} />
  }

  const columns = useMemo(
    () => [
      {
        Header: "Group name",
        accessor: "name",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell
            {...getCellProps()}
            className="pl-2"
          >{`${value}`}</Table.Cell>
        ),
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell {...getCellProps()}>
            {moment(value).format("DD MMM YYYY")}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default usePolicyColumn
