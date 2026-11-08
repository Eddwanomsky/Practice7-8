# Practice 7-8: Full-Stack CRUD Application & Authentication

Цей репозиторій містить реалізацію клієнтської частини повноцінного веб-додатку для управління сутностями (`Car`) із підтримкою взаємодії з бекендом, валідацією форм, управлінням станом та авторизацією на основі JWT.

---

##опис реалізованого функціоналу

У межах практичної роботи було реалізовано:
* **Управління сутностями (CRUD):** Відображення списку автомобілів у таблиці, обробка зв'язків (отримання назви бренду як рядка з бекенда), створення та редагування записів.
* **Асинхронний стан та кешування:** Інтеграція **TanStack Query** (React Query) для ефективного отримання даних, кешування та виконання мутацій.
* **Валідація та форми:** Побудова зручних форм за допомогою **React Hook Form** та валідація даних на базі схем **Zod**.
* **Глобальний стан та безпека:** Управління станом сесії за допомогою **Zustand** із персистентністю в `localStorage`.
* **Автоматичне ін'єктування токена:** Налаштування екземпляра **Axios** та request-інтерцептора для автоматичного додавання заголовка `Authorization: Bearer <token>` до кожного захищеного запиту.

---

##Приклади коду

### 1. Конфігурація Axios та Request-інтерцептор (`src/api/axiosInstance.ts`)
Динамічне додавання JWT-токена з глобального Zustand-стору до кожного вихідного HTTP-запиту:

```typescript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Приклад кастомного хука для створення нової сутності з обробкою кешу:

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosInstance';
import { CarFormValues } from '../types';

export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCar: CarFormValues) => {
      const response = await api.post('/cars', newCar);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
};

Опис правил валідації полів форми за допомогою Zod:
import { z } from 'zod';

export const carFormSchema = z.object({
  brandId: z.number({ invalid_type_error: 'Оберіть бренд' }),
  model: z.string().min(2, 'Модель занадто коротка'),
  year: z.number().min(1900, 'Некоректний рік').max(new Date().getFullYear(), 'Рік не може бути з майбутнього'),
  price: z.number().positive('Ціна має бути більшою за 0'),
  vin: z.string().length(17, 'VIN-код повинен складатись з 17 символів'),
});

export type CarFormValues = z.infer<typeof carFormSchema>;
<img width="1919" height="279" alt="image" src="https://github.com/user-attachments/assets/d849d494-e0fc-4ac9-9f3f-2eb2df72cacc" />

Коментарі щодо особливостей реалізації та труднощів
Під час інтеграції виникла специфіка роботи бекенда з реляційною сутністю Brand: хоча в базі використовується зв'язок ManyToOne, API повертає назву бренду безпосередньо у вигляді рядка (car.brand: "Toyota Motor"). Це було враховано у типізації фронтенда (brand?: string), що дозволило уникнути помилок рендерингу в таблиці.
Використання Zustand у парі з синхронізацією з localStorage дозволило надійно зберігати JWT-токен між перезавантаженнями сторінки та швидко отримувати до нього доступ усередині Axios-інтерцепторів поза React-компонентами.
Проєкт налаштований із використанням сучасного стека (TanStack Router / React Router), що вимагало уважної структуризації файлових маршрутів та коректної обробки захищених роутів.
