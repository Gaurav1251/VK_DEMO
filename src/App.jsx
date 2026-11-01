import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/site/SiteLayout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Quality from './pages/Quality';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/AdminProducts';
import AdminCategories from './admin/AdminCategories';
import AdminEnquiries from './admin/AdminEnquiries';
import AdminOrders from './admin/AdminOrders';
import OrderDetail from './admin/OrderDetail';
import OrderDocument from './admin/OrderDocument';
import AdminSettings from './admin/AdminSettings';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="quality" element={<Quality />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin is intentionally not linked from the public site. */}
      <Route path="admin" element={<AdminLogin />} />
      {/* Bills and receipts: full page, no admin menu, ready to print */}
      <Route path="admin/orders/:id/bill" element={<OrderDocument type="bill" />} />
      <Route path="admin/orders/:id/receipt/:paymentId" element={<OrderDocument type="receipt" />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
