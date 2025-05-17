import React from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import {
  ItemDefectsFormValues,
  DefectType,
  Defect,
  getDefectTypeLabel,
} from '@/features/order-wizard/model/schema/item-defects.schema';

interface DefectsSelectProps {
  control: Control<ItemDefectsFormValues>;
  defects: Defect[];
  onAddDefect: (defectType: DefectType, description?: string) => void;
  onUpdateDefect?: (index: number, defect: Defect) => void;
  onRemoveDefect: (index: number) => void;
  isLoading?: boolean;
}

/**
 * Компонент для вибору дефектів та ризиків предмета
 */
export const DefectsSelect: React.FC<DefectsSelectProps> = ({
  control,
  defects,
  onAddDefect,
  onRemoveDefect,
  isLoading = false,
}) => {
  const [selectedDefectType, setSelectedDefectType] = React.useState<
    DefectType | ''
  >('');
  const [noGuaranteeReason, setNoGuaranteeReason] = React.useState('');

  const handleAddDefect = () => {
    if (selectedDefectType) {
      onAddDefect(
        selectedDefectType as DefectType,
        selectedDefectType === DefectType.NO_GUARANTEE
          ? noGuaranteeReason
          : undefined
      );
      setSelectedDefectType('');
      setNoGuaranteeReason('');
    }
  };

  const handleDefectTypeChange = (event: SelectChangeEvent) => {
    setSelectedDefectType(event.target.value as DefectType);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoGuaranteeReason(event.target.value);
  };

  // Фільтруємо типи дефектів, які вже додані, крім "NO_GUARANTEE"
  const availableDefectTypes = Object.values(DefectType).filter((type) => {
    if (type === DefectType.NO_GUARANTEE)
      return !defects.some((defect) => defect.type === type);
    return !defects.some((defect) => defect.type === type);
  });

  const renderDefectsList = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Завантаження даних...
          </Typography>
        </Box>
      );
    }

    if (defects.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            my: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
        >
          <InfoIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Дефекти не вказані. Додайте, якщо вони є на предметі.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {defects.map((defect, index) => (
          <Chip
            key={`${defect.type}-${index}`}
            label={
              defect.type === DefectType.NO_GUARANTEE
                ? `${getDefectTypeLabel(defect.type)}: ${defect.description}`
                : getDefectTypeLabel(defect.type)
            }
            onDelete={() => onRemoveDefect(index)}
            deleteIcon={<CloseIcon />}
            color="error"
            variant="outlined"
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="defects"
          control={control}
          render={({ fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Вибір типу дефекту */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Select
                    value={selectedDefectType}
                    onChange={handleDefectTypeChange}
                    displayEmpty
                    fullWidth
                    sx={{ flexGrow: 1 }}
                    disabled={isLoading}
                  >
                    <MenuItem value="" disabled>
                      Виберіть тип дефекту або ризику
                    </MenuItem>
                    {availableDefectTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {getDefectTypeLabel(type)}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddDefect}
                    disabled={
                      !selectedDefectType ||
                      (selectedDefectType === DefectType.NO_GUARANTEE &&
                        !noGuaranteeReason) ||
                      isLoading
                    }
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <AddIcon />
                      )
                    }
                  >
                    Додати
                  </Button>
                </Box>

                {/* Поле для пояснення "Без гарантій" */}
                {selectedDefectType === DefectType.NO_GUARANTEE && (
                  <TextField
                    fullWidth
                    label="Обов'язкове пояснення"
                    required
                    value={noGuaranteeReason}
                    onChange={handleReasonChange}
                    helperText="Вкажіть причину, чому неможливо гарантувати результат"
                    error={
                      selectedDefectType === DefectType.NO_GUARANTEE &&
                      !noGuaranteeReason
                    }
                    disabled={isLoading}
                  />
                )}

                {/* Відображення вибраних дефектів */}
                {renderDefectsList()}

                {error && <FormHelperText>{error.message}</FormHelperText>}
              </Box>
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};
