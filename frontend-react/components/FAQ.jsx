import React from 'react';

function FAQ() {
  return (
    <section id="preguntas" className="seccion-preguntas">
      <div className="contenedor-preguntas">
        <div className="encabezado-seccion">
          <span className="subtitulo-seccion">Dudas habituales</span>
          <h2 className="titulo-seccion">Preguntas Frecuentes</h2>
          <p className="bajada-seccion">Información general sobre el proceso de pedido y entrega.</p>
        </div>
        <div className="lista-acordeon">
          <details className="item-acordeon">
            <summary>¿Con cuánta anticipación debo realizar mi encargo?</summary>
            <p>Te recomendamos realizar tu pedido con al menos 1 o 2 semanas de anticipación para garantizar disponibilidad.</p>
          </details>
          <details className="item-acordeon">
            <summary>¿Cuáles son las modalidades de pago y cómo se gestiona el abono inicial?</summary>
            <p>Las modalidades de pago disponibles son efectivo y transferencia bancaria. Se solicita un anticipo del 50% para comenzar la elaboración de tu pieza y el saldo restante momentos antes de la entrega.</p>
          </details>
          <details className="item-acordeon">
            <summary>¿Cuáles son las modalidades de entrega en Guayaquil?</summary>
            <p>Realizamos entregas coordinadas en puntos específicos y envíos a domicilio dentro de la ciudad.</p>
          </details>
          <details className="item-acordeon">
            <summary>¿Es posible solicitar un diseño personalizado que no esté en el catálogo?</summary>
            <p>¡Sí! Puedes adjuntar una foto o diseño de referencia en el formulario de pedidos "Encargo personalizado". Te contactaremos para coordinar los detalles.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

export default FAQ;