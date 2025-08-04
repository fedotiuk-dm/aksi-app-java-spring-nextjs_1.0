## Code Style Guidelines

- Imports must be placed at the top of the file, in the header section
- If anything prevents implementing this, identify and resolve the blocker
- All import statements should be consolidated at the beginning of each file

## MUI Grid Fix

**Проблема:** TypeScript помилки з Grid component - старий API vs новий API.

**Рішення:** В новій версії MUI Grid:
- Замість `item` prop - всі Grid елементи автоматично items
- Замість `xs={12}` використовувати `size={12}` або `size={{ xs: 12, sm: 6 }}`
- Імпорт: `import { Grid } from '@mui/material'` (не Grid2!)
- Container залишається `<Grid container>`

**Приклад:**
```typescript
// Старий (не працює):
<Grid item xs={12} sm={6} md={4}>

// Новий (правильний):
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
```