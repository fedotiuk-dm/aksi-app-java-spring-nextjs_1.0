'use client';

import { Typography, Container, Paper, Grid, Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

export function Settings() {
  const [tab, setTab] = useState(0);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Налаштування
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tab} 
          onChange={handleTabChange} 
          variant="scrollable" 
          scrollButtons="auto"
        >
          <Tab label="Загальні" />
          <Tab label="Користувачі" />
          <Tab label="Сповіщення" />
          <Tab label="Система" />
        </Tabs>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1">
              Тут будуть налаштування системи, управління користувачами та інші параметри для адміністраторів.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
