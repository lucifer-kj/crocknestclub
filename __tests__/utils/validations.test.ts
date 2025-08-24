import { validateRequest, productSchema, storeIdSchema } from '@/lib/validations';

describe('Validation Utils', () => {
  describe('validateRequest', () => {
    it('should return success with valid data', () => {
      const validProduct = {
        name: 'Test Product',
        price: 29.99,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        colorId: '123e4567-e89b-12d3-a456-426614174001',
        sizeId: '123e4567-e89b-12d3-a456-426614174002',
        images: [{ url: 'https://example.com/image.jpg' }],
        isFeatured: false,
        isArchived: false
      };

      const result = validateRequest(productSchema, validProduct);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validProduct);
      }
    });

    it('should return failure with invalid data', () => {
      const invalidProduct = {
        name: '', // Empty name
        price: -10, // Negative price
        categoryId: 'invalid-uuid',
        colorId: '123e4567-e89b-12d3-a456-426614174001',
        sizeId: '123e4567-e89b-12d3-a456-426614174002',
        images: [], // Empty images array
        isFeatured: false,
        isArchived: false
      };

      const result = validateRequest(productSchema, invalidProduct);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('name: Name is required');
        expect(result.errors).toContain('price: Price must be positive');
        expect(result.errors).toContain('categoryId: Invalid category ID format');
        expect(result.errors).toContain('images: At least one image is required');
      }
    });

    it('should validate store ID format', () => {
      const validStoreId = { storeId: '123e4567-e89b-12d3-a456-426614174000' };
      const invalidStoreId = { storeId: 'invalid-uuid' };

      const validResult = validateRequest(storeIdSchema, validStoreId);
      const invalidResult = validateRequest(storeIdSchema, invalidStoreId);

      expect(validResult.success).toBe(true);
      expect(invalidResult.success).toBe(false);
    });
  });

  describe('productSchema', () => {
    it('should accept valid product data', () => {
      const validProduct = {
        name: 'Test Product',
        price: 29.99,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        colorId: '123e4567-e89b-12d3-a456-426614174001',
        sizeId: '123e4567-e89b-12d3-a456-426614174002',
        images: [{ url: 'https://example.com/image.jpg' }]
      };

      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject invalid URLs in images', () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 29.99,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        colorId: '123e4567-e89b-12d3-a456-426614174001',
        sizeId: '123e4567-e89b-12d3-a456-426614174002',
        images: [{ url: 'not-a-valid-url' }]
      };

      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });
});
