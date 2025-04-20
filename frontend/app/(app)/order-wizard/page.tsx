'use client';

import { OrderWizard } from "@/features/order-wizard/components/OrderWizard";
import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";
import NextLink from "next/link";
import { Home as HomeIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";

export default function OrderWizardPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs 
          separator={<ChevronRightIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link 
            component={NextLink}
            href="/dashboard" 
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Головна
          </Link>
          <Link 
            component={NextLink}
            href="/orders" 
            color="inherit"
          >
            Замовлення
          </Link>
          <Typography color="text.primary">Створення замовлення</Typography>
        </Breadcrumbs>
      </Box>
      
      <OrderWizard />
    </Container>
  );
}
