'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  Divider, 
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Client } from '@/features/order-wizard/model/types';
import { useSearchResults } from '@/features/order-wizard/hooks';

interface SearchResultsProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  onClientEdit: (client: Client) => void;
  className?: string;
}

/**
 * Компонент для відображення результатів пошуку клієнтів
 * Використовує хук useSearchResults для логіки
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  clients,
  onClientSelect,
  onClientEdit,
  className
}) => {
  // Використовуємо хук для логіки обробки результатів
  const { 
    hasResults,
    handleClientSelect,
    handleClientEdit,
    getChannelLabel
  } = useSearchResults({ clients });
  
  // Якщо немає результатів, не відображаємо компонент
  if (!hasResults) {
    return null;
  }

  return (
    <Paper className={className} sx={{ 
      mt: 2, 
      overflow: 'hidden', 
      border: '1px solid #1976d2', 
      borderRadius: 1, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
    }}>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white', 
        fontWeight: 'bold',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'   
      }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Вибрані клієнти: {clients.length}
        </Typography>
      </Box>
      
      <List disablePadding>
        {clients.map((client, index) => (
          <React.Fragment key={client.id || `selected-client-${index}`}>
            <ListItem 
              disablePadding 
              sx={{ 
                display: 'block', 
                p: 2,
                bgcolor: index % 2 === 0 ? 'background.paper' : 'grey.50',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 9, sm: 10 }} 
                      onClick={() => handleClientSelect(client, onClientSelect)} 
                      sx={{ cursor: 'pointer' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    {client.lastName} {client.firstName}
                  </Typography>
                  
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {client.phone && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <strong>📞 Телефон:</strong> {client.phone}
                      </Typography>
                    )}
                    
                    {client.email && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <strong>✉️ Email:</strong> {client.email}
                      </Typography>
                    )}
                    
                    {client.address && (client.address.city || client.address.street) && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <strong>📍 Адреса:</strong> {client.address.city}
                        {client.address.street && `, ${client.address.street}`}
                      </Typography>
                    )}
                    
                    {client.communicationChannels && client.communicationChannels.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {client.communicationChannels.map((channel) => (
                          <Chip 
                            key={channel} 
                            label={getChannelLabel(channel)}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 3, sm: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleClientEdit(client, onClientEdit)}
                    aria-label="редагувати клієнта"
                    sx={{
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.16)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
            {index < clients.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default SearchResults;
