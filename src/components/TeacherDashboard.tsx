import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Trophy, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  LogOut, 
  LayoutDashboard,
  ArrowRight,
  GraduationCap,
  AlertTriangle,
  Layers,
  ChevronRight,
  Plus
} from "lucide-react";
import { Teacher, Grade, Student } from "../types";

interface TeacherDashboardProps {
  teacher: Teacher;
  isImpersonating: boolean;
  onLogout: () => void;
  onBackToAdmin?: () => void;
  showToast: (message: string, type: "success" | "error") => void;
  activeTab: string;
}

export default function TeacherDashboard({ teacher, isImpersonating, onLogout, onBackToAdmin, showToast, activeTab }: TeacherDashboardProps) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  useEffect(() => {
    const savedGrades = localStorage.getItem("aquire_grades");
    if (savedGrades) setGrades(JSON.parse(savedGrades));

    const savedStudents = localStorage.getItem("aquire_students");
    if (savedStudents) setAllStudents(JSON.parse(savedStudents));
  }, []);

  const teacherGrades = grades.filter(g => teacher.gradeIds?.includes(g.id));
  const assignedStudents = allStudents.filter(s => s.teacher_id === teacher.id);
  const avgProgress = assignedStudents.length > 0 
    ? Math.round(assignedStudents.reduce((acc, s) => acc + (s.progress || 0), 0) / assignedStudents.length)
    : 0;

  const stats = [
    { label: "Students", value: assignedStudents.length.toString(), icon: <Users className="text-blue-500" />, color: "bg-blue-50" },
    { label: "Learning Paths", value: "3/5", icon: <BookOpen className="text-emerald-500" />, color: "bg-emerald-50" },
    { label: "Assessments", value: "12 Pending", icon: <ClipboardList className="text-amber-500" />, color: "bg-amber-50" },
    { label: "Avg. Progress", value: `${avgProgress}%`, icon: <TrendingUp className="text-purple-500" />, color: "bg-purple-50" },
  ];

  const classes = [
    { name: "Narrative Writing", lessons: 12, progress: 65, color: "bg-blue-500" },
    { name: "Punctuation Mastery", lessons: 8, progress: 42, color: "bg-emerald-500" },
    { name: "Creative Editing", lessons: 10, progress: 88, color: "bg-amber-500" },
  ];

  const renderDashboard = () => (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-aquire-primary flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-aquire-primary/20 border-4 border-white overflow-hidden">
            {teacher.profile_pic ? (
              <img src={teacher.profile_pic} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              teacher.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-4xl font-black text-aquire-black tracking-tight">
              Welcome, {teacher.name.split(' ')[0]} 👋
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-aquire-grey-med font-medium">Teacher Dashboard •</span>
              {teacherGrades.map(g => (
                <span key={g.id} className="px-2 py-0.5 bg-aquire-primary/10 text-aquire-primary text-[10px] font-black rounded-md uppercase tracking-widest">
                  {g.name}
                </span>
              ))}
              {teacherGrades.length === 0 && (
                <span className="text-aquire-grey-med font-medium italic">No assigned grades</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isImpersonating && onBackToAdmin && (
            <button 
              onClick={onBackToAdmin}
              className="flex items-center gap-2 px-6 py-3 bg-aquire-black text-white rounded-2xl font-bold hover:bg-aquire-black/90 transition-all shadow-lg"
            >
              <ArrowRight size={20} className="rotate-180" />
              Back to Admin
            </button>
          )}
          {!isImpersonating && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-aquire-border rounded-2xl text-aquire-grey-med font-bold hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6 flex items-center gap-5 hover:scale-[1.02] transition-all cursor-default"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-aquire-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* My Students */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-aquire-black flex items-center gap-3">
              <Users className="text-aquire-primary" />
              Assigned Students
            </h2>
            <button className="text-sm font-bold text-aquire-primary hover:underline">View All</button>
          </div>
          
          {assignedStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {assignedStudents.slice(0, 4).map((student, idx) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card p-5 group hover:border-aquire-primary transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-aquire-primary/10 flex items-center justify-center text-aquire-primary font-bold border border-aquire-primary/20 overflow-hidden">
                      {student.profile_pic ? (
                        <img src={student.profile_pic} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        student.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-aquire-black text-sm group-hover:text-aquire-primary transition-colors">{student.name}</h4>
                      <p className="text-[10px] text-aquire-grey-med font-bold uppercase tracking-widest">
                        {grades.find(g => g.id === student.grade_id)?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-aquire-grey-med uppercase tracking-widest">Progress</span>
                      <span className="text-aquire-black">{student.progress || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-aquire-grey-light rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000"
                        style={{ width: `${student.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center bg-aquire-grey-light/30 border-dashed border-2 border-aquire-border">
              <p className="text-aquire-grey-med font-bold">No students assigned yet.</p>
            </div>
          )}
        </div>

        {/* My Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-aquire-black flex items-center gap-3">
              <BookOpen className="text-aquire-primary" />
              My Classes
            </h2>
            <button className="text-sm font-bold text-aquire-primary hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="card p-6 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 ${cls.color}/10 rounded-xl flex items-center justify-center`}>
                    <GraduationCap className={cls.color.replace('bg-', 'text-')} size={24} />
                  </div>
                  <span className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest bg-aquire-grey-light px-2 py-1 rounded-md">
                    {cls.lessons} Lessons
                  </span>
                </div>
                <h3 className="text-lg font-bold text-aquire-black mb-4 group-hover:text-aquire-primary transition-colors">
                  {cls.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-aquire-grey-med">Progress</span>
                    <span className="text-aquire-black">{cls.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-aquire-grey-light rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cls.color} transition-all duration-1000`}
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-aquire-black flex items-center gap-3">
            <Trophy className="text-amber-500" />
            Quick Actions
          </h2>
          <div className="space-y-4">
            {[
              { label: "View Learning Paths", icon: <LayoutDashboard size={18} /> },
              { label: "Grade Assignments", icon: <ClipboardList size={18} /> },
              { label: "Student Reports", icon: <Users size={18} /> },
              { label: "Class Announcements", icon: <AlertTriangle size={18} /> },
            ].map((action, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between p-5 bg-white border border-aquire-border rounded-2xl hover:border-aquire-primary hover:shadow-lg hover:shadow-aquire-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-aquire-grey-light rounded-xl flex items-center justify-center text-aquire-grey-med group-hover:text-aquire-primary group-hover:bg-aquire-primary/10 transition-all">
                    {action.icon}
                  </div>
                  <span className="font-bold text-aquire-black">{action.label}</span>
                </div>
                <ArrowRight size={18} className="text-aquire-grey-med group-hover:text-aquire-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-aquire-black tracking-tight">Manage Modules</h2>
        {teacher.permissions?.create_skill_based ? (
          <button className="btn-primary">
            <Layers size={20} />
            Create New Module
          </button>
        ) : (
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertTriangle size={14} />
            View Only Access
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, idx) => (
          <div key={idx} className="card p-6">
            <div className={`w-12 h-12 ${cls.color}/10 rounded-xl flex items-center justify-center mb-4`}>
              <Layers className={cls.color.replace('bg-', 'text-')} size={24} />
            </div>
            <h3 className="text-lg font-bold text-aquire-black mb-2">{cls.name}</h3>
            <p className="text-sm text-aquire-grey-med mb-6">Manage lessons and content for this module.</p>
            <div className="flex items-center justify-between pt-4 border-t border-aquire-border">
              <span className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">{cls.lessons} Lessons</span>
              <button className="text-aquire-primary font-bold text-sm hover:underline">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-aquire-black tracking-tight">
            {activeTab === "progress" ? "Progress Tracking" : activeTab === "assignments" ? "Assignments" : "Student List"}
          </h2>
          <p className="text-aquire-grey-med mt-1">
            {activeTab === "progress" ? "Monitor real-time student performance across all modules." : 
             activeTab === "assignments" ? "Manage and grade student assignments and assessments." : 
             "Manage your assigned students and their access."}
          </p>
        </div>
        {activeTab === "students" && teacher.permissions?.invite_students && (
          <button className="btn-primary">
            <Users size={20} />
            Add Student
          </button>
        )}
      </div>
      
      {activeTab === "students" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedStudents.map((student) => (
            <motion.div
              key={student.id}
              whileHover={{ y: -5 }}
              className="card p-6 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-aquire-primary/10 flex items-center justify-center text-aquire-primary text-xl font-bold border border-aquire-primary/20 overflow-hidden">
                  {student.profile_pic ? (
                    <img src={student.profile_pic} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    student.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-aquire-black group-hover:text-aquire-primary transition-colors">{student.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-wider">
                    {grades.find(g => g.id === student.grade_id)?.name || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-aquire-grey-med">Overall Progress</span>
                    <span className="text-aquire-black">{student.progress || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-aquire-grey-light rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-aquire-primary transition-all duration-1000"
                      style={{ width: `${student.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button className="py-2 px-3 bg-aquire-grey-light hover:bg-aquire-primary/10 hover:text-aquire-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    View Progress
                  </button>
                  <button className="py-2 px-3 bg-aquire-grey-light hover:bg-aquire-primary/10 hover:text-aquire-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Grade Work
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-20 text-center">
          <div className="w-16 h-16 bg-aquire-grey-light rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === "progress" ? <TrendingUp className="text-aquire-grey-med" size={32} /> : <ClipboardList className="text-aquire-grey-med" size={32} />}
          </div>
          <h3 className="text-xl font-bold text-aquire-black mb-2">
            {activeTab === "progress" ? "No Progress Data Yet" : "No Assignments Yet"}
          </h3>
          <p className="text-aquire-grey-med max-w-sm mx-auto">
            {activeTab === "progress" ? "Student progress data will appear here once they start working on their modules." : 
             "You haven't created any assignments for your students yet."}
          </p>
        </div>
      )}

      {activeTab === "students" && assignedStudents.length === 0 && (
        <div className="card p-20 text-center">
          <div className="w-16 h-16 bg-aquire-grey-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-aquire-grey-med" size={32} />
          </div>
          <h3 className="text-xl font-bold text-aquire-black mb-2">No Students Assigned</h3>
          <p className="text-aquire-grey-med max-w-sm mx-auto">You haven't been assigned any students yet. Contact your administrator to get started.</p>
        </div>
      )}
    </div>
  );

  const renderAccount = () => (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-3xl font-black text-aquire-black tracking-tight">Account Settings</h2>
      <div className="card p-8 space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-aquire-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden">
            {teacher.profile_pic ? (
              <img src={teacher.profile_pic} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              teacher.name.charAt(0)
            )}
          </div>
          <div>
            <button className="btn-primary px-4 py-2 text-sm">Change Photo</button>
            <p className="text-xs text-aquire-grey-med mt-2">JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Full Name</label>
            <input type="text" defaultValue={teacher.name} className="input-field w-full" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Email Address</label>
            <input type="email" defaultValue={teacher.email} className="input-field w-full" disabled />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Assigned Grades</label>
            <div className="flex flex-wrap gap-2 p-4 bg-aquire-grey-light rounded-2xl border border-aquire-border">
              {teacherGrades.map(g => (
                <span key={g.id} className="px-3 py-1 bg-white border border-aquire-border text-aquire-primary text-xs font-bold rounded-xl shadow-sm">
                  {g.name}
                </span>
              ))}
              {teacherGrades.length === 0 && (
                <span className="text-sm text-aquire-grey-med italic">No grades assigned by administrator.</span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-aquire-border space-y-6">
          <h3 className="text-xl font-bold text-aquire-black">Change Password</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Current Password</label>
              <input type="password" placeholder="••••••••" className="input-field w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">New Password</label>
                <input type="password" placeholder="••••••••" className="input-field w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-aquire-grey-med uppercase tracking-widest">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="input-field w-full" />
              </div>
            </div>
          </div>
        </div>

        <button className="btn-primary w-full md:w-auto">Save Changes</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-aquire-grey-light">
      {isImpersonating && (
        <div className="bg-aquire-black text-white py-4 px-8 flex items-center justify-between sticky top-0 z-[100] shadow-2xl border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-aquire-primary flex items-center justify-center shadow-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-aquire-primary uppercase tracking-widest leading-none mb-1">Admin Impersonation</p>
                <p className="text-sm font-bold leading-none">Logged in as: {teacher.name}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20 hidden md:block" />
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-aquire-primary" />
                <span className="text-xs font-bold">{assignedStudents.length} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-xs font-bold">{avgProgress}% Avg Progress</span>
              </div>
            </div>
          </div>
          {onBackToAdmin && (
            <button 
              onClick={onBackToAdmin}
              className="px-6 py-2 bg-white text-aquire-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-aquire-primary hover:text-white transition-all shadow-lg"
            >
              Back to Admin Panel
            </button>
          )}
        </div>
      )}

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {activeTab === "dashboard" && renderDashboard()}
        {(activeTab === "modules" || activeTab === "lessons") && (
          teacher.permissions?.skill_based ? renderModules() : (
            <div className="card p-20 text-center">
              <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-aquire-black mb-2">Access Restricted</h2>
              <p className="text-aquire-grey-med">You do not have permission to access Skill-Based Content. Please contact your administrator.</p>
            </div>
          )
        )}
        {activeTab === "learning-paths" && (
          teacher.permissions?.learning_paths ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-aquire-black tracking-tight">Learning Paths</h2>
                {teacher.permissions?.create_learning_paths && (
                  <button className="btn-primary">
                    <Plus size={20} />
                    Create Path
                  </button>
                )}
              </div>
              <div className="card p-20 text-center">
                <p className="text-aquire-grey-med">Learning Paths content will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="card p-20 text-center">
              <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-aquire-black mb-2">Access Restricted</h2>
              <p className="text-aquire-grey-med">You do not have permission to access Learning Paths. Please contact your administrator.</p>
            </div>
          )
        )}
        {(activeTab === "students" || activeTab === "progress" || activeTab === "assignments") && (
          teacher.permissions?.invite_students ? renderStudents() : (
            <div className="card p-20 text-center">
              <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-aquire-black mb-2">Access Restricted</h2>
              <p className="text-aquire-grey-med">You do not have permission to access Student Management. Please contact your administrator.</p>
            </div>
          )
        )}
        {activeTab === "account" && renderAccount()}
      </div>
    </div>
  );
}
