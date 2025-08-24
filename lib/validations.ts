import { z } from 'zod';

// Common validation schemas
export const storeIdSchema = z.object({
  storeId: z.string().uuid('Invalid store ID format')
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  price: z.number().positive('Price must be positive').min(0.01, 'Price must be at least 0.01'),
  categoryId: z.string().uuid('Invalid category ID format'),
  colorId: z.string().uuid('Invalid color ID format'),
  sizeId: z.string().uuid('Invalid size ID format'),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL')
  })).min(1, 'At least one image is required'),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional()
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  billboardId: z.string().uuid('Invalid billboard ID format')
});

export const billboardSchema = z.object({
  label: z.string().min(1, 'Label is required').max(255, 'Label too long'),
  imageUrl: z.string().url('Invalid image URL')
});

export const colorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  value: z.string().min(1, 'Value is required').max(7, 'Invalid color value')
});

export const sizeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  value: z.string().min(1, 'Value is required').max(50, 'Value too long')
});

export const storeSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(255, 'Store name too long')
});

// Validation helper function
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};
