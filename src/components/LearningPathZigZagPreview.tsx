import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Star, 
  PlayCircle, 
  CheckCircle2, 
  ArrowLeft,
  Trophy,
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { LearningPath, Lesson, PathStarData } from "../types";
import StudentPreview from "./StudentPreview";

interface LearningPathZigZagPreviewProps {
  path: LearningPath;
  lessons: Lesson[];
  onClose: () => void;
}

export default function LearningPathZigZagPreview({ path, lessons, onClose }: LearningPathZigZagPreviewProps) {
  const [activeStar, setActiveStar] = useState<number | null>(null);
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedStars, setCompletedStars] = useState<number[]>([]);
  
  // For demo purposes, let's assume the first star is the current one
  const currentStar = completedStars.length + 1;

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsLessonActive(true);
  };

  const handleLessonComplete = () => {
    if (selectedLesson && !selectedLesson.isSkillLesson) {
      const starNum = selectedLesson.starNumber || (activeStar !== null ? activeStar + 1 : 1);
      if (!completedStars.includes(starNum)) {
        setCompletedStars([...completedStars, starNum]);
      }
    }
    setIsLessonActive(false);
    setSelectedLesson(null);
  };

  if (isLessonActive && selectedLesson) {
    return (
      <StudentPreview 
        lesson={selectedLesson}
        onClose={handleLessonComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-[#0F172A] overflow-y-auto custom-scrollbar">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1E293B_0%,#0F172A_100%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/60 hover:text-aquire-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{path.name}</h1>
            <p className="text-sm text-white/40 font-medium">Skill-Based Zig-Zag Journey</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all border border-white/10"
        >
          Exit Journey
        </button>
      </header>

      <main className="relative max-w-4xl mx-auto px-8 py-20 min-h-screen">
        {/* Progress Tracker */}
        <div className="mb-20 bg-white/5 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-aquire-primary" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-amber-400" size={20} />
              <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Your Progress</span>
            </div>
            <span className="text-aquire-primary font-black text-xl">{Math.round((completedStars.length / path.stars) * 100)}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedStars.length / path.stars) * 100}%` }}
              className="h-full bg-gradient-to-r from-aquire-primary to-blue-400 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            />
          </div>
        </div>

        {/* Path Container */}
        <div className="relative space-y-32">
          {/* SVG Path Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: path.stars * 200 }}>
            <path 
              d={generatePathD(path.stars)} 
              fill="none" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="12" 
              strokeLinecap="round"
              strokeDasharray="20 20"
            />
            <motion.path 
              d={generatePathD(path.stars)} 
              fill="none" 
              stroke="url(#pathGradient)" 
              strokeWidth="12" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: completedStars.length / path.stars }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>

          {Array.from({ length: path.stars }).map((_, index) => {
            const starNum = index + 1;
            const isCompleted = completedStars.includes(starNum);
            const isCurrent = currentStar === starNum;
            const isLocked = starNum > currentStar;
            const isRight = index % 2 === 0;
            
            const starData = path.starsData?.find(s => s.star === starNum);
            const mainLesson = lessons.find(l => l.id === (starData?.mainLessonId || path.starLessons[index]));
            const skillLessons = lessons.filter(l => 
              (starData?.skillLessonIds.includes(l.id)) || 
              (l.isSkillLesson && l.learningPathId === path.id && l.starNumber === starNum)
            );

            return (
              <div 
                key={index} 
                className={`flex w-full ${isRight ? 'justify-end' : 'justify-start'} relative z-10`}
              >
                <div className="relative group">
                  {/* Floating Skill Orbs */}
                  <div className="absolute inset-0 pointer-events-none">
                    {skillLessons.map((skill, sIdx) => {
                      const angle = (sIdx * 2 * Math.PI) / skillLessons.length;
                      const radius = 85; // Increased radius to move them away
                      
                      return (
                        <motion.div
                          key={skill.id}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{ 
                            scale: 1,
                            x: [
                              Math.cos(angle) * radius,
                              Math.cos(angle) * (radius + 5),
                              Math.cos(angle) * radius
                            ],
                            y: [
                              Math.sin(angle) * radius,
                              Math.sin(angle) * (radius - 8),
                              Math.sin(angle) * radius
                            ],
                          }}
                          transition={{
                            scale: { duration: 0.5, delay: sIdx * 0.1 },
                            x: { duration: 3 + sIdx, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 4 + sIdx, repeat: Infinity, ease: "easeInOut" }
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-125 transition-transform z-20 group/orb border-2 border-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartLesson(skill);
                          }}
                        >
                          <Sparkles size={16} className="text-white" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-white text-aquire-black text-[10px] font-black rounded-xl opacity-0 group-hover/orb:opacity-100 transition-opacity whitespace-nowrap shadow-2xl border border-aquire-border">
                            {skill.name}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Main Star */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isLocked && setActiveStar(activeStar === index ? null : index)}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                      isCompleted 
                        ? "bg-[#F59E0B] border-amber-200/50 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)]" 
                        : isCurrent 
                          ? "bg-[#2563EB] border-blue-200/50 text-white shadow-[0_0_40px_rgba(37,99,235,0.6)] ring-4 ring-blue-500/20" 
                          : "bg-[#1E293B] border-white/10 text-white/20"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={40} />
                    ) : (
                      <Star size={40} fill={isCurrent ? "currentColor" : "none"} />
                    )}
                    
                    {isCurrent && (
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 bg-aquire-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        You are here
                      </div>
                    )}

                    {(isCurrent || activeStar === index) && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-white text-aquire-black text-xs font-bold rounded-xl shadow-xl border border-aquire-border animate-bounce">
                        {mainLesson?.name}
                      </div>
                    )}

                    {skillLessons.length > 0 && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#0F172A] shadow-lg">
                        {skillLessons.length}
                      </div>
                    )}
                  </motion.button>

                  {/* Expanded Info Card */}
                  <AnimatePresence>
                    {activeStar === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`absolute top-0 ${isRight ? 'right-full mr-12' : 'left-full ml-12'} w-80 bg-white rounded-[32px] p-8 shadow-2xl z-50 border border-aquire-border`}
                      >
                        <div className="space-y-6">
                          <div>
                            <span className="text-[10px] font-black text-aquire-primary uppercase tracking-widest">Star {starNum}</span>
                            <h3 className="text-xl font-bold text-aquire-black mt-1">{mainLesson?.name || "Main Lesson"}</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <button 
                              onClick={() => mainLesson && handleStartLesson(mainLesson)}
                              className="w-full py-4 bg-aquire-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-aquire-primary/20 transition-all"
                            >
                              <PlayCircle size={20} />
                              Start Main Lesson
                            </button>

                            {skillLessons.length > 0 && (
                              <div className="pt-4 border-t border-aquire-border">
                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Skill Lessons</h4>
                                <div className="space-y-2">
                                  {skillLessons.map(skill => (
                                    <button
                                      key={skill.id}
                                      onClick={() => handleStartLesson(skill)}
                                      className="w-full p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-emerald-100 transition-all"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Sparkles size={14} />
                                        {skill.name}
                                      </div>
                                      <ChevronRight size={14} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedStars.length === path.stars && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-32 p-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[40px] text-center text-white shadow-2xl shadow-amber-500/30 border border-white/20"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <Trophy size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight">Mastery Achieved!</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto font-medium">
              You've conquered the <strong>{path.name}</strong> and collected all {path.stars} stars. 
              Your skills are now legendary!
            </p>
            <button 
              onClick={onClose}
              className="px-10 py-5 bg-white text-amber-600 font-black rounded-[20px] hover:bg-amber-50 transition-all shadow-xl uppercase tracking-widest text-sm"
            >
              Return to Dashboard
            </button>
          </motion.div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0F172A;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1E293B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563EB;
        }
      `}} />
    </div>
  );
}

function generatePathD(stars: number) {
  let d = "M 400 0 "; // Start center
  for (let i = 0; i < stars; i++) {
    const y = (i + 1) * 200;
    const x = i % 2 === 0 ? 600 : 200; // Alternate left/right
    const prevX = i % 2 === 0 ? 200 : 600;
    const prevY = i * 200;
    
    if (i === 0) {
      d += `C 400 100, ${x} 100, ${x} ${y} `;
    } else {
      d += `C ${prevX} ${prevY + 100}, ${x} ${y - 100}, ${x} ${y} `;
    }
  }
  return d;
}
