'use client';

import React from 'react';
import {
  Stack,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Typography,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Константи
const CONTACT_METHODS = {
  PHONE: 'phone',
  SMS: 'sms',
  VIBER: 'viber',
} as const;

const INFO_SOURCES = {
  INSTAGRAM: 'instagram',
  GOOGLE: 'google',
  RECOMMENDATIONS: 'recommendations',
  OTHER: 'other',
} as const;

// Константа для кольору тексту
const TEXT_SECONDARY = 'text.secondary';

interface ClientCreationFormProps {
  // Основна інформація
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  address: string;
  onAddressChange: (value: string) => void;

  // Способи зв'язку
  contactMethods: string[];
  onContactMethodsChange: (methods: string[]) => void;

  // Джерело інформації
  infoSource: string;
  onInfoSourceChange: (source: string) => void;
  sourceDetails: string;
  onSourceDetailsChange: (details: string) => void;

  // Помилки валідації
  errors?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    infoSourceOther?: string;
  };

  // Стан
  isCreating?: boolean;
}

export const ClientCreationForm: React.FC<ClientCreationFormProps> = ({
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  address,
  onAddressChange,
  contactMethods,
  onContactMethodsChange,
  infoSource,
  onInfoSourceChange,
  sourceDetails,
  onSourceDetailsChange,
  errors = {},
}) => {
  const handleContactMethodChange = (method: string, checked: boolean) => {
    if (checked) {
      onContactMethodsChange([...contactMethods, method]);
    } else {
      onContactMethodsChange(contactMethods.filter((m) => m !== method));
    }
  };

  return (
    <Stack spacing={3}>
      {/* Основна інформація */}
      <Stack spacing={2}>
        <Typography variant="h6">Основна інформація</Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            label="Ім'я *"
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            label="Прізвище *"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Stack>

        <TextField
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          label="Телефон *"
          placeholder="+380XXXXXXXXX"
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone}
          InputProps={{
            startAdornment: <PhoneIcon sx={{ mr: 1, color: TEXT_SECONDARY }} />,
          }}
        />

        <TextField
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          label="Email"
          type="email"
          placeholder="example@email.com"
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: <EmailIcon sx={{ mr: 1, color: TEXT_SECONDARY }} />,
          }}
        />

        <TextField
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          label="Адреса"
          placeholder="Вулиця, будинок, квартира"
          fullWidth
          multiline
          rows={2}
          error={!!errors.address}
          helperText={errors.address}
          InputProps={{
            startAdornment: (
              <LocationIcon sx={{ mr: 1, color: TEXT_SECONDARY, alignSelf: 'flex-start', mt: 1 }} />
            ),
          }}
        />
      </Stack>

      {/* Способи зв'язку */}
      <Stack spacing={2}>
        <Typography variant="h6">Способи зв&apos;язку</Typography>
        <Typography variant="body2" color="text.secondary">
          Оберіть зручні способи зв&apos;язку з клієнтом (можна обрати кілька)
        </Typography>

        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={contactMethods.includes(CONTACT_METHODS.PHONE)}
                  onChange={(e) =>
                    handleContactMethodChange(CONTACT_METHODS.PHONE, e.target.checked)
                  }
                />
              }
              label="Телефонний дзвінок"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={contactMethods.includes(CONTACT_METHODS.SMS)}
                  onChange={(e) => handleContactMethodChange(CONTACT_METHODS.SMS, e.target.checked)}
                />
              }
              label="SMS повідомлення"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={contactMethods.includes(CONTACT_METHODS.VIBER)}
                  onChange={(e) =>
                    handleContactMethodChange(CONTACT_METHODS.VIBER, e.target.checked)
                  }
                />
              }
              label="Viber"
            />
          </FormGroup>
        </FormControl>
      </Stack>

      {/* Джерело інформації */}
      <Stack spacing={2}>
        <Typography variant="h6">Джерело інформації про хімчистку</Typography>
        <Typography variant="body2" color="text.secondary">
          Як клієнт дізнався про нашу хімчистку?
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={infoSource}
            onChange={(e) => onInfoSourceChange(e.target.value)}
            row={false}
          >
            <FormControlLabel
              value={INFO_SOURCES.INSTAGRAM}
              control={<Radio />}
              label="Instagram"
            />
            <FormControlLabel
              value={INFO_SOURCES.GOOGLE}
              control={<Radio />}
              label="Google пошук"
            />
            <FormControlLabel
              value={INFO_SOURCES.RECOMMENDATIONS}
              control={<Radio />}
              label="Рекомендації друзів/знайомих"
            />
            <FormControlLabel value={INFO_SOURCES.OTHER} control={<Radio />} label="Інше" />
          </RadioGroup>

          {/* Поле для уточнення "Інше" */}
          {infoSource === INFO_SOURCES.OTHER && (
            <TextField
              value={sourceDetails}
              onChange={(e) => onSourceDetailsChange(e.target.value)}
              label="Уточніть джерело"
              placeholder="Опишіть, як клієнт дізнався про нас"
              fullWidth
              size="small"
              sx={{ mt: 1, ml: 4 }}
              error={!!errors.infoSourceOther}
              helperText={errors.infoSourceOther}
            />
          )}
        </FormControl>
      </Stack>
    </Stack>
  );
};
