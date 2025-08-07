'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  Schedule,
  Edit,
} from '@mui/icons-material';
import type { BranchInfo } from '@/shared/api/generated/branch';

interface BranchCardProps {
  branch: BranchInfo;
  onEdit?: (branch: BranchInfo) => void;
  onDeactivate?: (branchId: string) => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  onEdit,
  onDeactivate,
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {branch.name}
            </Typography>
            <Chip
              label={branch.active ? 'Активна' : 'Неактивна'}
              color={branch.active ? 'success' : 'default'}
              size="small"
            />
          </Box>

          {branch.address && (
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <LocationOn fontSize="small" color="action" />
              <Box>
                <Typography variant="body2">
                  {branch.address}
                </Typography>
              </Box>
            </Stack>
          )}

          {branch.phone && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Phone fontSize="small" color="action" />
              <Typography variant="body2">{branch.phone}</Typography>
            </Stack>
          )}

          {branch.email && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Email fontSize="small" color="action" />
              <Typography variant="body2">{branch.email}</Typography>
            </Stack>
          )}

          {branch.workingHours && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2">{branch.workingHours}</Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardActions>
        {onEdit && (
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => onEdit(branch)}
          >
            Редагувати
          </Button>
        )}
        {onDeactivate && branch.active && (
          <Button
            size="small"
            color="error"
            onClick={() => onDeactivate(branch.id)}
          >
            Деактивувати
          </Button>
        )}
      </CardActions>
    </Card>
  );
};