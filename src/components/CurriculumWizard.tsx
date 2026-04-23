import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Layout, 
  Layers, 
  BookOpen, 
  Target,
  Check,
  AlertCircle
} from "lucide-react";
import { Module, Lesson, Chapter, Level } from "../types";

interface CurriculumWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    module: Omit<Module, "id" | "createdAt">;
    lessons: {
      name: string;
      description: string;
      successKPIs: string[];
      chapters: string[]; // only names for now
    }[];
  }) => void;
  levels: Level[];
}

export default function CurriculumWizard({ isOpen, onClose, onSave, levels }: CurriculumWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Module Info
  const [moduleInfo, setModuleInfo] = useState({
    name: "",
    description: "",
    levelIds: [] as string[]
  });

  // Step 2: Lessons count and list
  const [numLessons, setNumLessons] = useState(1);
  const [lessonsData, setLessonsData] = useState<{
    name: string;
    description: string;
    successKPIs: string[];
    chapters: string[];
  }[]>([{ name: "", description: "", successKPIs: [], chapters: [""] }]);

  const [errors, setErrors] = useState<any>({});

  const validateStep1 = () => {
    const errs: any = {};
    if (!moduleInfo.name.trim()) errs.moduleName = "Module name is required";
    if (!moduleInfo.description.trim()) errs.moduleDesc = "Description is required";
    if (moduleInfo.levelIds.length === 0) errs.levels = "Select at least one level";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: any = {};
    lessonsData.forEach((lesson, index) => {
      if (!lesson.name.trim()) errs[`lesson_${index}_name`] = "Lesson name is required";
      if (!lesson.description.trim()) errs[`lesson_${index}_desc`] = "Description is required";
      if (lesson.successKPIs.length === 0) errs[`lesson_${index}_kpis`] = "Add at least one KPI";
      if (lesson.chapters.some(c => !c.trim())) errs[`lesson_${index}_chapters`] = "Chapter titles cannot be empty";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      // Adjust lessonsData array based on numLessons
      const current = [...lessonsData];
      if (numLessons > current.length) {
        for (let i = current.length; i < numLessons; i++) {
          current.push({ name: "", description: "", successKPIs: [], chapters: [""] });
        }
      } else {
        current.length = numLessons;
      }
      setLessonsData(current);
      setStep(3);
    }
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave({
      module: moduleInfo,
      lessons: lessonsData
    });
    setIsSubmitting(false);
    onClose();
    // Reset wizard
    setStep(1);
    setModuleInfo({ name: "", description: "", levelIds: [] });
    setNumLessons(1);
    setLessonsData([{ name: "", description: "", successKPIs: [], chapters: [""] }]);
  };

  const addKPI = (lessonIndex: number, kpi: string) => {
    if (!kpi.trim()) return;
    const updated = [...lessonsData];
    if (!updated[lessonIndex].successKPIs.includes(kpi)) {
      updated[lessonIndex].successKPIs.push(kpi);
      setLessonsData(updated);
    }
  };

  const removeKPI = (lessonIndex: number, kpi: string) => {
    const updated = [...lessonsData];
    updated[lessonIndex].successKPIs = updated[lessonIndex].successKPIs.filter(k => k !== kpi);
    setLessonsData(updated);
  };

  const addChapterTitle = (lessonIndex: number) => {
    const updated = [...lessonsData];
    updated[lessonIndex].chapters.push("");
    setLessonsData(updated);
  };

  const updateChapterTitle = (lessonIndex: number, chapterIndex: number, value: string) => {
    const updated = [...lessonsData];
    updated[lessonIndex].chapters[chapterIndex] = value;
    setLessonsData(updated);
  };

  const removeChapter = (lessonIndex: number, chapterIndex: number) => {
    const updated = [...lessonsData];
    updated[lessonIndex].chapters.splice(chapterIndex, 1);
    setLessonsData(updated);
  };

  const toggleLevel = (id: string) => {
    setModuleInfo(prev => ({
      ...prev,
      levelIds: prev.levelIds.includes(id) 
        ? prev.levelIds.filter(gid => gid !== id) 
        : [...prev.levelIds, id]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-aquire-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-aquire-border flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-aquire-black flex items-center gap-2">
                  <Layout className="text-aquire-primary" />
                  Curriculum Builder Wizard
                </h2>
                <p className="text-aquire-grey-med text-sm mt-1">
                  Design your module structure in three simple steps.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-aquire-grey-light rounded-full transition-colors"
              >
                <X size={24} className="text-aquire-grey-med" />
              </button>
            </div>

            {/* Steps Progress */}
            <div className="px-8 py-4 bg-aquire-grey-light/30 border-b border-aquire-border flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === s ? "bg-aquire-primary text-white scale-110 shadow-lg" : 
                    step > s ? "bg-emerald-500 text-white" : "bg-white text-aquire-grey-med border border-aquire-border"
                  }`}>
                    {step > s ? <Check size={16} /> : s}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    step === s ? "text-aquire-primary" : "text-aquire-grey-med"
                  }`}>
                    {s === 1 ? "Module Info" : s === 2 ? "Lesson Count" : "Lesson Details"}
                  </span>
                  {s < 3 && <div className="w-12 h-[2px] bg-aquire-border mx-2" />}
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-aquire-grey-dark ml-1">Module Name</label>
                      <input
                        type="text"
                        value={moduleInfo.name}
                        onChange={(e) => setModuleInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full input-field"
                        placeholder="e.g. Fundamental Physics"
                      />
                      {errors.moduleName && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.moduleName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-aquire-grey-dark ml-1">Description</label>
                      <textarea
                        value={moduleInfo.description}
                        onChange={(e) => setModuleInfo(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full input-field min-h-[120px] resize-none"
                        placeholder="Describe what students will learn in this module..."
                      />
                      {errors.moduleDesc && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.moduleDesc}</p>}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-aquire-grey-dark ml-1">Select Levels</label>
                      <div className="flex flex-wrap gap-2">
                        {levels.map(level => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => toggleLevel(level.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border-2 ${
                              moduleInfo.levelIds.includes(level.id)
                                ? "bg-aquire-primary border-aquire-primary text-white shadow-lg"
                                : "bg-white border-aquire-border text-aquire-grey-med hover:border-aquire-primary/30"
                            }`}
                          >
                            {moduleInfo.levelIds.includes(level.id) && <Check size={14} />}
                            {level.name}
                          </button>
                        ))}
                      </div>
                      {errors.levels && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.levels}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center justify-center space-y-8 py-12"
                  >
                    <div className="w-20 h-20 bg-aquire-primary/10 rounded-[24px] flex items-center justify-center text-aquire-primary mb-2">
                      <Layers size={40} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-aquire-black">How many lessons currently?</h3>
                      <p className="text-aquire-grey-med">You can always add more later, but let's start with a structure.</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setNumLessons(Math.max(1, numLessons - 1))}
                        className="w-14 h-14 rounded-2xl bg-white border border-aquire-border flex items-center justify-center text-aquire-grey-dark hover:border-aquire-primary hover:text-aquire-primary transition-all shadow-sm active:scale-90"
                      >
                        <ChevronLeft size={28} />
                      </button>
                      <div className="text-6xl font-black text-aquire-primary w-24 text-center">
                        {numLessons}
                      </div>
                      <button 
                        onClick={() => setNumLessons(numLessons + 1)}
                        className="w-14 h-14 rounded-2xl bg-white border border-aquire-border flex items-center justify-center text-aquire-grey-dark hover:border-aquire-primary hover:text-aquire-primary transition-all shadow-sm active:scale-90"
                      >
                        <ChevronRight size={28} />
                      </button>
                    </div>

                    <div className="text-aquire-grey-med font-medium text-sm italic">
                      Total {numLessons} lesson{numLessons > 1 ? 's' : ''} will be initialized.
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12 pb-8"
                  >
                    {lessonsData.map((lesson, lIdx) => (
                      <div key={lIdx} className="bg-aquire-grey-light/20 border border-aquire-border rounded-[24px] p-6 space-y-6 relative border-l-[6px] border-l-aquire-primary shadow-sm hover:shadow-md transition-all">
                        <div className="absolute -top-4 left-6 bg-aquire-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                          Lesson {lIdx + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-tighter">Lesson Title</label>
                              <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-aquire-grey-med" size={18} />
                                <input
                                  type="text"
                                  value={lesson.name}
                                  onChange={(e) => {
                                    const updated = [...lessonsData];
                                    updated[lIdx].name = e.target.value;
                                    setLessonsData(updated);
                                  }}
                                  className="w-full pl-12 pr-4 py-3 bg-white border border-aquire-border rounded-xl focus:ring-2 focus:ring-aquire-primary/20 outline-none transition-all"
                                  placeholder="Introduction to Motion"
                                />
                              </div>
                              {errors[`lesson_${lIdx}_name`] && <p className="text-red-500 text-[10px] ml-1">{errors[`lesson_${lIdx}_name`]}</p>}
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-tighter">Description</label>
                              <textarea
                                value={lesson.description}
                                onChange={(e) => {
                                  const updated = [...lessonsData];
                                  updated[lIdx].description = e.target.value;
                                  setLessonsData(updated);
                                }}
                                className="w-full p-4 bg-white border border-aquire-border rounded-xl h-24 resize-none focus:ring-2 focus:ring-aquire-primary/20 outline-none transition-all text-sm"
                                placeholder="Explain what this lesson covers..."
                              />
                              {errors[`lesson_${lIdx}_desc`] && <p className="text-red-500 text-[10px] ml-1">{errors[`lesson_${lIdx}_desc`]}</p>}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-tighter flex items-center gap-2">
                                <Target size={14} className="text-aquire-primary" />
                                Success KPIs (Skills)
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  id={`kpi-input-${lIdx}`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addKPI(lIdx, (e.target as HTMLInputElement).value);
                                      (e.target as HTMLInputElement).value = "";
                                    }
                                  }}
                                  className="flex-1 px-4 py-2 bg-white border border-aquire-border rounded-xl text-sm outline-none focus:border-aquire-primary transition-all"
                                  placeholder="Press Enter to add"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.getElementById(`kpi-input-${lIdx}`) as HTMLInputElement;
                                    addKPI(lIdx, input.value);
                                    input.value = "";
                                  }}
                                  className="w-10 h-10 bg-aquire-primary text-white rounded-xl flex items-center justify-center hover:bg-aquire-primary-hover shadow-sm"
                                >
                                  <Plus size={20} />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {lesson.successKPIs.map(kpi => (
                                  <span key={kpi} className="px-3 py-1 bg-aquire-primary/10 text-aquire-primary rounded-full text-xs font-bold flex items-center gap-2">
                                    {kpi}
                                    <button onClick={() => removeKPI(lIdx, kpi)} className="hover:text-red-500"><X size={12} /></button>
                                  </span>
                                ))}
                              </div>
                              {errors[`lesson_${lIdx}_kpis`] && <p className="text-red-500 text-[10px] ml-1">{errors[`lesson_${lIdx}_kpis`]}</p>}
                            </div>

                            <div className="space-y-3">
                              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-tighter flex items-center gap-2">
                                <Layers size={14} className="text-aquire-primary" />
                                Initial Chapters
                              </label>
                              <div className="space-y-2">
                                {lesson.chapters.map((chap, cIdx) => (
                                  <div key={cIdx} className="flex gap-2 items-center">
                                    <span className="text-[10px] font-bold text-aquire-grey-med w-4">{cIdx + 1}.</span>
                                    <input
                                      type="text"
                                      value={chap}
                                      onChange={(e) => updateChapterTitle(lIdx, cIdx, e.target.value)}
                                      className="flex-1 px-4 py-2 bg-white border-b border-aquire-border text-sm outline-none focus:border-aquire-primary transition-all"
                                      placeholder="Chapter Title"
                                    />
                                    {lesson.chapters.length > 1 && (
                                      <button onClick={() => removeChapter(lIdx, cIdx)} className="text-aquire-grey-med hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button 
                                  onClick={() => addChapterTitle(lIdx)}
                                  className="text-[10px] font-bold text-aquire-primary flex items-center gap-1 hover:underline mt-1"
                                >
                                  <Plus size={10} /> Add Chapter
                                </button>
                                {errors[`lesson_${lIdx}_chapters`] && <p className="text-red-500 text-[10px] ml-1">{errors[`lesson_${lIdx}_chapters`]}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-aquire-border bg-aquire-grey-light/20 flex items-center justify-between">
              <div className="flex gap-2">
                {step > 1 && (
                  <button 
                    onClick={handleBack}
                    className="btn-secondary px-6"
                  >
                    <ChevronLeft size={20} />
                    Back
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                {step < 3 ? (
                  <button 
                    onClick={handleNext}
                    className="btn-primary min-w-[140px]"
                  >
                    Continue
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-primary min-w-[180px]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} />
                        Finish & Create
                      </>
                    )}
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
