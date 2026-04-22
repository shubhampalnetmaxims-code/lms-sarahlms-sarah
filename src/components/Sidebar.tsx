import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Trophy, 
  ChevronDown, 
  LogOut, 
  User,
  LayoutDashboard,
  Menu,
  X,
  Book,
  Users,
  UserCheck,
  Home,
  ClipboardList,
  Database,
  Building2,
  Settings,
  TrendingUp
} from "lucide-react";
import { Organization } from "../types";

interface SidebarProps {
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'admin' | 'teacher' | 'student';
  impersonating?: boolean;
  currentUser?: any;
  onBackToAdmin?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

export default function Sidebar({ 
  onLogout, 
  activeTab, 
  setActiveTab, 
  userRole = 'admin', 
  impersonating = false,
  currentUser,
  onBackToAdmin
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["academic", "organization", "teacher-modules", "teacher-students"]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const loadOrg = () => {
      const savedOrg = localStorage.getItem("aquire_organization");
      if (savedOrg) {
        setOrganization(JSON.parse(savedOrg));
      }
    };

    loadOrg();

    const handleOrgUpdate = () => {
      loadOrg();
    };

    document.addEventListener('organization-updated', handleOrgUpdate);
    return () => document.removeEventListener('organization-updated', handleOrgUpdate);
  }, []);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { 
      id: "academic", 
      label: "Academic", 
      icon: <GraduationCap size={20} />,
      submenu: [
        { id: "curriculum", label: "Curriculum Builder", icon: <Layers size={18} /> },
        { id: "learning-paths", label: "Learning Paths", icon: <Book size={18} /> },
        { id: "skills", label: "Skill-Based Lessons", icon: <Trophy size={18} /> },
        { id: "assessments", label: "Assessments", icon: <ClipboardList size={18} /> },
      ]
    },
    { 
      id: "organization", 
      label: "Organization", 
      icon: <Building2 size={20} />,
      submenu: [
        { id: "manage-school", label: "Manage School", icon: <Settings size={18} /> },
        { id: "teachers", label: "Teachers", icon: <UserCheck size={18} /> },
        { id: "students", label: "Students", icon: <User size={18} /> },
        { id: "home-learner", label: "Home learner", icon: <Home size={18} /> },
      ]
    },
  ];

  const teacherMenuItems: MenuItem[] = [
    { id: "dashboard", label: "Home / Dashboard", icon: <Home size={20} /> },
    ...(currentUser?.permissions?.skill_based ? [{ 
      id: "teacher-modules", 
      label: "Modules", 
      icon: <Layers size={20} />,
      submenu: [
        { id: "curriculum", label: "View Curriculum", icon: <Layers size={18} /> },
      ]
    }] : []),
    ...(currentUser?.permissions?.learning_paths ? [{
      id: "teacher-learning",
      label: "Academic",
      icon: <GraduationCap size={20} />,
      submenu: [
        { id: "learning-paths", label: "Learning Paths", icon: <Book size={18} /> },
      ]
    }] : []),
    { 
      id: "teacher-students", 
      label: "Students", 
      icon: <Users size={20} />,
      submenu: [
        { id: "students", label: "Student List", icon: <User size={18} /> },
        { id: "progress", label: "Progress Tracking", icon: <TrendingUp size={18} /> },
        { id: "assignments", label: "Assignments", icon: <ClipboardList size={18} /> },
      ]
    },
    { 
      id: "teacher-settings", 
      label: "Settings", 
      icon: <Settings size={20} />,
      submenu: [
        { id: "account", label: "Account (Profile/Password)", icon: <User size={18} /> },
      ]
    },
  ];

  const studentMenuItems: MenuItem[] = [
    { id: "dashboard", label: "My Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "my-learning", label: "My Learning", icon: <BookOpen size={20} /> },
    { id: "learning-paths", label: "Learning Paths", icon: <Trophy size={20} /> },
    { id: "assignments", label: "Assignments", icon: <ClipboardList size={20} /> },
    { id: "profile", label: "My Profile", icon: <User size={20} /> },
  ];

  const currentMenuItems = userRole === 'teacher' ? teacherMenuItems : userRole === 'student' ? studentMenuItems : menuItems;

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${userRole === 'teacher' ? 'sidebar-teacher' : 'bg-aquire-black py-8'}`}>
      {/* Logo Section */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
          {organization?.logo ? (
            <img src={organization.logo} alt="Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <GraduationCap className="text-aquire-primary w-6 h-6" />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-white leading-tight truncate">
            {organization?.name || "Aquire Academy"}
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
            {userRole === 'teacher' ? 'Teacher Portal' : userRole === 'student' ? 'Student Portal' : 'Admin Panel'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {currentMenuItems.map((item) => (
          <div key={item.id} className="space-y-1">
            <button
              onClick={() => item.submenu ? toggleMenu(item.id) : setActiveTab(item.id)}
              className={`w-full transition-all duration-300 group ${
                userRole === 'teacher' 
                  ? `teacher-nav-item ${activeTab === item.id || (item.submenu && (item.submenu.some(s => s.id === activeTab) || item.submenu.some(s => s.submenu && s.submenu.some(ss => ss.id === activeTab)))) ? 'active' : ''}`
                  : `flex items-center justify-between px-4 py-3 rounded-xl ${activeTab === item.id || (item.submenu && (item.submenu.some(s => s.id === activeTab) || item.submenu.some(s => s.submenu && s.submenu.some(ss => ss.id === activeTab)))) ? "bg-aquire-primary text-white shadow-lg shadow-aquire-primary/20" : "text-[#E2E8F0] hover:bg-[#1E293B] hover:text-white"}`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${activeTab === item.id || (item.submenu && item.submenu.some(s => s.id === activeTab)) 
                  ? userRole === 'teacher' ? "text-blue-600" : "text-white" 
                  : "group-hover:text-aquire-primary"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.submenu && (
                <motion.div
                  animate={{ rotate: expandedMenus.includes(item.id) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="opacity-50" />
                </motion.div>
              )}
            </button>

            <AnimatePresence>
              {item.submenu && expandedMenus.includes(item.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden pl-4 space-y-1"
                >
                  {item.submenu.map((sub) => (
                    <div key={sub.id} className="space-y-1">
                      <button
                        onClick={() => sub.submenu ? toggleMenu(sub.id) : setActiveTab(sub.id)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                          activeTab === sub.id || (sub.submenu && sub.submenu.some(ss => ss.id === activeTab))
                            ? userRole === 'teacher'
                              ? "text-blue-500 bg-blue-600/10 font-bold"
                              : "text-white bg-aquire-primary shadow-md shadow-aquire-primary/10 font-bold"
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${activeTab === sub.id || (sub.submenu && sub.submenu.some(ss => ss.id === activeTab)) ? "text-white" : "opacity-70"}`}>{sub.icon}</span>
                          {sub.label}
                        </div>
                        {sub.submenu && (
                          <motion.div
                            animate={{ rotate: expandedMenus.includes(sub.id) ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={14} className="opacity-50" />
                          </motion.div>
                        )}
                      </button>

                      {sub.submenu && expandedMenus.includes(sub.id) && (
                        <div className="pl-6 space-y-1">
                          {sub.submenu.map((ss) => (
                            <button
                              key={ss.id}
                              onClick={() => setActiveTab(ss.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs transition-all duration-300 ${
                                activeTab === ss.id
                                  ? "text-white bg-aquire-primary/20 font-bold"
                                  : "text-white/30 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <span>{ss.icon}</span>
                              {ss.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="px-4 mt-auto pt-6 border-t border-white/5 space-y-4">
        {impersonating && onBackToAdmin && (
          <button
            onClick={onBackToAdmin}
            className={`w-full flex items-center justify-center gap-2 transition-all duration-300 font-black text-xs uppercase tracking-widest ${
              userRole === 'teacher' ? 'back-admin-btn' : 'py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
            }`}
          >
            <LogOut size={18} className="rotate-180" />
            Back to Admin Panel
          </button>
        )}

        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-aquire-primary flex items-center justify-center text-white font-bold border-2 border-white/10 overflow-hidden">
            {currentUser?.profile_pic ? (
              <img src={currentUser.profile_pic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              currentUser?.name?.charAt(0) || "SP"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentUser?.name || "Shubham Pal"}</p>
            <p className="text-[10px] text-white/40 truncate">
              {userRole === 'teacher' ? 'Teacher' : userRole === 'student' ? 'Student' : 'Super Admin'}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 font-bold text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-40 p-3 bg-aquire-black rounded-xl text-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 bg-aquire-black border-r border-white/5 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-aquire-black z-50 lg:hidden"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
