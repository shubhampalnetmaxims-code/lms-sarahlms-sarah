import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle, Loader2, Upload, Image as ImageIcon, ChevronDown, Plus, Trash2 as TrashIcon } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { Module, Lesson, LearningPath, Grade } from "../types";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<Lesson, "id" | "chapters" | "createdAt">) => void;
  editingLesson: Lesson | null;
  modules: Module[];
  learningPaths: LearningPath[];
  grades: Grade[];
}

const SAMPLE_THUMBNAILS = [
  "https://picsum.photos/seed/edu1/400/300",
  "https://picsum.photos/seed/edu2/400/300",
  "https://picsum.photos/seed/edu3/400/300",
  "https://picsum.photos/seed/edu4/400/300",
  "https://picsum.photos/seed/edu5/400/300",
];

export default function LessonModal({ isOpen, onClose, onSave, editingLesson, modules, learningPaths, grades }: LessonModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [thumbnail, setThumbnail] = useState(SAMPLE_THUMBNAILS[0]);
  const [isSkillLesson, setIsSkillLesson] = useState(false);
  const [learningPathId, setLearningPathId] = useState("");
  const [successKPIs, setSuccessKPIs] = useState<string[]>([]);
  const [newKPI, setNewKPI] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string; moduleId?: string; gradeId?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get grades for the selected module
  const moduleGrades = modules.find(m => m.id === moduleId)?.gradeIds || [];
  const filteredGrades = grades.filter(g => moduleGrades.includes(g.id));

  useEffect(() => {
    if (editingLesson) {
      setName(editingLesson.name);
      setDescription(editingLesson.description);
      setModuleId(editingLesson.moduleId);
      setGradeId(editingLesson.gradeId);
      setThumbnail(editingLesson.thumbnail);
      setIsSkillLesson(editingLesson.isSkillLesson || false);
      setLearningPathId(editingLesson.learningPathId || "");
      setSuccessKPIs(editingLesson.successKPIs || []);
    } else {
      setName("");
      setDescription("");
      const firstMod = modules[0]?.id || "";
      setModuleId(firstMod);
      
      // Auto-select first grade from module
      const firstModGrades = modules.find(m => m.id === firstMod)?.gradeIds || [];
      setGradeId(firstModGrades[0] || "");
      
      setThumbnail(SAMPLE_THUMBNAILS[0]);
      setIsSkillLesson(false);
      setLearningPathId("");
      setSuccessKPIs([]);
    }
    setErrors({});
  }, [editingLesson, isOpen, modules]);

  // When moduleId changes, update gradeId if current one is not in new module's grades
  useEffect(() => {
    if (!editingLesson && moduleId) {
      const currentModGrades = modules.find(m => m.id === moduleId)?.gradeIds || [];
      if (!currentModGrades.includes(gradeId)) {
        setGradeId(currentModGrades[0] || "");
      }
    }
  }, [moduleId, modules]);

  const validate = () => {
    const newErrors: { name?: string; description?: string; moduleId?: string; gradeId?: string } = {};
    if (!name.trim()) newErrors.name = "Lesson name is required";
    if (!isSkillLesson && !description.trim()) newErrors.description = "Description is required";
    if (!moduleId) newErrors.moduleId = "Please select a module";
    if (!gradeId) newErrors.gradeId = "Please select a grade";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSave({ 
      name, 
      description, 
      moduleId, 
      gradeId,
      thumbnail,
      isSkillLesson,
      learningPathId: isSkillLesson ? learningPathId : undefined,
      successKPIs: successKPIs.length > 0 ? successKPIs : undefined
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-aquire-border my-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-aquire-grey-med hover:text-aquire-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aquire-black mb-2">
                {editingLesson ? "Edit Lesson" : "Add New Lesson"}
              </h2>
              <p className="text-aquire-grey-med">
                Configure your lesson details and link it to an academic module.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                      Step 1: Select Module
                    </label>
                    <div className="relative">
                      <select
                        value={moduleId}
                        onChange={(e) => setModuleId(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl input-field appearance-none cursor-pointer"
                      >
                        <option value="">Select Module...</option>
                        {modules.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
                    </div>
                    {errors.moduleId && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle size={12} /> {errors.moduleId}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                      Step 2: Assign Grade
                    </label>
                    <div className="relative">
                      <select
                        value={gradeId}
                        onChange={(e) => setGradeId(e.target.value)}
                        disabled={!moduleId}
                        className="w-full px-6 py-4 rounded-2xl input-field appearance-none cursor-pointer disabled:opacity-50 disabled:bg-aquire-grey-light"
                      >
                        <option value="">{moduleId ? "Select Grade..." : "Select module first"}</option>
                        {filteredGrades.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
                    </div>
                    {errors.gradeId && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle size={12} /> {errors.gradeId}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                      Lesson Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Introduction to Variables"
                      className={`w-full px-6 py-4 rounded-2xl input-field ${
                        errors.name ? "border-red-500 focus:ring-red-500/20" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                    Lesson Thumbnail
                  </label>
                  <div className="relative group aspect-video rounded-2xl overflow-hidden border border-aquire-border bg-aquire-grey-light">
                    <img 
                      src={thumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-aquire-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-aquire-grey-dark hover:text-aquire-primary transition-all shadow-lg"
                        title="Upload Custom Image"
                      >
                        <Upload size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnail(SAMPLE_THUMBNAILS[Math.floor(Math.random() * SAMPLE_THUMBNAILS.length)])}
                        className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-aquire-grey-dark hover:text-aquire-primary transition-all shadow-lg"
                        title="Random Sample"
                      >
                        <ImageIcon size={20} />
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  <p className="text-[10px] text-aquire-grey-med text-center mt-2 uppercase tracking-widest font-bold">
                    Recommended: 16:9 Aspect Ratio
                  </p>
                </div>
              </div>

              {/* Advanced Section */}
              <div className="p-6 bg-aquire-grey-light/30 rounded-[24px] border border-aquire-border space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-aquire-black">Advanced Settings</h4>
                    <p className="text-[10px] text-aquire-grey-med uppercase tracking-wider font-bold">Skill-Based Learning Path Integration</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={isSkillLesson}
                      onChange={(e) => setIsSkillLesson(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-aquire-grey-med peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aquire-primary"></div>
                    <span className="ml-3 text-xs font-bold text-aquire-grey-dark">Skill Lesson</span>
                  </label>
                </div>

                {isSkillLesson && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 border-t border-aquire-border"
                  >
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-aquire-grey-dark ml-1">
                        Select Learning Path
                      </label>
                      <div className="relative">
                        <select
                          value={learningPathId}
                          onChange={(e) => setLearningPathId(e.target.value)}
                          className="w-full px-5 py-3 rounded-xl input-field appearance-none cursor-pointer text-sm"
                        >
                          <option value="">Select a path...</option>
                          {learningPaths.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-aquire-grey-med w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Success KPIs (Lessons Skills)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKPI}
                    onChange={(e) => setNewKPI(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newKPI.trim()) {
                          setSuccessKPIs([...successKPIs, newKPI.trim()]);
                          setNewKPI("");
                        }
                      }
                    }}
                    placeholder="Add a skill student will gain..."
                    className="flex-1 px-5 py-3 rounded-xl input-field text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newKPI.trim()) {
                        setSuccessKPIs([...successKPIs, newKPI.trim()]);
                        setNewKPI("");
                      }
                    }}
                    className="p-3 bg-aquire-primary text-white rounded-xl hover:bg-aquire-primary/90 transition-all shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {successKPIs.map((kpi, idx) => (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 group"
                    >
                      {kpi}
                      <button
                        type="button"
                        onClick={() => setSuccessKPIs(successKPIs.filter((_, i) => i !== idx))}
                        className="text-emerald-400 hover:text-emerald-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                  {successKPIs.length === 0 && (
                    <p className="text-xs text-aquire-grey-med italic ml-1">No skills added yet.</p>
                  )}
                </div>
              </div>

              {!isSkillLesson && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                    Description
                  </label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="What will students learn in this lesson?"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle size={12} /> {errors.description}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-[2] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      {editingLesson ? "Update Lesson" : "Save Lesson"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
