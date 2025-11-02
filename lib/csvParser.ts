import Papa from 'papaparse';
import { Question, QuizData } from './types';

export interface CSVParseOptions {
  onComplete?: (data: Question[]) => void;
  onError?: (error: Error) => void;
}

export async function parseCSV(filePath: string): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const questions: Question[] = results.data.map((row: any) => {
            // Clean and validate the data
            const question: Question = {
              Question_Number: String(row.Question_Number || '').trim(),
              Part: String(row.Part || '').trim(),
              Subject: String(row.Subject || '').trim(),
              Context_Passage: row.Context_Passage ? String(row.Context_Passage).trim() : undefined,
              Question_English: row.Question_English ? String(row.Question_English).trim() : undefined,
              Question_Hindi: row.Question_Hindi ? String(row.Question_Hindi).trim() : undefined,
              Option_A_English: row.Option_A_English ? String(row.Option_A_English).trim() : undefined,
              Option_A_Hindi: row.Option_A_Hindi ? String(row.Option_A_Hindi).trim() : undefined,
              Option_B_English: row.Option_B_English ? String(row.Option_B_English).trim() : undefined,
              Option_B_Hindi: row.Option_B_Hindi ? String(row.Option_B_Hindi).trim() : undefined,
              Option_C_English: row.Option_C_English ? String(row.Option_C_English).trim() : undefined,
              Option_C_Hindi: row.Option_C_Hindi ? String(row.Option_C_Hindi).trim() : undefined,
              Option_D_English: row.Option_D_English ? String(row.Option_D_English).trim() : undefined,
              Option_D_Hindi: row.Option_D_Hindi ? String(row.Option_D_Hindi).trim() : undefined,
              Correct_Option_Key: (String(row.Correct_Option_Key || '').trim().toUpperCase() || 'A') as 'A' | 'B' | 'C' | 'D',
              Explanation_Hindi: row.Explanation_Hindi ? String(row.Explanation_Hindi).trim() : undefined,
            };
            return question;
          }).filter((q: Question) => q.Question_Number); // Filter out empty rows

          resolve(questions);
        } catch (error) {
          reject(new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message || 'Unknown error'}`));
      },
    });
  });
}

export function extractPaperInfo(filename: string): { year?: string; paperNumber?: string; name: string } {
  // Extract year and paper number from filename
  // Formats: 
  // - "2021 Paper 2.csv" 
  // - "2023_Paper1.csv" 
  // - "2023-Paper1.csv" 
  // - "Paper1_2023.csv"
  // - "2023.csv" (year only)
  
  // Try: Year Paper Number (e.g., "2021 Paper 2")
  let match = filename.match(/(\d{4})\s+[Pp]aper\s+(\d+)/i);
  if (match) {
    return {
      year: match[1],
      paperNumber: match[2],
      name: filename.replace(/\.csv$/i, '').replace(/_/g, ' '),
    };
  }

  // Try: Year_PaperNumber or Year-PaperNumber
  match = filename.match(/(\d{4})[_\-\s]+[Pp]aper\s*(\d+)/i);
  if (match) {
    return {
      year: match[1],
      paperNumber: match[2],
      name: filename.replace(/\.csv$/i, '').replace(/_/g, ' '),
    };
  }

  // Try: PaperNumber_Year
  match = filename.match(/[Pp]aper\s*(\d+)[_\-\s]+(\d{4})/i);
  if (match) {
    return {
      year: match[2],
      paperNumber: match[1],
      name: filename.replace(/\.csv$/i, '').replace(/_/g, ' '),
    };
  }

  // Try: Just year
  match = filename.match(/(\d{4})/);
  if (match) {
    return {
      year: match[1],
      paperNumber: undefined,
      name: filename.replace(/\.csv$/i, '').replace(/_/g, ' '),
    };
  }

  // Fallback
  const name = filename.replace(/\.csv$/i, '').replace(/_/g, ' ');
  return {
    year: undefined,
    paperNumber: undefined,
    name,
  };
}

export function filterQuestionsByPart(questions: Question[], part: string | 'all'): Question[] {
  if (part === 'all') return questions;
  return questions.filter(q => q.Part.toLowerCase() === part.toLowerCase());
}

export async function loadQuizData(filePath: string): Promise<QuizData> {
  const questions = await parseCSV(filePath);
  const filename = filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown';
  const paperInfo = extractPaperInfo(filename);

  return {
    questions,
    paperName: paperInfo.name,
    year: paperInfo.year,
    paperNumber: paperInfo.paperNumber,
  };
}
