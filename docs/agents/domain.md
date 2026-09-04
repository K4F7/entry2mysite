# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or **`CONTEXT-MAP.md`** if it exists.
- **`docs/adr/`** for decisions touching the area being changed.

If these files do not exist, proceed silently. The `/domain-modeling` skill creates them lazily when needed.

## File structure

This is a single-context repo:

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use the glossary's vocabulary

Use domain terms as defined in `CONTEXT.md`; note gaps for `/domain-modeling`.

## Flag ADR conflicts

If output contradicts an ADR, surface the conflict explicitly rather than silently overriding it.
