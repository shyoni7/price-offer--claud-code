interface DocumentPreviewProps {
  content: string;
  language: string;
}

export function DocumentPreview({ content, language }: DocumentPreviewProps) {
  const direction = language === 'he' ? 'rtl' : 'ltr';

  return (
    <div
      dir={direction}
      className="prose max-w-none"
      style={{
        fontFamily: language === 'he' ? 'Heebo, sans-serif' : 'Inter, sans-serif',
      }}
    >
      {content ? (
        <div
          className="document-preview"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="text-center text-textSecondary py-12">
          <p>לחץ על &quot;יצירת תוכן&quot; כדי ליצור את המסמך</p>
        </div>
      )}
    </div>
  );
}
