import React, { useState } from "react";
import {
  ChartPie,
  CheckSquare,
  FolderKanban,
  Layers,
  LayoutDashboard,
  Users,
} from "lucide-react";

const pageContent = {
  Dashboard: {
    title: "Dashboard",
    description: "Welcome back, Serafim. Here's what's happening today.",
    content: (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="content-card">
          <h2 className="text-lg font-semibold text-white">Active Projects</h2>
          <p className="mt-2 text-4xl font-bold text-indigo-400">12</p>
        </div>
        <div className="content-card">
          <h2 className="text-lg font-semibold text-white">Tasks Due</h2>
          <p className="mt-2 text-4xl font-bold text-pink-400">5</p>
        </div>
        <div className="content-card">
          <h2 className="text-lg font-semibold text-white">New Users</h2>
          <p className="mt-2 text-4xl font-bold text-emerald-400">28</p>
        </div>
      </div>
    ),
  },
  Analytics: {
    title: "Analytics",
    description: "Detailed insights and metrics for your projects.",
    content: (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="content-card flex h-64 items-center justify-center lg:col-span-2">
          <p className="text-gray-400">Chart placeholder for User Growth</p>
        </div>
        <div className="content-card">
          <h2 className="text-lg font-semibold text-white">Bounce Rate</h2>
          <p className="mt-2 text-4xl font-bold text-indigo-400">24.5%</p>
        </div>
        <div className="content-card">
          <h2 className="text-lg font-semibold text-white">Session Duration</h2>
          <p className="mt-2 text-4xl font-bold text-pink-400">8m 12s</p>
        </div>
      </div>
    ),
  },
  Users: {
    title: "Users",
    description: "Manage all the users in your organization.",
    content: (
      <div className="content-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jane Doe</td>
              <td>jane.doe@example.com</td>
              <td>Admin</td>
            </tr>
            <tr>
              <td>John Smith</td>
              <td>john.smith@example.com</td>
              <td>Developer</td>
            </tr>
            <tr>
              <td>Sam Wilson</td>
              <td>sam.wilson@example.com</td>
              <td>Designer</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  Projects: {
    title: "Projects",
    description: "An overview of all your ongoing and completed projects.",
    content: (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="content-card">
          <h2 className="text-lg font-semibold text-white">Project Alpha</h2>
          <p className="mt-1 text-sm text-gray-400">Status: In Progress</p>
        </div>
        <div className="content-card">
          <h2 className="text-lg font-semibold text-white">Project Beta</h2>
          <p className="mt-1 text-sm text-gray-400">Status: Completed</p>
        </div>
      </div>
    ),
  },
  Tasks: {
    title: "Tasks",
    description: "Track and manage all your tasks and to-dos.",
    content: (
      <div className="content-card">
        <ul>
          <li className="task-list-item">
            <span>Finalize Q3 report</span>
            <span className="text-xs text-pink-400">Due Tomorrow</span>
          </li>
          <li className="task-list-item">
            <span>Design new landing page mockups</span>
            <span className="text-xs text-gray-400">In Progress</span>
          </li>
          <li className="task-list-item">
            <span>Deploy server updates</span>
            <span className="text-xs text-emerald-400">Completed</span>
          </li>
        </ul>
      </div>
    ),
  },
};

type PageKey = keyof typeof pageContent;

const navItems: Array<{ page: PageKey; icon: React.ReactNode }> = [
  { page: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { page: "Analytics", icon: <ChartPie className="h-5 w-5" /> },
  { page: "Users", icon: <Users className="h-5 w-5" /> },
  { page: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
  { page: "Tasks", icon: <CheckSquare className="h-5 w-5" /> },
];

const Sidebar = ({
  activePage,
  setActivePage,
}: {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
}) => (
  <aside className="glass-effect z-10 flex w-64 flex-shrink-0 flex-col">
    <div className="flex h-20 items-center justify-center border-b border-white/10">
      <div className="flex items-center gap-2">
        <Layers className="h-8 w-8 text-indigo-400" />
        <span className="text-xl font-bold text-white">AetherUI</span>
      </div>
    </div>
    <nav className="flex-grow space-y-2 p-4">
      {navItems.map((item) => (
        <a
          key={item.page}
          href="#"
          className={`nav-link flex items-center gap-3 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-white/5 ${activePage === item.page ? "active" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            setActivePage(item.page);
          }}
        >
          {item.icon}
          <span>{item.page}</span>
        </a>
      ))}
    </nav>
    <div className="border-t border-white/10 p-4">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
          alt="User Avatar"
          className="h-10 w-10 rounded-full border-2 border-indigo-400 object-cover"
        />
        <div>
          <p className="font-semibold text-white">Serafim P.</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
      </div>
    </div>
  </aside>
);

const MainContent = ({ activePage }: { activePage: PageKey }) => {
  const { title, description, content } = pageContent[activePage];
  return (
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-gray-400">{description}</p>
      <div className="mt-8">{content}</div>
    </main>
  );
};

export const DashboardLayout = () => {
  const [activePage, setActivePage] = useState<PageKey>("Dashboard");
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-gray-900 text-gray-200">
      <style>{`
        .glass-effect {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(2, 6, 23, 0.84));
          backdrop-filter: blur(14px);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }
        .shape-1,
        .shape-2 {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(60px);
          opacity: 0.35;
        }
        .shape-1 {
          width: 320px;
          height: 320px;
          top: -120px;
          right: 12%;
          background: #6366f1;
        }
        .shape-2 {
          width: 280px;
          height: 280px;
          bottom: -120px;
          left: 20%;
          background: #ec4899;
        }
        .content-card {
          background: rgba(15, 23, 42, 0.56);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1.25rem;
          backdrop-filter: blur(10px);
        }
        .custom-table {
          width: 100%;
          border-collapse: collapse;
        }
        .custom-table th,
        .custom-table td {
          text-align: left;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .custom-table th {
          color: #e2e8f0;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .task-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .task-list-item:last-child {
          border-bottom: none;
        }
        .nav-link.active {
          background: linear-gradient(120deg, rgba(99, 102, 241, 0.26), rgba(236, 72, 153, 0.2));
          color: #fff;
        }
      `}</style>
      <div className="shape-1" />
      <div className="shape-2" />
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <MainContent activePage={activePage} />
    </div>
  );
};
