import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '@/App';
import { CountryPage } from '@/pages/CountryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SearchPage } from '@/pages/SearchPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<SearchPage />} />
        <Route path="search/:query" element={<SearchPage />} />
        <Route path="country/:code" element={<CountryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
