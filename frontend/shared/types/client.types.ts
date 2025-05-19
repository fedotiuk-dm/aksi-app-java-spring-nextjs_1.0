export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
  communicationChannels: CommunicationChannel[];
  source: {
    source: ClientSource;
    details?: string;
  };
}

export type CommunicationChannel = 'PHONE' | 'SMS' | 'EMAIL' | 'TELEGRAM';
export type ClientSource = 'RECOMMENDATION' | 'WEBSITE' | 'SOCIAL_MEDIA' | 'OTHER';
