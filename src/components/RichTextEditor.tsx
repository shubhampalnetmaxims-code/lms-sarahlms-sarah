import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon,
  Palette,
  Highlighter,
  AlertCircle,
  Info,
  Lightbulb,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyPreset = (style: 'important' | 'note' | 'example' | 'warning') => {
    // Save selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    switch(style) {
      case 'important':
        execCommand('foreColor', '#ef4444'); // Red
        execCommand('hiliteColor', '#fef08a'); // Yellow highlight
        break;
      case 'note':
        execCommand('foreColor', '#2563eb'); // Blue
        break;
      case 'example':
        execCommand('foreColor', '#16a34a'); // Green
        execCommand('hiliteColor', '#f1f5f9'); // Light grey bg
        break;
      case 'warning':
        execCommand('foreColor', '#ea580c'); // Orange
        break;
    }
  };

  const ToolbarButton = ({ icon: Icon, command, value = '', active = false, onClick }: { icon: any, command?: string, value?: string, active?: boolean, onClick?: () => void }) => (
    <button
      type="button"
      onClick={onClick || (() => execCommand(command!, value))}
      className={`p-2 rounded hover:bg-aquire-grey-light transition-all ${
        active ? 'text-aquire-primary bg-aquire-primary/10' : 'text-aquire-grey-med hover:text-aquire-primary'
      }`}
    >
      <Icon size={16} />
    </button>
  );

  const colors = ['#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#000000', '#64748b'];
  const highlights = ['#fef08a', '#fed7aa', '#bfdbfe', '#ffffff'];

  return (
    <div className="input-field rounded-2xl overflow-hidden flex flex-col p-0 border-[#D1D5DB]">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-aquire-border bg-aquire-grey-light/50">
        <ToolbarButton icon={Heading1} command="formatBlock" value="H1" />
        <ToolbarButton icon={Heading2} command="formatBlock" value="H2" />
        <ToolbarButton icon={Heading3} command="formatBlock" value="H3" />
        
        <div className="w-px h-4 bg-aquire-border mx-1" />
        
        <ToolbarButton icon={Bold} command="bold" />
        <ToolbarButton icon={Italic} command="italic" />
        <ToolbarButton icon={Underline} command="underline" />
        <ToolbarButton icon={Strikethrough} command="strikeThrough" />
        
        <div className="w-px h-4 bg-aquire-border mx-1" />
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all flex items-center gap-1"
          >
            <Palette size={16} />
            <ChevronDown size={10} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-aquire-border rounded-xl shadow-xl z-50 flex gap-1">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    execCommand('foreColor', c);
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-full border border-aquire-border"
                  style={{ backgroundColor: c }}
                />
              ))}
              <input 
                type="color" 
                onChange={(e) => execCommand('foreColor', e.target.value)}
                className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className="p-2 rounded hover:bg-aquire-grey-light text-aquire-grey-med hover:text-aquire-primary transition-all flex items-center gap-1"
          >
            <Highlighter size={16} />
            <ChevronDown size={10} />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-aquire-border rounded-xl shadow-xl z-50 flex gap-1">
              {highlights.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    execCommand('hiliteColor', c);
                    setShowHighlightPicker(false);
                  }}
                  className="w-6 h-6 rounded border border-aquire-border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-aquire-border mx-1" />
        
        <ToolbarButton icon={List} command="insertUnorderedList" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" />
        
        <div className="w-px h-4 bg-aquire-border mx-1" />
        
        <ToolbarButton icon={AlignLeft} command="justifyLeft" />
        <ToolbarButton icon={AlignCenter} command="justifyCenter" />
        <ToolbarButton icon={AlignRight} command="justifyRight" />
        
        <div className="w-px h-4 bg-aquire-border mx-1" />
        
        <ToolbarButton icon={LinkIcon} onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) execCommand('createLink', url);
        }} />

        <div className="w-px h-4 bg-aquire-border mx-1" />

        {/* Preset Styles */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => applyPreset('important')}
            className="px-2 py-1 text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
            title="Important: Red text + Yellow highlight"
          >
            <AlertCircle size={12} /> Important
          </button>
          <button
            type="button"
            onClick={() => applyPreset('note')}
            className="px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1"
            title="Note: Blue text"
          >
            <Info size={12} /> Note
          </button>
          <button
            type="button"
            onClick={() => applyPreset('example')}
            className="px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1"
            title="Example: Green text + Grey bg"
          >
            <Lightbulb size={12} /> Example
          </button>
          <button
            type="button"
            onClick={() => applyPreset('warning')}
            className="px-2 py-1 text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all flex items-center gap-1"
            title="Warning: Orange text"
          >
            <CheckCircle2 size={12} /> Warning
          </button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rich-editor custom-scrollbar overflow-y-auto min-h-[150px] max-h-[400px] p-6 text-aquire-black focus:outline-none"
        data-placeholder={placeholder}
      />
      {/* Live Preview Area */}
      <div className="bg-aquire-grey-light/30 p-4 border-t border-aquire-border">
        <span className="text-[10px] font-bold text-aquire-grey-med uppercase tracking-widest block mb-2">Live Preview</span>
        <div 
          className="rich-editor-content text-sm"
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-aquire-grey-med italic">No content yet...</p>' }}
        />
      </div>
    </div>
  );
}
