# Repository Guidelines

## Project Structure & Module Organization
The app follows Next.js App Router conventions inside `src`. Routes and API handlers live in `src/app`, Claude automation logic is under `src/agents`, shared UI and presentation widgets live in `src/components` (see `slides`, `renderer`, `workspace`, `intake`), and shared utilities/types are collected in `src/lib`. Styling primitives are located in `src/styles`, static assets belong in `public`, and Jest suites mirror the runtime folders under `__tests__` to keep UI and library coverage close to their sources.

## Build, Test, and Development Commands
Use `npm install` once, then `npm run dev` to launch the local server on port 3000. `npm run build` performs the production Next.js build, and `npm run start` serves the compiled output. Configure Claude access with `.env.local` containing `ANTHROPIC_API_KEY=sk-ant-…` before running any command, otherwise slide generation requests will fail. Run `npx jest` (or `npx jest --watch`) to execute the unit suites defined in `jest.config.ts`.

## Coding Style & Naming Conventions
Author features in TypeScript with strict null checks enabled via `tsconfig.json`. Components, hooks, and stores use PascalCase file names (`SlideRenderer.tsx`), utilities favor camelCase exports, and test files mirror the source path with `.test.ts`/`.test.tsx` suffixes. Prefer functional React components, Tailwind CSS v4 tokens, and `clsx` for conditional classes. Keep Anthropic agent metadata in `src/agents` small, composable modules instead of monoliths.

## Testing Guidelines
Jest with `@testing-library/react` and `@testing-library/jest-dom` powers component tests; keep DOM assertions declarative and avoid implementation detail queries. Place new suites in `__tests__/<area>/` with the same directory layout as `src`. Aim for smoke coverage of every new slide component and any bespoke logic inside `src/lib`. When adding data transformers, include schema edge cases and snapshot representative slide JSON for regression safety.

## Commit & Pull Request Guidelines
Follow the existing Conventional Commits style seen in history (`feat:`, `docs:`, `chore:`). Group related changes per commit, keep messages imperative, and mention issue IDs when relevant. PRs should include a crisp summary, testing evidence (`npx jest`, manual checks), screenshots or screen recordings for UI shifts, and explicit callouts for API key or configuration changes.

## Security & Configuration Tips
This project intentionally ships without authentication; never deploy publicly without adding auth around Anthropic endpoints. Keep `.env.local` out of version control, rotate keys after demos, and redact sample outputs in screenshots. Review `README.md` before merging to ensure its warning block stays accurate whenever backend behavior changes.
