// BALENZAA

document.addEventListener('DOMContentLoaded', () => {
    // 1. Filtrado de Categorías en el Catálogo (Fix display bug)
    const botonesFiltro = document.querySelectorAll('.boton-filtro');
    const tarjetasProducto = document.querySelectorAll('.tarjeta-producto');

    if (botonesFiltro.length > 0) {
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesFiltro.forEach(b => b.classList.remove('activo'));
                boton.classList.add('activo');

                const filtro = boton.textContent.trim().toLowerCase();

                tarjetasProducto.forEach(tarjeta => {
                    const etiqueta = tarjeta.querySelector('.etiqueta-categoria');
                    const textoCategoria = (etiqueta ? etiqueta.textContent : '').toLowerCase();
                    const dataCategoria = (tarjeta.dataset.categoria || '').toLowerCase();

                    const coincideTodos = filtro.includes('todo');
                    const coincideAmigurumi = filtro.includes('amigurumi') && (textoCategoria.includes('amigurumi') || dataCategoria.includes('amigurumi'));
                    const coincideLlavero = filtro.includes('llavero') && (textoCategoria.includes('llavero') || dataCategoria.includes('llavero'));
                    const coincideFlores = (filtro.includes('flor') || filtro.includes('ramo')) && (textoCategoria.includes('flor') || textoCategoria.includes('ramo') || dataCategoria.includes('flor'));

                    if (coincideTodos || coincideAmigurumi || coincideLlavero || coincideFlores) {
                        // Limpiar el inline style para respetar el CSS original intacto
                        tarjeta.style.display = '';
                    } else {
                        tarjeta.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Interacción con BalenzIA (Popup Flotante)
    const botonBalenzia = document.getElementById('boton-balenzia');
    const ventanaBalenzia = document.getElementById('ventana-balenzia');
    const botonCerrarBalenzia = document.getElementById('cerrar-balenzia');
    const formBalenzia = document.getElementById('formulario-balenzia');
    const inputBalenzia = document.getElementById('input-balenzia');
    const chatBalenzia = document.getElementById('chat-balenzia');

    if (botonBalenzia && ventanaBalenzia) {
        botonBalenzia.addEventListener('click', () => {
            ventanaBalenzia.classList.toggle('activo');
            if (ventanaBalenzia.classList.contains('activo') && inputBalenzia) {
                inputBalenzia.focus();
            }
        });

        if (botonCerrarBalenzia) {
            botonCerrarBalenzia.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaBalenzia.classList.remove('activo');
            });
        }

        if (formBalenzia && inputBalenzia && chatBalenzia) {
            formBalenzia.addEventListener('submit', (e) => {
                e.preventDefault();
                const consulta = inputBalenzia.value.trim();
                if (!consulta) return;

                const burbujaUsuario = document.createElement('div');
                burbujaUsuario.className = 'burbuja-mensaje usuario';
                burbujaUsuario.textContent = consulta;
                chatBalenzia.appendChild(burbujaUsuario);

                inputBalenzia.value = '';
                chatBalenzia.scrollTop = chatBalenzia.scrollHeight;

                setTimeout(() => {
                    const burbujaRespuesta = document.createElement('div');
                    burbujaRespuesta.className = 'burbuja-mensaje balenzia';
                    burbujaRespuesta.textContent = 'mensaje provisional';
                    chatBalenzia.appendChild(burbujaRespuesta);
                    chatBalenzia.scrollTop = chatBalenzia.scrollHeight;
                }, 400);
            });
        }
    }


    // 3. Envío del Formulario de Pedidos
    const formPedido = document.getElementById('formulario-pedido');
    if (formPedido) {
        formPedido.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre-cliente')?.value.trim();
            const correo = document.getElementById('correo-cliente')?.value.trim();
            const suscribir = document.getElementById('suscribir-newsletter')?.checked;

            // Guardar localmente para simulación antes del backend
            const nuevoPedido = {
                id: Date.now(),
                nombre,
                correo,
                producto: document.getElementById('tipo-producto')?.value,
                detalles: document.getElementById('detalles-pedido')?.value,
                fechaEntrega: document.getElementById('fecha-entrega')?.value,
                suscritoClub: suscribir,
                fechaCreacion: new Date().toLocaleDateString('es-EC')
            };

            const pedidosGuardados = JSON.parse(localStorage.getItem('balenzaa_pedidos') || '[]');
            pedidosGuardados.push(nuevoPedido);
            localStorage.setItem('balenzaa_pedidos', JSON.stringify(pedidosGuardados));

            alert(`¡Gracias, ${nombre}! Tu encargo ha sido registrado con éxito en Balenzaa.` + (suscribir ? ' Te has sumado al Club Balenzaa 💌' : ''));
            formPedido.reset();
        });
    }
});