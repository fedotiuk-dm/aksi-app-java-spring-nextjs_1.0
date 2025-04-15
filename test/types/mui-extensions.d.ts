/**
 * Розширення типів для бібліотеки Material UI
 */

// Розширення для палітри кольорів
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customColors?: {
      dryClean: string;
      washing: string;
      laundry: string;
      cleaning: string;
      ironing: string;
      urgentBadge: string;
    };
  }

  interface PaletteOptions {
    customColors?: {
      dryClean: string;
      washing: string;
      laundry: string;
      cleaning: string;
      ironing: string;
      urgentBadge: string;
    };
  }

  // Можна додати додаткові кольори, розміри чи інші налаштування теми по мірі необхідності
}

// Розширення для компонентів
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    // Тут можна додати нові кольори для кнопок за потреби
  }
}

// Розширення для типографіки
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    // Тут можна додати нові варіанти типографіки за потреби
  }
}

declare module '@mui/material/Grid' {
  import * as React from 'react';
  import { SystemProps } from '@mui/system';
  import { Theme } from '@mui/material/styles';
  import { SxProps } from '@mui/system';

  type GridDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
  type GridSpacing = number | string;
  type GridWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
  type GridSize = 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  interface GridProps extends SystemProps {
    children?: React.ReactNode;
    container?: boolean;
    direction?: GridDirection;
    wrap?: GridWrap;
    spacing?: GridSpacing | Record<string, GridSpacing>;
    rowSpacing?: GridSpacing | Record<string, GridSpacing>;
    columnSpacing?: GridSpacing | Record<string, GridSpacing>;
    xs?: GridSize | boolean;
    sm?: GridSize | boolean;
    md?: GridSize | boolean;
    lg?: GridSize | boolean;
    xl?: GridSize | boolean;
    sx?: SxProps<Theme>;
  }

  const Grid: React.FC<GridProps>;
  export default Grid;
}
