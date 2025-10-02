import { api } from '@/services/api';
import { Mortgage } from '@/types';

// Тип для создания новой ипотеки (без id, user, status)
type NewMortgage = Omit<Mortgage, 'id' | 'user' | 'status'>;

export const mortgagesApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getMortgages: builder.query<Mortgage[], void>({
      query: () => 'mortgages/',
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Mortgage' as const, id })),
        { type: 'Mortgage', id: 'LIST' },
      ],
    }),
    addMortgage: builder.mutation<Mortgage, NewMortgage>({
      query: (mortgage) => ({
        url: 'mortgages/',
        method: 'POST',
        body: mortgage,
      }),
      // После успешного создания, инвалидируем кэш списка, чтобы он автоматически обновился
      invalidatesTags: [{ type: 'Mortgage', id: 'LIST' }],
    }),
  }),
});

// Экспортируем хук для использования в компонентах
export const { useGetMortgagesQuery, useAddMortgageMutation } = mortgagesApiSlice;
