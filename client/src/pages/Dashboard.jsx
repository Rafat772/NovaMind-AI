import ChatInput from "../components/dashboard/ChatInput";
import Welcome from "../components/dashboard/Welcome";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0B0B0F]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Welcome />
          </div>

          <ChatInput />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
