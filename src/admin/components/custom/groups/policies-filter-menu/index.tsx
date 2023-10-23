import { DateComparisonOperator } from "@medusajs/types"
import {FilterMenu} from "../../../shared/filter-menu";

type PoliciesFilter = {
    created_at?: DateComparisonOperator
    updated_at?: DateComparisonOperator
}

type PoliciesFilterMenuProps = {
    onClearFilters: () => void
    onFilterChange: (filter: PoliciesFilter) => void
    value?: PoliciesFilter
}

const PoliciesFilterMenu = ({
                               value,
                               onClearFilters,
                               onFilterChange,
                           }: PoliciesFilterMenuProps) => {
    const onDateChange = (
        key: "created_at" | "updated_at",
        date?: DateComparisonOperator
    ) => {
        onFilterChange({
            ...value,
            [key as keyof PoliciesFilter]: date,
        })
    }

    return (
        <FilterMenu onClearFilters={onClearFilters}>
            <FilterMenu.Content>
                <FilterMenu.DateItem
                    name={ "Created at"}
                    value={value?.created_at}
                    onChange={(obj) => onDateChange("created_at", obj)}
                />
                <FilterMenu.Seperator />
                <FilterMenu.DateItem
                    name={"Updated at"}
                    value={value?.updated_at}
                    onChange={(obj) => onDateChange("updated_at", obj)}
                />
            </FilterMenu.Content>
        </FilterMenu>
    )
}

export { PoliciesFilterMenu, type PoliciesFilter }
