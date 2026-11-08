import { z } from 'zod';

export const carFormSchema = z.object({
  brandId: z.coerce.number().min(1, 'Brand ID is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1900, 'Invalid year').max(2100, 'Invalid year'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  vin: z.string().length(17, 'VIN must be exactly 17 characters'),
  status: z.enum(['available', 'reserved', 'sold']).optional(),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export interface CreateCarDTO {
  brandId: number;
  model: string;
  year: number;
  price: number;
  vin: string;
  status?: 'available' | 'reserved' | 'sold';
}

export interface Brand {
  id: number;
  name: string;
}

export interface Car {
  id: number;
  model: string;
  year: number;
  price: number | string;
  vin: string;
  status?: 'available' | 'reserved' | 'sold';
  brand?: string; // <--- строка, а не объект Brand
}