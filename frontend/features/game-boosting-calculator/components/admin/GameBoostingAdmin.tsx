'use client';

/**
 * Game Boosting Admin Panel
 * Main admin interface for managing games and boosters
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { GameManagement } from './games/GameManagement';
import { BoosterManagement } from './boosters/BoosterManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const GameBoostingAdmin = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} href="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink
            component={Link}
            href="/game-boosting-calculator"
            underline="hover"
            color="inherit"
          >
            Game Boosting Calculator
          </MuiLink>
          <Typography color="text.primary">Admin Panel</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Game Boosting Admin Panel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage games, boosters, and pricing configurations for the game boosting calculator.
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Games" />
              <Tab label="Boosters" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <GameManagement />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <BoosterManagement />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};
