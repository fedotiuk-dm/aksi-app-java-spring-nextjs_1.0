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
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { 
  ItemDefectsFormValues, 
  StainType, 
  Stain,
  getStainTypeLabel
} from '@/features/order-wizard/model/schema/item-defects.schema';

interface StainsSelectProps {
  control: Control<ItemDefectsFormValues>;
  stains: Stain[];
  onAddStain: (stainType: StainType, description?: string) => void;
  onUpdateStain?: (index: number, stain: Stain) => void;
  onRemoveStain: (index: number) => void;
}

/**
 * Компонент для вибору плям на предметі
 */
export const StainsSelect: React.FC<StainsSelectProps> = ({ 
  control, 
  stains, 
  onAddStain, 
  onRemoveStain 
}) => {
  const [selectedStainType, setSelectedStainType] = React.useState<StainType | ''>('');
  const [otherStainDescription, setOtherStainDescription] = React.useState('');

  const handleAddStain = () => {
    if (selectedStainType) {
      onAddStain(
        selectedStainType as StainType, 
        selectedStainType === StainType.OTHER ? otherStainDescription : undefined
      );
      setSelectedStainType('');
      setOtherStainDescription('');
    }
  };

  const handleStainTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStainType(event.target.value as StainType);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherStainDescription(event.target.value);
  };
  
  // Фільтруємо типи плям, які вже додані, крім типу "OTHER"
  const availableStainTypes = Object.values(StainType).filter(type => {
    if (type === StainType.OTHER) return true;
    return !stains.some(stain => stain.type === type);
  });

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="stains"
          control={control}
          render={({ fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Вибір типу плями */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Select
                    value={selectedStainType}
                    onChange={handleStainTypeChange as any}
                    displayEmpty
                    fullWidth
                    sx={{ flexGrow: 1 }}
                  >
                    <MenuItem value="" disabled>
                      Виберіть тип плями
                    </MenuItem>
                    {availableStainTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {getStainTypeLabel(type)}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddStain}
                    disabled={!selectedStainType}
                    startIcon={<AddIcon />}
                  >
                    Додати
                  </Button>
                </Box>

                {/* Поле для опису плями "Інше" */}
                {selectedStainType === StainType.OTHER && (
                  <TextField
                    fullWidth
                    label="Опис плями"
                    value={otherStainDescription}
                    onChange={handleDescriptionChange}
                    helperText="Вкажіть детальний опис плями"
                  />
                )}

                {/* Відображення вибраних плям */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {stains.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Плями не вказані. Додайте, якщо вони є на предметі.
                    </Typography>
                  ) : (
                    stains.map((stain, index) => (
                      <Chip
                        key={`${stain.type}-${index}`}
                        label={
                          stain.type === StainType.OTHER
                            ? `${getStainTypeLabel(stain.type)}: ${stain.description}`
                            : getStainTypeLabel(stain.type)
                        }
                        onDelete={() => onRemoveStain(index)}
                        deleteIcon={<CloseIcon />}
                        color="primary"
                        variant="outlined"
                        sx={{ m: 0.5 }}
                      />
                    ))
                  )}
                </Box>

                {error && <FormHelperText>{error.message}</FormHelperText>}
              </Box>
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};
