import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Save, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  GripVertical,
  CheckCircle2,
  Eye,
  Check
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import RichTextEditor from "./RichTextEditor";
import { Module, Lesson, LearningPath, Grade } from "../types";

interface LearningPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (path: Omit<LearningPath, "id" | "createdAt">) => void;
  editingPath: LearningPath | null;
  modules: Module[];
  lessons: Lesson[];
  grades: Grade[];
}

const DraggableAny = Draggable as any;

export default function LearningPathModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPath, 
  modules, 
  lessons,
  grades
}: LearningPathModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(5);
  const [gradeIds, setGradeIds] = useState<string[]>([]);
  const [moduleId, setModuleId] = useState("");
  const [starLessons, setStarLessons] = useState<(string | null)[]>([]);
  const [errors, setErrors] = useState<{ name?: string; description?: string; moduleId?: string; grades?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPath) {
      setName(editingPath.name);
      setDescription(editingPath.description);
      setStars(editingPath.stars);
      setGradeIds(editingPath.gradeIds || []);
      setModuleId(editingPath.moduleId);
      setStarLessons(editingPath.starLessons);
      setStep(1);
    } else {
      setName("");
      setDescription("");
      setStars(5);
      setGradeIds([]);
      setModuleId("");
      setStarLessons(new Array(5).fill(null));
      setStep(1);
    }
    setErrors({});
  }, [editingPath, isOpen, modules]);

  // Adjust starLessons when stars count changes
  useEffect(() => {
    setStarLessons(prev => {
      const newArr = [...prev];
      if (stars > newArr.length) {
        return [...newArr, ...new Array(stars - newArr.length).fill(null)];
      } else if (stars < newArr.length) {
        return newArr.slice(0, stars);
      }
      return newArr;
    });
  }, [stars]);

  const validateStep1 = () => {
    const newErrors: { name?: string; description?: string; grades?: string } = {};
    if (!name.trim()) newErrors.name = "Path name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (gradeIds.length === 0) newErrors.grades = "Select at least 1 grade";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { moduleId?: string } = {};
    if (!moduleId) newErrors.moduleId = "Please select a module";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const toggleGrade = (id: string) => {
    setGradeIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
    // Reset module if grades change
    setModuleId("");
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    // If dragging from available lessons to a star
    if (source.droppableId === "available-lessons" && destination.droppableId.startsWith("star-")) {
      const starIndex = parseInt(destination.droppableId.replace("star-", ""));
      const lessonId = result.draggableId;
      
      const newStarLessons = [...starLessons];
      newStarLessons[starIndex] = lessonId;
      setStarLessons(newStarLessons);
    }
    
    // If dragging from one star to another
    if (source.droppableId.startsWith("star-") && destination.droppableId.startsWith("star-")) {
      const sourceIndex = parseInt(source.droppableId.replace("star-", ""));
      const destIndex = parseInt(destination.droppableId.replace("star-", ""));
      
      const newStarLessons = [...starLessons];
      const temp = newStarLessons[sourceIndex];
      newStarLessons[sourceIndex] = newStarLessons[destIndex];
      newStarLessons[destIndex] = temp;
      setStarLessons(newStarLessons);
    }

    // If dragging from a star back to available (removing from star)
    if (source.droppableId.startsWith("star-") && destination.droppableId === "available-lessons") {
      const sourceIndex = parseInt(source.droppableId.replace("star-", ""));
      const newStarLessons = [...starLessons];
      newStarLessons[sourceIndex] = null;
      setStarLessons(newStarLessons);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Initialize starsData if it doesn't exist
    const starsData = editingPath?.starsData || starLessons.map((lessonId, index) => ({
      star: index + 1,
      mainLessonId: lessonId,
      skillLessonIds: []
    }));

    onSave({ name, description, moduleId, gradeIds, stars, starLessons, starsData });
    setIsSubmitting(false);
    onClose();
  };

  // Filter modules based on selected grades
  const filteredModules = modules.filter(m => 
    m.gradeIds && m.gradeIds.some(gid => gradeIds.includes(gid))
  );

  const availableLessons = lessons.filter(l => l.moduleId === moduleId && !starLessons.includes(l.id));

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-aquire-grey-dark ml-1">Path Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Narrative Writing Mastery"
          className={`w-full px-6 py-4 rounded-2xl input-field ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-aquire-grey-dark ml-1">Description</label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe the learning journey..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description}</p>}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-bold text-aquire-grey-dark ml-1">Select Grades</label>
        <div className="flex flex-wrap gap-2">
          {grades.filter(g => g.status === 'active').map(grade => {
            const isSelected = gradeIds.includes(grade.id);
            return (
              <button
                key={grade.id}
                type="button"
                onClick={() => toggleGrade(grade.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border-2 ${
                  isSelected 
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "bg-white border-aquire-border text-aquire-grey-med hover:border-aquire-primary/30"
                }`}
              >
                {isSelected && <Check size={14} />}
                {grade.name}
              </button>
            );
          })}
        </div>
        {errors.grades && <p className="text-red-500 text-xs mt-1 ml-1">{errors.grades}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-aquire-grey-dark ml-1">Number of Stars (1-20)</label>
        <select
          value={stars}
          onChange={(e) => setStars(parseInt(e.target.value))}
          className="w-full px-6 py-4 rounded-2xl input-field appearance-none bg-white"
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n} Stars</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
          Select Module (Filtered by Grades)
        </label>
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map(mod => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setModuleId(mod.id)}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  moduleId === mod.id 
                    ? "border-aquire-primary bg-aquire-primary/5 ring-4 ring-aquire-primary/10" 
                    : "border-aquire-border bg-white hover:border-aquire-primary/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold ${moduleId === mod.id ? "text-aquire-primary" : "text-aquire-black"}`}>
                    {mod.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {mod.gradeIds?.slice(0, 2).map(gid => {
                      const g = grades.find(grade => grade.id === gid);
                      return g ? (
                        <span key={gid} className="px-2 py-0.5 bg-aquire-grey-light text-aquire-grey-med text-[8px] font-black rounded-md uppercase">
                          {g.name}
                        </span>
                      ) : null;
                    })}
                    {(mod.gradeIds?.length || 0) > 2 && (
                      <span className="px-2 py-0.5 bg-aquire-grey-light text-aquire-grey-med text-[8px] font-black rounded-md uppercase">
                        +{(mod.gradeIds?.length || 0) - 2}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-aquire-grey-med line-clamp-2" dangerouslySetInnerHTML={{ __html: mod.description }}></p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-aquire-grey-light rounded-3xl border-2 border-dashed border-aquire-border">
            <p className="text-aquire-grey-med font-bold">No modules found for the selected grades.</p>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 text-aquire-primary text-sm font-bold hover:underline"
            >
              Go back to change grades
            </button>
          </div>
        )}
        {errors.moduleId && <p className="text-red-500 text-xs mt-1 ml-1">{errors.moduleId}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row gap-8 h-[500px]">
          {/* Available Lessons */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <h4 className="text-sm font-bold text-aquire-grey-dark mb-4 px-2">Available Lessons</h4>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              <Droppable droppableId="available-lessons">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[100px]">
                    {availableLessons.map((lesson, index) => (
                      <DraggableAny key={lesson.id} draggableId={lesson.id} index={index}>
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 bg-white border border-aquire-border rounded-xl flex items-center gap-3 shadow-sm hover:border-aquire-primary transition-all ${
                              snapshot.isDragging ? "ring-2 ring-aquire-primary shadow-xl" : ""
                            }`}
                          >
                            <GripVertical size={16} className="text-aquire-grey-med" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-aquire-black truncate">{lesson.name}</p>
                            </div>
                          </div>
                        )}
                      </DraggableAny>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Star Assignment */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <h4 className="text-sm font-bold text-aquire-grey-dark mb-4 px-2">Star Progression</h4>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              <div className="space-y-4">
                {starLessons.map((lessonId, index) => {
                  const lesson = lessons.find(l => l.id === lessonId);
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 border border-amber-200">
                        <Star size={20} fill="currentColor" />
                      </div>
                      <div className="flex-1">
                        <Droppable droppableId={`star-${index}`}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`p-4 rounded-2xl border-2 border-dashed transition-all min-h-[72px] flex items-center ${
                                snapshot.isDraggingOver 
                                  ? "border-aquire-primary bg-aquire-primary/5" 
                                  : lesson 
                                    ? "border-emerald-500/30 bg-emerald-50/50 border-solid" 
                                    : "border-aquire-border bg-aquire-grey-light"
                              }`}
                            >
                              {lesson ? (
                                <DraggableAny draggableId={lesson.id} index={0}>
                                  {(provided: any) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="w-full flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                        <span className="font-bold text-aquire-black">{lesson.name}</span>
                                      </div>
                                      <button 
                                        onClick={() => {
                                          const newStarLessons = [...starLessons];
                                          newStarLessons[index] = null;
                                          setStarLessons(newStarLessons);
                                        }}
                                        className="text-aquire-grey-med hover:text-red-500 transition-colors"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  )}
                                </DraggableAny>
                              ) : (
                                <span className="text-sm text-aquire-grey-med italic">Drag a lesson here for Star {index + 1}</span>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="bg-aquire-grey-light rounded-3xl p-8 border border-aquire-border">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-aquire-black">{name}</h4>
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-1">
              {gradeIds.map(gid => {
                const g = grades.find(grade => grade.id === gid);
                return g ? (
                  <span key={gid} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                    {g.name}
                  </span>
                ) : null;
              })}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
              <Star size={16} fill="currentColor" />
              {stars} Stars
            </div>
          </div>
        </div>
        <div className="prose prose-sm max-w-none text-aquire-grey-med mb-8" dangerouslySetInnerHTML={{ __html: description }} />
        
        <div className="space-y-4">
          <h5 className="text-sm font-bold text-aquire-grey-dark uppercase tracking-widest">Path Sequence</h5>
          <div className="space-y-3">
            {starLessons.map((lessonId, index) => {
              const lesson = lessons.find(l => l.id === lessonId);
              return (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-aquire-border">
                  <span className="w-8 h-8 rounded-full bg-aquire-primary/10 text-aquire-primary flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className={`font-bold ${lesson ? "text-aquire-black" : "text-red-500 italic"}`}>
                    {lesson ? lesson.name : "No lesson assigned"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

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
            className="relative w-full max-w-4xl bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-aquire-border my-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-aquire-grey-med hover:text-aquire-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s ? "bg-aquire-primary text-white" : "bg-aquire-grey-light text-aquire-grey-med"
                    }`}>
                      {s}
                    </div>
                    {s < 4 && <div className={`w-12 h-1 transition-all ${step > s ? "bg-aquire-primary" : "bg-aquire-grey-light"}`} />}
                  </div>
                ))}
              </div>
              <h2 className="text-3xl font-bold text-aquire-black mb-2">
                {editingPath ? "Edit Learning Path" : "Create Learning Path"}
              </h2>
              <p className="text-aquire-grey-med">
                {step === 1 && "Step 1: Define the basic details of your learning path."}
                {step === 2 && "Step 2: Choose the academic module for this path."}
                {step === 3 && "Step 3: Assign lessons to each star in the progression."}
                {step === 4 && "Step 4: Review your learning path configuration."}
              </p>
            </div>

            <div className="min-h-[400px]">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </div>

            <div className="flex gap-4 pt-10 border-t border-aquire-border mt-10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary flex-1"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
              )}
              <div className="flex-[2] flex gap-4">
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary w-full"
                  >
                    Next Step
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || starLessons.some(l => l === null)}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save size={20} />
                        {editingPath ? "Update Path" : "Create Path"}
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
