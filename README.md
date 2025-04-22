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
- **Home Page**
  - Currently includes some static content in v1.0
  - Future versions will implement dynamic content loading
  - Plans to make all sections fully database-driven

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
│   │   ├── manage-projects/  # Project management
│   │   ├── projects/        # Project administration
│   │   ├── resume/         # Resume management
│   │   └── users/         # User management
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── projects/     # Project endpoints
│   │   └── resume/       # Resume endpoints
│   ├── about/           # About page
│   ├── contact/         # Contact page
│   ├── login/           # Login page
│   ├── profile/         # User profile
│   ├── projects/        # Project pages
│   └── register/        # Registration page
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── projects/       # Project-related components
│   ├── resume/         # Resume components
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
│   └── actions/       # Server actions
├── providers/         # React providers
├── public/            # Static assets
├── styles/           # Global styles
└── types/            # TypeScript type definitions
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

The database schema includes the following tables with their structures:

### Resume Profile
- Personal information including name, location, contact details
- Professional summary and title
- Social links and bio photo
- Automatic timestamp tracking

### Education
- Academic details with institution and degree
- Date ranges and location
- Optional GPA field
- Timestamp tracking

### Experience
- Professional experience entries
- Company, position, and location details
- Employment type and date ranges
- Array of description points
- Current position flag

### Projects
- Comprehensive project details
- Title, organization, and date ranges
- Technologies, skills, and tools used (as arrays)
- URLs for demo, GitHub, and images
- Slug for SEO-friendly URLs
- Featured flag for highlighting
- Creation and update timestamps

### Certifications
- Professional certifications
- Issuer and dates
- Optional expiry tracking
- Description field

### Skills
- Categorized skill sets
- Array of skills per category
- Timestamp tracking

### Volunteering
- Volunteer experience
- Organization and position details
- Date ranges and location
- Array of description points

### Users
- User authentication and profile
- Email and password (hashed)
- Role-based access control
- Name and creation tracking

### Site Settings
- Global site configuration
- Registration control flag
- Update timestamp tracking

All tables include appropriate constraints and data types optimized for PostgreSQL. See `ddl.sql` for the complete schema definition including indexes and constraints.

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

## 🗺️ Roadmap / Coming Soon

- **Dynamic Home Page**
  - Converting static content to database-driven sections
  - Customizable layout and content management
  - Real-time content updates

- **Enhanced Media Management**
  - Cloud storage integration (AWS S3 or Google Cloud Storage)
  - Image optimization and responsive delivery
  - Media library management
  - Support for multiple file types

- **Blog Platform**
  - Article publishing system
  - Rich text editor
  - Categories and tags
  - SEO optimization
  - Comments system
  - RSS feed support

These features are under development and will be included in future releases.
