'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import React, { useState } from 'react';

interface LegalAgreementProps {
  agreesToTerms: boolean;
  onTermsChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Компонент для юридичних аспектів та згоди з умовами
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення юридичних аспектів
 * - Отримує стан та обробники через пропси
 * - Не містить бізнес-логіки валідації
 */
export const LegalAgreement: React.FC<LegalAgreementProps> = ({
  agreesToTerms,
  onTermsChange,
  disabled = false,
}) => {
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Card variant="outlined" sx={{ bgcolor: 'warning.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Юридичні аспекти
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreesToTerms}
                  onChange={(e) => onTermsChange(e.target.checked)}
                  required
                  disabled={disabled}
                />
              }
              label={
                <Typography variant="body2">
                  Я погоджуюсь з{' '}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setShowTermsDialog(true)}
                    sx={{ p: 0, minWidth: 'auto', textDecoration: 'underline' }}
                  >
                    умовами надання послуг
                  </Button>{' '}
                  та{' '}
                  <Button
                    variant="text"
                    size="small"
                    sx={{ p: 0, minWidth: 'auto', textDecoration: 'underline' }}
                  >
                    державними документами
                  </Button>
                </Typography>
              }
            />

            {/* TODO: Реалізувати цифровий підпис */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Місце для цифрового підпису клієнта
                <br />
                (буде реалізовано пізніше)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Діалог з умовами */}
      <Dialog
        open={showTermsDialog}
        onClose={() => setShowTermsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Умови надання послуг</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            1. Хімчистка приймає речі на обробку відповідно до їх стану та типу матеріалу.
          </Typography>
          <Typography variant="body2" paragraph>
            2. Термін виконання послуг: звичайний - 48 годин, терміновий - 24 години.
          </Typography>
          <Typography variant="body2" paragraph>
            3. Хімчистка не несе відповідальності за зміну кольору, деформацію або пошкодження
            виробів з дефектами.
          </Typography>
          <Typography variant="body2" paragraph>
            4. Речі, не отримані протягом 30 днів, підлягають реалізації для покриття витрат на
            зберігання.
          </Typography>
          <Typography variant="body2" paragraph>
            5. Рекламації приймаються протягом 3 днів з моменту видачі речей.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTermsDialog(false)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LegalAgreement;
