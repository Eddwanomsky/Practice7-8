import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import { Car, CreateCarDTO } from './types'; // Добавлен импорт CreateCarDTO, если он у вас в types

const getCars = async (): Promise<Car[]> => {
  const response = await apiClient.get('/api/cars'); 
  return response.data;
};

const getCarById = async (id: string): Promise<Car> => {
  const response = await apiClient.get(`/api/cars/${id}`); // Добавлен префикс /api
  return response.data;
};

// Приклад правильного запиту
export const createCar = async (data: CreateCarDTO) => {
  const response = await apiClient.post('/cars', {
    brand: data.brandId,   // Текстове поле
    model: data.model,   // Текстове поле
    year: Number(data.year),
    price: Number(data.price),
    vin: data.vin,
  });
  return response.data;
};
const updateCar = async ({ id, data }: { id: string; data: Partial<Car> }): Promise<Car> => {
  const response = await apiClient.put(`/api/cars/${id}`, data); // Добавлен префикс /api
  return response.data;
};

const deleteCar = async (id: string) => {
  await apiClient.delete(`/api/cars/${id}`);
};

// Хуки
export const useCars = () => useQuery<Car[]>({ queryKey: ['cars'], queryFn: getCars });

export const useCar = (id: string) => useQuery<Car>({ queryKey: ['cars', id], queryFn: () => getCarById(id) });

export function useCreateCar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newCar: CreateCarDTO) => apiClient.post('/cars', newCar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      navigate({ to: '/cars' }); // Возвращает на страницу со списком
    },
  });
}

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateCar,
    onSuccess: (updatedCar) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.setQueryData(['cars', updatedCar.id], updatedCar);
      navigate({ to: '/cars' });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
};