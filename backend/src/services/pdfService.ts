import puppeteer from 'puppeteer';

interface DocumentData {
  docType: string;
  language: string;
  templateId: string;
  clientName?: string | null;
  subject?: string | null;
  editedBody?: string | null;
  generatedBody?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generate PDF from document content using Puppeteer
 */
export async function generatePDF(document: DocumentData): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Get the document content (prefer edited over generated)
    const content = document.editedBody || document.generatedBody || '<p>No content available</p>';

    // Build the complete HTML with styling and branding
    const html = buildDocumentHTML(document, content);

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF with proper RTL support
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      displayHeaderFooter: true,
      headerTemplate: buildHeaderTemplate(document),
      footerTemplate: buildFooterTemplate(document)
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

function buildDocumentHTML(document: DocumentData, content: string): string {
  const isRTL = document.language === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';

  return `
    <!DOCTYPE html>
    <html lang="${document.language}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${document.docType} - ${document.clientName || 'Document'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&family=Inter:wght@300;400;500;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: ${isRTL ? "'Heebo', sans-serif" : "'Inter', sans-serif"};
          direction: ${direction};
          color: #1F2937;
          line-height: 1.6;
          background: #FFFFFF;
        }

        .document-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          color: #06B6D4;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
          border-bottom: 3px solid #FF2F87;
          padding-bottom: 10px;
        }

        h2 {
          color: #06B6D4;
          font-size: 24px;
          font-weight: 600;
          margin-top: 30px;
          margin-bottom: 15px;
        }

        h3 {
          color: #1F2937;
          font-size: 20px;
          font-weight: 500;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        p {
          margin-bottom: 15px;
          color: #1F2937;
        }

        ul, ol {
          margin-bottom: 15px;
          padding-${isRTL ? 'right' : 'left'}: 30px;
        }

        li {
          margin-bottom: 8px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        th, td {
          padding: 12px;
          text-align: ${isRTL ? 'right' : 'left'};
          border-bottom: 1px solid #E5E7EB;
        }

        th {
          background-color: #F3F4F6;
          font-weight: 600;
          color: #1F2937;
        }

        strong {
          color: #06B6D4;
          font-weight: 600;
        }

        .logo {
          color: #06B6D4;
          font-size: 24px;
          font-weight: 700;
        }

        .accent {
          color: #FF2F87;
        }
      </style>
    </head>
    <body>
      <div class="document-container">
        ${content}
      </div>
    </body>
    </html>
  `;
}

function buildHeaderTemplate(document: DocumentData): string {
  const isRTL = document.language === 'he';

  return `
    <div style="width: 100%; font-size: 10px; padding: 10px 20px; color: #6B7280; border-bottom: 1px solid #E5E7EB; direction: ${isRTL ? 'rtl' : 'ltr'}; font-family: ${isRTL ? 'Heebo' : 'Inter'}, sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #06B6D4; font-weight: bold; font-size: 14px;">ORTAM AI</span>
        <span>${document.docType}</span>
        <span>${new Date().toLocaleDateString(isRTL ? 'he-IL' : 'en-US')}</span>
      </div>
    </div>
  `;
}

function buildFooterTemplate(document: DocumentData): string {
  const isRTL = document.language === 'he';
  const companyInfo = isRTL
    ? 'ORTAM AI | info@ortam.ai | www.ortam.ai'
    : 'ORTAM AI | info@ortam.ai | www.ortam.ai';

  return `
    <div style="width: 100%; font-size: 9px; padding: 10px 20px; color: #6B7280; border-top: 1px solid #E5E7EB; direction: ${isRTL ? 'rtl' : 'ltr'}; font-family: ${isRTL ? 'Heebo' : 'Inter'}, sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${companyInfo}</span>
        <span>${isRTL ? 'עמוד' : 'Page'} <span class="pageNumber"></span> ${isRTL ? 'מתוך' : 'of'} <span class="totalPages"></span></span>
      </div>
    </div>
  `;
}
