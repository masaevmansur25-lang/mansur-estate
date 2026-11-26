import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import AdminDashboard from '@/admin/AdminDashboard';

function Layout() {
  const { session } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header isAuth={session !== null} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
