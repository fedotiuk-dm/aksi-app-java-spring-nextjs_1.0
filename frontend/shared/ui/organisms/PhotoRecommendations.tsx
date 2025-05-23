'use client';

import { Info, CheckCircle } from '@mui/icons-material';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';

interface Recommendation {
  id: string;
  text: string;
}

interface PhotoRecommendationsProps {
  recommendations?: Recommendation[];
  title?: string;
  show?: boolean;
}

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'lighting',
    text: 'Фотографуйте предмет при хорошому освітленні',
  },
  {
    id: 'defects',
    text: 'Показуйте всі дефекти, плями та особливості',
  },
  {
    id: 'angles',
    text: 'Робіть фото з різних ракурсів',
  },
  {
    id: 'quality',
    text: 'Уникайте розмитих та темних знімків',
  },
];

/**
 * Компонент для відображення рекомендацій по фотографуванню
 */
export const PhotoRecommendations: React.FC<PhotoRecommendationsProps> = ({
  recommendations = DEFAULT_RECOMMENDATIONS,
  title = 'Рекомендації для фото',
  show = true,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, bgcolor: 'info.light' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Info color="info" />
        {title}
      </Typography>
      <List dense>
        {recommendations.map((recommendation) => (
          <ListItem key={recommendation.id}>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText primary={recommendation.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
