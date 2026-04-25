import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  BookOpen, 
  Star,
  CheckCircle2,
  GraduationCap,
  Plus,
  Search,
  ArrowRight,
  ArrowLeft,
  Users,
  User,
  Check
} from "lucide-react";
import { Module, Lesson, LearningPath, Level, Student } from "../types";

interface SkillLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignments: { 
    lessonId: string; 
    data: { 
      isSkillLesson: boolean; 
      learningPathId: string; 
      starNumber: number;
      assignedStudentIds?: string[];
    } 
  }[]) => void;
  modules: Module[];
  lessons: Lesson[];
  learningPaths: LearningPath[];
  levels: Level[];
  students: Student[];
}

export default function SkillLessonModal({ 
  isOpen, 
  onClose, 
  onSave, 
  modules, 
  lessons, 
  learningPaths,
  levels,
  students
}: SkillLessonModalProps) {
  const [step, setStep] = useState(1);
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [selectedPathId, setSelectedPathId] = useState("");
  const [starsEarned, setStarsEarned] = useState(1);
  const [lessonSearchQuery, setLessonSearchQuery] = useState("");
  const [studentAssignments, setStudentAssignments] = useState<Record<string, string[]>>({});
  const [lessonStarRewards, setLessonStarRewards] = useState<Record<string, number>>({});
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      
      // If we are editing specific lessons, pre-select them and their level
      if (lessons.length === 1 && lessons[0].isSkillLesson) {
        const lesson = lessons[0];
        setSelectedLevelId(lesson.levelId || "");
        setSelectedLessonIds([lesson.id]);
        setSelectedPathId(lesson.learningPathId || "");
        setStarsEarned(lesson.starNumber || 1);
        
        const rewards: Record<string, number> = {};
        const assignments: Record<string, string[]> = {};
        
        rewards[lesson.id] = lesson.rewardStars || 1;
        assignments[lesson.id] = lesson.assignedStudentIds || [];
        
        setLessonStarRewards(rewards);
        setStudentAssignments(assignments);
        
        // Skip step 1 if only one lesson is pre-selected and valid
        if (lesson.levelId) {
          setStep(2);
        }
      } else {
        setSelectedLevelId("");
        setSelectedLessonIds([]);
        setSelectedPathId("");
        setStarsEarned(1);
        setLessonSearchQuery("");
        setStudentAssignments({});
        setLessonStarRewards({});
      }
      
      setStudentSearchQuery("");
    }
  }, [isOpen, lessons]);

  const handleLessonToggle = (lessonId: string) => {
    setSelectedLessonIds(prev => {
      const isSelected = prev.includes(lessonId);
      if (!isSelected) {
        setLessonStarRewards(r => ({ ...r, [lessonId]: 1 }));
      }
      return isSelected 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId];
    });
  };

  const handleStarRewardChange = (lessonId: string, value: number) => {
    setLessonStarRewards(prev => ({ ...prev, [lessonId]: value }));
  };

  const handleStudentToggle = (lessonId: string, studentId: string) => {
    setStudentAssignments(prev => {
      const current = prev[lessonId] || [];
      const updated = current.includes(studentId)
        ? current.filter(id => id !== studentId)
        : [...current, studentId];
      return { ...prev, [lessonId]: updated };
    });
  };

  const handleSave = () => {
    if (selectedLessonIds.length > 0) {
      const assignments = selectedLessonIds.map(lessonId => ({
        lessonId,
        data: {
          isSkillLesson: true,
          learningPathId: selectedPathId,
          starNumber: starsEarned,
          rewardStars: lessonStarRewards[lessonId] || 1,
          assignedStudentIds: studentAssignments[lessonId] || []
        }
      }));
      onSave(assignments);
      onClose();
    }
  };

  // Filter lessons based on selected level
  const filteredLessons = lessons.filter(l => 
    (!selectedLevelId || l.levelId === selectedLevelId) &&
    (l.name.toLowerCase().includes(lessonSearchQuery.toLowerCase()))
  );

  // Filter students based on selected level
  const filteredStudents = students.filter(s => 
    s.level_id === selectedLevelId && 
    (s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
     s.email.toLowerCase().includes(studentSearchQuery.toLowerCase()))
  );

  const activeLevel = levels.find(l => l.id === selectedLevelId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-aquire-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20 my-auto flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-aquire-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-aquire-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-aquire-primary/20">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-aquire-black">Skill Boost Journey</h3>
                  <p className="text-sm text-aquire-grey-med">Step {step} of 2: {step === 1 ? "Select Level & Lessons" : "Assign to Students"}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-aquire-grey-light rounded-2xl transition-all text-aquire-grey-med"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              {step === 1 ? (
                <div className="space-y-10">
                  {/* Step 1 Content */}
                  
                  {/* Level Selection - Horizontal Form */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-aquire-black mb-1">
                      <GraduationCap size={20} className="text-aquire-primary" />
                      <span className="font-bold">Choose a Level</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {levels.filter(l => l.status === 'active').map(level => {
                        const isSelected = selectedLevelId === level.id;
                        return (
                          <button
                            key={level.id}
                            onClick={() => {
                              setSelectedLevelId(level.id);
                              setSelectedLessonIds([]);
                              setSelectedPathId("");
                            }}
                            className={`px-8 py-4 rounded-2xl font-bold transition-all border-2 text-sm ${
                              isSelected 
                                ? "bg-aquire-primary border-aquire-primary text-white shadow-xl shadow-aquire-primary/20" 
                                : "bg-aquire-grey-light border-transparent text-aquire-grey-med hover:border-aquire-border hover:text-aquire-black"
                            }`}
                          >
                            {level.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedLevelId && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Lesson Selection */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-aquire-black">
                            <BookOpen size={20} className="text-aquire-primary" />
                            <span className="font-bold">Select Lessons to Boost</span>
                          </div>
                          <div className="relative w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                            <input 
                              type="text"
                              value={lessonSearchQuery}
                              onChange={(e) => setLessonSearchQuery(e.target.value)}
                              placeholder="Search lessons..."
                              className="w-full pl-10 pr-4 py-2 bg-aquire-grey-light rounded-xl text-sm border border-transparent focus:border-aquire-primary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredLessons.length > 0 ? (
                            filteredLessons.map(lesson => {
                              const module = modules.find(m => m.id === lesson.moduleId);
                              const isSelected = selectedLessonIds.includes(lesson.id);
                              return (
                                <div 
                                  key={lesson.id}
                                  onClick={() => handleLessonToggle(lesson.id)}
                                  className={`relative p-5 pt-8 rounded-[24px] border-2 transition-all cursor-pointer group ${
                                    isSelected 
                                      ? "bg-blue-50 border-aquire-primary shadow-lg" 
                                      : "bg-white border-aquire-border hover:border-aquire-primary/30"
                                  }`}
                                >
                                  <div className={`absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                    isSelected 
                                      ? "bg-aquire-primary text-white" 
                                      : "bg-aquire-grey-light text-aquire-grey-med group-hover:bg-aquire-primary group-hover:text-white"
                                  }`}>
                                    {isSelected ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 bg-aquire-primary/10 text-aquire-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                                        {module?.name || "No Module"}
                                      </span>
                                    </div>
                                    <h4 className="font-bold text-aquire-black truncate pr-8">{lesson.name}</h4>
                                    <p className="text-xs text-aquire-grey-med line-clamp-2 mt-1">{lesson.description}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-span-full py-12 text-center bg-aquire-grey-light rounded-[32px] border-2 border-dashed border-aquire-border">
                              <BookOpen size={48} className="mx-auto text-aquire-grey-med mb-4 opacity-20" />
                              <p className="text-aquire-grey-med font-medium">No lessons found for this level</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-aquire-black">
                      <Users size={20} className="text-aquire-primary" />
                      <span className="font-bold">Assign Selected Lessons to Students</span>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={16} />
                      <input 
                        type="text"
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 bg-aquire-grey-light rounded-xl text-sm border border-transparent focus:border-aquire-primary focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedLessonIds.map(lessonId => {
                      const lesson = lessons.find(l => l.id === lessonId);
                      const assignedIds = studentAssignments[lessonId] || [];
                      
                      return (
                        <div key={lessonId} className="bg-aquire-grey-light/50 border border-aquire-border rounded-[32px] overflow-hidden">
                          <div className="px-6 py-4 bg-white border-b border-aquire-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-aquire-primary/10 flex items-center justify-center text-aquire-primary">
                                <BookOpen size={16} />
                              </div>
                              <span className="font-bold text-aquire-black">{lesson?.name}</span>
                              <span className="text-xs text-aquire-grey-med bg-aquire-grey-light px-2 py-0.5 rounded-md font-bold">
                                {assignedIds.length} Assigned
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                              <Star size={14} className="text-amber-500" fill="currentColor" />
                              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Reward Stars:</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleStarRewardChange(lessonId, Math.max(1, (lessonStarRewards[lessonId] || 1) - 1))}
                                  className="w-6 h-6 rounded-md bg-white border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-100"
                                >
                                  -
                                </button>
                                <span className="font-black text-amber-600 w-4 text-center">{lessonStarRewards[lessonId] || 1}</span>
                                <button 
                                  onClick={() => handleStarRewardChange(lessonId, Math.min(5, (lessonStarRewards[lessonId] || 1) + 1))}
                                  className="w-6 h-6 rounded-md bg-white border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {filteredStudents.map(student => {
                                const isAssigned = assignedIds.includes(student.id);
                                return (
                                  <button
                                    key={student.id}
                                    onClick={() => handleStudentToggle(lessonId, student.id)}
                                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                                      isAssigned 
                                        ? "bg-white border-aquire-primary shadow-sm" 
                                        : "bg-white/50 border-transparent hover:border-aquire-border"
                                    }`}
                                  >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                      isAssigned ? "bg-aquire-primary text-white" : "bg-aquire-grey-light text-aquire-grey-med"
                                    }`}>
                                      {student.profile_pic ? (
                                        <img src={student.profile_pic} className="w-full h-full rounded-full object-cover" />
                                      ) : student.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs font-bold truncate ${isAssigned ? "text-aquire-primary" : "text-aquire-black"}`}>
                                        {student.name}
                                      </p>
                                    </div>
                                    {isAssigned && <Check size={14} className="text-aquire-primary" strokeWidth={3} />}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {filteredStudents.length === 0 && (
                              <div className="text-center py-6 text-aquire-grey-med text-xs">
                                No students found for {activeLevel?.name}
                              </div>
                            )}

                            {assignedIds.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-aquire-border pt-4">
                                {assignedIds.map(id => {
                                  const s = students.find(st => st.id === id);
                                  return (
                                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-aquire-primary/10 text-aquire-primary text-[10px] font-black rounded-lg">
                                      {s?.name}
                                      <button onClick={() => handleStudentToggle(lessonId, id)}>
                                        <X size={12} className="hover:text-red-500 transition-colors" />
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-aquire-grey-light/30 border-t border-aquire-border flex items-center justify-between">
              <div className="flex gap-3">
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 font-bold text-aquire-grey-med hover:text-aquire-black flex items-center gap-2 transition-all"
                  >
                    <ArrowLeft size={20} /> Back
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-4 font-bold text-aquire-grey-med hover:text-aquire-black transition-all"
                >
                  Cancel
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                {step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    disabled={selectedLessonIds.length === 0 || !selectedLevelId}
                    className="px-10 py-4 bg-aquire-primary text-white rounded-[20px] font-bold shadow-xl shadow-aquire-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-10 py-4 bg-aquire-primary text-white rounded-[20px] font-bold shadow-xl shadow-aquire-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 size={20} /> Confirm Assignments
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
