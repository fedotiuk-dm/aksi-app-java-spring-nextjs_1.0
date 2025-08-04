'use client';

/**
 * @fileoverview Вкладки навігації каталогу
 */

import {
  Box,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  HomeRepairService,
  Inventory,
  PriceCheck,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import {
  ServiceList,
  ItemList,
  PriceList,
  CatalogFilters,
  CatalogModal,
} from '@/features/catalog';
import { 
  useListServices, 
  useListItems, 
  useListPriceListItems,
  useListServiceItems,
} from '@/shared/api/generated/serviceItem';
import type { 
  ServiceInfo, 
  ItemInfo, 
  ServiceItemInfo 
} from '@/shared/api/generated/serviceItem';

type TabValue = 'services' | 'items' | 'priceList' | 'serviceItems';

interface TabPanelProps {
  children?: React.ReactNode;
  index: TabValue;
  value: TabValue;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`catalog-tabpanel-${index}`}
      aria-labelledby={`catalog-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const CatalogTabs = () => {
  const [tabValue, setTabValue] = useState<TabValue>('services');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Завантажуємо дані для отримання кількості елементів у бейджах
  const { data: servicesData } = useListServices({ active: true });
  const { data: itemsData } = useListItems({ active: true });
  const { data: priceListData } = useListPriceListItems({ active: true });
  const { data: serviceItemsData } = useListServiceItems({ active: true });

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setTabValue(newValue);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleServiceSuccess = (service: ServiceInfo) => {
    // Refresh services data or show success message
    console.log('Service saved:', service);
  };

  const handleItemSuccess = (item: ItemInfo) => {
    // Refresh items data or show success message
    console.log('Item saved:', item);
  };

  const handleServiceItemSuccess = (serviceItem: ServiceItemInfo) => {
    // Refresh service items data or show success message
    console.log('Service item saved:', serviceItem);
  };

  const getTabCount = (tab: TabValue): number => {
    switch (tab) {
      case 'services':
        return servicesData?.services?.length || 0;
      case 'items':
        return itemsData?.items?.length || 0;
      case 'priceList':
        return priceListData?.priceListItems?.length || 0;
      case 'serviceItems':
        return serviceItemsData?.serviceItems?.length || 0;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Вкладки каталогу"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Badge badgeContent={getTabCount('services')} color="primary">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeRepairService />
                  Послуги
                </Box>
              </Badge>
            }
            value="services"
            id="catalog-tab-services"
            aria-controls="catalog-tabpanel-services"
          />
          <Tab
            label={
              <Badge badgeContent={getTabCount('items')} color="primary">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory />
                  Товари
                </Box>
              </Badge>
            }
            value="items"
            id="catalog-tab-items"
            aria-controls="catalog-tabpanel-items"
          />
          <Tab
            label={
              <Badge badgeContent={getTabCount('priceList')} color="primary">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PriceCheck />
                  Прайс-лист
                </Box>
              </Badge>
            }
            value="priceList"
            id="catalog-tab-priceList"
            aria-controls="catalog-tabpanel-priceList"
          />
          <Tab
            label={
              <Badge badgeContent={getTabCount('serviceItems')} color="primary">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkIcon />
                  Комбінації
                </Box>
              </Badge>
            }
            value="serviceItems"
            id="catalog-tab-serviceItems"
            aria-controls="catalog-tabpanel-serviceItems"
          />
        </Tabs>
      </Box>

      {/* Фільтри для активної вкладки */}
      <CatalogFilters 
        mode={tabValue} 
        onSearch={handleSearch}
      />

      {/* Вміст вкладок */}
      <TabPanel value={tabValue} index="services">
        <ServiceList />
      </TabPanel>

      <TabPanel value={tabValue} index="items">
        <ItemList />
      </TabPanel>

      <TabPanel value={tabValue} index="priceList">
        <PriceList />
      </TabPanel>

      <TabPanel value={tabValue} index="serviceItems">
        <Box>
          {/* TODO: Створити ServiceItemList компонент */}
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            ServiceItemList компонент буде створено пізніше
          </Box>
        </Box>
      </TabPanel>

      {/* Універсальна модалка для форм */}
      <CatalogModal
        onServiceSuccess={handleServiceSuccess}
        onItemSuccess={handleItemSuccess}
        onServiceItemSuccess={handleServiceItemSuccess}
      />
    </Box>
  );
};