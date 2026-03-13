# Compliance Web Application

This project is a modern web application built with [Next.js 16](https://nextjs.org/) and [React 19](https://react.dev/), designed for compliance management. It utilizes a robust stack including TypeScript, Tailwind CSS, and shadcn/ui for the frontend, with PostgreSQL for data persistence and `better-auth` for authentication.

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- Yarn package manager
- PostgreSQL database

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd compliance-web
    ```

2.  Install dependencies:

    ```bash
    yarn install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and configure the necessary variables (e.g., `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`). You can copy `.env.example` to `.env.local`:
    
    ```bash
    cp .env.example .env.local
    ```

4.  Configure Database:
    Ensure your PostgreSQL database is running and credentials are set in your `.env.local` file.

5.  (Optional) Seed the database with initial user data:
    ```bash
    yarn db:seed
    ```
    This will create a test account you can use to log in:
    - **Email:** `test@dstax.com`
    - **Password:** `123456`

6.  Run the development server:
    ```bash
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

The following scripts are available in `package.json`:

| Command           | Description                                                                         |
| :---------------- | :---------------------------------------------------------------------------------- |
| `yarn dev`        | Starts the development server with hot reloading.                                   |
| `yarn build`      | Builds the application for production.                                              |
| `yarn start`      | Starts the production server (requires `yarn build` first).                         |
| `yarn lint`       | Runs ESLint to identify and report on patterns found in ECMAScript/JavaScript code. |
| `yarn format`     | Formats the codebase using Prettier.                                                |
| `yarn type-check` | Runs TypeScript type checking without emitting files.                               |
| `yarn prepare`    | Sets up Husky for git hooks.                                                        |
| `yarn migrate`    | Runs database migrations using `better-auth`.                                       |
| `yarn db:seed`    | Seeds the database with initial user data using `src/scripts/seed-user.ts`.         |

## Project Structure

The project follows the Next.js App Router structure:

```
/
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── (public)/        # Route group for public pages
│   │   ├── api/             # API routes
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   └── ...              # Feature-specific components
│   ├── lib/                 # Utility functions and shared libraries
│   │   ├── auth/            # Authentication configuration (better-auth)
│   │   └── ...              # Other utilities
│   ├── scripts/             # Scripts for tasks like database seeding
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets (images, fonts, etc.)
├── ...                      # Configuration files
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4, shadcn/ui
- **State Management:** Zustand
- **Form Handling:** React Hook Form, Zod
- **Authentication:** better-auth
- **Database:** PostgreSQL (`pg` driver)
- **Linting & Formatting:** ESLint, Prettier, Husky, Lint-staged

## Configuration

Key configuration files include:

- `next.config.ts`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.
- `components.json`: shadcn/ui configuration.
- `eslint.config.mjs`: ESLint configuration.
- `.prettierrc`: Prettier configuration.

## Development Workflow

1.  **Code Style:** The project enforces code style using Prettier and ESLint. Husky is configured to run these checks on pre-commit via lint-staged.
2.  **Type Safety:** TypeScript is strictly enforced. Run `yarn type-check` to verify type integrity.
3.  **Database:** Ensure your local PostgreSQL instance is running and the `DATABASE_URL` is correctly set in your environment variables before running migrations or seeding the database.
