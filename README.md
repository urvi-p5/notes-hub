# Notes Hub 📝

A stunning, modern, fully-animated notes management application with a beautiful frontend, robust backend, and real PostgreSQL persistence.

## ✨ Features

- **Beautiful, Modern UI**: Sleek design with gradient backgrounds and smooth animations
- **Fully Animated**: Framer Motion animations for every interaction
- **Full CRUD Operations**: Create, read, update, delete notes with ease
- **Real Persistence**: PostgreSQL database for reliable data storage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Type-Safe**: Full TypeScript implementation across frontend and backend
- **Form Validation**: Client-side and server-side validation with Zod
- **State Management**: Zustand for efficient client-side state
- **Production Ready**: Clean architecture with proper error handling

## 🏗️ Architecture

### Frontend Stack

- **React 18** with TypeScript (strict mode)
- **Vite** for fast development and bundling
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **Axios** for API communication
- **Zod** for schema validation
- **Lucide React** for beautiful icons

### Backend Stack

- **Node.js** with TypeScript
- **Express.js** for HTTP API
- **PostgreSQL** for data persistence
- **Zod** for request validation

### Database

- **PostgreSQL** with automatic schema initialization
- UUID primary keys for robust identification
- Timestamps for audit tracking

## 📁 Project Structure

```
code/
├── client/                      # React Frontend
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx          # Custom button with animations
│   │   ├── Input.tsx           # Input field with validation feedback
│   │   ├── Modal.tsx           # Reusable modal dialog
│   │   ├── NoteCard.tsx        # Animated note card component
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   └── Sidebar.tsx         # Mobile sidebar menu
│   ├── pages/                  # Route components
│   │   ├── dashboard/          # Main dashboard (list notes)
│   │   └── notes/
│   │       ├── create.tsx      # Create note page
│   │       ├── edit.tsx        # Edit note page
│   │       └── view.tsx        # View note details
│   ├── services/               # API communication
│   │   └── notes.api.ts        # REST API client
│   ├── store/                  # Zustand state management
│   │   └── notes.store.ts      # Notes store
│   ├── schemas/                # Zod validation schemas
│   │   └── note.schema.ts      # Note schemas
│   ├── types/                  # TypeScript types
│   │   └── note.types.ts       # Note interfaces
│   ├── utils/                  # Utility functions
│   │   └── axios.ts            # Axios instance config
│   ├── App.tsx                 # Main app component with routing
│   └── global.css              # Global styles and animations
│
├── server/                      # Express Backend
│   ├── index.ts                # Server setup and middleware
│   ├── db.ts                   # PostgreSQL client and initialization
│   ├── types/
│   │   └── note.types.ts       # Backend types
│   ├── services/
│   │   └── notes.service.ts    # Business logic
│   └── routes/
│       └── notes.ts            # REST API endpoints
│
├── .env                        # Environment variables
├── .env.example                # Example environment file
├── tailwind.config.ts          # Tailwind CSS configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **PostgreSQL** 12+ running locally or accessible via network

### Installation

1. **Clone or download the project**

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up PostgreSQL**

   Create a PostgreSQL database and user:

   ```sql
   CREATE USER postgres WITH PASSWORD 'postgres';
   CREATE DATABASE notes_hub OWNER postgres;
   GRANT ALL PRIVILEGES ON DATABASE notes_hub TO postgres;
   ```

4. **Configure environment variables**

   Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=notes_hub

   # API Configuration
   VITE_API_BASE_URL=http://localhost:8080

   # Server Configuration
   PING_MESSAGE=pong
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:8080`

## 📚 API Endpoints

All API endpoints are prefixed with `/api` and return JSON responses.

### Notes Endpoints

#### Get All Notes

```
GET /api/notes
Response: { success: boolean, data: Note[] }
```

#### Get Single Note

```
GET /api/notes/:id
Response: { success: boolean, data: Note }
```

#### Create Note

```
POST /api/notes
Body: { title: string, content: string }
Response: { success: boolean, data: Note }
```

#### Update Note

```
PUT /api/notes/:id
Body: { title?: string, content?: string }
Response: { success: boolean, data: Note }
```

#### Delete Note

```
DELETE /api/notes/:id
Response: { success: boolean }
```

### Response Format

All responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 🗄️ Database Schema

### notes table

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**

- `idx_notes_created_at` - For sorting by creation date
- `idx_notes_updated_at` - For sorting by update date

## 🎨 UI Components

### Button

Custom animated button with multiple variants and sizes.

```typescript
<Button variant="primary" size="lg" isLoading={false}>
  Create Note
</Button>
```

**Variants:** primary, secondary, danger, outline  
**Sizes:** sm, md, lg

### Input

Input field with label, error display, and validation feedback.

```typescript
<Input
  label="Note Title"
  name="title"
  error={errors.title}
  placeholder="Enter title..."
/>
```

### Modal

Reusable modal dialog with backdrop.

```typescript
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
>
  Are you sure?
</Modal>
```

### NoteCard

Animated card displaying note preview with action buttons.

### Navbar

Sticky navigation bar with logo and menu items.

### Sidebar

Responsive sidebar for mobile navigation.

## 🔐 Form Validation

Client-side validation using Zod:

```typescript
CreateNoteSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(5).max(5000),
});
```

Server-side validation ensures data integrity.

## 🧪 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Format code
pnpm format.fix

# Run tests (if configured)
pnpm test
```

### Build Output

- **Frontend**: `dist/spa/` - Vite SPA build
- **Server**: `dist/server/` - Express server build

## 📦 Production Deployment

### Build

```bash
pnpm build
```

### Deploy Backend

```bash
# Start production server
pnpm start
```

The application will be available at the configured port.

### Environment Variables for Production

Update `.env` with production credentials:

- Secure PostgreSQL credentials
- Production API base URL
- Any other production settings

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running and credentials in `.env` are correct.

### Failed to load notes

**Solution:** Check the browser console (F12) and server logs for detailed errors.

### CORS Issues

The server is configured with CORS enabled for development. For production, update CORS settings in `server/index.ts`.

## 📖 Code Examples

### Creating a Note

```typescript
import { notesApi } from "@/services/notes.api";
import { useNotesStore } from "@/store/notes.store";

const { addNote } = useNotesStore();

const note = await notesApi.createNote({
  title: "My Note",
  content: "Content here",
});

addNote(note);
```

### Fetching Notes

```typescript
import { notesApi } from "@/services/notes.api";

const notes = await notesApi.fetchNotes();
```

### State Management

```typescript
import { useNotesStore } from "@/store/notes.store";

const { notes, loading, error, setLoading } = useNotesStore();
```

## 🎯 Key Features Explained

### Animations

- Framer Motion handles all UI animations
- Smooth page transitions
- Hover effects on cards and buttons
- Loading spinners
- Modal slide-in animations

### State Management

Zustand provides:

- Centralized notes state
- Loading and error states
- Action methods for CRUD operations
- Minimal boilerplate

### Type Safety

- Full TypeScript strict mode
- Shared types between frontend and backend
- Zod runtime validation
- Type-safe API responses

### Error Handling

- Try-catch blocks in API calls
- User-friendly error messages
- Retry mechanisms for failed operations
- Validation error feedback

## 📝 License

This project is built as a complete starter template.

## 🤝 Contributing

Suggestions and improvements are welcome!

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
