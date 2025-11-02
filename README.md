# Knowly / Seekhli - Bilingual Quiz App

A modern, offline-first bilingual (English + Hindi) quiz web application built with Next.js for practicing test papers from CSV files.

## Features

- 🌐 **Bilingual Support**: Full English and Hindi interface
- 📱 **Mobile-First**: Optimized for mobile devices
- 🔌 **Offline-First**: Works completely offline with PWA support
- 🎯 **Multiple Quiz Modes**:
  - Standard Mode (sequential questions)
  - Time Attack Mode (30 seconds per question)
  - Random Mode (random questions)
  - Define Count Mode (set number of random questions)
  - Review Mode (view past attempts)
- 🎨 **Customizable Themes**: Multiple color palette options
- 🔊 **Sound Effects**: Toggleable sound cues
- 📊 **Progress Tracking**: Track accuracy and performance
- ♿ **Accessible**: Keyboard navigation, ARIA labels, adjustable font sizes

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide-react
- **CSV Parsing**: PapaParse
- **State**: LocalStorage
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Knowly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## CSV File Format

Place your CSV files in `/public/assets/`. The CSV should have the following columns:

- `Question_Number` - Unique question identifier
- `Part` - Part/Section (e.g., "Part A", "Part B")
- `Subject` - Subject name
- `Context_Passage` - Optional context or passage
- `Question_English` - Question in English
- `Question_Hindi` - Question in Hindi
- `Option_A_English` through `Option_D_English` - English options
- `Option_A_Hindi` through `Option_D_Hindi` - Hindi options
- `Correct_Option_Key` - Correct answer (A, B, C, or D)
- `Explanation_Hindi` - Explanation in Hindi (shown for incorrect answers)

See `/public/assets/sample.csv` for an example.

## Project Structure

```
Knowly/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── language/          # Language selection
│   ├── select-paper/      # Paper selection
│   ├── select-mode/       # Mode selection
│   ├── quiz/              # Quiz interface
│   ├── review/            # Results & review
│   ├── settings/          # Settings page
│   └── about/             # About/Help page
├── components/             # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & types
└── public/
    └── assets/            # CSV files
```

## Usage

1. **Language Selection**: On first launch, select your preferred app language (English or Hindi)
2. **Select Paper**: Choose a paper from available CSV files
3. **Choose Part**: Select a specific part or "All Parts"
4. **Select Mode**: Choose your quiz mode and exam language
5. **Take Quiz**: Answer questions and review explanations
6. **Review Results**: View your performance and review answers

## Settings

- **Theme**: Choose from multiple color palettes
- **Sound**: Enable/disable sound effects
- **Font Size**: Adjust text size (Small, Medium, Large)
- **App Language**: Switch between English and Hindi
- **Reset Progress**: Clear all saved quiz sessions

## PWA Installation

The app is a Progressive Web App (PWA) and can be installed on mobile devices:
- On Android: Use "Add to Home Screen" from the browser menu
- On iOS: Use "Add to Home Screen" from Safari

## Development

### Adding New CSV Files

1. Add CSV files to `/public/assets/`
2. Filenames can include year and paper number (e.g., `2023_Paper1.csv`)
3. The app will automatically detect and list available papers

### Customizing Themes

Edit theme palettes in `/hooks/useTheme.ts` and add new color schemes.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and TailwindCSS