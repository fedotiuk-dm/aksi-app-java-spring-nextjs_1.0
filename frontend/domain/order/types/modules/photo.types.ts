/**
 * Типи для модуля Photo (Фотодокументація)
 */

/**
 * Фотографія предмета замовлення
 */
export interface OrderItemPhoto {
  id?: string;
  orderItemId: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  url?: string;
  thumbnailUrl?: string;
  description?: string;
  annotations?: PhotoAnnotation[];
  metadata?: PhotoMetadata;
  uploadedAt: Date;
  uploadedBy?: string;
}

/**
 * Анотація (позначка) на фото
 */
export interface PhotoAnnotation {
  id?: string;
  photoId: string;
  type: AnnotationType;
  position: Position;
  size: Size;
  text?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  color?: string;
  createdAt: Date;
  createdBy?: string;
}

/**
 * Типи анотацій
 */
export enum AnnotationType {
  STAIN = 'STAIN', // Пляма
  DEFECT = 'DEFECT', // Дефект
  WEAR = 'WEAR', // Знос
  DAMAGE = 'DAMAGE', // Пошкодження
  REPAIR_NEEDED = 'REPAIR_NEEDED', // Потребує ремонту
  ATTENTION = 'ATTENTION', // Увага
  NOTE = 'NOTE', // Примітка
}

/**
 * Позиція на фото
 */
export interface Position {
  x: number; // в пікселях або відсотках
  y: number;
}

/**
 * Розмір області
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Метадані фото
 */
export interface PhotoMetadata {
  width: number;
  height: number;
  dpi?: number;
  colorSpace?: string;
  camera?: CameraInfo;
  location?: GeoLocation;
  timestamp: Date;
  compression?: string;
  orientation?: number;
}

/**
 * Інформація про камеру
 */
export interface CameraInfo {
  make?: string;
  model?: string;
  software?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  flash?: boolean;
}

/**
 * Геолокація
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

/**
 * Параметри завантаження фото
 */
export interface PhotoUploadParams {
  itemId: string;
  file: File;
  description?: string;
  autoGenerateAnnotations?: boolean;
  compressImage?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-100
}

/**
 * Результат завантаження фото
 */
export interface PhotoUploadResult {
  success: boolean;
  photo?: OrderItemPhoto;
  errors?: string[];
  warnings?: string[];
  compressionApplied?: boolean;
  originalSize?: number;
  finalSize?: number;
}

/**
 * Параметри обробки фото
 */
export interface PhotoProcessingParams {
  resize?: {
    width: number;
    height: number;
    maintainAspectRatio: boolean;
  };
  compression?: {
    quality: number;
    format: 'JPEG' | 'PNG' | 'WEBP';
  };
  watermark?: {
    text: string;
    position: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'CENTER';
    opacity: number;
  };
  autoEnhance?: boolean;
}

/**
 * Групування фото
 */
export interface PhotoGroup {
  id: string;
  orderItemId: string;
  name: string;
  description?: string;
  photos: OrderItemPhoto[];
  coverPhotoId?: string;
  createdAt: Date;
}

/**
 * Параметри пошуку фото
 */
export interface PhotoSearchParams {
  orderItemIds?: string[];
  annotationTypes?: AnnotationType[];
  uploadDateFrom?: Date;
  uploadDateTo?: Date;
  hasAnnotations?: boolean;
  minFileSize?: number;
  maxFileSize?: number;
  mimeTypes?: string[];
  keyword?: string;
}

/**
 * Результат пошуку фото
 */
export interface PhotoSearchResult {
  photos: OrderItemPhoto[];
  totalCount: number;
  groupedByItem: Record<string, OrderItemPhoto[]>;
  stats: PhotoStats;
}

/**
 * Статистика фото
 */
export interface PhotoStats {
  totalPhotos: number;
  totalSize: number;
  averageSize: number;
  byMimeType: Record<string, number>;
  byAnnotationType: Record<AnnotationType, number>;
  photosWithAnnotations: number;
  photosWithoutAnnotations: number;
}

/**
 * Налаштування камери
 */
export interface CameraSettings {
  resolution: '720p' | '1080p' | '4K';
  quality: 'LOW' | 'MEDIUM' | 'HIGH';
  autoFocus: boolean;
  flashMode: 'AUTO' | 'ON' | 'OFF';
  compressionLevel: number;
  saveToGallery: boolean;
}

/**
 * Шаблон анотації
 */
export interface AnnotationTemplate {
  id: string;
  name: string;
  type: AnnotationType;
  defaultText?: string;
  defaultColor?: string;
  defaultSize?: Size;
  category: string;
  usage: number;
}
