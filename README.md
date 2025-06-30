# Personal CRM - Job Search & Professional Networking Tracker

A self-hostable Next.js application for tracking job applications, managing professional contacts, and organizing networking activities. Built with modern web technologies and designed for easy deployment with Docker.

## Features

- **Job Application Tracking**: Monitor your job applications with status updates, priority levels, and detailed information
- **Company Management**: Keep track of companies you're interested in or have applied to
- **Contact Management**: Maintain a database of professional contacts with their details and company affiliations
- **Activity Logging**: Record all interactions, interviews, meetings, and follow-ups
- **Notes & Documentation**: Store important notes, interview preparation materials, and insights
- **Dashboard Overview**: Get a quick overview of your job search progress and recent activities

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, **shadcn/ui**
- **Backend**: Next.js API routes
- **Database**: Prisma ORM with SQLite (development) or PostgreSQL (production)
- **Deployment**: Docker & Docker Compose
- **UI Components**: shadcn/ui (built on Radix UI), React Hook Form, React Hot Toast, Heroicons

## Design System & UI Components

This application follows a comprehensive design system built with **shadcn/ui** components. The design system ensures:

- **Consistency**: Unified component patterns across the application
- **Accessibility**: Built on Radix UI primitives for full a11y support  
- **Customization**: Easy theming with CSS variables and Tailwind CSS
- **Type Safety**: Full TypeScript support for all components
- **Performance**: Tree-shakable components, only import what you use

### Key Design Elements

- **Primary Colors**: Blue-based palette (#3b82f6, #2563eb, #1d4ed8)
- **Typography**: Inter font family with responsive scaling
- **Layout**: Card-based design with consistent spacing and shadows
- **Components**: Button, Card, Input, Badge, Avatar, and more

For detailed design guidelines, see [Design System Documentation](./design/DESIGN_SYSTEM.md).

### Available shadcn/ui Components

Current components integrated:
- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Consistent container styling
- `Input`, `Label`, `Textarea` - Form elements
- `Select` - Dropdown selection
- `Badge` - Status and priority indicators  
- `Avatar` - Profile images with fallbacks
- `Form` - Form validation and handling

To add new components:
```bash
npx shadcn@latest add [component-name]
```

## Database Options

This application supports both SQLite and PostgreSQL:
- **SQLite**: Perfect for development and small-scale deployments
- **PostgreSQL**: Recommended for production use with multiple users

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration. For development, the default SQLite setup works out of the box.

4. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

#### Option 1: SQLite (Simple Setup)

```bash
docker-compose up personal-crm-sqlite
```

The application will be available at [http://localhost:3000](http://localhost:3000)

#### Option 2: PostgreSQL (Production Setup)

```bash
docker-compose up personal-crm-postgres postgres
```

The application will be available at [http://localhost:3001](http://localhost:3001)

## Environment Variables

### Required Variables

- `DATABASE_PROVIDER`: Either "sqlite" or "postgresql"
- `DATABASE_URL`: Connection string for your database
- `NEXTAUTH_SECRET`: Secret key for authentication (generate a random string)
- `NEXTAUTH_URL`: URL where your application is hosted

### Example Configurations

#### SQLite (Development)
```env
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

#### PostgreSQL (Production)
```env
DATABASE_PROVIDER="postgresql"
DATABASE_URL="postgresql://username:password@localhost:5432/personal_crm"
NEXTAUTH_SECRET="your-production-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"
```

## Database Management

### Migration Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and apply migrations (production)
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Database Schema

The application includes the following main entities:

- **Users**: Application users
- **Companies**: Organizations you're tracking
- **Contacts**: Professional contacts within companies
- **JobApplications**: Your job applications with detailed tracking
- **Activities**: All interactions and events
- **Notes**: Personal notes and documentation

## Project Structure

```
personal-crm/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── applications/    # Job applications pages
│   │   ├── companies/       # Companies pages
│   │   ├── contacts/        # Contacts pages
│   │   ├── activities/      # Activities pages
│   │   └── notes/           # Notes pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions and configurations
│   ├── types/               # TypeScript type definitions
│   └── hooks/               # Custom React hooks
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.js              # Database seeding script
├── docker-compose.yml       # Docker composition
├── Dockerfile               # Docker configuration
└── README.md
```

## Folder Structure

```
personal-crm/
├── design/                     # Design documentation and assets
│   ├── DESIGN_SYSTEM.md       # Complete design system documentation
│   ├── README.md              # Design folder overview
│   ├── user-flows/            # User flow documentation
│   │   └── README.md          # User flows guide and templates
│   └── reference-images/      # Design references and mockups
│       ├── components/        # Component design references
│       ├── pages/            # Page layout references
│       ├── mobile/           # Mobile-specific designs
│       ├── wireframes/       # Low-fidelity wireframes
│       ├── mockups/          # High-fidelity mockups
│       └── README.md         # Reference images guide
├── src/                       # Application source code
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── ...                       # Other project files
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema to database
- `npm run db:migrate`: Run database migrations
- `npm run db:studio`: Open Prisma Studio
- `npm run db:seed`: Seed database with sample data

## Customization

### Themes and Styling

The application uses Tailwind CSS for styling. You can customize the theme by editing:
- `tailwind.config.js`: Tailwind configuration
- `src/app/globals.css`: Global styles and custom CSS classes

### Database Schema

To modify the database schema:
1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:push` (development) or `npm run db:migrate` (production)

## Production Deployment

### Using Docker

1. **Build the Docker image**
   ```bash
   docker build -t personal-crm .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d personal-crm-postgres postgres
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up your production database**
   
3. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

4. **Start the production server**
   ```bash
   npm start
   ```

## Security Considerations

- Change the default `NEXTAUTH_SECRET` in production
- Use strong database passwords
- Enable HTTPS in production
- Regularly update dependencies
- Consider implementing rate limiting for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include your environment details and error messages

## Roadmap

Future enhancements planned:
- User authentication and multi-user support
- Email integration for automatic activity tracking
- Calendar integration for interview scheduling
- Advanced reporting and analytics
- Mobile app companion
- API endpoints for third-party integrations
- Export functionality (PDF reports, CSV data)
- Automated follow-up reminders
