import React, {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {normalizeAmount} from "../../../utils/prices"
import {ActionType} from "../actionables"
import PlusIcon from "../icons/plus-icon"
import MinusIcon from "../icons/minus-icon";
import ArrowLeftIcon from "../icons/arrow-left-icon";
import BannerCard from "../banner-card"
import StatusIndicator from "../status-indicator";

type GiftCardVariant = {
    prices: {
        currency_code: string
        amount: number
    }[]
}

type GiftCardBannerProps = {
    title: string
    status: string
    thumbnail: string | null
    description: string | null
    variants: GiftCardVariant[]
    defaultCurrency: string
    onEdit: () => void
    onUnpublish: () => void
    onDelete: () => void
}

const GiftCardBanner: React.FC<GiftCardBannerProps> = ({
                                                           title,
                                                           status,
                                                           thumbnail,
                                                           description,
                                                           variants,
                                                           defaultCurrency,
                                                           onEdit,
                                                           onUnpublish,
                                                           onDelete,
                                                       }) => {
    const {t} = useTranslation()
    const actions: ActionType[] = [
        {
            label: t("gift-card-banner-edit", "Edit"),
            onClick: onEdit,
            // icon: <EditIcon size={16}/>,
            icon: <PlusIcon size={16}/>,
        },
        {
            label:
                status === "published"
                    ? t("gift-card-banner-unpublish", "Unpublish")
                    : t("gift-card-banner-publish", "Publish"),
            onClick: onUnpublish,
            // icon: <UnpublishIcon size={16}/>,
            icon: <MinusIcon size={16}/>,
        },
        {
            label: t("gift-card-banner-delete", "Delete"),
            onClick: onDelete,
            // icon: <TrashIcon size={16}/>,
            icon: <ArrowLeftIcon size={16}/>,
            variant: "danger",
        },
    ]

    const denominations = useMemo(() => {
        return variants
            .map((variant) => {
                const price = variant.prices.find(
                    (price) => price.currency_code === defaultCurrency
                )

                if (!price) {
                    return ""
                }

                return `${normalizeAmount(
                    defaultCurrency,
                    price.amount
                )} ${defaultCurrency.toUpperCase()}`
            })
            .filter(Boolean)
    }, [variants, defaultCurrency])

    return (
        <BannerCard title={title} thumbnail={thumbnail} actions={actions}>
            <BannerCard.Description>{description}</BannerCard.Description>
            <BannerCard.Footer>
                <div className="flex items-center justify-between">
                    {/*<TagGrid tags={denominations} badgeVariant="default"/>*/}
                    <StatusIndicator
                        variant={status === "published" ? "success" : "danger"}
                        title={
                            status === "published"
                                ? t("gift-card-banner-published", "Published")
                                : t("gift-card-banner-unpublished", "Unpublished")
                        }
                    />
                </div>
            </BannerCard.Footer>
        </BannerCard>
    )
}

export default GiftCardBanner
