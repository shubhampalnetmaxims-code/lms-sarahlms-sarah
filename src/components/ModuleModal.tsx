import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle, Loader2, Check } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

import { Module, Grade } from "../types";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: Omit<Module, "id" | "createdAt">) => void;
  editingModule: Module | null;
  grades: Grade[];
}

export default function ModuleModal({ isOpen, onClose, onSave, editingModule, grades }: ModuleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gradeIds, setGradeIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; description?: string; grades?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingModule) {
      setName(editingModule.name);
      setDescription(editingModule.description);
      setGradeIds(editingModule.gradeIds || []);
    } else {
      setName("");
      setDescription("");
      setGradeIds([]);
    }
    setErrors({});
  }, [editingModule, isOpen]);

  const validate = () => {
    const newErrors: { name?: string; description?: string; grades?: string } = {};
    if (!name.trim()) newErrors.name = "Module name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.length > 200) newErrors.description = "Description must be under 200 characters";
    
    if (gradeIds.length === 0) newErrors.grades = "Assign at least 1 grade";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleGrade = (id: string) => {
    setGradeIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSave({ name, description, gradeIds });
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
            className="relative w-full max-w-lg bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-aquire-border my-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-aquire-grey-med hover:text-aquire-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aquire-black mb-2">
                {editingModule ? "Edit Module" : "Add New Module"}
              </h2>
              <p className="text-aquire-grey-med">
                {editingModule ? "Update the module details below." : "Fill in the details to create a new academic module."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Module Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advanced Mathematics"
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

              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Description
                </label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Briefly describe the module content..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                    <AlertCircle size={12} /> {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Assign Grades
                </label>
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
                {errors.grades && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                    <AlertCircle size={12} /> {errors.grades}
                  </p>
                )}
              </div>

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
                      {editingModule ? "Update Module" : "Save Module"}
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
