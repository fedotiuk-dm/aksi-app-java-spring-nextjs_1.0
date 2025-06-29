'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { CheckCircle, Assignment, Print, Email, Draw, Warning } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import {
  useStage4UpdateLegalAcceptance,
  useStage4SaveSignature,
  useStage4FinalizeOrder,
  useStage4GenerateReceipt,
  useStage4GetCurrentState,
} from '@/shared/api/generated/stage4';

interface OrderCompletionFormData {
  termsAccepted: boolean;
  sendReceiptByEmail: boolean;
  generatePrintableReceipt: boolean;
  comments: string;
  signatureData: string;
}

export const OrderCompletion = () => {
  const { sessionId, orderId, stage4Ready, setStage4Ready } = useOrderOnepageStore();
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionSuccess, setCompletionSuccess] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  // API хуки
  const updateLegalAcceptance = useStage4UpdateLegalAcceptance();
  const saveSignature = useStage4SaveSignature();
  const finalizeOrder = useStage4FinalizeOrder();
  const generateReceipt = useStage4GenerateReceipt();

  // Отримання поточного стану (тільки якщо Stage4 готовий)
  const { data: currentState } = useStage4GetCurrentState(sessionId || '', {
    query: {
      enabled: !!sessionId && stage4Ready, // Завантажуємо тільки коли Stage4 готовий
      retry: false,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderCompletionFormData>({
    defaultValues: {
      termsAccepted: false,
      sendReceiptByEmail: true,
      generatePrintableReceipt: true,
      comments: '',
      signatureData: '',
    },
  });

  const watchedTermsAccepted = watch('termsAccepted');
  const watchedSignatureData = watch('signatureData');

  // Перевірка готовності до завершення
  const canComplete = watchedTermsAccepted && watchedSignatureData && sessionId && orderId;

  const handleSignatureCapture = () => {
    setShowSignatureDialog(true);
  };

  const handleSignatureSave = async (signatureData: string) => {
    if (!sessionId) return;

    try {
      await saveSignature.mutateAsync({
        sessionId,
        data: {
          orderId: orderId || '',
          signatureData,
          termsAccepted: true,
        },
      });
      setValue('signatureData', signatureData);
      setShowSignatureDialog(false);
    } catch (error) {
      console.error('Помилка збереження підпису:', error);
    }
  };

  const handleLegalAcceptance = async (accepted: boolean) => {
    if (!sessionId) return;

    try {
      await updateLegalAcceptance.mutateAsync({
        sessionId,
        data: {
          legalAcceptanceConfirmed: accepted,
        },
      });

      // Встановлюємо готовність Stage4 після підтвердження правових умов
      if (accepted) {
        setStage4Ready(true);
      }
    } catch (error) {
      console.error('Помилка оновлення юридичного прийняття:', error);
    }
  };

  const onSubmit = async (data: OrderCompletionFormData) => {
    if (!sessionId || !orderId) return;

    setIsCompleting(true);
    try {
      // 1. Оновлення юридичного прийняття
      await handleLegalAcceptance(data.termsAccepted);

      // 2. Фіналізація замовлення
      const finalizationResult = await finalizeOrder.mutateAsync({
        sessionId,
        data: {
          orderId,
          signatureData: data.signatureData,
          termsAccepted: data.termsAccepted,
          sendReceiptByEmail: data.sendReceiptByEmail,
          generatePrintableReceipt: data.generatePrintableReceipt,
          comments: data.comments,
        },
      });

      // 3. Генерація квитанції (якщо потрібно)
      if (data.generatePrintableReceipt) {
        await generateReceipt.mutateAsync({
          data: {
            orderId,
            includeSignature: true,
          },
        });
      }

      setCompletionSuccess(true);
      setCompletionMessage(finalizationResult.completionMessage || 'Замовлення успішно завершено!');
    } catch (error) {
      console.error('Помилка завершення замовлення:', error);
      setCompletionMessage('Помилка при завершенні замовлення. Спробуйте ще раз.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (completionSuccess) {
    return (
      <Paper sx={{ p: 2, backgroundColor: 'success.light' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircle color="success" />
          <Typography variant="h6" color="success.dark">
            Замовлення завершено
          </Typography>
        </Box>
        <Alert severity="success" sx={{ mb: 2 }}>
          {completionMessage}
        </Alert>
        <Stack spacing={1}>
          <Chip label={`Номер замовлення: ${orderId}`} color="success" variant="outlined" />
          {currentState?.createdOrderNumber && (
            <Chip
              label={`Номер квитанції: ${currentState.createdOrderNumber}`}
              color="info"
              variant="outlined"
            />
          )}
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Assignment color="primary" />
        <Typography variant="h6">Завершення замовлення</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Підпис клієнта */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Підпис клієнта
            </Typography>
            <Button
              variant={watchedSignatureData ? 'contained' : 'outlined'}
              startIcon={<Draw />}
              onClick={handleSignatureCapture}
              color={watchedSignatureData ? 'success' : 'primary'}
              fullWidth
            >
              {watchedSignatureData ? 'Підпис отримано' : 'Отримати підпис'}
            </Button>
          </Box>

          {/* Прийняття умов */}
          <Controller
            name="termsAccepted"
            control={control}
            rules={{ required: 'Необхідно прийняти умови надання послуг' }}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      handleLegalAcceptance(e.target.checked);
                    }}
                  />
                }
                label={
                  <Typography variant="body2">
                    Я приймаю умови надання послуг та підтверджую правильність даних
                  </Typography>
                }
              />
            )}
          />
          {errors.termsAccepted && (
            <Alert severity="error" sx={{ fontSize: '0.75rem' }}>
              {errors.termsAccepted.message}
            </Alert>
          )}

          <Divider />

          {/* Опції квитанції */}
          <Typography variant="subtitle2">Опції квитанції:</Typography>

          <Controller
            name="sendReceiptByEmail"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" />
                    <Typography variant="body2">Надіслати квитанцію на email</Typography>
                  </Box>
                }
              />
            )}
          />

          <Controller
            name="generatePrintableReceipt"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Print fontSize="small" />
                    <Typography variant="body2">Згенерувати друковану квитанцію</Typography>
                  </Box>
                }
              />
            )}
          />

          {/* Коментарі */}
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Додаткові коментарі (необов'язково)"
                multiline
                rows={2}
                size="small"
                placeholder="Особливі побажання або примітки..."
              />
            )}
          />

          {/* Попередження */}
          {!canComplete && (
            <Alert severity="warning" icon={<Warning />}>
              Для завершення замовлення необхідно:
              {!watchedTermsAccepted && ' прийняти умови надання послуг'}
              {!watchedSignatureData && ' отримати підпис клієнта'}
            </Alert>
          )}

          {/* Кнопка завершення */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!canComplete || isCompleting}
            startIcon={isCompleting ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{ mt: 2 }}
          >
            {isCompleting ? 'Завершення...' : 'Завершити замовлення'}
          </Button>
        </Stack>
      </form>

      {/* Діалог підпису */}
      <SignatureDialog
        open={showSignatureDialog}
        onClose={() => setShowSignatureDialog(false)}
        onSave={handleSignatureSave}
      />
    </Paper>
  );
};

// Компонент діалогу для підпису (спрощена версія)
interface SignatureDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
}

const SignatureDialog = ({ open, onClose, onSave }: SignatureDialogProps) => {
  const [signatureText, setSignatureText] = useState('');

  const handleSave = () => {
    if (signatureText.trim()) {
      // В реальному додатку тут буде canvas для підпису
      onSave(`signature:${signatureText}`);
      setSignatureText('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Draw />
          Підпис клієнта
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Введіть ім'я клієнта для підтвердження підпису:
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label="Повне ім'я клієнта"
          value={signatureText}
          onChange={(e) => setSignatureText(e.target.value)}
          placeholder="Прізвище Ім'я По батькові"
          sx={{ mt: 1 }}
        />
        <Alert severity="info" sx={{ mt: 2 }}>
          В майбутньому тут буде інтерфейс для цифрового підпису
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleSave} variant="contained" disabled={!signatureText.trim()}>
          Зберегти підпис
        </Button>
      </DialogActions>
    </Dialog>
  );
};
