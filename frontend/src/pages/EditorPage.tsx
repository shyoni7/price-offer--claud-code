import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import { DocumentForm } from '@/components/DocumentForm';
import { DocumentPreview } from '@/components/DocumentPreview';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArrowLeft, Save, FileDown, Sparkles, Eye, Edit3 } from 'lucide-react';
import type { Document, DocumentFormData } from '@/types';

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch document if editing existing
  const { data, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentsApi.getById(id!),
    enabled: !!id,
  });

  const currentDocument = data?.data.document;

  useEffect(() => {
    if (currentDocument?.editedBody || currentDocument?.generatedBody) {
      setEditedContent(
        currentDocument.editedBody || currentDocument.generatedBody || ''
      );
    }
  }, [currentDocument]);

  // Create document mutation
  const createMutation = useMutation({
    mutationFn: documentsApi.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate(`/editor/${response.data.document.id}`);
    },
  });

  // Update document mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Document> }) =>
      documentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsSaving(false);
    },
  });

  // Generate content mutation
  const generateMutation = useMutation({
    mutationFn: documentsApi.generate,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      setEditedContent(response.data.generatedContent);
      setIsEditMode(true);
    },
  });

  // Export PDF mutation
  const exportMutation = useMutation({
    mutationFn: documentsApi.exportPDF,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = window.document.createElement('a');
      anchor.href = url;
      anchor.download = `${currentDocument?.docType}-${currentDocument?.clientName || 'document'}.pdf`;
      window.document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(anchor);
    },
  });

  const handleFormSubmit = (formData: DocumentFormData) => {
    if (id && currentDocument) {
      // Update existing document fields
      updateMutation.mutate({
        id,
        data: formData,
      });
    } else {
      // Create new document
      createMutation.mutate(formData);
    }
  };

  const handleGenerate = () => {
    if (id) {
      generateMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (id) {
      setIsSaving(true);
      updateMutation.mutate({
        id,
        data: { editedBody: editedContent },
      });
    }
  };

  const handleExport = () => {
    if (id) {
      exportMutation.mutate(id);
    }
  };

  if (isLoading && id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-textSecondary">טוען מסמך...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                <span>חזרה למסמכים</span>
              </button>
              {currentDocument && (
                <div className="text-sm text-textSecondary">
                  <span className="font-medium">{currentDocument.docType}</span>
                  {currentDocument.clientName && (
                    <span> • {currentDocument.clientName}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {id && currentDocument && (
                <>
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    {isEditMode ? (
                      <>
                        <Eye size={18} />
                        <span>תצוגה מקדימה</span>
                      </>
                    ) : (
                      <>
                        <Edit3 size={18} />
                        <span>עריכה</span>
                      </>
                    )}
                  </button>

                  {!currentDocument.generatedBody && (
                    <button
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending}
                      className="btn-accent flex items-center gap-2"
                    >
                      <Sparkles size={18} />
                      <span>{generateMutation.isPending ? 'מייצר...' : 'יצירת תוכן'}</span>
                    </button>
                  )}

                  {isEditMode && (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Save size={18} />
                      <span>{isSaving ? 'שומר...' : 'שמירה'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleExport}
                    disabled={
                      exportMutation.isPending || !currentDocument.editedBody
                    }
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <FileDown size={18} />
                    <span>{exportMutation.isPending ? 'מייצא...' : 'ייצוא PDF'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-textPrimary mb-6">פרטי המסמך</h2>
            <DocumentForm
              document={currentDocument}
              onSubmit={handleFormSubmit}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>

          {/* Right Side - Preview/Editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-32 h-fit max-h-[calc(100vh-10rem)] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-textPrimary">
                {isEditMode ? 'עריכת תוכן' : 'תצוגה מקדימה'}
              </h2>
              {currentDocument?.language && (
                <span className="text-sm text-textSecondary">
                  {currentDocument.language === 'he' ? 'עברית' : 'English'}
                </span>
              )}
            </div>

            {!currentDocument && (
              <div className="text-center text-textSecondary py-12">
                <p>מלא את הפרטים בצד שמאל כדי להתחיל</p>
              </div>
            )}

            {currentDocument && !isEditMode && (
              <DocumentPreview
                content={editedContent}
                language={currentDocument.language}
              />
            )}

            {currentDocument && isEditMode && (
              <RichTextEditor
                content={editedContent}
                onChange={setEditedContent}
                language={currentDocument.language}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
