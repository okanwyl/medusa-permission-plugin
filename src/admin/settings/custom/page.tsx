import type {SettingConfig} from "@medusajs/admin"
import LockIcon from "../../shared/components/icons/user-permission-icon";
import DraftOrders from "../../shared/domain/permissions/draft-orders";
import {useTranslation} from "react-i18next";
import BackButton from "../../shared/components/back-button";

const CustomSettingPage = () => {
    const {t} = useTranslation();
    return (
        <div>
            <BackButton
                label={t("pages-back-to-settings", "Back to settings")}
                path="/a/settings"
                className="mb-xsmall"
            />
            <div>
                <DraftOrders/>
            </div>
        </div>
    )
}

export const config: SettingConfig = {
    card: {
        label: "User Permissions",
        description: "Manage your team users permissions",
        icon: LockIcon,
    },
}

export default CustomSettingPage