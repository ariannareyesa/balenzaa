import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Catalog from './components/Catalog';
import CareGuide from './components/CareGuide';
import FAQ from './components/FAQ';
import CartDrawer from './components/CartDrawer';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    
    // Desplazarse al catálogo o abrir formulario de pedido
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
    alert('¡Productos listos! Puedes proceder con tu encargo en la tienda.');
  };

  return (
    <div className="cuerpo-tienda">
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenModal={() => alert('Modal de encargo personalizado pronto en React')} 
      />
      <main>
        <Hero onOpenModal={() => alert('Modal de encargo personalizado pronto en React')} />
        <About />
        <Catalog onAddToCart={handleAddToCart} />
        <CareGuide />
        <FAQ />
      </main>
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onUpdateObservation={handleUpdateObservation}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;