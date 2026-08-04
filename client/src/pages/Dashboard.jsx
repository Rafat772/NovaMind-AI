import DashboardLayout from "../layouts/DashboardLayout";

import ChatWindow from "../components/dashboard/ChatWindow";
import ChatInput from "../components/dashboard/ChatInput";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">

        <div className="flex-1">
          <ChatWindow />
        </div>

        <ChatInput />

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;