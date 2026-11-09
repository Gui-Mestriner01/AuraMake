import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store/StoreContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminSales from './pages/admin/AdminSales'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/loja" element={<Catalog />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="promocoes" element={<AdminPromotions />} />
            <Route path="vendas" element={<AdminSales />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
