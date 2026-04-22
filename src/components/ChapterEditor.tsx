import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
  Type, 
  Video, 
  CheckSquare, 
  ListOrdered, 
  MinusCircle, 
  HelpCircle, 
  Move,
  Save,
  Eye,
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Upload,
  Loader2
} from "lucide-react";
import { Chapter, ContentBlock } from "../types";
import RichTextEditor from "./RichTextEditor";

interface ChapterEditorProps {
  chapter: Chapter;
  onSave: (updatedChapter: Chapter) => void;
  onUpdate?: (updatedChapter: Chapter) => void;
  onBack: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

const BLOCK_TYPES = [
  { type: 'reading', label: 'Reading', icon: FileText, color: 'text-aquire-primary' },
  { type: 'video', label: 'Video', icon: Video, color: 'text-red-500' },
  { type: 'short_answer', label: 'Short Answer', icon: HelpCircle, color: 'text-purple-500' },
  { type: 'mcq', label: 'MCQ', icon: ListOrdered, color: 'text-amber-500' },
  { type: 'fill_blanks', label: 'Fill Blanks', icon: MinusCircle, color: 'text-emerald-500' },
  { type: 'true_false', label: 'True/False', icon: CheckSquare, color: 'text-orange-500' },
  { type: 'drag_drop', label: 'Drag & Drop', icon: Move, color: 'text-cyan-500' },
  { type: 'long_text', label: 'Long Text', icon: HelpCircle, color: 'text-blue-600' },
];

export default function ChapterEditor({ chapter, onSave, onUpdate, onBack, showToast }: ChapterEditorProps) {
  const [localChapter, setLocalChapter] = useState<Chapter>({
    ...chapter,
    blocks: chapter.blocks || []
  });
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>(new Date().toLocaleTimeString());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(localChapter) !== JSON.stringify(chapter)) {
        if (onUpdate) {
          onUpdate(localChapter);
          setLastSaved(new Date().toLocaleTimeString());
        }
      }
    }, 3000); // Auto-save every 3 seconds if changes occur
    return () => clearTimeout(timer);
  }, [localChapter, chapter, onUpdate]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data: getDefaultData(type)
    };
    setLocalChapter(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
    setExpandedBlocks(prev => [...prev, newBlock.id]);
    showToast(`${type.replace('_', ' ')} block added`, "success");
  };

  const getDefaultData = (type: ContentBlock['type']) => {
    switch (type) {
      case 'reading': return { text: '', examples: '' };
      case 'video': return { url: '', description: '', fileName: '' };
      case 'short_answer': return { questions: [{ q: '', a: '' }] };
      case 'mcq': return { question: '', options: [{ text: '', isCorrect: false }] };
      case 'fill_blanks': return { text: '', answers: [] };
      case 'true_false': return { statement: '', isTrue: true };
      case 'drag_drop': return { paragraph: '', items: [] };
      case 'long_text': return { question: '', description: '', expected_answer: '', keywords: '', marks: 10 };
      default: return {};
    }
  };

  const updateBlockData = (id: string, newData: any) => {
    setLocalChapter(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, data: newData } : b)
    }));
  };

  const handleVideoUpload = async (blockId: string, file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      showToast("File too large (max 50MB)", "error");
      return;
    }

    setIsUploading(blockId);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      updateBlockData(blockId, { 
        ...localChapter.blocks.find(b => b.id === blockId)?.data, 
        url: base64,
        fileName: file.name
      });
      setIsUploading(null);
      showToast("Video uploaded successfully", "success");
    };
    reader.readAsDataURL(file);
  };

  const removeBlock = (id: string) => {
    setLocalChapter(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
    showToast("Block removed", "success");
  };

  const toggleExpand = (id: string) => {
    setExpandedBlocks(prev => 
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(localChapter);
    showToast("Chapter saved successfully", "success");
  };

  // --- Block Renderers ---
  const renderBlockForm = (block: ContentBlock) => {
    const { type, data } = block;

    switch (type) {
      case 'reading':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Content Text (Rich Editor)</label>
              <RichTextEditor 
                value={data.text}
                onChange={(val) => updateBlockData(block.id, { ...data, text: val })}
                placeholder="Enter rich text content here..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Examples (Rich Editor)</label>
              <RichTextEditor 
                value={data.examples}
                onChange={(val) => updateBlockData(block.id, { ...data, examples: val })}
                placeholder="Enter examples here..."
              />
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Video Upload (MP4/WebM)</label>
              <div className="flex flex-col gap-4">
                {data.url ? (
                  <div className="aspect-video rounded-2xl overflow-hidden bg-aquire-black border border-aquire-border relative group">
                    <video src={data.url} controls className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => updateBlockData(block.id, { ...data, url: '', fileName: '' })}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full aspect-video rounded-3xl border-2 border-dashed border-aquire-border hover:border-aquire-primary/50 hover:bg-aquire-grey-light transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group">
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleVideoUpload(block.id, e.target.files[0])}
                    />
                    {isUploading === block.id ? (
                      <Loader2 className="w-10 h-10 text-aquire-primary animate-spin" />
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-aquire-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="text-aquire-primary" size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-aquire-black font-bold">Click to upload video</p>
                          <p className="text-aquire-grey-med text-xs mt-1">MP4 or WebM (Max 50MB)</p>
                        </div>
                      </>
                    )}
                  </label>
                )}
                {data.fileName && <p className="text-xs text-aquire-grey-med italic">File: {data.fileName}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Description (Rich Editor)</label>
              <RichTextEditor 
                value={data.description}
                onChange={(val) => updateBlockData(block.id, { ...data, description: val })}
                placeholder="What is this video about?"
              />
            </div>
          </div>
        );

      case 'short_answer':
        return (
          <div className="space-y-6">
            {data.questions.map((q: any, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-aquire-grey-light border border-aquire-border space-y-4 relative group/q">
                <button 
                  onClick={() => {
                    const newQs = data.questions.filter((_: any, idx: number) => idx !== i);
                    updateBlockData(block.id, { ...data, questions: newQs });
                  }}
                  className="absolute top-4 right-4 text-aquire-grey-med hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-aquire-grey-med uppercase">Question {i + 1} (Rich Editor)</label>
                  <RichTextEditor 
                    value={q.q}
                    onChange={(val) => {
                      const newQs = [...data.questions];
                      newQs[i].q = val;
                      updateBlockData(block.id, { ...data, questions: newQs });
                    }}
                    placeholder="Enter question..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-aquire-grey-med uppercase">Correct Answer</label>
                  <input 
                    type="text"
                    value={q.a}
                    onChange={(e) => {
                      const newQs = [...data.questions];
                      newQs[i].a = e.target.value;
                      updateBlockData(block.id, { ...data, questions: newQs });
                    }}
                    className="w-full input-field p-3 text-sm"
                    placeholder="Enter answer..."
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateBlockData(block.id, { ...data, questions: [...data.questions, { q: '', a: '' }] })}
              className="w-full py-3 border-2 border-dashed border-aquire-border rounded-2xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary/30 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Plus size={16} /> Add Question
            </button>
          </div>
        );

      case 'mcq':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Question (Rich Editor)</label>
              <RichTextEditor 
                value={data.question}
                onChange={(val) => updateBlockData(block.id, { ...data, question: val })}
                placeholder="Enter MCQ question..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Options</label>
              {data.options.map((opt: any, i: number) => (
                <div key={i} className="flex items-center gap-4 group/opt">
                  <button 
                    onClick={() => {
                      const newOpts = data.options.map((o: any, idx: number) => ({ ...o, isCorrect: idx === i }));
                      updateBlockData(block.id, { ...data, options: newOpts });
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      opt.isCorrect ? 'border-aquire-primary bg-aquire-primary text-white' : 'border-aquire-border'
                    }`}
                  >
                    {opt.isCorrect && <CheckCircle2 size={14} />}
                  </button>
                  <input 
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const newOpts = [...data.options];
                      newOpts[i].text = e.target.value;
                      updateBlockData(block.id, { ...data, options: newOpts });
                    }}
                    className="flex-1 input-field p-3 text-sm"
                    placeholder={`Option ${i + 1}`}
                  />
                  <button 
                    onClick={() => {
                      const newOpts = data.options.filter((_: any, idx: number) => idx !== i);
                      updateBlockData(block.id, { ...data, options: newOpts });
                    }}
                    className="text-aquire-grey-med hover:text-red-500 transition-colors opacity-0 group-hover/opt:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => updateBlockData(block.id, { ...data, options: [...data.options, { text: '', isCorrect: false }] })}
                className="w-full py-3 border-2 border-dashed border-aquire-border rounded-2xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary/30 transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Plus size={16} /> Add Option
              </button>
            </div>
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Statement (Rich Editor)</label>
              <RichTextEditor 
                value={data.statement}
                onChange={(val) => updateBlockData(block.id, { ...data, statement: val })}
                placeholder="Enter statement..."
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => updateBlockData(block.id, { ...data, isTrue: true })}
                className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${
                  data.isTrue ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-aquire-border text-aquire-grey-med hover:border-aquire-primary/30'
                }`}
              >
                <CheckCircle2 size={20} /> True
              </button>
              <button 
                onClick={() => updateBlockData(block.id, { ...data, isTrue: false })}
                className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${
                  !data.isTrue ? 'border-red-500 bg-red-50 text-red-600' : 'border-aquire-border text-aquire-grey-med hover:border-aquire-primary/30'
                }`}
              >
                <XCircle size={20} /> False
              </button>
            </div>
          </div>
        );

      case 'fill_blanks':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Text with Blanks (use [blank] for gaps)</label>
              <RichTextEditor 
                value={data.text}
                onChange={(val) => updateBlockData(block.id, { ...data, text: val })}
                placeholder="e.g. The capital of France is [blank]."
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Answers (in order)</label>
              {data.answers.map((ans: string, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-aquire-grey-light flex items-center justify-center text-xs font-bold text-aquire-grey-med">{i + 1}</div>
                  <input 
                    type="text"
                    value={ans}
                    onChange={(e) => {
                      const newAns = [...data.answers];
                      newAns[i] = e.target.value;
                      updateBlockData(block.id, { ...data, answers: newAns });
                    }}
                    className="flex-1 input-field p-3 text-sm"
                    placeholder="Correct answer..."
                  />
                  <button 
                    onClick={() => {
                      const newAns = data.answers.filter((_: any, idx: number) => idx !== i);
                      updateBlockData(block.id, { ...data, answers: newAns });
                    }}
                    className="text-aquire-grey-med hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => updateBlockData(block.id, { ...data, answers: [...data.answers, ''] })}
                className="w-full py-3 border-2 border-dashed border-aquire-border rounded-2xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary/30 transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Plus size={16} /> Add Answer
              </button>
            </div>
          </div>
        );

      case 'drag_drop':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Paragraph with Drop Zones (Rich Editor)</label>
              <RichTextEditor 
                value={data.paragraph}
                onChange={(val) => updateBlockData(block.id, { ...data, paragraph: val })}
                placeholder="Enter paragraph text..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Draggable Items</label>
              {data.items.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-aquire-grey-light flex items-center justify-center text-xs font-bold text-aquire-grey-med">{i + 1}</div>
                  <input 
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[i] = e.target.value;
                      updateBlockData(block.id, { ...data, items: newItems });
                    }}
                    className="flex-1 input-field p-3 text-sm"
                    placeholder="Draggable word/phrase..."
                  />
                  <button 
                    onClick={() => {
                      const newItems = data.items.filter((_: any, idx: number) => idx !== i);
                      updateBlockData(block.id, { ...data, items: newItems });
                    }}
                    className="text-aquire-grey-med hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => updateBlockData(block.id, { ...data, items: [...data.items, ''] })}
                className="w-full py-3 border-2 border-dashed border-aquire-border rounded-2xl text-aquire-grey-med hover:text-aquire-primary hover:border-aquire-primary/30 transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Plus size={16} /> Add Draggable Item
              </button>
            </div>
          </div>
        );
      case 'long_text':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Question Title (Rich Editor)</label>
              <RichTextEditor 
                value={data.question}
                onChange={(val) => updateBlockData(block.id, { ...data, question: val })}
                placeholder="Enter long text question..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Question Description (Optional)</label>
              <RichTextEditor 
                value={data.description}
                onChange={(val) => updateBlockData(block.id, { ...data, description: val })}
                placeholder="Enter description or instructions..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Expected Answer (Rich Editor)</label>
              <RichTextEditor 
                value={data.expected_answer}
                onChange={(val) => updateBlockData(block.id, { ...data, expected_answer: val })}
                placeholder="Enter the ideal answer for reference..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Keywords (comma-separated)</label>
                <input 
                  type="text"
                  value={data.keywords}
                  onChange={(e) => updateBlockData(block.id, { ...data, keywords: e.target.value })}
                  className="w-full input-field p-3 text-sm"
                  placeholder="e.g. gravity, force, mass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-aquire-grey-med uppercase tracking-widest">Marks</label>
                <input 
                  type="number"
                  value={data.marks}
                  onChange={(e) => updateBlockData(block.id, { ...data, marks: parseInt(e.target.value) || 0 })}
                  className="w-full input-field p-3 text-sm"
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-aquire-grey-med hover:text-aquire-primary transition-colors group mb-2 font-bold"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Lesson
          </button>
          <div className="flex items-center gap-4">
            <input 
              type="text"
              value={localChapter.name}
              onChange={(e) => setLocalChapter(prev => ({ ...prev, name: e.target.value }))}
              className="text-4xl font-bold text-aquire-black bg-transparent border-none focus:ring-0 p-0 w-full"
              placeholder="Chapter Name"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest">Auto-save active</span>
            <span className="text-[10px] text-aquire-primary font-medium">Last saved: {lastSaved}</span>
          </div>
          <button 
            onClick={handleSave}
            className="btn-primary px-8"
          >
            <Save size={20} />
            Save & Exit
          </button>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-6">
        <Reorder.Group axis="y" values={localChapter.blocks} onReorder={(newBlocks) => setLocalChapter(prev => ({ ...prev, blocks: newBlocks }))} className="space-y-6">
          <AnimatePresence mode="popLayout">
            {localChapter.blocks.map((block) => (
              <Reorder.Item 
                key={block.id} 
                value={block}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card overflow-hidden group"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="cursor-grab active:cursor-grabbing text-aquire-grey-med hover:text-aquire-primary transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div className={`p-3 rounded-xl bg-aquire-grey-light ${BLOCK_TYPES.find(t => t.type === block.type)?.color}`}>
                        {React.createElement(BLOCK_TYPES.find(t => t.type === block.type)?.icon || Type, { size: 20 })}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest block">Block Type</span>
                        <h4 className="text-aquire-black font-bold capitalize">{block.type.replace('_', ' ')}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleExpand(block.id)}
                        className="p-2 rounded-lg hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all"
                      >
                        {expandedBlocks.includes(block.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <button 
                        onClick={() => removeBlock(block.id)}
                        className="p-2 rounded-lg hover:bg-aquire-grey-light text-aquire-grey-med hover:text-red-500 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedBlocks.includes(block.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t border-aquire-border">
                          {renderBlockForm(block)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {localChapter.blocks.length === 0 && (
          <div className="p-20 text-center bg-white rounded-[32px] border-dashed border-2 border-aquire-border">
            <div className="w-20 h-20 bg-aquire-grey-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={32} className="text-aquire-grey-med" />
            </div>
            <h3 className="text-xl font-bold text-aquire-black mb-2">No content blocks yet</h3>
            <p className="text-aquire-grey-med mb-8">Start building your chapter by adding dynamic content blocks below.</p>
          </div>
        )}

        {/* Add Block Menu */}
        <div className="card p-8">
          <h3 className="text-sm font-bold text-aquire-grey-med uppercase tracking-widest mb-6 text-center">Add Content Block</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {BLOCK_TYPES.map((type) => (
              <button
                key={type.type}
                onClick={() => addBlock(type.type as any)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-aquire-grey-light transition-all group"
              >
                <div className={`p-4 rounded-2xl bg-aquire-grey-light group-hover:scale-110 transition-transform ${type.color}`}>
                  <type.icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-wider group-hover:text-aquire-primary transition-colors">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
