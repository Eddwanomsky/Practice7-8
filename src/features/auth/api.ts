import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const loginSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(6, 'Пароль має бути не менше 6 символів'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token?: string;
  token?: string;
}

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Зберігаємо токен (підлаштуйте під назву поля у вашому پاسخі бекенда: access_token або token)
      const token = data.access_token || data.token;
      if (token) {
        setToken(token);
        navigate('/cars'); // Перенаправлення на головну сторінку після успішного входу
      }
    },
  });
};