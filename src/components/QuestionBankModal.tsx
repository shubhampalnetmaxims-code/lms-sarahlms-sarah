import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { 
  X, 
  Plus, 
  GripVertical, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  Type,
  CheckSquare,
  CircleDot,
  AlignLeft,
  FileJson,
  Download,
  Upload,
  Layout,
  Database
} from "lucide-react";
import { QuestionBank, QuestionBankItem, Grade } from "../types";

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bank: Omit<QuestionBank, "id" | "createdAt">) => void;
  editingBank: QuestionBank | null;
  availableGrades: Grade[];
}

const QUESTION_TYPES = [
  { id: 'mcq', label: 'Multiple Choice', icon: <CircleDot size={16} /> },
  { id: 'true_false', label: 'True/False', icon: <CheckCircle2 size={16} /> },
  { id: 'fill_blanks', label: 'Fill in Blanks', icon: <CheckSquare size={16} /> },
  { id: 'short_answer', label: 'Short Answer', icon: <Type size={16} /> },
  { id: 'long_text', label: 'Long Text', icon: <AlignLeft size={16} /> },
  { id: 'section', label: 'Section Divider', icon: <Layout size={16} /> },
];

export default function QuestionBankModal({ isOpen, onClose, onSave, editingBank, availableGrades }: QuestionBankModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (editingBank) {
      setName(editingBank.name);
      setDescription(editingBank.description);
      setSelectedGradeIds(editingBank.gradeIds || []);
      setQuestions(editingBank.questions);
      setStep(1);
    } else {
      setName("");
      setDescription("");
      setSelectedGradeIds([]);
      setQuestions([]);
      setStep(1);
    }
  }, [editingBank, isOpen]);

  const addQuestion = (type: QuestionBankItem['type']) => {
    const newQuestion: QuestionBankItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: type === 'section' ? "New Section" : "New Question",
      marks: type === 'section' ? 0 : 5,
      required: true,
      options: type === 'mcq' ? [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false }
      ] : undefined,
      correctAnswer: type === 'true_false' ? true : undefined,
      answers: type === 'fill_blanks' ? [""] : undefined,
    };
    setQuestions([...questions, newQuestion]);
    setExpandedId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<QuestionBankItem>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      const duplicated = { ...question, id: Math.random().toString(36).substr(2, 9) };
      const index = questions.findIndex(q => q.id === id);
      const newQuestions = [...questions];
      newQuestions.splice(index + 1, 0, duplicated);
      setQuestions(newQuestions);
      setExpandedId(duplicated.id);
    }
  };

  const toggleGrade = (gradeId: string) => {
    setSelectedGradeIds(prev => 
      prev.includes(gradeId) 
        ? prev.filter(id => id !== gradeId)
        : [...prev, gradeId]
    );
  };

  const handleSave = () => {
    if (!name.trim() || selectedGradeIds.length === 0) return;
    onSave({ 
      name, 
      description, 
      gradeIds: selectedGradeIds,
      questions 
    });
    onClose();
  };

  const handleImportJSON = () => {
    const input = prompt("Paste Question Bank JSON here:");
    if (input) {
      try {
        const parsed = JSON.parse(input);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          setQuestions([...questions, ...parsed.questions.map((q: any) => ({
            ...q,
            id: Math.random().toString(36).substr(2, 9)
          }))]);
        }
      } catch (e) {
        alert("Invalid JSON format");
      }
    }
  };

  if (!isOpen) return null;

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col my-auto"
          >
        {/* Header */}
        <div className="px-8 py-6 border-b border-aquire-border flex items-center justify-between bg-aquire-grey-light/30">
          <div>
            <h2 className="text-2xl font-bold text-aquire-black">
              {editingBank ? "Edit Assessment" : "Create Assessment"}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-aquire-primary text-white" : "bg-aquire-grey-med/20 text-aquire-grey-med"}`}>1</div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step >= 1 ? "text-aquire-primary" : "text-aquire-grey-med"}`}>Basic Info</span>
              </div>
              <div className="w-8 h-[2px] bg-aquire-border" />
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-aquire-primary text-white" : "bg-aquire-grey-med/20 text-aquire-grey-med"}`}>2</div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step >= 2 ? "text-aquire-primary" : "text-aquire-grey-med"}`}>Questions Builder</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-aquire-grey-light rounded-xl transition-colors">
            <X size={24} className="text-aquire-grey-med" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {step === 1 ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Bank Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Physics Mid-Term Assessment"
                  className="w-full px-6 py-4 bg-aquire-grey-light border border-aquire-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-aquire-primary/20 focus:border-aquire-primary transition-all text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this question bank..."
                  rows={4}
                  className="w-full px-6 py-4 bg-aquire-grey-light border border-aquire-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-aquire-primary/20 focus:border-aquire-primary transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Assign Grades</label>
                <div className="flex flex-wrap gap-2">
                  {availableGrades.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => toggleGrade(grade.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        selectedGradeIds.includes(grade.id)
                          ? "bg-aquire-primary border-aquire-primary text-white shadow-md shadow-aquire-primary/20"
                          : "bg-white border-aquire-border text-aquire-grey-med hover:border-aquire-primary/50"
                      }`}
                    >
                      {grade.name}
                    </button>
                  ))}
                </div>
                {selectedGradeIds.length === 0 && (
                  <p className="text-xs text-red-500 font-medium">Please select at least one grade.</p>
                )}
              </div>
              
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Google Forms Style Builder</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    In the next step, you'll be able to add multiple question types, reorder them with drag-and-drop, and set marks for each.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-aquire-black">Questions ({questions.length})</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleImportJSON}
                      className="flex items-center gap-2 px-3 py-1.5 bg-aquire-grey-light hover:bg-aquire-grey-med/10 rounded-lg text-xs font-bold text-aquire-grey-med transition-all"
                    >
                      <FileJson size={14} />
                      Import JSON
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-aquire-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-aquire-primary/20 transition-all">
                      <Plus size={18} />
                      Add Question
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-aquire-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-2">
                      {QUESTION_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => addQuestion(type.id as any)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-aquire-grey-light rounded-xl text-sm text-aquire-grey-med hover:text-aquire-primary transition-all"
                        >
                          {type.icon}
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-4">
                {questions.map((q, index) => (
                  <Reorder.Item
                    key={q.id}
                    value={q}
                    className={`bg-white border-2 rounded-2xl overflow-hidden transition-all ${expandedId === q.id ? "border-aquire-primary shadow-xl" : "border-aquire-border hover:border-aquire-grey-med/30"}`}
                  >
                    {/* Card Header */}
                    <div 
                      className={`px-6 py-4 flex items-center gap-4 cursor-pointer ${expandedId === q.id ? "bg-aquire-primary/5" : "bg-white"}`}
                      onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                    >
                      <div className="cursor-grab active:cursor-grabbing text-aquire-grey-med/40 hover:text-aquire-primary transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-aquire-primary uppercase tracking-widest">
                            {q.type === 'section' ? 'Section' : `Question ${index + 1}`}
                          </span>
                          <span className="px-2 py-0.5 bg-aquire-grey-light rounded text-[10px] font-bold text-aquire-grey-med uppercase">
                            {q.type.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-aquire-black truncate mt-0.5">
                          {q.question || (q.type === 'section' ? "Untitled Section" : "Untitled Question")}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); duplicateQuestion(q.id); }}
                          className="p-2 text-aquire-grey-med hover:text-aquire-primary hover:bg-aquire-primary/10 rounded-lg transition-all"
                          title="Duplicate"
                        >
                          <Copy size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                          className="p-2 text-aquire-grey-med hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        {expandedId === q.id ? <ChevronUp size={20} className="text-aquire-grey-med" /> : <ChevronDown size={20} className="text-aquire-grey-med" />}
                      </div>
                    </div>

                    {/* Card Body */}
                    <AnimatePresence>
                      {expandedId === q.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-8 pb-8 pt-2 border-t border-aquire-border space-y-6"
                        >
                          {/* Question Text */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">
                              {q.type === 'section' ? 'Section Title' : 'Question Text'}
                            </label>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                              className="w-full px-4 py-3 bg-aquire-grey-light border border-aquire-border rounded-xl focus:outline-none focus:border-aquire-primary transition-all font-semibold"
                            />
                          </div>

                          {q.type !== 'section' && (
                            <>
                              {/* MCQ Options */}
                              {q.type === 'mcq' && (
                                <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Options</label>
                                  {q.options?.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-center gap-3">
                                      <button
                                        onClick={() => {
                                          const newOpts = [...(q.options || [])];
                                          newOpts.forEach((o, i) => o.isCorrect = i === optIdx);
                                          updateQuestion(q.id, { options: newOpts });
                                        }}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? "bg-aquire-primary border-aquire-primary text-white" : "border-aquire-border hover:border-aquire-primary/50"}`}
                                      >
                                        {opt.isCorrect && <CheckCircle2 size={14} />}
                                      </button>
                                      <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => {
                                          const newOpts = [...(q.options || [])];
                                          newOpts[optIdx].text = e.target.value;
                                          updateQuestion(q.id, { options: newOpts });
                                        }}
                                        className="flex-1 px-4 py-2 bg-aquire-grey-light border border-aquire-border rounded-xl focus:outline-none focus:border-aquire-primary transition-all text-sm"
                                      />
                                      <button
                                        onClick={() => {
                                          const newOpts = q.options?.filter((_, i) => i !== optIdx);
                                          updateQuestion(q.id, { options: newOpts });
                                        }}
                                        className="p-2 text-aquire-grey-med hover:text-red-500 transition-colors"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const newOpts = [...(q.options || []), { text: `Option ${(q.options?.length || 0) + 1}`, isCorrect: false }];
                                      updateQuestion(q.id, { options: newOpts });
                                    }}
                                    className="flex items-center gap-2 text-sm font-bold text-aquire-primary hover:underline ml-9"
                                  >
                                    <Plus size={16} />
                                    Add Option
                                  </button>
                                </div>
                              )}

                              {/* True/False */}
                              {q.type === 'true_false' && (
                                <div className="flex items-center gap-4">
                                  <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Correct Answer:</label>
                                  <div className="flex bg-aquire-grey-light p-1 rounded-xl border border-aquire-border">
                                    <button
                                      onClick={() => updateQuestion(q.id, { correctAnswer: true })}
                                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${q.correctAnswer === true ? "bg-white text-aquire-primary shadow-sm" : "text-aquire-grey-med hover:text-aquire-black"}`}
                                    >
                                      True
                                    </button>
                                    <button
                                      onClick={() => updateQuestion(q.id, { correctAnswer: false })}
                                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${q.correctAnswer === false ? "bg-white text-aquire-primary shadow-sm" : "text-aquire-grey-med hover:text-aquire-black"}`}
                                    >
                                      False
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Fill in Blanks */}
                              {q.type === 'fill_blanks' && (
                                <div className="space-y-4">
                                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
                                    Use <strong>[blank]</strong> in your question text where you want the blanks to appear.
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Correct Answers</label>
                                    {q.answers?.map((ans, ansIdx) => (
                                      <div key={ansIdx} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-aquire-grey-med/10 rounded-lg flex items-center justify-center text-xs font-bold text-aquire-grey-med">
                                          {ansIdx + 1}
                                        </div>
                                        <input
                                          type="text"
                                          value={ans}
                                          onChange={(e) => {
                                            const newAns = [...(q.answers || [])];
                                            newAns[ansIdx] = e.target.value;
                                            updateQuestion(q.id, { answers: newAns });
                                          }}
                                          className="flex-1 px-4 py-2 bg-aquire-grey-light border border-aquire-border rounded-xl focus:outline-none focus:border-aquire-primary transition-all text-sm"
                                        />
                                        <button
                                          onClick={() => {
                                            const newAns = q.answers?.filter((_, i) => i !== ansIdx);
                                            updateQuestion(q.id, { answers: newAns });
                                          }}
                                          className="p-2 text-aquire-grey-med hover:text-red-500 transition-colors"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      onClick={() => {
                                        const newAns = [...(q.answers || []), ""];
                                        updateQuestion(q.id, { answers: newAns });
                                      }}
                                      className="flex items-center gap-2 text-sm font-bold text-aquire-primary hover:underline ml-11"
                                    >
                                      <Plus size={16} />
                                      Add Blank Answer
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Short Answer */}
                              {q.type === 'short_answer' && (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Expected Answer</label>
                                  <input
                                    type="text"
                                    value={q.expectedAnswer}
                                    onChange={(e) => updateQuestion(q.id, { expectedAnswer: e.target.value })}
                                    className="w-full px-4 py-3 bg-aquire-grey-light border border-aquire-border rounded-xl focus:outline-none focus:border-aquire-primary transition-all text-sm"
                                  />
                                </div>
                              )}

                              {/* Long Text */}
                              {q.type === 'long_text' && (
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Expected Answer (Reference)</label>
                                    <textarea
                                      value={q.expectedAnswer}
                                      onChange={(e) => updateQuestion(q.id, { expectedAnswer: e.target.value })}
                                      rows={3}
                                      className="w-full px-4 py-3 bg-aquire-grey-light border border-aquire-border rounded-xl focus:outline-none focus:border-aquire-primary transition-all text-sm resize-none"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Target Keywords (Comma separated)</label>
                                    <textarea
                                      value={q.keywords}
                                      onChange={(e) => updateQuestion(q.id, { keywords: e.target.value })}
                                      rows={3}
                                      className="w-full px-4 py-3 bg-aquire-grey-light border border-aquire-border rounded-xl focus:outline-none focus:border-aquire-primary transition-all text-sm resize-none"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Bottom Controls */}
                              <div className="flex items-center justify-between pt-4 border-t border-aquire-border/50">
                                <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Marks:</label>
                                    <input
                                      type="number"
                                      value={q.marks}
                                      onChange={(e) => updateQuestion(q.id, { marks: parseInt(e.target.value) || 0 })}
                                      className="w-16 px-2 py-1 bg-aquire-grey-light border border-aquire-border rounded text-center text-sm font-bold"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Required</span>
                                    <button
                                      onClick={() => updateQuestion(q.id, { required: !q.required })}
                                      className={`w-10 h-5 rounded-full transition-all relative ${q.required ? "bg-aquire-primary" : "bg-aquire-grey-med/30"}`}
                                    >
                                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${q.required ? "right-1" : "left-1"}`} />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="flex items-center gap-2 px-3 py-1.5 bg-aquire-grey-light hover:bg-aquire-grey-med/10 rounded-lg text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest transition-all">
                                    <ImageIcon size={14} />
                                    Add Image
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {questions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-aquire-border rounded-3xl bg-aquire-grey-light/20">
                  <div className="w-16 h-16 bg-aquire-grey-light rounded-2xl flex items-center justify-center mb-4">
                    <Database className="text-aquire-grey-med/40" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-aquire-black">No questions yet</h4>
                  <p className="text-aquire-grey-med text-sm mt-1">Start by adding your first question from the menu above.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-aquire-border flex items-center justify-between bg-aquire-grey-light/30">
          <button
            onClick={() => step === 1 ? onClose() : setStep(1)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-aquire-grey-med hover:bg-aquire-grey-light transition-all"
          >
            {step === 1 ? "Cancel" : <><ArrowLeft size={20} /> Back</>}
          </button>
          
          <div className="flex items-center gap-3">
            {step === 1 ? (
              <button
                onClick={() => name.trim() && selectedGradeIds.length > 0 && setStep(2)}
                disabled={!name.trim() || selectedGradeIds.length === 0}
                className="flex items-center gap-2 px-8 py-3 bg-aquire-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-aquire-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-aquire-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-aquire-primary/20 transition-all"
              >
                <Save size={20} />
                Save Assessment
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
