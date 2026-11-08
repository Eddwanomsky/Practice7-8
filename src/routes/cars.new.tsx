import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCar } from '../features/cars/api';
import { carFormSchema, CarFormValues } from '../features/cars/types'; // Импортируем общую схему и тип

export const Route = createFileRoute('/cars/new')({
  component: CreateCarPage,
});

function CreateCarPage() {
  const createCarMutation = useCreateCar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
  });

  const onSubmit = (data: CarFormValues) => {
    createCarMutation.mutate(data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Add New Car</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="brand" className="block font-medium mb-1">Brand</label>
          <input
            id="brand"
            {...register('brand')}
            placeholder="e.g. Toyota"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        <div>
          <label htmlFor="model" className="block font-medium mb-1">Model</label>
          <input
            id="model"
            {...register('model')}
            placeholder="e.g. Camry"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
        </div>

        <div>
          <label htmlFor="year" className="block font-medium mb-1">Year</label>
          <input
            id="year"
            type="number"
            {...register('year')}
            placeholder="2023"
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
            {...register('price')}
            placeholder="25000"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="vin" className="block font-medium mb-1">VIN Code</label>
          <input
            id="vin"
            {...register('vin')}
            placeholder="1HGBH..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin.message}</p>}
        </div>

        <button
          type="submit"
          disabled={createCarMutation.isPending}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {createCarMutation.isPending ? 'Creating...' : 'Create Car'}
        </button>
      </form>
    </div>
  );
}