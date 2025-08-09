import React from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type Props = {
  urgency: string;
  discountType: string;
  discountPct?: number;
  onUrgencyChange: (value: string) => void;
  onDiscountTypeChange: (value: string) => void;
  onDiscountPctChange: (value?: number) => void;
  onApplyGlobalModifiers: () => void | Promise<void>;
  onRecalculate: () => void | Promise<void>;
  showDetails: boolean;
  onToggleDetails: () => void;
  applying: boolean;
  recalculating: boolean;
};

export const GlobalControls: React.FC<Props> = ({
  urgency,
  discountType,
  discountPct,
  onUrgencyChange,
  onDiscountTypeChange,
  onDiscountPctChange,
  onApplyGlobalModifiers,
  onRecalculate,
  showDetails,
  onToggleDetails,
  applying,
  recalculating,
}) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ md: 'center' }}
      sx={{ mb: 2 }}
    >
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="urgency-label">Терміновість</InputLabel>
        <Select
          labelId="urgency-label"
          label="Терміновість"
          value={urgency}
          onChange={(e) => onUrgencyChange(String(e.target.value))}
        >
          <MenuItem value="NORMAL">Звичайне (0%)</MenuItem>
          <MenuItem value="EXPRESS_48H">+50% (48 год)</MenuItem>
          <MenuItem value="EXPRESS_24H">+100% (24 год)</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="discount-type-label">Знижка</InputLabel>
        <Select
          labelId="discount-type-label"
          label="Знижка"
          value={discountType}
          onChange={(e) => onDiscountTypeChange(String(e.target.value))}
        >
          <MenuItem value="NONE">Без знижки</MenuItem>
          <MenuItem value="EVERCARD">Еверкард (10%)</MenuItem>
          <MenuItem value="SOCIAL_MEDIA">Соцмережі (5%)</MenuItem>
          <MenuItem value="MILITARY">ЗСУ (10%)</MenuItem>
          <MenuItem value="OTHER">Інше (відсоток)</MenuItem>
        </Select>
      </FormControl>

      {discountType === 'OTHER' && (
        <TextField
          size="small"
          type="number"
          label="Відсоток"
          value={discountPct ?? ''}
          onChange={(e) => {
            const v =
              e.target.value === ''
                ? undefined
                : Math.max(0, Math.min(100, Number(e.target.value)));
            onDiscountPctChange(v);
          }}
          inputProps={{ min: 0, max: 100 }}
          sx={{ width: 120 }}
        />
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
        <Tooltip title="Застосувати модифікатори">
          <span>
            <IconButton color="primary" onClick={onApplyGlobalModifiers} disabled={applying}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Перерахувати кошик">
          <span>
            <IconButton onClick={onRecalculate} disabled={recalculating}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={showDetails ? 'Сховати деталізацію' : 'Показати деталізацію'}>
          <IconButton onClick={onToggleDetails}>
            {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
