'use client';

/**
 * @fileoverview Список послуг каталогу
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Category,
  Palette,
} from '@mui/icons-material';
import { useListServices } from '@/shared/api/generated/serviceItem';
import { 
  SERVICE_CATEGORY_NAMES, 
  PROCESSING_TIME_NAMES,
  useCatalogStore,
  CATALOG_DEFAULTS,
  CATALOG_MESSAGES
} from '@/features/catalog';
import type { ServiceInfo } from '@/shared/api/generated/serviceItem';

interface ServiceListProps {
  onEdit?: (service: ServiceInfo) => void;
  onDelete?: (serviceId: string) => void;
  onAdd?: () => void;
}

export const ServiceList = ({ onEdit, onDelete, onAdd }: ServiceListProps) => {
  const { filters } = useCatalogStore();
  
  const { 
    data: servicesData, 
    isLoading, 
    error 
  } = useListServices({
    active: filters.activeOnly,
    category: filters.serviceCategory,
  });

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        <Grid container spacing={2}>
          {Array.from({ length: CATALOG_DEFAULTS.PAGINATION.SKELETON_ITEMS }).map((_, index) => (
            <Grid size={{ xs: CATALOG_DEFAULTS.GRID.BREAKPOINTS.XS, sm: CATALOG_DEFAULTS.GRID.BREAKPOINTS.SM, md: CATALOG_DEFAULTS.GRID.BREAKPOINTS.MD }} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={24} />
                    <Skeleton variant="rectangular" width={60} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {CATALOG_MESSAGES.SERVICE_LIST.LOADING_ERROR}: {error.message}
      </Alert>
    );
  }

  const services = servicesData?.services || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {CATALOG_MESSAGES.SERVICE_LIST.TITLE} ({services.length})
        </Typography>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
          >
            {CATALOG_MESSAGES.SERVICE_LIST.ADD_BUTTON}
          </Button>
        )}
      </Box>

      {services.length === 0 ? (
        <Alert severity="info">
          {CATALOG_MESSAGES.SERVICE_LIST.NO_ITEMS}. {onAdd && CATALOG_MESSAGES.SERVICE_LIST.CREATE_FIRST}.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {services.map((service) => (
            <Grid size={{ xs: CATALOG_DEFAULTS.GRID.BREAKPOINTS.XS, sm: CATALOG_DEFAULTS.GRID.BREAKPOINTS.SM, md: CATALOG_DEFAULTS.GRID.BREAKPOINTS.MD }} key={service.id}>
              <ServiceCard
                service={service}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

interface ServiceCardProps {
  service: ServiceInfo;
  onEdit?: (service: ServiceInfo) => void;
  onDelete?: (serviceId: string) => void;
}

const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        }
      }}
    >
      {service.color && (
        <Box
          sx={{
            height: 4,
            backgroundColor: service.color,
          }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
            {service.name}
          </Typography>
          <Box>
            {onEdit && (
              <IconButton
                size="small"
                onClick={() => onEdit(service)}
                aria-label={`${CATALOG_MESSAGES.SERVICE_LIST.EDIT_ARIA} ${service.name}`}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(service.id)}
                aria-label={`${CATALOG_MESSAGES.SERVICE_LIST.DELETE_ARIA} ${service.name}`}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {CATALOG_MESSAGES.SERVICE_LIST.CODE_LABEL}: {service.code}
        </Typography>

        {service.description && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {service.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            icon={<Category />}
            label={SERVICE_CATEGORY_NAMES[service.category]}
            size="small"
            variant="outlined"
          />
          {service.color && (
            <Chip
              icon={<Palette />}
              label={service.color}
              size="small"
              variant="outlined"
              sx={{ color: service.color }}
            />
          )}
          {!service.active && (
            <Chip
              label={CATALOG_MESSAGES.SERVICE_LIST.INACTIVE}
              size="small"
              color="error"
              variant="outlined"
            />
          )}
          {service.requiresSpecialHandling && (
            <Chip
              label={CATALOG_MESSAGES.SERVICE_LIST.SPECIAL_HANDLING}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        {service.allowedProcessingTimes && service.allowedProcessingTimes.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {CATALOG_MESSAGES.SERVICE_LIST.PROCESSING_TIMES_LABEL}:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {service.allowedProcessingTimes.map((time) => (
                <Chip
                  key={time}
                  label={PROCESSING_TIME_NAMES[time]}
                  size="small"
                  variant="filled"
                  color="primary"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {service.tags && service.tags.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {CATALOG_MESSAGES.SERVICE_LIST.TAGS_LABEL}:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {service.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};