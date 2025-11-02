# Character Management System
A high-performance React table application built to handle 1000+ rows with advanced filtering, sorting, search, and selection capabilities.

### Functionality
- **Row Selection**: Select individual rows or all rows with checkboxes
- **Advanced Filtering**: Filter by health status (Healthy, Injured, Critical) with multi-select support
- **Real-time Search**: Search characters by name or location instantly
- **Sorting**: Sort by power level (ascending/descending/unsorted)
- **View Management**: Mark rows as viewed/unviewed with console logging
- **Loading States**: Displays loader during data fetch

### Technical Features
- **Virtualization**: Uses TanStack Virtual for optimal rendering performance
- **Type Safety**: Fully typed with TypeScript
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Responsive Design**: Mobile-friendly layout
- **Clean Architecture**: Separation of concerns with reusable components
- **Comprehensive Tests**: Jest/Vitest tests with user interaction simulation

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **TanStack Table** - Powerful table logic
- **TanStack Virtual** - Row virtualization for performance
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Vite** - Build tool
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## 📦 Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🧪 Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# View test coverage
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn UI components
│   ├── CharacterTable.tsx  # Main table component
│   └── HealthFilter.tsx    # Health filter dropdown
├── data/
│   └── mockData.ts      # Mock data generation
├── lib/
│   ├── utils.ts         # Utility functions
│   └── tableUtils.ts    # Table-specific utilities
├── types/
│   └── character.ts     # TypeScript type definitions
├── test/
│   ├── setup.ts         # Test configuration
│   └── CharacterTable.test.tsx  # Table tests
└── pages/
    └── Index.tsx        # Main page
```

## 🎯 Key Implementation Details

### Performance Optimization

The table handles 1000+ rows efficiently through:
1. **Row Virtualization**: Only renders visible rows using `@tanstack/react-virtual`
2. **Memoization**: Uses `useMemo` for expensive computations (filtering, sorting)
3. **Callback Optimization**: Uses `useCallback` to prevent unnecessary re-renders
4. **Efficient State Management**: Optimized state updates and batching

### Data Flow

```
Mock Data (1000 entries)
    ↓
Filter by Health Status (if applied)
    ↓
Filter by Search Query (if applied)
    ↓
Sort by Power (if applied)
    ↓
Virtual Rendering (only visible rows)
```

### Selection Logic

- Selection state is maintained using TanStack Table's row selection
- Selected IDs are extracted from the filtered/sorted data
- Works correctly even when filters are applied
- Console logs selected IDs when marking as viewed/unviewed

## 🎨 Design System

The application uses a semantic design system with:
- HSL color tokens for consistency
- Table-specific color tokens for headers, rows, and borders
- Health status colors (green for Healthy, orange for Injured, red for Critical)
- Responsive typography and spacing
- Accessible contrast ratios

## ♿ Accessibility Features

- Semantic HTML elements (`<table>`, `<thead>`, `<tbody>`)
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Proper role attributes

## 📊 Data Schema

```typescript
interface Character {
  id: string;           // Unique identifier
  name: string;         // Character name
  location: Location;   // "Konoha" | "Suna" | "Kiri" | "Iwa" | "Kumo"
  health: HealthStatus; // "Healthy" | "Injured" | "Critical"
  power: number;        // Range: 100-10,000
}
```

## 🧪 Testing

The test suite covers:
- Table rendering with data
- Search functionality (by name and location)
- Filtering accuracy
- Row selection (single and multiple)
- Select all functionality
- Mark as viewed/unviewed actions
- Button state management
- Console logging verification
- Filtered data character count


## 🎓 Code Quality

The codebase follows:
- **TypeScript Best Practices**: Strict typing, interfaces, type guards
- **React Best Practices**: Hooks, composition, prop drilling avoidance
- **Clean Code Principles**: Single responsibility, DRY, meaningful names
- **Accessibility Standards**: WCAG 2.1 Level AA compliance
- **Performance Patterns**: Memoization, virtualization, lazy loading

