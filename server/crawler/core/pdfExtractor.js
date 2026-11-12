import axios from 'axios';
import pdfParse from 'pdf-parse';
import { validateTargetUrl, stripToPlainText } from './security.js';

const MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

/**
 * Downloads a permitted PDF file and extracts clean text
 */
export async function downloadAndExtractPdfText(pdfUrl, options = {}) {
  const validatedUrl = await validateTargetUrl(pdfUrl, options.allowedDomains);

  const response = await axios.get(validatedUrl, {
    responseType: 'arraybuffer',
    timeout: 20000,
    maxContentLength: MAX_PDF_SIZE_BYTES,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) (OurVillageCrawler/1.0)'
    }
  });

  const buffer = Buffer.from(response.data);
  const pdfData = await pdfParse(buffer, {
    max: 20
  });

  return {
    numPages: pdfData.numpages,
    text: pdfData.text || '',
    info: pdfData.info || {},
    url: validatedUrl
  };
}

/**
 * Helper to parse dates in DD/MM/YYYY, DD-MM-YYYY, or standard formats
 */
function parseFlexibleDate(dateStr) {
  if (!dateStr) return null;
  const dmy = dateStr.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (dmy) {
    const day = parseInt(dmy[1], 10);
    const month = parseInt(dmy[2], 10) - 1;
    let year = parseInt(dmy[3], 10);
    if (year < 100) year += 2000;
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }
  const standard = new Date(dateStr);
  return isNaN(standard.getTime()) ? null : standard;
}

/**
 * Structured regex pattern extraction to parse government recruitment PDF text
 */
export function extractRecruitmentDetailsFromText(rawText, sourceUrl = '') {
  const text = rawText || '';
  const missingFields = [];

  // 1. Notification Number
  const notifRegex = /(?:Notification|Advt|Advertisement|Notification\s+No|Advt\.?\s*No\.?|Rc\.\s*No\.?)[\s:.-]*([A-Z0-9\/-]{3,30})/i;
  const notifMatch = text.match(notifRegex);
  const notificationNumber = notifMatch ? notifMatch[1].trim() : null;
  if (!notificationNumber) missingFields.push('notificationNumber');

  // 2. Total Vacancies
  const vacRegex = /(?:Total\s+(?:Number\s+of\s+)?Vacancies|No\.?\s+of\s+Posts|Total\s+Posts)[\s:.-]*(\d+)/i;
  const vacMatch = text.match(vacRegex);
  const totalVacancies = vacMatch ? parseInt(vacMatch[1], 10) : null;
  if (!totalVacancies) missingFields.push('totalVacancies');

  // 3. Age Limit
  const ageRegex = /(?:Age\s+Limit|Maximum\s+Age|Age)[\s:.-]*([^\n.]{5,80})/i;
  const ageMatch = text.match(ageRegex);
  const ageLimit = ageMatch ? ageMatch[1].trim() : 'Unavailable';
  if (ageLimit === 'Unavailable') missingFields.push('ageLimit');

  // 4. Application Fee
  const feeRegex = /(?:Application\s+Fee|Fee|Examination\s+Fee)[\s:.-]*([^\n.]{4,60})/i;
  const feeMatch = text.match(feeRegex);
  const applicationFee = feeMatch ? feeMatch[1].trim() : 'Unavailable';
  if (applicationFee === 'Unavailable') missingFields.push('applicationFee');

  // 5. Selection Process
  const selectRegex = /(?:Selection\s+Process|Method\s+of\s+Selection|Scheme\s+of\s+Examination)[\s:.-]*([^\n.]{6,120})/i;
  const selectMatch = text.match(selectRegex);
  const selectionProcess = selectMatch ? selectMatch[1].trim() : 'Unavailable';
  if (selectionProcess === 'Unavailable') missingFields.push('selectionProcess');

  // 6. Eligibility / Qualification
  const eligRegex = /(?:Educational\s+Qualifications?|Eligibility|Minimum\s+Qualification)[\s:.-]*([^\n.]{6,150})/i;
  const eligMatch = text.match(eligRegex);
  const eligibility = eligMatch ? eligMatch[1].trim() : 'Unavailable';
  if (!eligibility || eligibility === 'Unavailable' || eligibility.length < 5) missingFields.push('eligibility');

  // 7. Important Dates
  const lastDateRegex = /(?:Last\s+Date(?:\s+for\s+submission|\s+to\s+apply)?|Closing\s+Date)[\s:.-]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{1,2}\s+[A-Za-z]+\s+\d{4})/i;
  const lastDateMatch = text.match(lastDateRegex);
  let applicationLastDate = null;
  if (lastDateMatch) {
    applicationLastDate = parseFlexibleDate(lastDateMatch[1].trim());
  }
  if (!applicationLastDate) missingFields.push('applicationLastDate');

  return {
    notificationNumber: notificationNumber || 'Unavailable',
    totalVacancies: totalVacancies || 0,
    ageLimit,
    applicationFee,
    selectionProcess,
    eligibility: eligibility || 'Unavailable',
    importantDates: {
      notificationDate: new Date(),
      applicationStartDate: new Date(),
      applicationLastDate: applicationLastDate || null,
      examDate: 'To be announced'
    },
    missingFields,
    confidenceScore: calculateExtractionConfidence(missingFields)
  };
}

function calculateExtractionConfidence(missingFields) {
  const totalChecked = 6;
  const found = totalChecked - missingFields.length;
  return Math.round((found / totalChecked) * 100);
}
