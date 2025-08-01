'use client';

import { Typography, Container, Paper, Box, Tabs, Tab } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { UsersManagement } from './users/UsersManagement';
import { useAuth, ROLES } from '@/features/auth';
import { useSearchParams } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export function Settings() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Only admins can see users tab
  const isAdmin = user?.roles?.includes(ROLES.ADMIN);
  
  // Check if we should open users tab
  const defaultTab = searchParams.get('tab') === 'users' && isAdmin ? 1 : 0;
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    if (searchParams.get('tab') === 'users' && isAdmin) {
      setTab(1);
    }
  }, [searchParams, isAdmin]);

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
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Загальні" />
          {isAdmin && <Tab label="Користувачі" />}
          <Tab label="Сповіщення" />
          <Tab label="Система" />
        </Tabs>
      </Paper>

      <TabPanel value={tab} index={0}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Загальні налаштування системи
          </Typography>
        </Paper>
      </TabPanel>

      {isAdmin && (
        <TabPanel value={tab} index={1}>
          <UsersManagement />
        </TabPanel>
      )}

      <TabPanel value={tab} index={isAdmin ? 2 : 1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Налаштування сповіщень
          </Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tab} index={isAdmin ? 3 : 2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Системні налаштування
          </Typography>
        </Paper>
      </TabPanel>
    </Container>
  );
}
