# GENZLAB 🇳🇬

Tiny AI tools for real-life Nigerian problems.

**Money. Hustle. Dating. Content. Life. One problem at a time.**

## MVP tools

1. **What Do I Say?** — paste message + vibe → 3 Nigerian Gen-Z replies
2. **What Should I Charge?** — pricing estimate + negotiation + ready message
3. **What Can I Hustle?** — 5 realistic income experiments (no scams)

## Stack

- Next.js App Router + TypeScript + Tailwind
- Gemini (`GEMINI_API_KEY`) server-side with structured mock fallback
- localStorage history + thin `track()` analytics stub
- No auth, no payments (yet)

## Local

```bash
cp .env.example .env.local   # add GEMINI_API_KEY
npm install
npm run dev
```

## Deploy (Render)

- Runtime: Node
- Build: `npm install && npm run build`
- Start: `npm start`
- Env: `GEMINI_API_KEY`

## Architecture

Each tool is a module under `src/tools/<name>` (config, mock, prompts) + API route + UI component. Add a new tool by copying that pattern and registering it in `src/lib/tools.ts`.
