export interface DocumentFields {
  docType: string;
  language: string;
  templateId: string;
  clientName?: string;
  clientContactPerson?: string;
  clientContactPhone?: string;
  subject?: string;
  priceAmount?: number;
  priceCurrency: string;
  vatPercent: number;
  showPrice: boolean;
  userPrompt?: string;
  sender?: string;
}

export interface DocumentCreateInput extends DocumentFields {
  createdBy: string;
}

export interface DocumentUpdateInput {
  editedBody?: string;
  status?: 'DRAFT' | 'LOCKED' | 'EXPORTED';
  fields?: Partial<DocumentFields>;
}

export interface GenerateDocumentInput {
  docType: string;
  language: string;
  clientName?: string;
  clientContactPerson?: string;
  subject?: string;
  priceAmount?: number;
  showPrice: boolean;
  userPrompt?: string;
}

export interface AIPromptTemplate {
  docType: string;
  language: string;
  title?: string;
  clientName?: string;
  clientContactPerson?: string;
  priceAmount?: number;
  priceWithVAT?: number;
  showPrice: boolean;
  userPrompt?: string;
}
