import type {SettingConfig} from "@medusajs/admin"
import LockIcon from "../../shared/components/icons/user-permission-icon";

const CustomSettingPage = () => {
    return (
        <div>
            <h1>Custom Setting Page</h1>
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