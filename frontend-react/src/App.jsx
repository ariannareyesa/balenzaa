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

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalDetails, setOrderModalDetails] = useState('');

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('balenzaa_carrito');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('balenzaa_carrito', JSON.stringify(updatedCart));
  };

  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex(item => item.nombre === product.nombre);
    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].cantidad += 1;
    } else {
      updatedCart.push({ ...product, cantidad: 1, observacion: '' });
    }
    saveCartToStorage(updatedCart);
  };

  const handleUpdateQuantity = (index, delta) => {
    let updatedCart = [...cart];
    if (updatedCart[index].cantidad + delta > 0) {
      updatedCart[index].cantidad += delta;
    } else {
      updatedCart.splice(index, 1);
    }
    saveCartToStorage(updatedCart);
  };

  const handleRemoveItem = (index) => {
    let updatedCart = [...cart];
    updatedCart.splice(index, 1);
    saveCartToStorage(updatedCart);
  };

  const handleUpdateObservation = (index, observation) => {
    let updatedCart = [...cart];
    updatedCart[index].observacion = observation;
    saveCartToStorage(updatedCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    setIsCartOpen(false);

    // Preparar resumen del carrito para el modal de encargo
    let resumen = 'Pedido desde el catálogo:\n';
    cart.forEach(i => {
      resumen += `- ${i.cantidad}x ${i.nombre} ($${((parseFloat(i.precio) || 0) * i.cantidad).toFixed(2)})`;
      if (i.observacion) resumen += ` [Nota: ${i.observacion}]`;
      resumen += '\n';
    });

    setOrderModalDetails(resumen);
    setIsOrderModalOpen(true);
  };

  const handleOpenCustomOrder = () => {
    setOrderModalDetails('');
    setIsOrderModalOpen(true);
  };

  return (
    <div className="cuerpo-tienda">
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenModal={handleOpenCustomOrder} 
      />
      <main>
        <Hero onOpenModal={handleOpenCustomOrder} />
        <About />
        <Catalog onAddToCart={handleAddToCart} />
        <CareGuide />
        <FAQ />
      </main>
      
      <Footer />
      <WhatsAppButton />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onUpdateObservation={handleUpdateObservation}
        onCheckout={handleCheckout}
      />

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          
          // Actualizar carrito local por si se vació al confirmar pedido
          const savedCart = localStorage.getItem('balenzaa_carrito');
          setCart(savedCart ? JSON.parse(savedCart) : []);
        }}
        initialDetails={orderModalDetails}
      />
    </div>
  );
}

export default App;