'use client';

import {
  Warning,
  ReportProblem,
  LocalLaundryService,
  ErrorOutline,
  Info,
  ExpandMore,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React, { useState } from 'react';

import { useItemWizard, DefectType, StainType } from '@/domain/order';

import { StepContainer } from '../../../shared/ui/step-container';
import { StepNavigation } from '../../../shared/ui/step-navigation';

/**
 * Підкрок 2.3: Забруднення, дефекти та ризики
 *
 * Згідно з документацією Order Wizard:
 * - Плями (мультивибір чекбоксів)
 * - Дефекти та ризики (мультивибір чекбоксів)
 * - Примітки щодо дефектів (текстове поле)
 */
export const DefectsStainsStep: React.FC = () => {
  // Отримуємо функціональність Item Wizard з domain layer
  const { itemData, validation, canProceed, updateDefectsStains, wizard } = useItemWizard();

  // Локальний стан для кастомних описів
  const [customStainDescription, setCustomStainDescription] = useState('');
  const [customDefectDescription, setCustomDefectDescription] = useState('');

  // Локалізовані назви плям
  const stainLabels: Record<StainType, string> = {
    [StainType.GREASE]: 'Жир',
    [StainType.BLOOD]: 'Кров',
    [StainType.PROTEIN]: 'Білок',
    [StainType.WINE]: 'Вино',
    [StainType.COFFEE]: 'Кава',
    [StainType.GRASS]: 'Трава',
    [StainType.INK]: 'Чорнило',
    [StainType.COSMETICS]: 'Косметика',
    [StainType.OTHER]: 'Інше',
  };

  // Локалізовані назви дефектів
  const defectLabels: Record<DefectType, string> = {
    [DefectType.WORN]: 'Потертості',
    [DefectType.TORN]: 'Порване',
    [DefectType.MISSING_ACCESSORIES]: 'Відсутність фурнітури',
    [DefectType.DAMAGED_ACCESSORIES]: 'Пошкодження фурнітури',
    [DefectType.COLOR_CHANGE_RISK]: 'Ризики зміни кольору',
    [DefectType.DEFORMATION_RISK]: 'Ризики деформації',
    [DefectType.OTHER]: 'Інше',
  };

  /**
   * Обробник зміни плям
   */
  const handleStainChange = (stainType: StainType, checked: boolean) => {
    const currentStains = itemData.stains || [];

    if (checked) {
      // Додаємо пляму
      updateDefectsStains({
        stains: [...currentStains, stainType],
      });
    } else {
      // Видаляємо пляму
      updateDefectsStains({
        stains: currentStains.filter((s) => s !== stainType),
      });
    }
  };

  /**
   * Обробник зміни дефектів
   */
  const handleDefectChange = (defectType: DefectType, checked: boolean) => {
    const currentDefects = itemData.defects || [];

    if (checked) {
      // Додаємо дефект
      updateDefectsStains({
        defects: [...currentDefects, defectType],
      });
    } else {
      // Видаляємо дефект
      updateDefectsStains({
        defects: currentDefects.filter((d) => d !== defectType),
      });
    }
  };

  /**
   * Обробник зміни примітки
   */
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateDefectsStains({
      defectsNotes: event.target.value,
    });
  };

  /**
   * Обробник зміни "без гарантій"
   */
  const handleNoWarrantyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateDefectsStains({
      noWarranty: event.target.checked,
      // Очищуємо причину якщо прибираємо "без гарантій"
      noWarrantyReason: event.target.checked ? itemData.noWarrantyReason : '',
    });
  };

  /**
   * Обробник зміни причини "без гарантій"
   */
  const handleNoWarrantyReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateDefectsStains({
      noWarrantyReason: event.target.value,
    });
  };

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = () => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до калькулятора ціни');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = () => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Повернення до характеристик');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  // Підрахунок вибраних елементів
  const selectedStains = itemData.stains || [];
  const selectedDefects = itemData.defects || [];
  const hasIssues = selectedStains.length > 0 || selectedDefects.length > 0 || itemData.noWarranty;

  return (
    <StepContainer
      title="Забруднення, дефекти та ризики"
      subtitle="Відмітьте всі виявлені плями, дефекти та можливі ризики при чистці"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Плями */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalLaundryService color="primary" />
            Виявлені плями
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <FormGroup>
              <Grid container spacing={2}>
                {Object.entries(stainLabels).map(([stainType, label]) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stainType}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedStains.includes(stainType as StainType)}
                          onChange={(e) =>
                            handleStainChange(stainType as StainType, e.target.checked)
                          }
                        />
                      }
                      label={label}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </FormControl>

          {/* Кастомний опис для "Інше" */}
          {selectedStains.includes(StainType.OTHER) && (
            <TextField
              fullWidth
              label="Опишіть інші плями"
              placeholder="Вкажіть тип та місце розташування плям..."
              value={customStainDescription}
              onChange={(e) => setCustomStainDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
          )}

          {selectedStains.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Вибрані плями:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedStains.map((stain) => (
                  <Chip
                    key={stain}
                    label={stainLabels[stain]}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Дефекти та ризики */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportProblem color="primary" />
            Дефекти та ризики
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <FormGroup>
              <Grid container spacing={2}>
                {Object.entries(defectLabels).map(([defectType, label]) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={defectType}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedDefects.includes(defectType as DefectType)}
                          onChange={(e) =>
                            handleDefectChange(defectType as DefectType, e.target.checked)
                          }
                        />
                      }
                      label={label}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </FormControl>

          {/* Кастомний опис для "Інше" */}
          {selectedDefects.includes(DefectType.OTHER) && (
            <TextField
              fullWidth
              label="Опишіть інші дефекти"
              placeholder="Вкажіть додаткові дефекти або ризики..."
              value={customDefectDescription}
              onChange={(e) => setCustomDefectDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
          )}

          {selectedDefects.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Вибрані дефекти:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedDefects.map((defect) => (
                  <Chip
                    key={defect}
                    label={defectLabels[defect]}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Примітки та "без гарантій" */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info color="primary" />
            Додаткова інформація
          </Typography>

          {/* Загальні примітки */}
          <TextField
            fullWidth
            label="Примітки щодо дефектів та плям"
            placeholder="Додайте детальний опис стану предмета, розташування дефектів тощо..."
            value={itemData.defectsNotes || ''}
            onChange={handleNotesChange}
            multiline
            rows={3}
            error={!!validation.defectsStains.errors.defectsNotes}
            helperText={validation.defectsStains.errors.defectsNotes || 'Максимум 1000 символів'}
            sx={{ mb: 3 }}
          />

          <Divider sx={{ my: 2 }} />

          {/* Без гарантій */}
          <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={itemData.noWarranty || false}
                  onChange={handleNoWarrantyChange}
                  color="error"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Без гарантій
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Відмова від гарантійних зобов&apos;язань
                  </Typography>
                </Box>
              }
            />

            {itemData.noWarranty && (
              <TextField
                fullWidth
                required
                label="Причина відмови від гарантій"
                placeholder="Обов'язково вкажіть причину..."
                value={itemData.noWarrantyReason || ''}
                onChange={handleNoWarrantyReasonChange}
                error={!!validation.defectsStains.errors.noWarrantyReason}
                helperText={validation.defectsStains.errors.noWarrantyReason}
                sx={{ mt: 2 }}
                InputProps={{
                  startAdornment: <ErrorOutline color="error" sx={{ mr: 1 }} />,
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Попередження та інформаційні повідомлення */}
        {hasIssues && (
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="warning" />
                Важливі попередження
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {selectedStains.length > 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <LocalLaundryService color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Виявлені плями"
                      secondary="Деякі плями можуть не видалятися повністю або потребувати додаткової обробки."
                    />
                  </ListItem>
                )}
                {selectedDefects.length > 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <ReportProblem color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Виявлені дефекти"
                      secondary="Існуючі дефекти можуть вплинути на якість чистки або призвести до додаткових пошкоджень."
                    />
                  </ListItem>
                )}
                {itemData.noWarranty && (
                  <ListItem>
                    <ListItemIcon>
                      <ErrorOutline color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Без гарантій"
                      secondary="Хімчистка не несе відповідальності за можливі пошкодження предмета."
                    />
                  </ListItem>
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Підсумок */}
        {!hasIssues && (
          <Alert severity="success">
            <Typography variant="body2">
              Дефекти та плями не виявлені. Предмет у хорошому стані для стандартної чистки.
            </Typography>
          </Alert>
        )}
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до ціни"
        backLabel="Назад до характеристик"
        isNextDisabled={!canProceed}
      />
    </StepContainer>
  );
};

export default DefectsStainsStep;
