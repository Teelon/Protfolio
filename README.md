# Data Analytics Portfolio

A modern, full-stack portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL. Features authentication, admin dashboard, project management, and responsive design.

## 🚀 Features

- **Authentication & Authorization**

  - Email/password authentication
  - Role-based access control (user/admin)
  - Protected admin routes
  - Secure session management
- **Project Management**

  - CRUD operations for projects
  - Rich project details including technologies, skills, and tools
  - Featured projects showcase
  - Slug-based routing
- **Admin Dashboard**

  - User management
  - Project management
  - Resume builder
  - Site settings control
- **UI/UX**

  - Responsive design
  - Dark/light theme support
  - Modern UI components
  - Mobile-friendly navigation

## 🛠️ Tech Stack

- **Frontend**

  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons
- **Backend**

  - Next.js API Routes
  - NextAuth.js with Neon Adapter
  - Neon Serverless PostgreSQL
    - Serverless WebSocket connections
    - Edge-ready database access
    - Connection pooling support
  - Server Actions
  - Type-safe database queries
- **Infrastructure**

  - Neon (Serverless Postgres)
  - NextAuth.js Adapter
  - Vercel (recommended for deployment)

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- pnpm package manager

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd portfolio
   ```
2. Install dependencies with legacy peer deps (required for some packages):

   ```bash
   npm install --legacy-peer-deps
   ```
3. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```
4. Set up your environment variables in `.env`:

   ```
   DATABASE_URL=your_neon_database_url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret
   ```
5. Run the database migrations from `ddl.sql` in your database.
6. Important: Make sure to set up the site_settings table:

   ```sql
   INSERT INTO site_settings (allow_registration) VALUES (true);
   ```

   This is required to enable user registration on the site.
7. Start the development server:

   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
├── app/                   # Next.js 14 app directory
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   └── projects/         # Project pages
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── projects/        # Project-related components
│   └── ui/              # UI components
├── lib/                 # Utility functions
├── public/              # Static assets
└── types/              # TypeScript type definitions
```

## 🔒 Authentication

The application uses NextAuth.js with a custom credentials provider. Users can:

- Register with email/password
- Log in with existing credentials
- Access role-protected routes (admin/user)

## 👥 User Roles

- **User**: Can view projects and manage their profile
- **Admin**: Full access to admin dashboard, user management, and project management

## 🗄️ Database Schema

See `ddl.sql` in the root directory for the complete database structure. Key tables:

- users
- projects
- site_settings
- sessions
- accounts

## Database Configuration

### Neon Setup

1. Create a Neon account and project at https://neon.tech
2. Get your connection string from the Neon dashboard
3. The project uses two main database configurations:
   - `@neondatabase/serverless` for direct database access
   - `@auth/neon-adapter` for NextAuth.js integration

### Connection Types

The project uses two types of database connections:

1. **Pooled Connection** (for auth):

   ```typescript
   const pool = new Pool({ connectionString: process.env.DATABASE_URL })
   ```
2. **Direct Connection** (for serverless functions):

   ```typescript
   const sql = neon(process.env.DATABASE_URL)
   ```

### Performance Optimizations

- Connection caching is enabled via `neonConfig.fetchConnectionCache = true`
- WebSocket connections are used for better performance
- SSL configuration is automatically handled

## 🚀 Deployment

1. Set up a Neon database
2. Configure environment variables
3. Deploy to Vercel (recommended) or your preferred platform
4. Run database migrations

## 🧪 Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm type-check
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is MIT licensed.
