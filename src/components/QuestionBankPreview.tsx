import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Send,
  Trophy,
  RefreshCcw,
  Clock,
  HelpCircle,
  FileText
} from "lucide-react";
import { QuestionBank, QuestionBankItem } from "../types";

interface QuestionBankPreviewProps {
  bank: QuestionBank;
  onClose: () => void;
}

export default function QuestionBankPreview({ bank, onClose }: QuestionBankPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);

  const handleAnswerChange = (id: string, value: any) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    let total = 0;

    bank.questions.forEach(q => {
      if (q.type === 'section') return;
      total += q.marks;
      
      const studentAnswer = answers[q.id];
      if (!studentAnswer) return;

      if (q.type === 'mcq') {
        const correctOpt = q.options?.findIndex(o => o.isCorrect);
        if (studentAnswer === correctOpt) currentScore += q.marks;
      } else if (q.type === 'true_false') {
        if (studentAnswer === q.correctAnswer) currentScore += q.marks;
      } else if (q.type === 'fill_blanks') {
        const isCorrect = q.answers?.every((ans, idx) => 
          studentAnswer[idx]?.toLowerCase().trim() === ans.toLowerCase().trim()
        );
        if (isCorrect) currentScore += q.marks;
      } else if (q.type === 'short_answer') {
        if (studentAnswer.toLowerCase().trim() === q.expectedAnswer?.toLowerCase().trim()) {
          currentScore += q.marks;
        }
      } else if (q.type === 'long_text') {
        // Long text is usually manually graded, but we can give partial credit based on keywords
        const keywords = q.keywords?.split(',').map(k => k.trim().toLowerCase()) || [];
        const found = keywords.filter(k => studentAnswer.toLowerCase().includes(k));
        if (keywords.length > 0) {
          currentScore += (found.length / keywords.length) * q.marks;
        }
      }
    });

    setScore(Math.round(currentScore));
    setTotalPossible(total);
    setIsSubmitted(true);
  };

  const reset = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-aquire-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-aquire-black/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-aquire-primary/20 rounded-2xl flex items-center justify-center border border-aquire-primary/30">
            <FileText className="text-aquire-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{bank.name}</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Student Preview Mode</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-all"
        >
          <X size={24} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0F172A]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-12 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trophy className="text-green-600" size={48} />
              </div>
              <h2 className="text-4xl font-black text-aquire-black mb-4">Assessment Completed!</h2>
              <p className="text-aquire-grey-med text-lg mb-10">Great job! You've successfully submitted your responses.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="p-8 bg-aquire-grey-light rounded-3xl border border-aquire-border">
                  <p className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest mb-2">Your Score</p>
                  <p className="text-5xl font-black text-aquire-primary">{score} <span className="text-2xl text-aquire-grey-med">/ {totalPossible}</span></p>
                </div>
                <div className="p-8 bg-aquire-grey-light rounded-3xl border border-aquire-border">
                  <p className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest mb-2">Percentage</p>
                  <p className="text-5xl font-black text-aquire-primary">{Math.round((score / totalPossible) * 100)}%</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-8 py-4 bg-aquire-grey-light text-aquire-black rounded-2xl font-bold hover:bg-aquire-border transition-all"
                >
                  <RefreshCcw size={20} />
                  Retake Assessment
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-8 py-4 bg-aquire-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-aquire-primary/20 transition-all"
                >
                  Finish Preview
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Description Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12">
                <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Description</h3>
                <p className="text-white/80 leading-relaxed">{bank.description || "No description provided."}</p>
              </div>

              {/* Questions */}
              {bank.questions.map((q, index) => (
                <div key={q.id}>
                  {q.type === 'section' ? (
                    <div className="py-8 border-b border-white/10 mb-8">
                      <h3 className="text-2xl font-bold text-aquire-primary">{q.question}</h3>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border-l-8 border-aquire-primary group hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-aquire-primary/10 text-aquire-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            Question {index + 1}
                          </span>
                          <span className="text-aquire-grey-med text-[10px] font-bold uppercase tracking-widest">
                            {q.type.replace('_', ' ')} • {q.marks} Marks
                          </span>
                        </div>
                        {q.required && (
                          <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">* Required</span>
                        )}
                      </div>

                      <h4 className="text-xl font-bold text-aquire-black mb-8 leading-tight">
                        {q.question}
                      </h4>

                      {/* Question Inputs */}
                      <div className="space-y-4">
                        {q.type === 'mcq' && (
                          <div className="grid gap-3">
                            {q.options?.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => handleAnswerChange(q.id, optIdx)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${answers[q.id] === optIdx ? "border-aquire-primary bg-aquire-primary/5 text-aquire-primary" : "border-aquire-grey-light hover:border-aquire-border text-aquire-grey-med"}`}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[q.id] === optIdx ? "border-aquire-primary bg-aquire-primary" : "border-aquire-border"}`}>
                                  {answers[q.id] === optIdx && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span className="font-semibold">{opt.text}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {q.type === 'true_false' && (
                          <div className="flex gap-4">
                            {[true, false].map((val) => (
                              <button
                                key={val.toString()}
                                onClick={() => handleAnswerChange(q.id, val)}
                                className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${answers[q.id] === val ? "border-aquire-primary bg-aquire-primary/5 text-aquire-primary" : "border-aquire-grey-light hover:border-aquire-border text-aquire-grey-med"}`}
                              >
                                {val ? "True" : "False"}
                              </button>
                            ))}
                          </div>
                        )}

                        {q.type === 'fill_blanks' && (
                          <div className="space-y-4">
                            {q.answers?.map((_, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <span className="w-8 h-8 bg-aquire-grey-light rounded-xl flex items-center justify-center text-xs font-bold text-aquire-grey-med">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={answers[q.id]?.[idx] || ""}
                                  onChange={(e) => {
                                    const newAns = [...(answers[q.id] || [])];
                                    newAns[idx] = e.target.value;
                                    handleAnswerChange(q.id, newAns);
                                  }}
                                  placeholder="Type your answer..."
                                  className="flex-1 px-6 py-3 bg-aquire-grey-light border border-aquire-border rounded-xl focus:outline-none focus:border-aquire-primary transition-all font-semibold"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === 'short_answer' && (
                          <input
                            type="text"
                            value={answers[q.id] || ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full px-6 py-4 bg-aquire-grey-light border border-aquire-border rounded-2xl focus:outline-none focus:border-aquire-primary transition-all font-semibold"
                          />
                        )}

                        {q.type === 'long_text' && (
                          <div className="space-y-2">
                            <textarea
                              value={answers[q.id] || ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              placeholder="Write your detailed response here..."
                              rows={6}
                              className="w-full px-6 py-4 bg-aquire-grey-light border border-aquire-border rounded-2xl focus:outline-none focus:border-aquire-primary transition-all font-medium resize-none"
                            />
                            <div className="flex justify-end">
                              <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">
                                {(answers[q.id] || "").length} characters
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Section */}
              <div className="pt-12 pb-20 flex flex-col items-center gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center max-w-md">
                  <p className="text-white/60 text-sm">
                    Please review all your answers before submitting. Once submitted, you won't be able to change them.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-3 px-12 py-5 bg-aquire-primary text-white rounded-[2rem] font-black text-xl hover:shadow-2xl hover:shadow-aquire-primary/40 hover:-translate-y-1 transition-all active:scale-95"
                >
                  <Send size={24} />
                  Submit Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
