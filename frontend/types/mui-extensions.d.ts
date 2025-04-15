/**
 * Розширення типів для бібліотеки Material UI v7
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
    // Фіктивна властивість для уникнення помилки порожнього інтерфейсу
    _dummy?: never;
  }
}

// Розширення для типографіки
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    // Фіктивна властивість для уникнення помилки порожнього інтерфейсу
    _dummy?: never;
  }
}

// Розширення для Grid у MUI v7
declare module '@mui/material/Grid' {
  import * as React from 'react';
  import { SystemProps } from '@mui/system';
  import { Theme } from '@mui/material/styles';
  import { SxProps } from '@mui/system';

  type GridDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
  type GridSpacing = number | string;
  type GridWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
  type GridSize = 'auto' | 'grow' | number;

  interface GridSizeObject {
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
  }

  interface GridProps extends SystemProps {
    children?: React.ReactNode;
    container?: boolean;
    direction?: GridDirection;
    wrap?: GridWrap;
    spacing?: GridSpacing | Record<string, GridSpacing>;
    rowSpacing?: GridSpacing | Record<string, GridSpacing>;
    columnSpacing?: GridSpacing | Record<string, GridSpacing>;
    size?: GridSize | GridSizeObject;
    offset?: GridSize | GridSizeObject | 'auto';
    sx?: SxProps<Theme>;
  }

  const Grid: React.FC<GridProps>;
  export default Grid;
}
