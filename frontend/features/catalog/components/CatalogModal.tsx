'use client';

/**
 * @fileoverview Універсальна модалка для форм каталогу
 */

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  ServiceForm,
  ItemForm,
  ServiceItemForm,
  useCatalogStore,
  CATALOG_MODAL_TYPES,
} from '@/features/catalog';
import type { 
  ServiceInfo, 
  ItemInfo, 
  ServiceItemInfo 
} from '@/shared/api/generated/serviceItem';

interface CatalogModalProps {
  // Дані для редагування
  service?: ServiceInfo;
  item?: ItemInfo;
  serviceItem?: ServiceItemInfo;
  
  // Попередньо обрані значення для ServiceItemForm
  preselectedServiceId?: string;
  preselectedItemId?: string;
  
  // Колбеки успіху
  onServiceSuccess?: (service: ServiceInfo) => void;
  onItemSuccess?: (item: ItemInfo) => void;
  onServiceItemSuccess?: (serviceItem: ServiceItemInfo) => void;
}

export const CatalogModal = ({
  service,
  item,
  serviceItem,
  preselectedServiceId,
  preselectedItemId,
  onServiceSuccess,
  onItemSuccess,
  onServiceItemSuccess,
}: CatalogModalProps) => {
  const { modalType, closeModal } = useCatalogStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const open = modalType !== null;

  const handleSuccess = (data: any) => {
    switch (modalType) {
      case CATALOG_MODAL_TYPES.SERVICE:
        onServiceSuccess?.(data);
        break;
      case CATALOG_MODAL_TYPES.ITEM:
        onItemSuccess?.(data);
        break;
      case CATALOG_MODAL_TYPES.SERVICE_ITEM:
        onServiceItemSuccess?.(data);
        break;
    }
    closeModal();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case CATALOG_MODAL_TYPES.SERVICE:
        return (
          <ServiceForm
            service={service}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        );
      
      case CATALOG_MODAL_TYPES.ITEM:
        return (
          <ItemForm
            item={item}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        );
      
      case CATALOG_MODAL_TYPES.SERVICE_ITEM:
        return (
          <ServiceItemForm
            serviceItem={serviceItem}
            preselectedServiceId={preselectedServiceId}
            preselectedItemId={preselectedItemId}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        );
      
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case CATALOG_MODAL_TYPES.SERVICE:
        return service ? 'Редагувати послугу' : 'Створити послугу';
      case CATALOG_MODAL_TYPES.ITEM:
        return item ? 'Редагувати товар' : 'Створити товар';
      case CATALOG_MODAL_TYPES.SERVICE_ITEM:
        return serviceItem ? 'Редагувати комбінацію' : 'Створити комбінацію';
      default:
        return '';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: fullScreen ? 'auto' : '60vh',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {getModalTitle()}
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent
        sx={{
          p: fullScreen ? 2 : 3,
          '& .MuiPaper-root': {
            boxShadow: 'none',
            p: fullScreen ? 0 : 3,
          }
        }}
      >
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};