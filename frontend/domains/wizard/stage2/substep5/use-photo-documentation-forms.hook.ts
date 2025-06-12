/**
 * @fileoverview Хук для форм Substep5 Photo Documentation
 *
 * Відповідальність: React Hook Form + Zod валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import {
  photoUploadSchema,
  photoEditSchema,
  cameraSettingsSchema,
  photoFilterSchema,
  documentationValidationSchema,
  documentationCompletionSchema,
  gallerySettingsSchema,
  type PhotoUploadFormData,
  type PhotoEditFormData,
  type CameraSettingsFormData,
  type PhotoFilterFormData,
  type DocumentationValidationFormData,
  type DocumentationCompletionFormData,
  type GallerySettingsFormData,
} from './photo-documentation.schemas';

/**
 * Хук для форми завантаження фото
 */
export const usePhotoUploadForm = (
  onSubmit?: (data: PhotoUploadFormData) => void,
  defaultValues?: Partial<PhotoUploadFormData>
): UseFormReturn<PhotoUploadFormData> & {
  submitHandler: (data: PhotoUploadFormData) => void;
  resetForm: () => void;
  isValid: boolean;
} => {
  const form = useForm<PhotoUploadFormData>({
    resolver: zodResolver(photoUploadSchema),
    defaultValues: {
      description: '',
      annotations: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const submitHandler = useCallback(
    (data: PhotoUploadFormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    form.reset({
      description: '',
      annotations: '',
      ...defaultValues,
    });
  }, [form, defaultValues]);

  const isValid = form.formState.isValid;

  return {
    ...form,
    submitHandler,
    resetForm,
    isValid,
  };
};

/**
 * Хук для форми редагування фото
 */
export const usePhotoEditForm = (
  onSubmit?: (data: PhotoEditFormData) => void,
  defaultValues?: Partial<PhotoEditFormData>
): UseFormReturn<PhotoEditFormData> & {
  submitHandler: (data: PhotoEditFormData) => void;
  resetForm: () => void;
  isValid: boolean;
} => {
  const form = useForm<PhotoEditFormData>({
    resolver: zodResolver(photoEditSchema),
    defaultValues: {
      photoId: '',
      description: '',
      annotations: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const submitHandler = useCallback(
    (data: PhotoEditFormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    form.reset({
      photoId: '',
      description: '',
      annotations: '',
      ...defaultValues,
    });
  }, [form, defaultValues]);

  const isValid = form.formState.isValid;

  return {
    ...form,
    submitHandler,
    resetForm,
    isValid,
  };
};

/**
 * Хук для форми налаштувань камери
 */
export const useCameraSettingsForm = (
  onSubmit?: (data: CameraSettingsFormData) => void,
  defaultValues?: Partial<CameraSettingsFormData>
): UseFormReturn<CameraSettingsFormData> & {
  submitHandler: (data: CameraSettingsFormData) => void;
  resetForm: () => void;
  isValid: boolean;
} => {
  const form = useForm<CameraSettingsFormData>({
    resolver: zodResolver(cameraSettingsSchema),
    defaultValues: {
      quality: 'medium',
      facingMode: 'environment',
      enableFlash: false,
      autoFocus: true,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const submitHandler = useCallback(
    (data: CameraSettingsFormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    form.reset({
      quality: 'medium',
      facingMode: 'environment',
      enableFlash: false,
      autoFocus: true,
      ...defaultValues,
    });
  }, [form, defaultValues]);

  const isValid = form.formState.isValid;

  return {
    ...form,
    submitHandler,
    resetForm,
    isValid,
  };
};

/**
 * Хук для форми фільтрування фото
 */
export const usePhotoFilterForm = (
  onSubmit?: (data: PhotoFilterFormData) => void,
  defaultValues?: Partial<PhotoFilterFormData>
): UseFormReturn<PhotoFilterFormData> & {
  submitHandler: (data: PhotoFilterFormData) => void;
  resetForm: () => void;
  isValid: boolean;
} => {
  const form = useForm<PhotoFilterFormData>({
    resolver: zodResolver(photoFilterSchema),
    defaultValues: {
      searchTerm: '',
      sortBy: 'date',
      sortOrder: 'desc',
      showOnlyWithAnnotations: false,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const submitHandler = useCallback(
    (data: PhotoFilterFormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    form.reset({
      searchTerm: '',
      sortBy: 'date',
      sortOrder: 'desc',
      showOnlyWithAnnotations: false,
      ...defaultValues,
    });
  }, [form, defaultValues]);

  const isValid = form.formState.isValid;

  return {
    ...form,
    submitHandler,
    resetForm,
    isValid,
  };
};

/**
 * Хук для форми валідації документації
 */
export const useDocumentationValidationForm = (
  onSubmit?: (data: DocumentationValidationFormData) => void,
  defaultValues?: Partial<DocumentationValidationFormData>
): UseFormReturn<DocumentationValidationFormData> & {
  submitHandler: (data: DocumentationValidationFormData) => void;
  resetForm: () => void;
  isValid: boolean;
} => {
  const form = useForm<DocumentationValidationFormData>({
    resolver: zodResolver(documentationValidationSchema),
    defaultValues: {
      minPhotosRequired: 1,
      maxPhotosAllowed: 5,
      requireDescriptions: false,
      requireAnnotations: false,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const submitHandler = useCallback(
    (data: DocumentationValidationFormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    form.reset({
      minPhotosRequired: 1,
      maxPhotosAllowed: 5,
      requireDescriptions: false,
      requireAnnotations: false,
      ...defaultValues,
    });
  }, [form, defaultValues]);

  const isValid = form.formState.isValid;

  return {
    ...form,
    submitHandler,
    resetForm,
    isValid,
  };
};

/**
 * Хук для форми завершення документації
 */
export const useDocumentationCompletionForm = (
  onSubmit?: (data: DocumentationCompletionFormData) => void,
  defaultValues?: Partial<DocumentationCompletionFormData>
): UseFormReturn<DocumentationCompletionFormData> & {
  submitHandler: (data: DocumentationCompletionFormData) => void;
  resetForm: () => void;
  isValid: boolean;
} => {
  const form = useForm<DocumentationCompletionFormData>({
    resolver: zodResolver(documentationCompletionSchema),
    defaultValues: {
      notes: '',
      isComplete: false,
      skipReason: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const submitHandler = useCallback(
    (data: DocumentationCompletionFormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    form.reset({
      notes: '',
      isComplete: false,
      skipReason: '',
      ...defaultValues,
    });
  }, [form, defaultValues]);

  const isValid = form.formState.isValid;

  return {
    ...form,
    submitHandler,
    resetForm,
    isValid,
  };
};

/**
 * Хук для форми налаштувань галереї
 */
export const useGallerySettingsForm = (
  onSubmit?: (data: GallerySettingsFormData) => void,
  defaultValues?: Partial<GallerySettingsFormData>
): UseFormReturn<GallerySettingsFormData> & {
  submitHandler: (data: GallerySettingsFormData) => void;
  resetForm: () => void;
  isValid: boolean;
} => {
  const form = useForm<GallerySettingsFormData>({
    resolver: zodResolver(gallerySettingsSchema),
    defaultValues: {
      thumbnailSize: 'medium',
      showGrid: true,
      enableZoom: true,
      showMetadata: false,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const submitHandler = useCallback(
    (data: GallerySettingsFormData) => {
      onSubmit?.(data);
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    form.reset({
      thumbnailSize: 'medium',
      showGrid: true,
      enableZoom: true,
      showMetadata: false,
      ...defaultValues,
    });
  }, [form, defaultValues]);

  const isValid = form.formState.isValid;

  return {
    ...form,
    submitHandler,
    resetForm,
    isValid,
  };
};

/**
 * Композиційний хук для всіх форм фотодокументації
 */
export const usePhotoDocumentationForms = () => {
  // Форми
  const photoUploadForm = usePhotoUploadForm();
  const photoEditForm = usePhotoEditForm();
  const cameraSettingsForm = useCameraSettingsForm();
  const photoFilterForm = usePhotoFilterForm();
  const documentationValidationForm = useDocumentationValidationForm();
  const documentationCompletionForm = useDocumentationCompletionForm();
  const gallerySettingsForm = useGallerySettingsForm();

  // Стани валідності
  const formsValidity = useMemo(
    () => ({
      photoUpload: photoUploadForm.isValid,
      photoEdit: photoEditForm.isValid,
      cameraSettings: cameraSettingsForm.isValid,
      photoFilter: photoFilterForm.isValid,
      documentationValidation: documentationValidationForm.isValid,
      documentationCompletion: documentationCompletionForm.isValid,
      gallerySettings: gallerySettingsForm.isValid,
    }),
    [
      photoUploadForm.isValid,
      photoEditForm.isValid,
      cameraSettingsForm.isValid,
      photoFilterForm.isValid,
      documentationValidationForm.isValid,
      documentationCompletionForm.isValid,
      gallerySettingsForm.isValid,
    ]
  );

  // Стани помилок
  const formsErrors = useMemo(
    () => ({
      photoUpload: photoUploadForm.formState.errors,
      photoEdit: photoEditForm.formState.errors,
      cameraSettings: cameraSettingsForm.formState.errors,
      photoFilter: photoFilterForm.formState.errors,
      documentationValidation: documentationValidationForm.formState.errors,
      documentationCompletion: documentationCompletionForm.formState.errors,
      gallerySettings: gallerySettingsForm.formState.errors,
    }),
    [
      photoUploadForm.formState.errors,
      photoEditForm.formState.errors,
      cameraSettingsForm.formState.errors,
      photoFilterForm.formState.errors,
      documentationValidationForm.formState.errors,
      documentationCompletionForm.formState.errors,
      gallerySettingsForm.formState.errors,
    ]
  );

  // Методи скидання
  const resetAllForms = useCallback(() => {
    photoUploadForm.resetForm();
    photoEditForm.resetForm();
    cameraSettingsForm.resetForm();
    photoFilterForm.resetForm();
    documentationValidationForm.resetForm();
    documentationCompletionForm.resetForm();
    gallerySettingsForm.resetForm();
  }, [
    photoUploadForm,
    photoEditForm,
    cameraSettingsForm,
    photoFilterForm,
    documentationValidationForm,
    documentationCompletionForm,
    gallerySettingsForm,
  ]);

  return {
    forms: {
      photoUpload: photoUploadForm,
      photoEdit: photoEditForm,
      cameraSettings: cameraSettingsForm,
      photoFilter: photoFilterForm,
      documentationValidation: documentationValidationForm,
      documentationCompletion: documentationCompletionForm,
      gallerySettings: gallerySettingsForm,
    },
    validity: formsValidity,
    errors: formsErrors,
    resetAllForms,
  };
};

export type UsePhotoDocumentationFormsReturn = ReturnType<typeof usePhotoDocumentationForms>;
