import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { templatesApi, sendersApi } from '@/lib/api';
import type { Document, DocumentFormData } from '@/types';
import { DOCUMENT_TYPES, LANGUAGES, TEMPLATES } from '@/types';

interface DocumentFormProps {
  document?: Document;
  onSubmit: (data: DocumentFormData) => void;
  isLoading?: boolean;
}

export function DocumentForm({ document, onSubmit, isLoading }: DocumentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DocumentFormData>({
    defaultValues: {
      docType: document?.docType || 'הצעת מחיר',
      language: document?.language || 'he',
      templateId: document?.templateId || 'A',
      clientName: document?.clientName || '',
      clientContactPerson: document?.clientContactPerson || '',
      clientContactPhone: document?.clientContactPhone || '',
      subject: document?.subject || '',
      priceAmount: document?.priceAmount || undefined,
      showPrice: document?.showPrice ?? true,
      userPrompt: document?.userPrompt || '',
      sender: document?.sender || '',
    },
  });

  // Watch for changes
  const showPrice = watch('showPrice');
  const priceAmount = watch('priceAmount');
  const language = watch('language');

  // Calculate VAT
  const priceWithVAT = priceAmount ? priceAmount * 1.18 : 0;

  // Fetch senders
  const { data: sendersData } = useQuery({
    queryKey: ['senders'],
    queryFn: sendersApi.getAll,
  });

  const senders = sendersData?.data.senders || [];

  // Auto-save on blur or after typing stops
  useEffect(() => {
    if (document) {
      const subscription = watch(() => {
        // Debounce auto-save would go here
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, document]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Document Type */}
      <div>
        <label className="label">סוג המסמך *</label>
        <select {...register('docType', { required: true })} className="input-field">
          {DOCUMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="label">שפת המסמך *</label>
        <select {...register('language')} className="input-field">
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Template */}
      <div>
        <label className="label">תבנית עיצוב *</label>
        <select {...register('templateId')} className="input-field">
          {TEMPLATES.map((template) => (
            <option key={template.value} value={template.value}>
              {template.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-textPrimary mb-4">פרטי הלקוח</h3>

        {/* Client Name */}
        <div className="mb-4">
          <label className="label">שם הלקוח</label>
          <input
            type="text"
            {...register('clientName')}
            className="input-field"
            placeholder="לדוגמה: חברת טכנולוגיות בע״מ"
          />
        </div>

        {/* Contact Person */}
        <div className="mb-4">
          <label className="label">איש קשר אצל הלקוח</label>
          <input
            type="text"
            {...register('clientContactPerson')}
            className="input-field"
            placeholder="שם מלא"
          />
        </div>

        {/* Contact Phone */}
        <div className="mb-4">
          <label className="label">טלפון איש קשר</label>
          <input
            type="tel"
            {...register('clientContactPhone')}
            className="input-field"
            placeholder="050-1234567"
            dir="ltr"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="label">נושא או תחום</label>
          <input
            type="text"
            {...register('subject')}
            className="input-field"
            placeholder="לדוגמה: פיתוח מערכת AI"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-textPrimary mb-4">תמחור</h3>

        {/* Show Price Checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('showPrice')} className="rounded" />
            <span className="text-sm text-textPrimary">להציג מחיר במסמך</span>
          </label>
        </div>

        {/* Price Amount */}
        {showPrice && (
          <>
            <div className="mb-4">
              <label className="label">מחיר לפני מע״מ (₪)</label>
              <input
                type="number"
                step="0.01"
                {...register('priceAmount', { valueAsNumber: true })}
                className="input-field"
                placeholder="10000"
                dir="ltr"
              />
            </div>

            {/* Calculated Price with VAT */}
            {priceAmount && priceAmount > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-textSecondary">מחיר לפני מע״מ:</span>
                  <span className="font-medium text-textPrimary">
                    ₪{priceAmount.toLocaleString('he-IL')}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-textSecondary">מע״מ (18%):</span>
                  <span className="font-medium text-textPrimary">
                    ₪{(priceWithVAT - priceAmount).toLocaleString('he-IL')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                  <span className="text-sm font-semibold text-primary">סה״כ לתשלום:</span>
                  <span className="text-lg font-bold text-primary">
                    ₪{priceWithVAT.toLocaleString('he-IL')}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sender */}
      <div className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <label className="label">מי שולח את המסמך</label>
          <select {...register('sender')} className="input-field">
            <option value="">בחר שולח</option>
            {senders.map((sender) => (
              <option key={sender.id} value={sender.name}>
                {sender.name}
                {sender.title && ` - ${sender.title}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User Prompt */}
      <div className="border-t border-gray-200 pt-6">
        <div>
          <label className="label">הנחיות מיוחדות ליצירת המסמך</label>
          <textarea
            {...register('userPrompt')}
            className="input-field min-h-[120px]"
            placeholder="הוסף הנחיות מפורטות כיצד ליצור את תוכן המסמך..."
          />
          <p className="mt-2 text-xs text-textSecondary">
            למשל: &quot;דגש על יתרונות המוצר, הוסף סעיף על תמיכה טכנית, סגנון כתיבה
            פורמלי&quot;
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'שומר...' : document ? 'עדכון פרטים' : 'יצירת מסמך'}
        </button>
      </div>
    </form>
  );
}
