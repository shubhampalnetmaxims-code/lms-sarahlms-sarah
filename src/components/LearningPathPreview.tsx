import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  PlayCircle, 
  CheckCircle2, 
  ArrowLeft,
  LayoutGrid,
  Eye,
  EyeOff
} from "lucide-react";
import { LearningPath, Lesson, Chapter } from "../types";
import StudentPreview from "./StudentPreview";

interface LearningPathPreviewProps {
  path: LearningPath;
  lessons: Lesson[];
  onClose: () => void;
}

export default function LearningPathPreview({ path, lessons, onClose }: LearningPathPreviewProps) {
  const [currentStarIndex, setCurrentStarIndex] = useState(0);
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [completedStars, setCompletedStars] = useState<number[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const currentLessonId = path.starLessons[currentStarIndex];
  const currentLesson = lessons.find(l => l.id === currentLessonId);

  const handleStartLesson = () => {
    setIsLessonActive(true);
  };

  const handleLessonComplete = () => {
    if (!completedStars.includes(currentStarIndex)) {
      setCompletedStars([...completedStars, currentStarIndex]);
    }
    setIsLessonActive(false);
    if (currentStarIndex < path.stars - 1) {
      setCurrentStarIndex(currentStarIndex + 1);
    }
  };

  if (isLessonActive && currentLesson) {
    return (
      <StudentPreview 
        lesson={currentLesson}
        onClose={() => setIsLessonActive(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-aquire-grey-light overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-aquire-border px-8 py-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="p-3 hover:bg-aquire-grey-light rounded-2xl transition-all text-aquire-grey-med hover:text-aquire-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-aquire-black">{path.name}</h1>
            <p className="text-sm text-aquire-grey-med">Sequential Student Journey Preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              showAnswers 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-white border border-aquire-border text-aquire-grey-med hover:bg-aquire-grey-light"
            }`}
          >
            {showAnswers ? <Eye size={18} /> : <EyeOff size={18} />}
            {showAnswers ? "Answers Visible" : "Show Answers"}
          </button>
          <div className="h-10 w-px bg-aquire-border mx-2" />
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-aquire-black text-white rounded-xl font-bold text-sm hover:bg-aquire-black/90 transition-all shadow-lg"
          >
            Exit Preview
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-16 bg-white p-8 rounded-[32px] border border-aquire-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-aquire-grey-dark uppercase tracking-widest">Path Progress</span>
            <span className="text-aquire-primary font-bold">{Math.round((completedStars.length / path.stars) * 100)}% Complete</span>
          </div>
          <div className="h-4 bg-aquire-grey-light rounded-full overflow-hidden border border-aquire-border/50 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedStars.length / path.stars) * 100}%` }}
              className="h-full bg-aquire-primary rounded-full shadow-sm"
            />
          </div>
        </div>

        {/* Star Path */}
        <div className="space-y-12 relative">
          {/* Vertical Line */}
          <div className="absolute left-[31px] top-0 bottom-0 w-1 bg-aquire-border/50 rounded-full -z-10" />

          {path.starLessons.map((lessonId, index) => {
            const lesson = lessons.find(l => l.id === lessonId);
            const isCompleted = completedStars.includes(index);
            const isActive = currentStarIndex === index;
            const isLocked = false; // For Admin, all stars are open

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-8 items-start transition-all ${isLocked ? "opacity-50 grayscale" : ""}`}
              >
                {/* Star Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-500 ${
                  isCompleted 
                    ? "bg-emerald-500 border-emerald-100 text-white shadow-lg shadow-emerald-500/20" 
                    : isActive 
                      ? "bg-amber-500 border-amber-100 text-white shadow-lg shadow-amber-500/20 animate-pulse" 
                      : "bg-white border-aquire-border text-aquire-grey-med hover:border-aquire-primary hover:text-aquire-primary cursor-pointer"
                }`}
                onClick={() => !isCompleted && setCurrentStarIndex(index)}
                >
                  {isCompleted ? <CheckCircle2 size={28} /> : <Star size={28} fill={isActive ? "currentColor" : "none"} />}
                </div>

                {/* Lesson Card */}
                <div className={`flex-1 bg-white p-8 rounded-[32px] border transition-all duration-500 ${
                  isActive 
                    ? "border-aquire-primary shadow-xl shadow-aquire-primary/10 ring-1 ring-aquire-primary/20" 
                    : "border-aquire-border shadow-sm hover:border-aquire-primary/30"
                }`}
                onClick={() => !isCompleted && setCurrentStarIndex(index)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-aquire-primary uppercase tracking-widest">Star {index + 1}</span>
                        {isCompleted && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Completed</span>}
                      </div>
                      <h3 className="text-2xl font-bold text-aquire-black">{lesson?.name || "Unknown Lesson"}</h3>
                      <p className="text-aquire-grey-med line-clamp-2" dangerouslySetInnerHTML={{ __html: lesson?.description || "" }}></p>
                    </div>

                    <div className="shrink-0">
                      {isCompleted ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentStarIndex(index);
                            setIsLessonActive(true);
                          }}
                          className="px-8 py-4 bg-aquire-grey-light text-aquire-grey-dark font-bold rounded-2xl hover:bg-aquire-border transition-all flex items-center gap-2"
                        >
                          <PlayCircle size={20} />
                          Review Lesson
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentStarIndex(index);
                            setIsLessonActive(true);
                          }}
                          className={`px-8 py-4 font-bold rounded-2xl transition-all flex items-center gap-2 shadow-lg ${
                            isActive 
                              ? "bg-aquire-primary text-white hover:bg-aquire-primary/90 shadow-aquire-primary/20" 
                              : "bg-white border border-aquire-border text-aquire-grey-med hover:bg-aquire-grey-light shadow-sm"
                          }`}
                        >
                          <PlayCircle size={20} />
                          Start Lesson
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lesson Stats/Preview */}
                  <div className="mt-8 pt-8 border-t border-aquire-border flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-aquire-grey-med text-sm">
                      <LayoutGrid size={16} className="text-aquire-primary/50" />
                      <span className="font-medium">{lesson?.chapters.length || 0} Chapters</span>
                    </div>
                    <div className="flex items-center gap-2 text-aquire-grey-med text-sm">
                      <PlayCircle size={16} className="text-aquire-primary/50" />
                      <span className="font-medium">Video Lecture Included</span>
                    </div>
                    <div className="flex items-center gap-2 text-aquire-grey-med text-sm">
                      <CheckCircle2 size={16} className="text-aquire-primary/50" />
                      <span className="font-medium">7 Question Types</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedStars.length === path.stars && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-20 p-12 bg-emerald-500 rounded-[40px] text-center text-white shadow-2xl shadow-emerald-500/30"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Path Completed!</h2>
            <p className="text-emerald-50/80 text-lg mb-8 max-w-xl mx-auto">
              Congratulations! You've successfully navigated through the entire <strong>{path.name}</strong>. 
              You've earned all {path.stars} stars and mastered the curriculum.
            </p>
            <button 
              onClick={onClose}
              className="px-10 py-5 bg-white text-emerald-600 font-bold rounded-[20px] hover:bg-emerald-50 transition-all shadow-xl"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function Trophy({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
