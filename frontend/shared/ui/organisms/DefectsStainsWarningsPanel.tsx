'use client';

import {
  Warning,
  LocalLaundryService,
  ReportProblem,
  ErrorOutline,
  ExpandMore,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import React from 'react';

interface DefectsStainsWarningsPanelProps {
  hasStains: boolean;
  hasDefects: boolean;
  hasNoWarranty: boolean;
  showSuccessMessage?: boolean;
}

/**
 * Компонент для відображення попереджень про дефекти, плями та гарантії
 */
export const DefectsStainsWarningsPanel: React.FC<DefectsStainsWarningsPanelProps> = ({
  hasStains,
  hasDefects,
  hasNoWarranty,
  showSuccessMessage = true,
}) => {
  const hasIssues = hasStains || hasDefects || hasNoWarranty;

  if (!hasIssues) {
    return showSuccessMessage ? (
      <Alert severity="success">
        <Typography variant="body2">
          Дефекти та плями не виявлені. Предмет у хорошому стані для стандартної чистки.
        </Typography>
      </Alert>
    ) : null;
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Важливі попередження
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          {hasStains && (
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
          {hasDefects && (
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
          {hasNoWarranty && (
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
  );
};
