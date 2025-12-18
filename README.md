# Mayson Editor

A feature-rich, browser-based JSON editor built with React and TypeScript. Provides a professional-grade editing experience with multiple view modes, advanced formatting tools, and robust state management.

## Features

### Multi-View Editing
- **Text Editor** - Full-featured code editor with syntax highlighting, code folding, line numbers, search/replace, and virtualization for large files
- **Tree Editor** - Hierarchical tree view with inline editing, expand/collapse, breadcrumb navigation, and keyboard navigation
- **Table Editor** - Spreadsheet-like view for arrays of objects with sorting, column resizing, and row operations

### Multi-Document Support
- Multiple documents open simultaneously with tab bar
- Drag-and-drop tab reordering
- Document duplication
- Dirty state tracking for unsaved changes

### JSON Tools
- Format/prettify with customizable indentation
- Compact/minify
- Sort object keys (A-Z / Z-A)
- JSON repair for malformed input
- JSONPath querying with filter expressions
- JSON Schema validation (AJV)
- JSON diff/compare with side-by-side view

### Editor Capabilities
- Syntax highlighting with custom tokenizer
- Code folding (collapse/expand regions)
- Search and replace with regex support
- Go to line
- Error indicators with hover details
- Undo/Redo with full history
- Auto-close brackets and smart indentation

### Persistence
- Session persistence using IndexedDB
- Automatic save (debounced)
- Session restore on reload
- Settings persistence in localStorage

### Customization
- Light/Dark theme (with system preference option)
- Configurable font family and size (Google Fonts support)
- Adjustable tab size, line wrapping, and other editor behaviors

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **AJV** - JSON Schema validation
- **jsonrepair** - JSON repair
- **idb-keyval** - IndexedDB persistence
- **Web Workers** - Offload heavy processing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── editor/         # Editor views (text, tree, table)
│   ├── layout/         # App shell (Header, TabBar, StatusBar)
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Core utilities
│   ├── csv/            # CSV conversion
│   ├── diff/           # JSON diff algorithms
│   ├── file/           # File open/save operations
│   ├── fonts/          # Google Fonts loader
│   ├── json/           # JSON processing (tokenizer, parser, formatter, query, repair, validator)
│   └── storage/        # IndexedDB persistence
├── store/              # State management (Context + useReducer)
├── types/              # TypeScript definitions
└── workers/            # Web Workers for heavy computation
```

## License

MIT
