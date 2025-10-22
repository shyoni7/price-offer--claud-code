import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { documentsApi } from '@/lib/api';
import { Plus, FileText, Calendar, User } from 'lucide-react';
import type { Document } from '@/types';

export function DocumentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getAll,
  });

  const documents = data?.data.documents || [];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: 'טיוטה',
      LOCKED: 'נעול',
      EXPORTED: 'יוצא',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      LOCKED: 'bg-red-100 text-red-800',
      EXPORTED: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-textSecondary">טוען מסמכים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">שגיאה בטעינת מסמכים</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">המסמכים שלי</h1>
          <p className="text-textSecondary mt-2">ניהול וצפייה במסמכים</p>
        </div>
        <Link to="/editor" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>מסמך חדש</span>
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="mx-auto text-textSecondary mb-4" size={48} />
          <h3 className="text-xl font-medium text-textPrimary mb-2">אין מסמכים עדיין</h3>
          <p className="text-textSecondary mb-6">צור את המסמך הראשון שלך</p>
          <Link to="/editor" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            <span>יצירת מסמך חדש</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: Document) => (
            <Link
              key={doc.id}
              to={`/editor/${doc.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary" size={24} />
                  <h3 className="font-semibold text-textPrimary text-lg">{doc.docType}</h3>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {getStatusLabel(doc.status)}
                </span>
              </div>

              {doc.subject && (
                <p className="text-textSecondary text-sm mb-3 line-clamp-2">{doc.subject}</p>
              )}

              {doc.clientName && (
                <div className="flex items-center gap-2 text-textSecondary text-sm mb-2">
                  <User size={16} />
                  <span>{doc.clientName}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-textSecondary text-xs mt-4 pt-4 border-t border-gray-100">
                <Calendar size={14} />
                <span>{new Date(doc.updatedAt).toLocaleDateString('he-IL')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
