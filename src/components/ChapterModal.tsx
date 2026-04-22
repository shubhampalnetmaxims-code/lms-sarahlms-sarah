import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle, Loader2, FileText } from "lucide-react";
import { Chapter } from "../types";
import RichTextEditor from "./RichTextEditor";

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chapter: Omit<Chapter, "id">) => void;
  editingChapter: Chapter | null;
}

export default function ChapterModal({ isOpen, onClose, onSave, editingChapter }: ChapterModalProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ name?: string; content?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingChapter) {
      setName(editingChapter.name);
      setContent(editingChapter.content);
    } else {
      setName("");
      setContent("");
    }
    setErrors({});
  }, [editingChapter, isOpen]);

  const validate = () => {
    const newErrors: { name?: string; content?: string } = {};
    if (!name.trim()) newErrors.name = "Chapter name is required";
    if (!content.trim()) newErrors.content = "Content is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSave({ name, content, blocks: editingChapter?.blocks || [] });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-aquire-border"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-aquire-grey-med hover:text-aquire-primary transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-aquire-primary/10 rounded-2xl flex items-center justify-center">
                <FileText className="text-aquire-primary w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-aquire-black mb-1">
                  {editingChapter ? "Edit Chapter" : "Add New Chapter"}
                </h2>
                <p className="text-aquire-grey-med text-sm">
                  Define the learning content for this chapter.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-aquire-grey-dark ml-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chapter 1: Getting Started"
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
                  Chapter Content
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write the chapter content..."
                />
                {errors.content && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                    <AlertCircle size={12} /> {errors.content}
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
                      {editingChapter ? "Update Chapter" : "Save Chapter"}
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
