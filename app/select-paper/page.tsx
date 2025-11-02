'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { useSettings } from '@/hooks/useSettings';
import { extractPaperInfo, parseCSV } from '@/lib/csvParser';

const translations = {
  english: {
    title: 'Select Paper',
    selectYear: 'Select Year',
    selectPaperNumber: 'Select Paper',
    loading: 'Loading papers...',
    allParts: 'All Parts',
    selectPart: 'Select Part',
    continue: 'Continue',
    back: 'Back',
    noPapers: 'No papers found',
    paper: 'Paper',
    year: 'Year',
  },
  hindi: {
    title: 'पेपर चुनें',
    selectYear: 'वर्ष चुनें',
    selectPaperNumber: 'पेपर चुनें',
    loading: 'पेपर लोड हो रहे हैं...',
    allParts: 'सभी भाग',
    selectPart: 'भाग चुनें',
    continue: 'जारी रखें',
    back: 'वापस',
    noPapers: 'कोई पेपर नहीं मिला',
    paper: 'पेपर',
    year: 'वर्ष',
  },
};

interface PaperInfo {
  filename: string;
  path: string;
  name: string;
  year?: string;
  paperNumber?: string;
}

export default function SelectPaperPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [papers, setPapers] = useState<PaperInfo[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperInfo | null>(null);
  const [availableParts, setAvailableParts] = useState<Array<{ part: string; subjects: string[] }>>([]);
  const [selectedPart, setSelectedPart] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingParts, setIsLoadingParts] = useState(false);

  const t = translations[settings.appLanguage];

  useEffect(() => {
    // Load available CSV files
    const loadPapers = async () => {
      setIsLoading(true);
      try {
        // List of available papers - dynamically list from assets folder
        // In production, this would fetch from an API endpoint
        const paperFiles = [
          'sample.csv',
          '2021 Paper 2.csv',
        ];

        const paperInfos: PaperInfo[] = paperFiles.map(filename => {
          const info = extractPaperInfo(filename);
          return {
            filename,
            path: `/assets/${filename}`,
            name: info.name,
            year: info.year,
            paperNumber: info.paperNumber,
          };
        });

        setPapers(paperInfos);
      } catch (error) {
        console.error('Failed to load papers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPapers();
  }, []);

  // Group papers by year
  const papersByYear = papers.reduce((acc, paper) => {
    const year = paper.year || 'Other';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(paper);
    return acc;
  }, {} as Record<string, PaperInfo[]>);

  const availableYears = Object.keys(papersByYear).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return b.localeCompare(a); // Sort descending
  });

  // Get papers for selected year
  const papersForYear = selectedYear ? papersByYear[selectedYear] || [] : [];

  useEffect(() => {
    // When paper is selected, parse CSV to extract parts and subjects
    if (selectedPaper) {
      setIsLoadingParts(true);
      parseCSV(selectedPaper.path)
        .then(questions => {
          // Extract unique Part and Subject combinations
          const partSubjectMap = new Map<string, Set<string>>();
          
          questions.forEach(q => {
            if (q.Part && q.Subject) {
              if (!partSubjectMap.has(q.Part)) {
                partSubjectMap.set(q.Part, new Set());
              }
              partSubjectMap.get(q.Part)!.add(q.Subject);
            }
          });
          
          // Convert to array format
          const partsWithSubjects: Array<{ part: string; subjects: string[] }> = [];
          partSubjectMap.forEach((subjects, part) => {
            partsWithSubjects.push({
              part,
              subjects: Array.from(subjects).sort()
            });
          });
          
          // Sort by part name
          partsWithSubjects.sort((a, b) => a.part.localeCompare(b.part));
          
          setAvailableParts(partsWithSubjects);
          setSelectedPart('all');
        })
        .catch(error => {
          console.error('Failed to parse CSV:', error);
          setAvailableParts([]);
        })
        .finally(() => {
          setIsLoadingParts(false);
        });
    }
  }, [selectedPaper]);

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedPaper(null);
    setSelectedPart('all');
  };

  const handlePaperSelect = (paper: PaperInfo) => {
    setSelectedPaper(paper);
    setSelectedPart('all');
  };

  const handleBackFromPaper = () => {
    setSelectedPaper(null);
  };

  const handleBackFromYear = () => {
    setSelectedYear(null);
    setSelectedPaper(null);
  };

  const handleContinue = () => {
    if (selectedPaper) {
      // Store selection and navigate to mode selection
      sessionStorage.setItem('selectedPaper', JSON.stringify({
        path: selectedPaper.path,
        name: selectedPaper.name,
        part: selectedPart,
      }));
      router.push('/select-mode');
    }
  };

  if (isLoading) {
    return (
      <AnimatedPageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--theme-primary)] mx-auto mb-4" />
            <p className="text-[var(--theme-text-muted)] font-hindi">{t.loading}</p>
          </div>
        </div>
      </AnimatedPageWrapper>
    );
  }

  if (selectedPaper) {
    return (
      <AnimatedPageWrapper>
        <div className="min-h-screen p-6 bg-[var(--theme-bg)]">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleBackFromPaper}
              className="mb-6 flex items-center gap-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-hindi">{t.back}</span>
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-6 mb-6"
            >
              <h2 className="text-2xl font-bold mb-2 text-[var(--theme-text)] font-hindi">
                {selectedPaper.name}
              </h2>
              {selectedPaper.year && (
                <p className="text-[var(--theme-text-muted)]">
                  {settings.appLanguage === 'hindi' ? 'वर्ष' : 'Year'}: {selectedPaper.year}
                </p>
              )}
            </motion.div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--theme-text)] font-hindi">
                {t.selectPart}
              </h3>
              {isLoadingParts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-primary)] mr-3" />
                  <p className="text-[var(--theme-text-muted)] font-hindi">{t.loading}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPart('all')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPart === 'all'
                        ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]'
                        : 'border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)]'
                    } font-hindi`}
                  >
                    {t.allParts}
                  </button>
                  {availableParts.map((partData) => (
                    <button
                      key={partData.part}
                      onClick={() => setSelectedPart(partData.part)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPart === partData.part
                          ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]'
                          : 'border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text)]'
                      } font-hindi`}
                    >
                      <div className="font-semibold">{partData.part}</div>
                      <div className="text-sm text-[var(--theme-text-muted)] mt-1">
                        {settings.appLanguage === 'hindi' ? 'विषय' : 'Subject'}: {partData.subjects.join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <motion.button
              onClick={handleContinue}
              disabled={!selectedPaper}
              className="w-full p-4 rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed font-hindi"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.continue}
            </motion.button>
          </div>
        </div>
      </AnimatedPageWrapper>
    );
  }

  // Step 2: Paper Selection (after year is selected)
  if (selectedYear) {
    return (
      <AnimatedPageWrapper>
        <div className="min-h-screen p-6 bg-[var(--theme-bg)]">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleBackFromYear}
              className="mb-6 flex items-center gap-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-hindi">{t.back}</span>
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl p-6 mb-6"
            >
              <h2 className="text-2xl font-bold mb-2 text-[var(--theme-text)] font-hindi">
                {t.year}: {selectedYear}
              </h2>
            </motion.div>

            <h1 className="text-2xl font-bold mb-6 text-[var(--theme-text)] font-hindi">
              {t.selectPaperNumber}
            </h1>

            {papersForYear.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--theme-text-muted)] font-hindi">{t.noPapers}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {papersForYear.map((paper, index) => (
                  <motion.button
                    key={paper.filename}
                    onClick={() => handlePaperSelect(paper)}
                    className="w-full p-6 rounded-2xl border-2 border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-left transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-[var(--theme-primary)]/20">
                        <FileText className="w-6 h-6 text-[var(--theme-primary)]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-[var(--theme-text)] font-hindi">
                          {paper.paperNumber ? `${t.paper} ${paper.paperNumber}` : paper.name}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimatedPageWrapper>
    );
  }

  // Step 1: Year Selection
  return (
    <AnimatedPageWrapper>
      <div className="min-h-screen p-6 bg-[var(--theme-bg)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-hindi">{t.back}</span>
          </button>

          <h1 className="text-3xl font-bold mb-8 text-[var(--theme-text)] font-hindi">
            {t.selectYear}
          </h1>

          {availableYears.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--theme-text-muted)] font-hindi">{t.noPapers}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableYears.map((year, index) => (
                <motion.button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className="w-full p-6 rounded-2xl border-2 border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] text-left transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--theme-primary)]/20">
                      <FileText className="w-6 h-6 text-[var(--theme-primary)]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-[var(--theme-text)] font-hindi">
                        {year}
                      </div>
                      <div className="text-sm text-[var(--theme-text-muted)]">
                        {papersByYear[year].length} {papersByYear[year].length === 1 ? 'Paper' : 'Papers'}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}
