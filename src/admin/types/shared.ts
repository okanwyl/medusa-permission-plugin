import React from "react"

export type Option = {
    value: string
    label: string
}


export type ReactFCWithChildren<T> = React.FC<React.PropsWithChildren<T>>
