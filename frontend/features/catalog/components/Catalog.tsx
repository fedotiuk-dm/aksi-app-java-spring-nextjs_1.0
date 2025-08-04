'use client';

/**
 * @fileoverview Головний компонент каталогу з табами для послуг, товарів та прайс-листа
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Fab,
  Tooltip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import {
  ServiceList,
  ItemList,
  PriceList,
  CatalogModal,
  CatalogFilters,
  useCatalogStore,
  CATALOG_MESSAGES,
  CATALOG_MODAL_TYPES,
} from '@/features/catalog';
import type { ServiceInfo, ItemInfo, ServiceItemInfo } from '@/shared/api/generated/serviceItem';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`catalog-tabpanel-${index}`}
      aria-labelledby={`catalog-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `catalog-tab-${index}`,
    'aria-controls': `catalog-tabpanel-${index}`,
  };
};

export const Catalog = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editingService, setEditingService] = useState<ServiceInfo | undefined>();
  const [editingItem, setEditingItem] = useState<ItemInfo | undefined>();
  const [editingServiceItem, setEditingServiceItem] = useState<ServiceItemInfo | undefined>();
  
  const { openModal, closeModal } = useCatalogStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCloseModal = () => {
    closeModal();
    setEditingService(undefined);
    setEditingItem(undefined);
    setEditingServiceItem(undefined);
  };

  const handleServiceSuccess = (service: ServiceInfo) => {
    console.log('Service saved:', service);
    handleCloseModal();
  };

  const handleItemSuccess = (item: ItemInfo) => {
    console.log('Item saved:', item);
    handleCloseModal();
  };

  const handleServiceItemSuccess = (serviceItem: ServiceItemInfo) => {
    console.log('Service item saved:', serviceItem);
    handleCloseModal();
  };

  const handleEditService = (service: ServiceInfo) => {
    setEditingService(service);
    openModal(CATALOG_MODAL_TYPES.SERVICE);
  };

  const handleEditItem = (item: ItemInfo) => {
    setEditingItem(item);
    openModal(CATALOG_MODAL_TYPES.ITEM);
  };

  const handleDeleteService = (serviceId: string) => {
    console.log('Delete service:', serviceId);
    // TODO: Implement delete service
  };

  const handleDeleteItem = (itemId: string) => {
    console.log('Delete item:', itemId);
    // TODO: Implement delete item
  };


  const getAddButtonTooltip = () => {
    switch (activeTab) {
      case 0:
        return CATALOG_MESSAGES.SERVICE_LIST.ADD_BUTTON;
      case 1:
        return CATALOG_MESSAGES.ITEM_LIST.ADD_BUTTON;
      case 2:
        return CATALOG_MESSAGES.SERVICE_ITEM_FORM.TITLE_CREATE;
      default:
        return 'Додати';
    }
  };

  const handleAddClick = () => {
    switch (activeTab) {
      case 0:
        openModal(CATALOG_MODAL_TYPES.SERVICE);
        break;
      case 1:
        openModal(CATALOG_MODAL_TYPES.ITEM);
        break;
      case 2:
        openModal(CATALOG_MODAL_TYPES.SERVICE_ITEM);
        break;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {CATALOG_MESSAGES.CATALOG.TITLE}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {CATALOG_MESSAGES.CATALOG.DESCRIPTION}
      </Typography>

      {/* Filters */}
      <CatalogFilters mode={activeTab === 0 ? 'services' : activeTab === 1 ? 'items' : 'priceList'} />

      {/* Tabs */}
      <Paper sx={{ minHeight: '70vh' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="catalog tabs">
            <Tab 
              label={CATALOG_MESSAGES.TABS.SERVICES} 
              {...a11yProps(0)} 
            />
            <Tab 
              label={CATALOG_MESSAGES.TABS.ITEMS} 
              {...a11yProps(1)} 
            />
            <Tab 
              label={CATALOG_MESSAGES.TABS.PRICE_LIST} 
              {...a11yProps(2)} 
            />
          </Tabs>
        </Box>

        {/* Services Tab */}
        <TabPanel value={activeTab} index={0}>
          <ServiceList 
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            onAdd={() => openModal(CATALOG_MODAL_TYPES.SERVICE)}
          />
        </TabPanel>

        {/* Items Tab */}
        <TabPanel value={activeTab} index={1}>
          <ItemList 
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onAdd={() => openModal(CATALOG_MODAL_TYPES.ITEM)}
          />
        </TabPanel>

        {/* Price List Tab */}
        <TabPanel value={activeTab} index={2}>
          <PriceList />
        </TabPanel>
      </Paper>

      {/* Floating Action Button */}
      <Tooltip title={getAddButtonTooltip()} placement="left">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={handleAddClick}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Modal for Forms */}
      <CatalogModal
        service={editingService}
        item={editingItem}
        serviceItem={editingServiceItem}
        onServiceSuccess={handleServiceSuccess}
        onItemSuccess={handleItemSuccess}
        onServiceItemSuccess={handleServiceItemSuccess}
      />
    </Container>
  );
};