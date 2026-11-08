import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carFormSchema, CarFormValues } from '../types';
import { useCreateCar } from '../api';

export default function CreateCarPage() {
  const { mutate: createCar, isPending } = useCreateCar();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
  });

  const onSubmit = (data: CarFormValues) => {
    createCar({
      ...data,
      year: Number(data.year),
      price: Number(data.price),
      brandId: Number(data.brandId), // ID бренда для бэкенда
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Add New Car</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand ID</label>
          <input 
            type="number" 
            {...register('brandId', { valueAsNumber: true })} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
            placeholder="Введіть ID бренду (напр. 6)"
          />
          {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input {...register('model')} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input type="number" {...register('year', { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">VIN</label>
          <input {...register('vin')} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Create Car'}
        </button>
      </form>
    </div>
  );
}