'use client';

import { Person, Phone, LocationOn, Group } from '@mui/icons-material';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';

interface ClientInfoCardProps {
  name: string;
  phone: string;
  contactMethod?: string;
  address?: string;
  branchName?: string;
  branchAddress?: string;
  title?: string;
  showIcons?: boolean;
}

/**
 * Компонент для відображення інформації про клієнта та філію
 */
export const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  name,
  phone,
  contactMethod,
  address,
  branchName,
  branchAddress,
  title = 'Інформація про клієнта',
  showIcons = true,
}) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {showIcons && <Person color="primary" />}
          {title}
        </Typography>

        <Grid container spacing={3}>
          {/* Інформація про клієнта */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Клієнт
            </Typography>

            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {showIcons && <Person fontSize="small" />}
                <strong>ПІБ:</strong> {name}
              </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {showIcons && <Phone fontSize="small" />}
                <strong>Телефон:</strong> {phone}
              </Typography>
            </Box>

            {contactMethod && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Спосіб зв&apos;язку:</strong> {contactMethod}
                </Typography>
              </Box>
            )}

            {address && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {showIcons && <LocationOn fontSize="small" />}
                  <strong>Адреса:</strong> {address}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Інформація про філію */}
          {branchName && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Пункт прийому
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {showIcons && <Group fontSize="small" />}
                  <strong>Філія:</strong> {branchName}
                </Typography>
              </Box>

              {branchAddress && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {showIcons && <LocationOn fontSize="small" />}
                    <strong>Адреса філії:</strong> {branchAddress}
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
