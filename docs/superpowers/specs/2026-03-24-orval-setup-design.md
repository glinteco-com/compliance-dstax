# Orval Setup — React Query + Zod Code Generation

## Overview

Set up Orval to auto-generate React Query hooks, API functions, and Zod validation schemas from the backend OpenAPI spec. This replaces all hand-written API functions, React Query hooks, and TypeScript interfaces with generated code.

## Input

- **OpenAPI spec URL:** `http://100.81.155.97:8000/api/schema/`
- Fetched live on each generation run

## Orval Configuration

Single `orval.config.ts` at project root with one named target (`compliance`):

### React Query Client Output

- **Target:** `src/api/generated/`
- **Client:** `react-query`
- **Mode:** `tags-split` (one directory per API tag)
- **Mutator:** `src/api/mutator/custom-instance.ts` — adapter that delegates to the existing `src/api/api-client.ts` Axios instance (auth tokens, base URL, error interceptors)

### Zod Schema Output

- **Target:** `src/models/`
- **Client:** `zod`
- Generated Zod schemas validate API responses at runtime
- TypeScript types inferred via `z.infer<>`

### Post-Generation

- `afterAllFilesWrite: 'prettier --write'` to match project formatting (no semicolons, single quotes, trailing commas)

## Custom Mutator

File: `src/api/mutator/custom-instance.ts`

- Accepts Axios config (URL, method, params, data) from generated code
- Passes through existing `apiClient` instance
- Returns unwrapped response data (`response.data`)
- Exports `ErrorType` as `AxiosError` for typed error handling in generated hooks

## File Structure After Generation

```
src/
  api/
    api-client.ts              # Kept — existing Axios instance
    mutator/
      custom-instance.ts       # New — Orval mutator adapter
    generated/                 # New — Orval output (committed to git)
      {tag}/
        {tag}.ts               # useQuery/useMutation hooks + fetch functions
  models/                      # New — Zod schemas + inferred types
    {schema}.ts
```

## Files to Remove

After generation and import migration:

- `src/api/clients-api.ts` — replaced by generated hooks
- `src/api/support-tickets-api.ts` — replaced by generated hooks
- `src/api/master-data-api.ts` — replaced by generated hooks
- `src/types/api.ts` — `PaginatedResponse<T>` replaced by generated models
- Feature-specific hook files in `src/app/(auth)/{feature}/hooks/` that wrap React Query

## Package.json Scripts

- `"api:generate": "orval"` — regenerate from spec
- `"api:generate:watch": "orval --watch"` — watch mode during development

## Dependencies

- `orval` (devDependency)
- `@tanstack/react-query`, `axios`, `zod` already installed

## Decision: Commit Generated Code

Generated code is committed to git so that:

- CI builds don't depend on backend reachability
- Code review catches unexpected API changes
- No extra build step needed for deployment
