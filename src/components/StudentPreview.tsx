import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  PlayCircle, 
  CheckCircle2, 
  XCircle,
  LayoutGrid,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { Chapter, ContentBlock, Lesson } from '../types';

interface StudentPreviewProps {
  lesson: Lesson;
  initialChapterIndex?: number;
  onClose: () => void;
}

export default function StudentPreview({ lesson, initialChapterIndex = 0, onClose }: StudentPreviewProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean, message: string }>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set());

  const chapters = lesson?.chapters || [];
  const currentChapter = chapters[currentChapterIndex];

  if (!currentChapter) return null;

  const isQuestion = (type: string) => !['reading', 'video'].includes(type);
  const questionBlocks = currentChapter.blocks.filter(block => isQuestion(block.type));
  const totalQuestions = questionBlocks.length;
  let questionCounter = 0;

  const toggleCollapse = (blockId: string) => {
    setCollapsedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  };

  const handleAnswerChange = (blockId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [blockId]: value }));
  };

  const checkAnswer = (block: ContentBlock) => {
    const userAnswer = answers[block.id];
    let isCorrect = false;
    let message = "";

    switch (block.type) {
      case 'mcq':
        const correctOptions = block.data.options.filter((o: any) => o.isCorrect).map((o: any) => o.text);
        isCorrect = correctOptions.includes(userAnswer);
        message = isCorrect ? "Correct! Well done." : `Incorrect. The correct answer is: ${correctOptions.join(' or ')}`;
        break;
      case 'true_false':
        isCorrect = userAnswer === block.data.isTrue;
        message = isCorrect ? "Correct!" : "Incorrect.";
        break;
      case 'short_answer':
        // Simple case-insensitive check for the first question
        const firstQ = block.data.questions[0];
        isCorrect = userAnswer?.toLowerCase().trim() === firstQ?.a.toLowerCase().trim();
        message = isCorrect ? "Correct!" : `Incorrect. The answer is: ${firstQ?.a}`;
        break;
      case 'fill_blanks':
        // Check all blanks
        const allCorrect = block.data.answers.every((ans: string, i: number) => 
          userAnswer?.[i]?.toLowerCase().trim() === ans.toLowerCase().trim()
        );
        isCorrect = allCorrect;
        message = isCorrect ? "All blanks correct!" : "Some blanks are incorrect.";
        break;
      case 'drag_drop':
        const userOrder = answers[block.id] || [];
        isCorrect = JSON.stringify(userOrder) === JSON.stringify(block.data.answers);
        message = isCorrect ? "Correct order!" : "Incorrect order.";
        break;
      case 'long_text':
        isCorrect = true; // Long text is subjective, we just mark as "submitted"
        message = "Response submitted! Your instructor will review this.";
        break;
    }

    setFeedback(prev => ({ ...prev, [block.id]: { correct: isCorrect, message } }));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-aquire-grey-light flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-gradient-to-r from-aquire-black to-[#1E293B] border-b border-aquire-black/10 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex flex-col">
            <h2 className="font-bold text-white text-sm leading-tight">{lesson.name}</h2>
            <span className="text-[10px] font-bold text-aquire-primary uppercase tracking-widest">Student Preview</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-4 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Show Answers</span>
            <button 
              onClick={() => setShowAnswers(!showAnswers)}
              className={`w-10 h-5 rounded-full transition-all relative ${showAnswers ? 'bg-aquire-primary' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${showAnswers ? 'left-6' : 'left-1'}`} />
            </button>
            {showAnswers ? <Eye size={14} className="text-aquire-primary" /> : <EyeOff size={14} className="text-white/30" />}
          </div>
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest hidden sm:block">
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </span>
          <button 
            onClick={onClose}
            className="btn-primary py-2 px-6 text-sm font-bold shadow-lg shadow-aquire-primary/20"
          >
            EXIT EDIT
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-aquire-black border-r border-aquire-black/10 overflow-y-auto custom-scrollbar p-4 hidden md:block">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Chapters</h3>
          <div className="space-y-2">
            {chapters.map((chapter, i) => (
              <button
                key={chapter.id}
                onClick={() => setCurrentChapterIndex(i)}
                className={`w-full text-left p-3 rounded-xl transition-all text-sm font-medium ${
                  currentChapterIndex === i 
                    ? 'bg-aquire-primary text-white shadow-lg shadow-aquire-primary/20' 
                    : 'text-aquire-grey-light/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                {i + 1}. {chapter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-aquire-grey-light">
          <div className="max-w-3xl mx-auto py-12 px-6 space-y-12">
            <header className="space-y-2">
              <span className="text-xs font-bold text-aquire-primary uppercase tracking-widest">
                Learning Content
              </span>
              <h1 className="text-4xl font-bold text-aquire-black">{currentChapter.name}</h1>
            </header>

            <div className="space-y-12 pb-24">
              {currentChapter.blocks.map((block, i) => {
                const isBlockQuestion = isQuestion(block.type);
                if (isBlockQuestion) questionCounter++;
                const currentQuestionNumber = questionCounter;
                const isCollapsed = collapsedBlocks.has(block.id);

                return (
                  <motion.div 
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative ${isBlockQuestion ? 'question-block' : 'space-y-6'}`}
                  >
                    {isBlockQuestion && (
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-aquire-border/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-aquire-primary/10 flex items-center justify-center text-aquire-primary font-bold text-base shadow-sm">
                            {currentQuestionNumber}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-aquire-black leading-none mb-1">
                              Question {currentQuestionNumber}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-aquire-grey-light rounded text-[9px] font-bold text-aquire-grey-med uppercase tracking-wider">
                                {block.type.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] font-bold text-aquire-primary/40 uppercase tracking-widest">
                                • {block.data.marks || 10} Marks
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest leading-none mb-1">
                              Progress
                            </span>
                            <span className="text-xs font-bold text-aquire-primary">
                              {currentQuestionNumber} of {totalQuestions}
                            </span>
                          </div>
                          {showAnswers && (
                            <button 
                              onClick={() => toggleCollapse(block.id)}
                              className="p-2.5 rounded-xl hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all bg-white border border-aquire-border shadow-sm"
                              title={isCollapsed ? "Expand Question" : "Collapse Question"}
                            >
                              {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <AnimatePresence initial={false}>
                      {(!isCollapsed || !showAnswers || !isBlockQuestion) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={isBlockQuestion ? "space-y-6" : ""}>
                            {block.type === 'reading' && (
                              <div className="prose max-w-none">
                                <div 
                                  className="text-lg text-aquire-grey-dark leading-relaxed rich-editor-content"
                                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                                />
                                {block.data.examples && (
                                  <div className="mt-8 p-6 rounded-2xl bg-aquire-primary/5 border border-aquire-primary/10">
                                    <h5 className="text-aquire-primary font-bold mb-4 uppercase tracking-wider text-xs">Examples</h5>
                                    <ul className="space-y-3">
                                      {block.data.examples?.split(',').map((ex: string, idx: number) => (
                                        <li key={idx} className="text-aquire-grey-med flex items-center gap-3">
                                          <div className="w-1.5 h-1.5 rounded-full bg-aquire-primary" />
                                          {ex.trim()}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === 'video' && (
                              <div className="space-y-4">
                                <div className="aspect-video rounded-3xl overflow-hidden bg-black border border-aquire-border relative group shadow-lg">
                                  {block.data.url ? (
                                    <video 
                                      src={block.data.url} 
                                      controls 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/20">
                                      <PlayCircle size={64} />
                                      <span className="font-medium">No video uploaded</span>
                                    </div>
                                  )}
                                </div>
                                {block.data.description && (
                                  <p className="text-aquire-grey-med text-center italic text-sm">{block.data.description}</p>
                                )}
                              </div>
                            )}

                            {block.type === 'mcq' && (
                              <div className="space-y-6">
                                <h4 className="text-xl font-bold text-aquire-black rich-editor-content" dangerouslySetInnerHTML={{ __html: block.data.question }}></h4>
                                <div className="space-y-3">
                                  {block.data.options?.map((opt: any, idx: number) => (
                                    <button 
                                      key={idx} 
                                      onClick={() => !feedback[block.id] && handleAnswerChange(block.id, opt.text)}
                                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                                        answers[block.id] === opt.text
                                          ? 'border-aquire-primary bg-aquire-primary/5 text-aquire-primary'
                                          : 'border-aquire-border text-aquire-grey-med hover:bg-aquire-grey-light hover:text-aquire-black'
                                      } ${feedback[block.id] ? 'cursor-default' : ''} ${
                                        showAnswers && opt.isCorrect ? 'border-green-500 bg-green-50 text-green-600 ring-2 ring-green-500/20' : ''
                                      } ${
                                        showAnswers && answers[block.id] === opt.text && !opt.isCorrect ? 'border-red-500 bg-red-50 text-red-600 ring-2 ring-red-500/20' : ''
                                      }`}
                                    >
                                      <span className="font-medium">{opt.text}</span>
                                      <div className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                                        (answers[block.id] === opt.text || (showAnswers && opt.isCorrect))
                                          ? (showAnswers && opt.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-aquire-primary bg-aquire-primary text-white')
                                          : 'border-aquire-border group-hover:border-aquire-grey-med'
                                      }`}>
                                        {(answers[block.id] === opt.text || (showAnswers && opt.isCorrect)) && <CheckCircle2 size={14} />}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                {!feedback[block.id] ? (
                                  <button 
                                    disabled={!answers[block.id]}
                                    onClick={() => checkAnswer(block)}
                                    className="btn-primary w-full py-4 disabled:opacity-50"
                                  >
                                    Check Answer
                                  </button>
                                ) : (
                                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                                    feedback[block.id].correct ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                    {feedback[block.id].correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    <p className="font-bold text-sm">{feedback[block.id].message}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === 'true_false' && (
                              <div className="space-y-6">
                                <h4 className="text-xl font-bold text-aquire-black rich-editor-content" dangerouslySetInnerHTML={{ __html: block.data.statement }}></h4>
                                <div className="flex gap-4">
                                  {[true, false].map((val) => (
                                    <button 
                                      key={val.toString()}
                                      onClick={() => !feedback[block.id] && handleAnswerChange(block.id, val)}
                                      className={`flex-1 py-4 rounded-2xl border transition-all font-bold ${
                                        answers[block.id] === val
                                          ? (val ? 'border-green-500 bg-green-50 text-green-600' : 'border-red-500 bg-red-50 text-red-600')
                                          : 'border-aquire-border text-aquire-grey-med hover:border-aquire-grey-dark'
                                      } ${feedback[block.id] ? 'cursor-default' : ''} ${
                                        showAnswers && val === block.data.isTrue ? 'border-green-500 bg-green-50 text-green-600 ring-2 ring-green-500/20' : ''
                                      } ${
                                        showAnswers && answers[block.id] === val && val !== block.data.isTrue ? 'border-red-500 bg-red-50 text-red-600 ring-2 ring-red-500/20' : ''
                                      }`}
                                    >
                                      {val ? 'True' : 'False'}
                                    </button>
                                  ))}
                                </div>
                                {!feedback[block.id] ? (
                                  <button 
                                    disabled={answers[block.id] === undefined}
                                    onClick={() => checkAnswer(block)}
                                    className="btn-primary w-full py-4 disabled:opacity-50"
                                  >
                                    Check Answer
                                  </button>
                                ) : (
                                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                                    feedback[block.id].correct ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                    {feedback[block.id].correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    <p className="font-bold text-sm">{feedback[block.id].message}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === 'short_answer' && (
                              <div className="space-y-8">
                                {block.data.questions?.map((q: any, idx: number) => (
                                  <div key={idx} className="space-y-4">
                                    <h4 className="text-xl font-bold text-aquire-black rich-editor-content" dangerouslySetInnerHTML={{ __html: q.q }}></h4>
                                    <input 
                                      type="text"
                                      value={answers[block.id]?.[idx] || ''}
                                      onChange={(e) => {
                                        const current = answers[block.id] || [];
                                        const next = [...current];
                                        next[idx] = e.target.value;
                                        handleAnswerChange(block.id, next);
                                      }}
                                      disabled={!!feedback[block.id]}
                                      className={`input-field w-full ${
                                        showAnswers ? 'border-green-500 bg-green-50/30' : ''
                                      }`}
                                      placeholder={showAnswers ? `Correct Answer: ${q.a}` : "Type your answer here..."}
                                    />
                                  </div>
                                ))}
                                {!feedback[block.id] ? (
                                  <button 
                                    disabled={!answers[block.id] || answers[block.id].length < block.data.questions.length}
                                    onClick={() => checkAnswer(block)}
                                    className="btn-primary w-full py-4 disabled:opacity-50"
                                  >
                                    Check Answer
                                  </button>
                                ) : (
                                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                                    feedback[block.id].correct ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                    {feedback[block.id].correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    <p className="font-bold text-sm">{feedback[block.id].message}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === 'fill_blanks' && (
                              <div className="space-y-6">
                                <div className="text-xl font-bold text-aquire-black rich-editor-content" dangerouslySetInnerHTML={{ __html: block.data.text.replace(/\[blank\]/g, '<span class="inline-block w-24 border-b-2 border-aquire-primary mx-1"></span>') }}></div>
                                <div className="space-y-4 pt-4">
                                  {block.data.answers?.map((_: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4">
                                      <span className="text-aquire-grey-med text-xs font-bold uppercase">Blank {idx + 1}</span>
                                      {block.data.options?.[idx] ? (
                                        <select
                                          value={answers[block.id]?.[idx] || ''}
                                          onChange={(e) => {
                                            const current = answers[block.id] || [];
                                            const next = [...current];
                                            next[idx] = e.target.value;
                                            handleAnswerChange(block.id, next);
                                          }}
                                          disabled={!!feedback[block.id]}
                                          className={`input-field py-2 flex-1 ${
                                            showAnswers ? 'border-green-500 bg-green-50/30' : ''
                                          }`}
                                        >
                                          <option value="">Select answer...</option>
                                          {block.data.options[idx].map((opt: string) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input 
                                          type="text"
                                          value={answers[block.id]?.[idx] || ''}
                                          onChange={(e) => {
                                            const current = answers[block.id] || [];
                                            const next = [...current];
                                            next[idx] = e.target.value;
                                            handleAnswerChange(block.id, next);
                                          }}
                                          disabled={!!feedback[block.id]}
                                          className={`input-field py-2 flex-1 ${
                                            showAnswers ? 'border-green-500 bg-green-50/30' : ''
                                          }`}
                                          placeholder={showAnswers ? block.data.answers[idx] : "Type answer here..."}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {!feedback[block.id] ? (
                                  <button 
                                    disabled={!answers[block.id] || answers[block.id].length < block.data.answers.length}
                                    onClick={() => checkAnswer(block)}
                                    className="btn-primary w-full py-4 disabled:opacity-50"
                                  >
                                    Check Answer
                                  </button>
                                ) : (
                                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                                    feedback[block.id].correct ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                    {feedback[block.id].correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    <p className="font-bold text-sm">{feedback[block.id].message}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === 'drag_drop' && (
                              <div className="space-y-6">
                                <div className="text-xl font-bold text-aquire-black rich-editor-content" dangerouslySetInnerHTML={{ __html: block.data.paragraph }}></div>
                                <div className="space-y-4">
                                  <div className="flex flex-wrap gap-3 p-4 bg-aquire-grey-light rounded-2xl border border-dashed border-aquire-border min-h-[60px]">
                                    {(answers[block.id] || []).map((item: string, idx: number) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          if (feedback[block.id]) return;
                                          const current = answers[block.id] || [];
                                          handleAnswerChange(block.id, current.filter((_, i) => i !== idx));
                                        }}
                                        className="px-4 py-2 bg-aquire-primary text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2"
                                      >
                                        {item}
                                        <X size={14} />
                                      </button>
                                    ))}
                                    {(!answers[block.id] || answers[block.id].length === 0) && (
                                      <span className="text-aquire-grey-med text-sm italic">Click items below to arrange them...</span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-3 pt-4">
                                    {block.data.items?.filter((item: string) => !(answers[block.id] || []).includes(item)).map((item: string, idx: number) => (
                                      <button 
                                        key={idx} 
                                        onClick={() => {
                                          if (feedback[block.id]) return;
                                          const current = answers[block.id] || [];
                                          handleAnswerChange(block.id, [...current, item]);
                                        }}
                                        className={`px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                                          showAnswers 
                                            ? 'bg-green-50 border-green-500 text-green-700' 
                                            : 'bg-white border-aquire-border text-aquire-grey-dark hover:border-aquire-primary hover:text-aquire-primary'
                                        }`}
                                      >
                                        {item}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                {!feedback[block.id] ? (
                                  <button 
                                    disabled={!answers[block.id] || answers[block.id].length !== block.data.items.length}
                                    onClick={() => checkAnswer(block)}
                                    className="btn-primary w-full py-4 disabled:opacity-50"
                                  >
                                    Check Answer
                                  </button>
                                ) : (
                                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                                    feedback[block.id].correct ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                    {feedback[block.id].correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    <p className="font-bold text-sm">{feedback[block.id].message}</p>
                                  </div>
                                )}
                                {showAnswers && (
                                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Correct Order:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {block.data.answers.map((ans: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-green-200 rounded-lg text-xs font-bold text-green-700">
                                          {i + 1}. {ans}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === 'long_text' && (
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <h4 className="text-xl font-bold text-aquire-black rich-editor-content" dangerouslySetInnerHTML={{ __html: block.data.question }}></h4>
                                  {block.data.description && (
                                    <div className="text-aquire-grey-med text-sm rich-editor-content" dangerouslySetInnerHTML={{ __html: block.data.description }}></div>
                                  )}
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="relative">
                                    <textarea 
                                      value={answers[block.id] || ''}
                                      onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                                      disabled={!!feedback[block.id]}
                                      className="w-full min-h-[200px] p-6 rounded-3xl border-2 border-aquire-border focus:border-aquire-primary focus:ring-4 focus:ring-aquire-primary/10 transition-all bg-white text-aquire-black resize-none"
                                      placeholder="Type your detailed response here..."
                                    />
                                    <div className="absolute bottom-4 right-6 text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">
                                      { (answers[block.id] || '').length } characters
                                    </div>
                                  </div>

                                  {showAnswers && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="space-y-4 pt-4 border-t border-aquire-border"
                                    >
                                      {block.data.expected_answer && (
                                        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                                          <h5 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Expected Answer</h5>
                                          <div className="text-sm text-emerald-700 rich-editor-content" dangerouslySetInnerHTML={{ __html: block.data.expected_answer }}></div>
                                        </div>
                                      )}
                                      {block.data.keywords && (
                                        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                                          <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Target Keywords</h5>
                                          <div className="flex flex-wrap gap-2">
                                            {block.data.keywords.split(',').map((kw: string, idx: number) => (
                                              <span key={idx} className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                                                {kw.trim()}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </div>

                                {!feedback[block.id] ? (
                                  <button 
                                    disabled={!(answers[block.id] || '').trim()}
                                    onClick={() => checkAnswer(block)}
                                    className="btn-primary w-full py-4 disabled:opacity-50"
                                  >
                                    Submit Response
                                  </button>
                                ) : (
                                  <div className="p-4 rounded-2xl flex items-center gap-3 bg-blue-50 text-blue-600 border border-blue-100">
                                    <CheckCircle2 size={20} />
                                    <p className="font-bold text-sm">{feedback[block.id].message}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-12 border-t border-aquire-border">
              <button
                disabled={currentChapterIndex === 0}
                onClick={() => {
                  setCurrentChapterIndex(prev => prev - 1);
                  window.scrollTo(0, 0);
                }}
                className="btn-secondary px-8 disabled:opacity-20"
              >
                <ChevronLeft size={20} /> Previous Chapter
              </button>
              <button
                disabled={currentChapterIndex === chapters.length - 1}
                onClick={() => {
                  setCurrentChapterIndex(prev => prev + 1);
                  window.scrollTo(0, 0);
                }}
                className="btn-primary px-8 disabled:opacity-20"
              >
                Next Chapter <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
