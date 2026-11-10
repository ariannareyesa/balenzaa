import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Catalog from './components/Catalog';
import CareGuide from './components/CareGuide';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CartDrawer from './components/CartDrawer';
import OrderModal from './components/OrderModal';
import AdminPanel from './components/AdminPanel';

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#admin');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Estados independientes para evitar que se mezclen el carrito y el encargo personalizado
  const [isCartOrderModalOpen, setIsCartOrderModalOpen] = useState(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [cartOrderDetails, setCartOrderDetails] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('balenzaa_carrito');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  if (isAdminRoute) {
    return <AdminPanel onBackToStore={() => { window.location.hash = ''; setIsAdminRoute(false); }} />;
  }

  const totalCartItems = cart.reduce((acc, item) => acc + (item.cantidad || 0), 0);

  return (
    <div className="cuerpo-tienda">
      <Navbar 
        cartCount={totalCartItems} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenModal={() => {
          // Abre el modal exclusivo de Encargo Personalizado
          setIsCustomOrderModalOpen(true);
        }} 
      />
      <main>
        <Hero onOpenModal={() => {
          // Abre el modal exclusivo de Encargo Personalizado desde el banner principal
          setIsCustomOrderModalOpen(true);
        }} />
        <About />
        <Catalog onAddToCart={(prod) => {
          let updated = [...cart];
          const idx = updated.findIndex(i => i.nombre === prod.nombre);
          if (idx > -1) updated[idx].cantidad += 1;
          else updated.push({ ...prod, cantidad: 1, observacion: '' });
          setCart(updated);
          localStorage.setItem('balenzaa_carrito', JSON.stringify(updated));
        }} />
        <CareGuide />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={(idx, delta) => {
          let updated = [...cart];
          if (updated[idx].cantidad + delta > 0) updated[idx].cantidad += delta;
          else updated.splice(idx, 1);
          setCart(updated);
          localStorage.setItem('balenzaa_carrito', JSON.stringify(updated));
        }}
        onRemoveItem={(idx) => {
          let updated = [...cart];
          updated.splice(idx, 1);
          setCart(updated);
          localStorage.setItem('balenzaa_carrito', JSON.stringify(updated));
        }}
        onUpdateObservation={(idx, obs) => {
          let updated = [...cart];
          updated[idx].observacion = obs;
          setCart(updated);
          localStorage.setItem('balenzaa_carrito', JSON.stringify(updated));
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          
          let res = 'Pedido desde el catálogo:\n';
          cart.forEach(i => {
            res += `- ${i.cantidad}x ${i.nombre} ($${((parseFloat(i.precio) || 0) * i.cantidad).toFixed(2)})`;
            if (i.observacion && i.observacion.trim() !== '') {
              res += ` [Nota: ${i.observacion.trim()}]`;
            }
            res += '\n';
          });

          setCartOrderDetails(res);
          setIsCartOrderModalOpen(true);
        }}
      />

      {/* Modal exclusivo para pedidos que vienen del Carrito */}
      <OrderModal 
        isOpen={isCartOrderModalOpen}
        onClose={() => setIsCartOrderModalOpen(false)}
        initialDetails={cartOrderDetails}
        onPedidoExitoso={() => {
          setCart([]);
          localStorage.removeItem('balenzaa_carrito');
        }}
      />

      {/* Modal exclusivo para Encargo Personalizado */}
      <OrderModal 
        isOpen={isCustomOrderModalOpen}
        onClose={() => setIsCustomOrderModalOpen(false)}
        initialDetails=""
      />
    </div>
  );
}

export default App;