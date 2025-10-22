import { GenerateDocumentInput } from '../types';

/**
 * Generate document content using AI
 * This is a placeholder implementation that can be replaced with actual AI integration
 * (OpenAI, Anthropic, or other LLM providers)
 */
export async function generateDocumentContent(input: GenerateDocumentInput): Promise<string> {
  const {
    docType,
    language,
    clientName,
    clientContactPerson,
    subject,
    priceAmount,
    showPrice,
    userPrompt
  } = input;

  // Calculate price with VAT
  const priceWithVAT = priceAmount ? priceAmount * 1.18 : null;

  // Build the AI prompt based on the template from spec
  const aiPrompt = buildPrompt({
    docType,
    language,
    clientName,
    clientContactPerson,
    subject,
    priceAmount,
    priceWithVAT,
    showPrice,
    userPrompt
  });

  // TODO: Replace with actual AI API call
  // For MVP, we'll generate a structured template
  // In production, you would call OpenAI, Anthropic, or your preferred LLM

  /*
  // Example OpenAI integration:
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: aiPrompt }],
    temperature: 0.7,
  });
  return completion.choices[0].message.content || '';
  */

  // For now, return a template-based document
  return generateTemplateDocument(input);
}

function buildPrompt(data: {
  docType: string;
  language: string;
  clientName?: string | null;
  clientContactPerson?: string | null;
  subject?: string | null;
  priceAmount?: number | null;
  priceWithVAT?: number | null;
  showPrice: boolean;
  userPrompt?: string | null;
}): string {
  return `אתה כותב תוכן עסקי מקצועי עבור חברת ORTAM AI.

סוג מסמך: ${data.docType}
שפה: ${data.language}
${data.subject ? `כותרת: ${data.subject}` : ''}
${data.clientName ? `שם לקוח: ${data.clientName}` : ''}
${data.clientContactPerson ? `איש קשר: ${data.clientContactPerson}` : ''}
${data.showPrice && data.priceAmount ? `מחיר לפני מע״מ: ₪${data.priceAmount.toLocaleString('he-IL')}` : ''}
${data.showPrice && data.priceWithVAT ? `מחיר כולל מע״מ: ₪${data.priceWithVAT.toLocaleString('he-IL')}` : ''}

${data.userPrompt ? `הנחיות מיוחדות: ${data.userPrompt}` : ''}

הפק טיוטה עניינית עם כותרות משנה ורשימות נקודות בשפה מקצועית.`;
}

function generateTemplateDocument(input: GenerateDocumentInput): string {
  const { docType, language, clientName, clientContactPerson, subject, priceAmount, showPrice, userPrompt } = input;

  const isHebrew = language === 'he';
  const priceWithVAT = priceAmount ? priceAmount * 1.18 : null;

  const templates: Record<string, (lang: string) => string> = {
    'הצעת מחיר': (lang) => lang === 'he' ? `
      <div dir="rtl">
        <h1>הצעת מחיר</h1>
        <p><strong>תאריך:</strong> ${new Date().toLocaleDateString('he-IL')}</p>
        ${clientName ? `<p><strong>לכבוד:</strong> ${clientName}</p>` : ''}
        ${clientContactPerson ? `<p><strong>איש קשר:</strong> ${clientContactPerson}</p>` : ''}

        <h2>שלום רב,</h2>
        <p>להלן הצעת המחיר עבור ${subject || 'השירותים המבוקשים'}:</p>

        <h3>פירוט השירות</h3>
        <ul>
          <li>ייעוץ ותכנון אסטרטגי</li>
          <li>פיתוח ויישום פתרון מותאם אישית</li>
          <li>ליווי והדרכה</li>
          <li>תמיכה שוטפת</li>
        </ul>

        ${showPrice && priceAmount ? `
        <h3>תמחור</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #ccc;">
            <td style="padding: 10px;"><strong>פירוט</strong></td>
            <td style="padding: 10px; text-align: left;"><strong>סכום</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px;">מחיר לפני מע״מ</td>
            <td style="padding: 10px; text-align: left;">₪${priceAmount.toLocaleString('he-IL')}</td>
          </tr>
          <tr>
            <td style="padding: 10px;">מע״מ (18%)</td>
            <td style="padding: 10px; text-align: left;">₪${((priceWithVAT || 0) - priceAmount).toLocaleString('he-IL')}</td>
          </tr>
          <tr style="border-top: 2px solid #000; font-weight: bold;">
            <td style="padding: 10px;">סה״כ לתשלום</td>
            <td style="padding: 10px; text-align: left;">₪${priceWithVAT?.toLocaleString('he-IL')}</td>
          </tr>
        </table>
        ` : ''}

        ${userPrompt ? `<h3>פרטים נוספים</h3><p>${userPrompt}</p>` : ''}

        <h3>תנאי תשלום</h3>
        <p>התשלום יבוצע לפי הסכמה.</p>

        <h3>תוקף ההצעה</h3>
        <p>הצעה זו בתוקף ל-30 יום מתאריך הנפקתה.</p>

        <p>נשמח לעמוד לשירותכם,</p>
        <p><strong>צוות ORTAM AI</strong></p>
      </div>
    ` : `
      <div dir="ltr">
        <h1>Price Quotation</h1>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
        ${clientName ? `<p><strong>To:</strong> ${clientName}</p>` : ''}
        ${clientContactPerson ? `<p><strong>Contact Person:</strong> ${clientContactPerson}</p>` : ''}

        <h2>Dear Sir/Madam,</h2>
        <p>Please find below our quotation for ${subject || 'the requested services'}:</p>

        <h3>Service Details</h3>
        <ul>
          <li>Strategic consulting and planning</li>
          <li>Custom solution development and implementation</li>
          <li>Training and guidance</li>
          <li>Ongoing support</li>
        </ul>

        ${showPrice && priceAmount ? `
        <h3>Pricing</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #ccc;">
            <td style="padding: 10px;"><strong>Description</strong></td>
            <td style="padding: 10px; text-align: right;"><strong>Amount</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px;">Price before VAT</td>
            <td style="padding: 10px; text-align: right;">₪${priceAmount.toLocaleString('en-US')}</td>
          </tr>
          <tr>
            <td style="padding: 10px;">VAT (18%)</td>
            <td style="padding: 10px; text-align: right;">₪${((priceWithVAT || 0) - priceAmount).toLocaleString('en-US')}</td>
          </tr>
          <tr style="border-top: 2px solid #000; font-weight: bold;">
            <td style="padding: 10px;">Total</td>
            <td style="padding: 10px; text-align: right;">₪${priceWithVAT?.toLocaleString('en-US')}</td>
          </tr>
        </table>
        ` : ''}

        ${userPrompt ? `<h3>Additional Details</h3><p>${userPrompt}</p>` : ''}

        <p>We look forward to working with you,</p>
        <p><strong>ORTAM AI Team</strong></p>
      </div>
    `,

    'הסכם משווק': (lang) => lang === 'he' ? `
      <div dir="rtl">
        <h1>הסכם שיווק</h1>
        <p><strong>תאריך:</strong> ${new Date().toLocaleDateString('he-IL')}</p>
        ${clientName ? `<p><strong>שם המשווק:</strong> ${clientName}</p>` : ''}

        <h2>הגדרות</h2>
        <p>הסכם זה מגדיר את תנאי שיתוף הפעולה בין ORTAM AI לבין המשווק.</p>

        <h2>תחומי אחריות</h2>
        <ul>
          <li>קידום וקידום מכירות של מוצרי ושירותי החברה</li>
          <li>יצירת קשרים עם לקוחות פוטנציאליים</li>
          <li>דיווח שוטף על פעילות השיווק</li>
        </ul>

        ${userPrompt ? `<h3>תנאים מיוחדים</h3><p>${userPrompt}</p>` : ''}

        <p><strong>צוות ORTAM AI</strong></p>
      </div>
    ` : '',

    'מכתב רשמי': (lang) => lang === 'he' ? `
      <div dir="rtl">
        <h1>מכתב רשמי</h1>
        <p><strong>תאריך:</strong> ${new Date().toLocaleDateString('he-IL')}</p>
        ${clientName ? `<p><strong>לכבוד:</strong> ${clientName}</p>` : ''}
        ${clientContactPerson ? `<p><strong>איש קשר:</strong> ${clientContactPerson}</p>` : ''}

        <h2>שלום רב,</h2>
        <p>${subject || 'בהתייחס לנושא שבכותרת'}</p>

        ${userPrompt ? `<p>${userPrompt}</p>` : ''}

        <p>בכבוד רב,</p>
        <p><strong>צוות ORTAM AI</strong></p>
      </div>
    ` : ''
  };

  const templateFn = templates[docType];
  if (templateFn) {
    return templateFn(language);
  }

  // Default template
  return isHebrew ? `
    <div dir="rtl">
      <h1>${docType}</h1>
      <p><strong>תאריך:</strong> ${new Date().toLocaleDateString('he-IL')}</p>
      ${clientName ? `<p><strong>לכבוד:</strong> ${clientName}</p>` : ''}
      ${subject ? `<h2>${subject}</h2>` : ''}
      ${userPrompt ? `<p>${userPrompt}</p>` : '<p>תוכן המסמך יופק כאן.</p>'}
      <p><strong>צוות ORTAM AI</strong></p>
    </div>
  ` : `
    <div dir="ltr">
      <h1>${docType}</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
      ${clientName ? `<p><strong>To:</strong> ${clientName}</p>` : ''}
      ${subject ? `<h2>${subject}</h2>` : ''}
      ${userPrompt ? `<p>${userPrompt}</p>` : '<p>Document content will be generated here.</p>'}
      <p><strong>ORTAM AI Team</strong></p>
    </div>
  `;
}
