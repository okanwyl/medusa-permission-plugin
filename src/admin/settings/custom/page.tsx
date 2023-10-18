import type {SettingConfig} from "@medusajs/admin"
import LockIcon from "../../components/shared/icons/user-permission-icon";
import Policies from "../../components/domain/permissions/policies";
import BackButton from "../../components/shared/back-button";

const CustomSettingPage = () => {
    return (
        <div>
            <BackButton
                label="Back to settings"
                path="/a/settings"
                className="mb-xsmall"
            />
            <div>
                <Policies/>
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