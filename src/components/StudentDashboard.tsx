import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  ClipboardList, 
  User, 
  LogOut,
  ChevronRight,
  Star,
  Clock,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
  Calendar
} from "lucide-react";
import { Student, Module, Lesson, LearningPath, Level, Organization } from "../types";
import StudentPreview from "./StudentPreview";
import LearningPathZigZagPreview from "./LearningPathZigZagPreview";

interface StudentDashboardProps {
  student: Student;
  isImpersonating?: boolean;
  onLogout: () => void;
  showToast: (message: string, type: "success" | "error") => void;
  activeTab: string;
}

export default function StudentDashboard({ 
  student, 
  isImpersonating = false, 
  onLogout, 
  showToast,
  activeTab 
}: StudentDashboardProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [isPathPreviewOpen, setIsPathPreviewOpen] = useState(false);

  useEffect(() => {
    const savedModules = localStorage.getItem("aquire_modules");
    const savedLessons = localStorage.getItem("aquire_lessons");
    const savedPaths = localStorage.getItem("aquire_learning_paths");
    const savedLevels = localStorage.getItem("aquire_levels");
    const savedOrg = localStorage.getItem("aquire_organization");

    if (savedModules) setModules(JSON.parse(savedModules));
    if (savedLessons) setLessons(JSON.parse(savedLessons));
    if (savedPaths) setLearningPaths(JSON.parse(savedPaths));
    if (savedLevels) setLevels(JSON.parse(savedLevels));
    if (savedOrg) setOrganization(JSON.parse(savedOrg));
  }, []);

  const studentLevel = useMemo(() => 
    levels.find(l => l.id === student.level_id), 
  [levels, student.level_id]);

  // Filter content based on student's level
  const filteredModules = useMemo(() => 
    modules.filter(m => (m.levelIds || []).includes(student.level_id)),
  [modules, student.level_id]);

  const filteredLessons = useMemo(() => 
    lessons.filter(l => l.levelId === student.level_id),
  [lessons, student.level_id]);

  const filteredPaths = useMemo(() => 
    learningPaths.filter(p => (p.levelIds || []).includes(student.level_id)),
  [learningPaths, student.level_id]);

  const renderOverview = () => (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-aquire-black rounded-[40px] p-10 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-aquire-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden">
            {student.profile_pic ? (
              <img src={student.profile_pic} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-white/40" />
            )}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-aquire-primary text-white text-[10px] font-black uppercase tracking-widest">
                {studentLevel?.name || "Level"}
              </span>
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <Star size={14} fill="currentColor" />
                1,240 Points
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-2">Welcome back, {student.name.split(' ')[0]}! 👋</h2>
            <p className="text-white/60 max-w-lg">
              You're doing great! You've completed 85% of your weekly goals. Keep it up and earn your next badge.
            </p>
          </div>
          <div className="md:ml-auto flex gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center min-w-[120px]">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Streak</p>
              <p className="text-2xl font-bold flex items-center justify-center gap-2">
                <Sparkles className="text-amber-400" size={20} />
                12 Days
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center min-w-[120px]">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Rank</p>
              <p className="text-2xl font-bold">#4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Learning Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-aquire-black">Continue Learning</h3>
            <button className="text-aquire-primary font-bold text-sm hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLessons.slice(0, 2).map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card group overflow-hidden hover:border-aquire-primary/30 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedLesson(lesson);
                  setIsPreviewOpen(true);
                }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={lesson.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={48} className="text-white" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                      <div className="h-full bg-aquire-primary" style={{ width: i === 0 ? '65%' : '30%' }} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-black text-aquire-primary uppercase tracking-widest mb-1">
                    {modules.find(m => m.id === lesson.moduleId)?.name}
                  </p>
                  <h4 className="text-lg font-bold text-aquire-black mb-4 group-hover:text-aquire-primary transition-colors">{lesson.name}</h4>
                  <div className="flex items-center justify-between text-xs text-aquire-grey-med">
                    <span className="flex items-center gap-1"><Clock size={14} /> 45 mins</span>
                    <span className="font-bold text-aquire-black">{i === 0 ? '65%' : '30%'} Complete</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="card p-8 bg-emerald-50 border-emerald-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Trophy size={32} />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-emerald-900 mb-1">Next Achievement: "Quick Thinker"</h4>
                <p className="text-emerald-700/70 text-sm">Complete 5 more assessments with a score above 90% to earn this badge.</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-600">3/5</p>
                <p className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-widest">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="space-y-8">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-aquire-black mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-aquire-primary" />
              Upcoming Tasks
            </h3>
            <div className="space-y-4">
              {[
                { title: "Math Quiz: Geometry", date: "Tomorrow", type: "Quiz", color: "bg-amber-500" },
                { title: "English Essay Draft", date: "Friday", type: "Assignment", color: "bg-blue-500" },
                { title: "Science Project", date: "Next Mon", type: "Project", color: "bg-purple-500" },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-aquire-grey-light transition-colors cursor-pointer group">
                  <div className={`w-2 h-10 rounded-full ${task.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-aquire-black group-hover:text-aquire-primary transition-colors">{task.title}</p>
                    <p className="text-[10px] text-aquire-grey-med font-bold uppercase tracking-widest">{task.type} • {task.date}</p>
                  </div>
                  <ChevronRight size={16} className="text-aquire-grey-med opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-aquire-black text-white relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-aquire-primary/20 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold mb-4 relative z-10">Learning Path</h3>
            <div className="space-y-6 relative z-10">
              {filteredPaths.slice(0, 1).map(path => (
                <div key={path.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{path.name}</p>
                    <span className="text-xs text-aquire-primary font-bold">Level 3</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <div 
                        key={star} 
                        className={`flex-1 h-2 rounded-full ${star <= 3 ? 'bg-aquire-primary' : 'bg-white/10'}`} 
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPath(path);
                      setIsPathPreviewOpen(true);
                    }}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Continue Journey <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyLearning = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-aquire-black">My Learning</h2>
          <p className="text-aquire-grey-med">Explore all modules and lessons for {studentLevel?.name}.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons..." 
              className="pl-10 pr-4 py-3 bg-white border border-aquire-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-aquire-primary/20 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLessons.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())).map((lesson, i) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card group overflow-hidden hover:border-aquire-primary/30 transition-all cursor-pointer flex flex-col"
            onClick={() => {
              setSelectedLesson(lesson);
              setIsPreviewOpen(true);
            }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={lesson.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={48} className="text-white" />
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-aquire-black text-[10px] font-black uppercase tracking-widest">
                  {modules.find(m => m.id === lesson.moduleId)?.name}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-lg font-bold text-aquire-black mb-2 group-hover:text-aquire-primary transition-colors">{lesson.name}</h4>
              <p className="text-aquire-grey-med text-xs line-clamp-2 mb-6 flex-1" dangerouslySetInnerHTML={{ __html: lesson.description }}></p>
              <div className="flex items-center justify-between pt-4 border-t border-aquire-border">
                <div className="flex items-center gap-2 text-aquire-grey-med text-[10px] font-bold uppercase tracking-widest">
                  <Layers size={14} className="text-aquire-primary" />
                  {lesson.chapters?.length || 0} Chapters
                </div>
                <div className="w-8 h-8 rounded-full bg-aquire-grey-light flex items-center justify-center text-aquire-grey-med group-hover:bg-aquire-primary group-hover:text-white transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderLearningPaths = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-aquire-black">Learning Journeys</h2>
        <p className="text-aquire-grey-med">Embark on gamified paths to master your subjects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPaths.map((path, i) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8 group hover:border-aquire-primary/30 transition-all cursor-pointer relative overflow-hidden"
            onClick={() => {
              setSelectedPath(path);
              setIsPathPreviewOpen(true);
            }}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-aquire-primary/5 rounded-full blur-3xl group-hover:bg-aquire-primary/10 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-aquire-primary/10 flex items-center justify-center text-aquire-primary">
                  <Trophy size={32} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-aquire-black">{path.stars} Stars</p>
                  <p className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Total Journey</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-aquire-black mb-2 group-hover:text-aquire-primary transition-colors">{path.name}</h3>
              <p className="text-aquire-grey-med text-sm mb-8 line-clamp-2">{path.description}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-aquire-grey-med">Current Progress</span>
                  <span className="text-aquire-primary">60%</span>
                </div>
                <div className="h-3 w-full bg-aquire-grey-light rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    className="h-full bg-aquire-primary rounded-full shadow-lg shadow-aquire-primary/20"
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-aquire-grey-light flex items-center justify-center text-[10px] font-bold text-aquire-grey-med">
                        {i}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-aquire-primary flex items-center justify-center text-white">
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-aquire-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                    Continue Journey <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-aquire-grey-light/30">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="bg-red-600 text-white py-2 px-6 text-center text-xs font-black uppercase tracking-[0.2em] sticky top-0 z-[100] shadow-lg">
          Impersonating Student: {student.name} ({student.email})
        </div>
      )}

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-aquire-grey-med text-[10px] font-black uppercase tracking-widest mb-1">
              <GraduationCap size={14} className="text-aquire-primary" />
              <span>{organization?.name || "Aquire Academy"}</span>
              <ChevronRight size={12} />
              <span className="text-aquire-primary">{studentLevel?.name}</span>
            </div>
            <h1 className="text-4xl font-bold text-aquire-black tracking-tight">
              {activeTab === "dashboard" ? "Dashboard" : 
               activeTab === "my-learning" ? "My Learning" : 
               activeTab === "learning-paths" ? "Learning Journeys" : 
               activeTab === "assignments" ? "Assignments" : "My Profile"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-aquire-black">{student.name}</p>
              <p className="text-[10px] text-aquire-grey-med font-bold uppercase tracking-widest">{studentLevel?.name}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-aquire-border flex items-center justify-center overflow-hidden">
              {student.profile_pic ? (
                <img src={student.profile_pic} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="text-aquire-grey-med" />
              )}
            </div>
          </div>
        </header>

        <main>
          {activeTab === "dashboard" && renderOverview()}
          {activeTab === "my-learning" && renderMyLearning()}
          {activeTab === "learning-paths" && renderLearningPaths()}
          {activeTab === "assignments" && (
            <div className="flex flex-col items-center justify-center py-20 text-center card">
              <ClipboardList size={64} className="text-aquire-primary/20 mb-6" />
              <h3 className="text-2xl font-bold text-aquire-black mb-2">No Assignments Yet</h3>
              <p className="text-aquire-grey-med max-w-sm">Your teachers haven't assigned any tasks to your level yet. Check back soon!</p>
            </div>
          )}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto card p-10">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-32 h-32 rounded-[40px] bg-aquire-grey-light border-4 border-white shadow-xl mb-6 overflow-hidden">
                  {student.profile_pic ? (
                    <img src={student.profile_pic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-aquire-grey-med mt-8 mx-auto" />
                  )}
                </div>
                <h3 className="text-3xl font-bold text-aquire-black">{student.name}</h3>
                <p className="text-aquire-primary font-bold uppercase tracking-widest text-xs mt-1">{studentLevel?.name}</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest">Full Name</p>
                    <p className="font-bold text-aquire-black">{student.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-aquire-black">{student.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest">Joined Date</p>
                    <p className="font-bold text-aquire-black">{new Date(student.joined).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-aquire-grey-med uppercase tracking-widest">Account Status</p>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-md uppercase tracking-widest">Active</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-aquire-border">
                  <button className="w-full py-4 bg-aquire-grey-light text-aquire-grey-dark rounded-2xl font-bold hover:bg-aquire-border transition-all flex items-center justify-center gap-2">
                    <Edit size={18} />
                    Edit Profile Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Previews */}
      {isPreviewOpen && selectedLesson && (
        <StudentPreview 
          lesson={selectedLesson}
          initialChapterIndex={0}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {isPathPreviewOpen && selectedPath && (
        <LearningPathZigZagPreview 
          path={selectedPath}
          lessons={lessons}
          onClose={() => setIsPathPreviewOpen(false)}
        />
      )}
    </div>
  );
}

function Edit({ size }: { size: number }) {
  return <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />;
}
