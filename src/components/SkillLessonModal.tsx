import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Layers, 
  BookOpen, 
  Trophy, 
  Star,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import { Module, Lesson, LearningPath, Grade } from "../types";

interface SkillLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonId: string, data: { isSkillLesson: boolean; learningPathId: string; starNumber: number }) => void;
  modules: Module[];
  lessons: Lesson[];
  learningPaths: LearningPath[];
  grades: Grade[];
}

export default function SkillLessonModal({ 
  isOpen, 
  onClose, 
  onSave, 
  modules, 
  lessons, 
  learningPaths,
  grades
}: SkillLessonModalProps) {
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedPathId, setSelectedPathId] = useState("");
  const [starsEarned, setStarsEarned] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setSelectedGradeId("");
      setSelectedModuleId("");
      setSelectedLessonId("");
      setSelectedPathId("");
      setStarsEarned(1);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (selectedLessonId && selectedPathId) {
      onSave(selectedLessonId, {
        isSkillLesson: true,
        learningPathId: selectedPathId,
        starNumber: starsEarned
      });
      onClose();
    }
  };

  // Filter modules based on selected grade
  const filteredModules = modules.filter(m => 
    !selectedGradeId || (m.gradeIds && m.gradeIds.includes(selectedGradeId))
  );

  // Filter lessons based on selected module AND grade
  const filteredLessons = lessons.filter(l => 
    l.moduleId === selectedModuleId && (!selectedGradeId || l.gradeId === selectedGradeId)
  );

  // Filter paths based on selected grade
  const filteredPaths = learningPaths.filter(p => 
    !selectedGradeId || (p.gradeIds && p.gradeIds.includes(selectedGradeId))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-aquire-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20 my-auto"
          >
            {/* Header */}
            <div className="px-10 py-8 flex items-center justify-between border-b border-aquire-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-aquire-primary/10 rounded-xl flex items-center justify-center text-aquire-primary">
                  <Star size={20} fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-aquire-black">Add Skill Lesson</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-aquire-grey-light rounded-xl transition-all text-aquire-grey-med"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Grade Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1 flex items-center gap-2">
                  <GraduationCap size={14} /> Select Grade
                </label>
                <select 
                  value={selectedGradeId}
                  onChange={(e) => {
                    setSelectedGradeId(e.target.value);
                    setSelectedModuleId("");
                    setSelectedLessonId("");
                    setSelectedPathId("");
                  }}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-aquire-border focus:border-aquire-primary outline-none transition-all bg-white font-medium text-aquire-black"
                >
                  <option value="">Choose a grade...</option>
                  {grades.filter(g => g.status === 'active').map(grade => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                  ))}
                </select>
              </div>

              {/* Module Selection */}
              <div className={`space-y-2 transition-all ${!selectedGradeId ? "opacity-50 pointer-events-none" : ""}`}>
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1 flex items-center gap-2">
                  <Layers size={14} /> Select Module
                </label>
                <select 
                  value={selectedModuleId}
                  onChange={(e) => {
                    setSelectedModuleId(e.target.value);
                    setSelectedLessonId(""); // Reset lesson when module changes
                  }}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-aquire-border focus:border-aquire-primary outline-none transition-all bg-white font-medium text-aquire-black"
                >
                  <option value="">Choose a module...</option>
                  {filteredModules.map(mod => (
                    <option key={mod.id} value={mod.id}>{mod.name}</option>
                  ))}
                </select>
              </div>

              {/* Lesson Selection */}
              <div className={`space-y-2 transition-all ${!selectedModuleId ? "opacity-50 pointer-events-none" : ""}`}>
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1 flex items-center gap-2">
                  <BookOpen size={14} /> Select Lesson
                </label>
                <select 
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-aquire-border focus:border-aquire-primary outline-none transition-all bg-white font-medium text-aquire-black"
                >
                  <option value="">Choose a lesson...</option>
                  {filteredLessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
                  ))}
                </select>
              </div>

              {/* Path Selection */}
              <div className={`space-y-2 transition-all ${!selectedGradeId ? "opacity-50 pointer-events-none" : ""}`}>
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1 flex items-center gap-2">
                  <Trophy size={14} /> Select Learning Path
                </label>
                <select 
                  value={selectedPathId}
                  onChange={(e) => setSelectedPathId(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-aquire-border focus:border-aquire-primary outline-none transition-all bg-white font-medium text-aquire-black"
                >
                  <option value="">Choose a path...</option>
                  {filteredPaths.map(path => (
                    <option key={path.id} value={path.id}>{path.name}</option>
                  ))}
                </select>
              </div>

              {/* Star Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1 flex items-center gap-2">
                  <Star size={14} /> Star Milestone (1-20)
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="1"
                    max="20"
                    value={starsEarned}
                    onChange={(e) => setStarsEarned(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-aquire-grey-light rounded-lg appearance-none cursor-pointer accent-aquire-primary"
                  />
                  <div className="w-14 h-14 rounded-2xl border-2 border-aquire-primary flex items-center justify-center bg-aquire-primary/5">
                    <span className="text-xl font-black text-aquire-primary">{starsEarned}</span>
                  </div>
                </div>
              </div>

              {selectedLessonId && selectedPathId && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <p className="text-xs text-emerald-700 font-medium">
                    Assigning <strong>{lessons.find(l => l.id === selectedLessonId)?.name}</strong> to <strong>{learningPaths.find(p => p.id === selectedPathId)?.name}</strong> at Star <strong>{starsEarned}</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-10 py-8 bg-aquire-grey-light/30 flex items-center justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-4 font-bold text-aquire-grey-med hover:text-aquire-black transition-all"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                disabled={!selectedLessonId || !selectedPathId}
                className="px-8 py-4 bg-aquire-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-aquire-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Assignment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
