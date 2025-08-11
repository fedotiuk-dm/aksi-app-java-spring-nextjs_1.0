## Code Style Guidelines

- Imports must be placed at the top of the file, in the header section
- If anything prevents implementing this, identify and resolve the blocker
- All import statements should be consolidated at the beginning of each file

## MUI Grid Fix

**Problem:** TypeScript errors with Grid component - old API vs new API.

**Solution:** In the new version of MUI Grid:
- Instead of `item` prop - all Grid elements are automatically items
- Instead of `xs={12}` use `size={12}` or `size={{ xs: 12, sm: 6 }}`
- Import: `import { Grid } from '@mui/material'` (not Grid2!)
- Container remains `<Grid container>`

**Example:**
```typescript
// Old (not working):
<Grid item xs={12} sm={6} md={4}>

// New (correct):
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
```