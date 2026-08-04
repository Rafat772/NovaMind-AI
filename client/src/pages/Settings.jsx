import DashboardLayout from "../layouts/DashboardLayout";

import ProfileCard from "../components/settings/ProfileCard";
import Preferences from "../components/settings/Preferences";
import AccountSettings from "../components/settings/AccountSettings";

function Settings() {
  return (
    <DashboardLayout>
      <div className="p-10">

        <h1 className="text-4xl font-bold mb-2 text-white">
          Settings
        </h1>

        <p className="text-gray-400 mb-10">
          Manage your account and application preferences.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <ProfileCard />

          <div className="lg:col-span-2 space-y-6">

            <Preferences />

            <AccountSettings />

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Settings;