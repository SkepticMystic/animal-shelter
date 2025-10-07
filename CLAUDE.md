# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build the application
- `npm run lint` - Run ESLint and Prettier checks
- `npm run check` - Run Svelte type checking
- `npm run format` - Format code with Prettier

### Database Commands

- `npm run db:push` - Push schema changes to database (for development)
- `npm run db:generate` - Generate migrations (uses production env)
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio

### Testing

No test framework is currently configured. Always verify changes manually.

## Architecture Overview

### Tech Stack

- **Frontend**: SvelteKit 5, TypeScript, TailwindCSS 4
- **Backend**: SvelteKit server routes, Drizzle ORM, PostgreSQL (Neon), Redis
- **Auth**: Better-Auth with passkeys support
- **Deployment**: Vercel (with build command: `vite build && npm run db migrate`)
- **Images**: Cloudinary integration with thumbhash placeholders

### Project Structure

- `src/routes/` - SvelteKit pages (`+page.svelte`, `+page.server.ts`)
- `src/lib/` - Core application logic
  - `components/` - Svelte components (UI, forms, auth)
  - `server/db/schema/` - Drizzle database models (\*.model.ts)
  - `services/` - Business logic and integrations
  - `stores/` - Application state management
  - `utils/` - Shared utilities
  - `const/` - Constants (exported in UPPERCASE namespaces)
  - `schema/` - Zod validation schemas
  - `clients/` - Frontend API clients
  - `remote/` - Server-side external API integrations
- `drizzle/` - Database migrations and metadata
- `scripts/` - Build and utility scripts

### Core Domain Models

- **Organization** - Auth construct for shelter management
- **Shelter** - Public-facing shelter information (one per org)
- **Animal** - Individual animals with species, gender, status, microchip
- **AnimalEvent** - Events in an animal's lifecycle (intake, adoption, walks, etc.)
- **Image** - Cloudinary images with thumbhash support

### Key Patterns

- **snake_case** for database columns and TypeScript variables
- **Constants**: Declared in const/ files, exported in UPPERCASE namespaces with IDS arrays and MAPS for labels/icons
- **Icons**: Use iconify-tailwind (`{provider}/{name}` classes), prefer Lucide icons
- **Forms**: Use Formsnap + Superforms with Zod validation
- **Database**: Drizzle ORM with PostgreSQL, migrations in drizzle/
- **Auth**: Better-Auth with organization-based access control

### Environment Setup

1. Copy `.env.example` to `.env`
2. Set up Neon PostgreSQL database and add `DATABASE_URL`
3. Run `npm run db:push` to create tables
4. Configure other services (Cloudinary, Resend, Redis) as needed

## Important Notes

- Always run `npm run lint` and `npm run check` after making changes
- Database schema changes require migrations via `npm run db:generate`
- Images are handled through Cloudinary service with automatic thumbhash generation
- The application supports multi-tenant shelter management through organizations
- Authentication includes passkey support alongside traditional credentials

## Available MCP Tools:

### Svelte

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

#### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

#### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

#### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

#### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
