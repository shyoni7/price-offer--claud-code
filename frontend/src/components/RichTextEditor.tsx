import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignRight,
  AlignLeft,
  AlignCenter,
  Link as LinkIcon,
  Table as TableIcon,
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language: string;
}

export function RichTextEditor({ content, onChange, language }: RichTextEditorProps) {
  const direction = language === 'he' ? 'rtl' : 'ltr';

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        dir: direction,
        style: `font-family: ${language === 'he' ? 'Heebo, sans-serif' : 'Inter, sans-serif'}`,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'text-textSecondary'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const url = window.prompt('הזן כתובת URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="מודגש"
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="נטוי"
        >
          <Italic size={18} />
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="כותרת 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="כותרת 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="כותרת 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="רשימה"
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="רשימה ממוספרת"
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="יישור לימין"
        >
          <AlignRight size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="יישור למרכז"
        >
          <AlignCenter size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="יישור לשמאל"
        >
          <AlignLeft size={18} />
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="קישור">
          <LinkIcon size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={addTable} active={editor.isActive('table')} title="טבלה">
          <TableIcon size={18} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[500px]" />
    </div>
  );
}
