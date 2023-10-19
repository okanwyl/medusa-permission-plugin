import type { SettingConfig, SettingProps } from "@medusajs/admin"
import LockIcon from "../../components/shared/icons/user-permission-icon";
import Policies from "../../components/domain/permissions/policies";
import BackButton from "../../components/shared/back-button";

const CustomSettingPage = ({ notify }: SettingProps) => {
  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <div>
        <Policies notify={notify} />
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
