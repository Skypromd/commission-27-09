import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../authSlice';
import { useGetMeQuery } from '../authApiSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const PersistLogin = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector(selectCurrentToken);

  // isUninitialized - запрос еще не выполнялся
  // isLoading - запрос выполняется
  const { isLoading, isUninitialized } = useGetMeQuery(undefined, {
    skip: !token, // Пропускаем запрос, если нет токена
  });

  useEffect(() => {
    // Этот эффект просто для отладки, можно убрать
    console.log(`Token: ${token}, isLoading: ${isLoading}, isUninitialized: ${isUninitialized}`);
  }, [token, isLoading, isUninitialized]);

  if (!token) {
    return <>{children}</>; // Если токена нет, просто рендерим дочерние элементы
  }

  if (isLoading || isUninitialized) {
    return <LoadingSpinner />; // Показываем спиннер, пока идет загрузка данных пользователя
  }

  return <>{children}</>; // После загрузки рендерим дочерние элементы
};

export default PersistLogin;

