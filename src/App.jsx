import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store/StoreContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Info from './pages/Info'
import OrderSent from './pages/OrderSent'
import NotFound from './pages/NotFound'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminSales from './pages/admin/AdminSales'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/loja" element={<Catalog />} />
            <Route path="/produto/:id" element={<Product />} />
            <Route path="/ajuda" element={<Info />} />
            <Route path="/pedido/:codigo" element={<OrderSent />} />
            {/* qualquer outro endereço: tela 404 (com cabeçalho e rodapé da loja) */}
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="promocoes" element={<AdminPromotions />} />
            <Route path="vendas" element={<AdminSales />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
