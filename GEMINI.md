# Gemini Project Context: My Link

## Project Overview
**My Link** is a web application project consisting of a Next.js profile application located in the `my-profile` directory. The project is built with modern web technologies focusing on performance and developer experience.

### Core Technologies
- **Framework:** [Next.js](https://nextjs.org/) (v16.2.1)
- **Library:** [React](https://reactjs.org/) (v19.2.4)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4.x)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Runtime:** Node.js

## Project Structure
- `/my-profile`: The main Next.js application directory.
  - `/app`: Contains the application routes, components, and layouts (App Router).
  - `/public`: Static assets like images and SVG files.
  - `package.json`: Project dependencies and scripts.
  - `tsconfig.json`: TypeScript configuration.
  - `next.config.ts`: Next.js specific configuration.

## Getting Started

### Prerequisites
- Node.js installed.
- npm, yarn, pnpm, or bun as a package manager.

### Building and Running
Navigate to the `my-profile` directory before running commands:

| Action | Command |
| :--- | :--- |
| **Install Dependencies** | `npm install` |
| **Run Development Server** | `npm run dev` |
| **Build for Production** | `npm run build` |
| **Start Production Server** | `npm run start` |
| **Linting** | `npm run lint` |

## Development Conventions
- **App Router:** Use the Next.js App Router pattern for routing and layouts.
- **Styling:** Utilize Tailwind CSS 4 for all styling needs.
- **Types:** Ensure all new components and functions are properly typed using TypeScript.
- **Icons/Images:** Use `next/image` for optimized image loading.
