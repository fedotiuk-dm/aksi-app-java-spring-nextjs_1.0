'use client';

import {
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { TextFieldProps } from '@mui/material/TextField';
import React from 'react';

// Базовий тип для всіх полів
interface BaseFieldProps {
  label: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
}

// Текстове поле
interface TextFieldComponentProps
  extends BaseFieldProps,
    Omit<TextFieldProps, 'label' | 'error' | 'helperText'> {
  type: 'text' | 'number' | 'email' | 'tel' | 'password';
}

// Автокомпліт
interface AutocompleteFieldProps extends BaseFieldProps {
  type: 'autocomplete';
  options: string[];
  value: string;
  onChange: (event: React.SyntheticEvent, value: string | null) => void;
  freeSolo?: boolean;
  placeholder?: string;
}

// Селект
interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: Array<{ value: string; label: string; description?: string }>;
}

// Об'єднаний тип
type FormFieldProps = TextFieldComponentProps | AutocompleteFieldProps | SelectFieldProps;

/**
 * Універсальний компонент для полів форми
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, error, startIcon, endIcon, helperText } = props;

  // Текстове поле
  if (
    props.type === 'text' ||
    props.type === 'number' ||
    props.type === 'email' ||
    props.type === 'tel' ||
    props.type === 'password'
  ) {
    const { type, startIcon, endIcon, helperText: propHelperText, ...textFieldProps } = props;

    return (
      <TextField
        {...textFieldProps}
        type={type}
        label={label}
        error={!!error}
        helperText={error || propHelperText}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : undefined,
          ...textFieldProps.InputProps,
        }}
      />
    );
  }

  // Автокомпліт
  if (props.type === 'autocomplete') {
    const { options, value, onChange, freeSolo = false, placeholder } = props;

    return (
      <Autocomplete
        options={options}
        value={value}
        onChange={onChange}
        freeSolo={freeSolo}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={!!error}
            helperText={error || helperText}
            InputProps={{
              ...params.InputProps,
              startAdornment: startIcon ? (
                <>
                  <InputAdornment position="start">{startIcon}</InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ) : (
                params.InputProps.startAdornment
              ),
              endAdornment: endIcon ? (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end">{endIcon}</InputAdornment>
                </>
              ) : (
                params.InputProps.endAdornment
              ),
            }}
          />
        )}
      />
    );
  }

  // Селект
  if (props.type === 'select') {
    const { value, onChange, options } = props;

    return (
      <FormControl fullWidth error={!!error}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={onChange}
          label={label}
          startAdornment={
            startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : undefined
          }
          endAdornment={
            endIcon ? <InputAdornment position="end">{endIcon}</InputAdornment> : undefined
          }
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box>
                <Box component="span">{option.label}</Box>
                {option.description && (
                  <Box
                    component="span"
                    sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary' }}
                  >
                    {option.description}
                  </Box>
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return null;
};
