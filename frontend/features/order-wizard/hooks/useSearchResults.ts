import { useCallback } from 'react';
import { Client } from '../model/types';

interface UseSearchResultsProps {
  clients?: Client[];
}

interface UseSearchResultsResult {
  hasResults: boolean;
  handleClientSelect: (client: Client, onSelect: (client: Client) => void) => void;
  handleClientEdit: (client: Client, onEdit: (client: Client) => void) => void;
  getChannelLabel: (channel: string) => string;
}

/**
 * Хук для управління відображенням результатів пошуку клієнтів
 */
export const useSearchResults = (props: UseSearchResultsProps): UseSearchResultsResult => {
  const { clients = [] } = props;
  
  // Перевірка наявності результатів
  const hasResults = clients.length > 0;
  
  // Обробка вибору клієнта
  const handleClientSelect = useCallback((client: Client, onSelect: (client: Client) => void) => {
    onSelect(client);
  }, []);
  
  // Обробка редагування клієнта
  const handleClientEdit = useCallback((client: Client, onEdit: (client: Client) => void) => {
    onEdit(client);
  }, []);
  
  // Отримання зрозумілої назви для каналу комунікації
  const getChannelLabel = useCallback((channel: string): string => {
    switch (channel) {
      case 'PHONE':
        return 'Телефон';
      case 'SMS':
        return 'SMS';
      case 'VIBER':
        return 'Viber';
      case 'TELEGRAM':
        return 'Telegram';
      case 'EMAIL':
        return 'Email';
      default:
        return channel;
    }
  }, []);
  
  return {
    hasResults,
    handleClientSelect,
    handleClientEdit,
    getChannelLabel
  };
};
