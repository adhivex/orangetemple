# OrangeTemple — AI Coding Rules

## General
1. Read `CLAUDE.md` first, then the documents relevant to the task.
2. Prefer the simplest solution that satisfies the requirement.
3. Do not add a dependency without a clear reason. State the reason in the pull request or `DECISIONS.md` for anything non-trivial.
4. Do not rewrite working code unnecessarily.
5. If documents conflict or a decision is missing, stop and ask, then record the answer in `DECISIONS.md`.

## Architecture
6. Keep the application modular with clear component boundaries and a sensible folder structure.
7. Prefer reusable components; no page-specific duplication.
8. Do not hardcode temple content in UI components or create per-temple pages.
9. Never duplicate temple records for collections.
10. Keep data access in a dedicated server-side layer; components receive typed props.

## Next.js
11. Server Components by default; Client Components only for interactivity, with state kept local.
12. Preserve SEO-friendly server rendering.
13. Validate inputs (Zod) and environment variables.
14. Check the pinned Next.js version's current documentation before using caching or revalidation APIs.

## Database
15. Use Prisma and follow `DATABASE-SCHEMA.md`. Schema changes go through migrations and update the document.
16. Seed scripts are idempotent, keyed by slug.
17. Never expose credentials to the browser. Never commit secrets or real `.env` values.
18. Check the current Prisma and Neon documentation for the pinned versions before configuring connections.

## UI
19. Follow `DESIGN-SYSTEM.md`. Use tokens, not hardcoded colours.
20. Mobile-first always. One responsive implementation, never separate mobile and desktop components for the same thing.
21. Provide loading, empty, missing-image, not-found and error states for every data-driven view.
22. Respect reduced motion. Maintain contrast, focus and keyboard access.
23. Test at 360, 390 and 430 px as well as tablet and desktop. No horizontal page scrolling.

## Content
24. Treat temple content as structured data.
25. Keep documented facts and traditional legends separate.
26. Never fabricate sources, timings, URLs, coordinates or credits. Leave the field empty instead.
27. Every image has alt text, credit and licence. No AI-generated imagery of temples or deities.

## Performance
28. Optimize images, lazy-load non-critical media, and keep client JavaScript small.
29. Stay within the budgets in `ARCHITECTURE.md`.
30. No blocking third-party scripts.

## Testing
31. Add Vitest tests for pure logic and Playwright smoke tests for key flows as defined in `ARCHITECTURE.md`.
32. Include axe accessibility checks on key pages.
33. A phase is not done until its "done when" criteria in `DEVELOPMENT-PLAN.md` are met.

## Quality gates
After each meaningful milestone run typecheck, lint, tests and a production build. Fix errors you caused before continuing; do not just report them.

## Change management
For a significant architectural change: explain the reason, update the relevant documents, and add a `DECISIONS.md` entry.

## Workflow
1. Inspect the repository.
2. Read the relevant documents.
3. Identify existing patterns.
4. State the approach briefly.
5. Implement in small, reviewable commits.
6. Validate.
7. Report using the format below.

## Milestone report format
- **Completed:** what was implemented
- **Files changed:** the important files
- **Validation:** typecheck, lint, test and build results, plus what was checked visually
- **Decisions and deviations:** anything added to `DECISIONS.md` or differing from the docs
- **Next step:** the next phase, and whether a review gate applies
