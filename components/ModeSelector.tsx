'use client';

import { motion } from 'framer-motion';
import { Clock, Shuffle, List, Target, BookOpen } from 'lucide-react';
import { QuizMode } from '@/lib/types';
import { useSettings } from '@/hooks/useSettings';

interface ModeSelectorProps {
  selectedMode: QuizMode | null;
  onSelect: (mode: QuizMode) => void;
}

const modes: {
  id: QuizMode;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
}[] = [
  {
    id: 'standard',
    icon: List,
    name: 'Standard Mode',
    nameHindi: 'स्टैंडर्ड मोड',
    description: 'All questions sequentially',
    descriptionHindi: 'सभी प्रश्न क्रमिक रूप से',
  },
  {
    id: 'time-attack',
    icon: Clock,
    name: 'Time Attack',
    nameHindi: 'टाइम अटैक',
    description: '30 seconds per question',
    descriptionHindi: 'प्रति प्रश्न 30 सेकंड',
  },
  {
    id: 'random',
    icon: Shuffle,
    name: 'Random Mode',
    nameHindi: 'रैंडम मोड',
    description: 'Random question each time',
    descriptionHindi: 'हर बार एक यादृच्छिक प्रश्न',
  },
  {
    id: 'define-count',
    icon: Target,
    name: 'Define Count',
    nameHindi: 'गिनती निर्धारित करें',
    description: 'Set number of questions',
    descriptionHindi: 'प्रश्नों की संख्या निर्धारित करें',
  },
  {
    id: 'review',
    icon: BookOpen,
    name: 'Review Mode',
    nameHindi: 'रिव्यू मोड',
    description: 'View past attempts',
    descriptionHindi: 'पिछले प्रयास देखें',
  },
];

export function ModeSelector({ selectedMode, onSelect }: ModeSelectorProps) {
  const { settings } = useSettings();

  const getText = (english: string, hindi: string) => {
    return settings.appLanguage === 'hindi' ? hindi : english;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;

        return (
          <motion.button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              isSelected
                ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10'
                : 'border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  isSelected
                    ? 'bg-[var(--theme-primary)]/20'
                    : 'bg-[var(--theme-surface-hover)]'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isSelected
                      ? 'text-[var(--theme-primary)]'
                      : 'text-[var(--theme-text-muted)]'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold mb-1 ${
                    isSelected
                      ? 'text-[var(--theme-primary)]'
                      : 'text-[var(--theme-text)]'
                  }`}
                >
                  {getText(mode.name, mode.nameHindi)}
                </h3>
                <p className="text-sm text-[var(--theme-text-muted)]">
                  {getText(mode.description, mode.descriptionHindi)}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
