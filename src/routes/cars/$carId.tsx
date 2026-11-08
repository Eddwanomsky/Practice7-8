import { createFileRoute, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCar, useUpdateCar } from '../../features/cars/api';
import { useEffect } from 'react';

// Схема валідації через Zod
const carSchema = z.object({
  brand: z.string().min(2, 'Brand name is too short'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year'),
  price: z.number().positive('Price must be a positive number'),
});

type CarFormData = z.infer<typeof carSchema>;

export const Route = createFileRoute('/cars/$carId')({
  component: CarDetailPage,
});

function CarDetailPage() {
  const { carId } = useParams({ from: '/cars/$carId' });
  const { data: car, isLoading, isError } = useCar(carId);
  const updateCarMutation = useUpdateCar();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  });

  useEffect(() => {
    if (car) {
      reset({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
      });
    }
  }, [car, reset]);

  const onSubmit = (data: CarFormData) => {
    updateCarMutation.mutate({ id: carId, data });
  };

  if (isLoading) return <div className="p-4">Loading car details...</div>;
  if (isError || !car) return <div className="p-4 text-red-500">Car not found or failed to load.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Edit Car: {car.model}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="brand" className="block font-medium mb-1">Brand</label>
          <input
            id="brand"
            {...register('brand')}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        <div>
          <label htmlFor="model" className="block font-medium mb-1">Model</label>
          <input
            id="model"
            {...register('model')}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
        </div>

        <div>
          <label htmlFor="year" className="block font-medium mb-1">Year</label>
          <input
            id="year"
            type="number"
            {...register('year', { valueAsNumber: true })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block font-medium mb-1">Price ($)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <button
          type="submit"
          disabled={updateCarMutation.isPending}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition"
        >
          {updateCarMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}