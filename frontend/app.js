document.addEventListener('DOMContentLoaded', () => {

    function mostrarToast(mensaje, tipo = 'exito') {
        let contenedor = document.getElementById('contenedor-toasts');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'contenedor-toasts';
            document.body.appendChild(contenedor);
        }

        const toast = document.createElement('div');
        toast.className = `toast-notificacion ${tipo}`;
        toast.textContent = mensaje;

        contenedor.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('visible');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    function mostrarConfirmacion(mensaje, callbackAceptar) {
        const modal = document.getElementById('modal-confirmacion');
        const textoMsg = document.getElementById('texto-mensaje-confirmacion');
        const btnAceptar = document.getElementById('btn-aceptar-confirmacion');
        const btnCancelar = document.getElementById('btn-cancelar-confirmacion');

        if (!modal || !textoMsg || !btnAceptar || !btnCancelar) {
            if (confirm(mensaje)) callbackAceptar();
            return;
        }

        textoMsg.textContent = mensaje;
        modal.style.display = 'flex';

        const nuevoBtnAceptar = btnAceptar.cloneNode(true);
        const nuevoBtnCancelar = btnCancelar.cloneNode(true);
        btnAceptar.parentNode.replaceChild(nuevoBtnAceptar, btnAceptar);
        btnCancelar.parentNode.replaceChild(nuevoBtnCancelar, btnCancelar);

        document.getElementById('btn-aceptar-confirmacion').onclick = () => {
            modal.style.display = 'none';
            callbackAceptar();
        };

        document.getElementById('btn-cancelar-confirmacion').onclick = () => {
            modal.style.display = 'none';
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuNavegacion = document.getElementById('menuNavegacion');

    if (menuHamburguesa && menuNavegacion) {
        menuHamburguesa.addEventListener('click', () => {
            menuNavegacion.classList.toggle('activo');
        });

        menuNavegacion.querySelectorAll('a').forEach(enlace => {
            enlace.addEventListener('click', () => {
                menuNavegacion.classList.remove('activo');
            });
        });
    }

    // --- INDICADOR DE AGENDA EN EL CATÁLOGO ---
    const bannerAgenda = document.getElementById('banner-estado-agenda');
    if (bannerAgenda) {
        const estaCerrada = localStorage.getItem('balenzaa_agenda_cerrada') === 'true';
        if (estaCerrada) {
            bannerAgenda.textContent = 'Agenda cerrada por el momento';
            bannerAgenda.className = 'agenda-cerrada';
            bannerAgenda.style.color = '#721C24';
        } else {
            bannerAgenda.textContent = 'Agenda abierta';
            bannerAgenda.className = 'agenda-abierta';
            bannerAgenda.style.color = '#155724';
        }
    }

    const catalogoInicial = [];

    async function obtenerCatalogo() {
        try {
            const respuesta = await fetch('/api/productos');
            if (respuesta.ok) {
                const productos = await respuesta.json();
                return productos.length > 0 ? productos : catalogoInicial;
            }
        } catch (error) {
            console.error('Error al cargar catálogo desde el backend:', error);
        }
        const guardado = localStorage.getItem('balenzaa_catalogo');
        return guardado ? JSON.parse(guardado) : catalogoInicial;
    }

    // --- LÓGICA DEL CARRITO ---
    let carrito = JSON.parse(localStorage.getItem('balenzaa_carrito')) || [];

    function guardarCarritoEnStorage() {
        localStorage.setItem('balenzaa_carrito', JSON.stringify(carrito));
    }

    function actualizarContadorCarrito() {
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = totalItems;
        }
    }
    actualizarContadorCarrito();

    function agregarAlCarrito(producto) {
        const existente = carrito.find(item => item.nombre === producto.nombre);
        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1, observacion: '' });
        }
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        mostrarToast(`¡"${producto.nombre}" agregado al carrito!`, 'exito');
    }

    const panelCarritoLateral = document.getElementById('panel-carrito-lateral');
    const overlayCarritoLateral = document.getElementById('overlay-carrito-lateral');
    const btnAbrirCarrito = document.getElementById('boton-abrir-carrito');
    const btnCerrarPanelCarrito = document.getElementById('cerrar-panel-carrito');
    const listaItemsCarrito = document.getElementById('lista-items-carrito');
    const totalPrecioCarrito = document.getElementById('total-precio-carrito');
    const btnProcederPedidoCarrito = document.getElementById('btn-proceder-pedido-carrito');

    function abrirCarritoLateral() {
        if (panelCarritoLateral && overlayCarritoLateral) {
            renderizarItemsCarritoLateral();
            panelCarritoLateral.style.right = '0';
            overlayCarritoLateral.style.display = 'block';
        }
    }

    function cerrarCarritoLateral() {
        if (panelCarritoLateral && overlayCarritoLateral) {
            panelCarritoLateral.style.right = '-420px';
            overlayCarritoLateral.style.display = 'none';
        }
    }

    if (btnAbrirCarrito) btnAbrirCarrito.onclick = abrirCarritoLateral;
    if (btnCerrarPanelCarrito) btnCerrarPanelCarrito.onclick = cerrarCarritoLateral;
    if (overlayCarritoLateral) overlayCarritoLateral.onclick = cerrarCarritoLateral;

    function renderizarItemsCarritoLateral() {
        if (!listaItemsCarrito) return;
        if (carrito.length === 0) {
            listaItemsCarrito.innerHTML = '<p style="text-align: center; color: var(--tinta); padding: 2rem;">Tu carrito está vacío.</p>';
            if (totalPrecioCarrito) totalPrecioCarrito.textContent = '$0.00';
            return;
        }

        listaItemsCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach((item, index) => {
            const subtotal = (parseFloat(item.precio) || 0) * item.cantidad;
            total += subtotal;

            const div = document.createElement('div');
            div.style.cssText = 'background: #FFF7FA; padding: 0.9rem; border-radius: 14px; border: 1.5px solid var(--rosa-claro); display: flex; flex-direction: column; gap: 0.6rem;';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="font-size: 0.9rem; color: var(--tinta); display: block;">${item.nombre}</strong>
                        <span style="font-size: 0.82rem; color: var(--rosa); font-weight: 700;">$${parseFloat(item.precio).toFixed(2)} x ${item.cantidad}</span>
                    </div>
                    <div style="display: flex; gap: 0.3rem; align-items: center;">
                        <button class="btn-menos" data-index="${index}" style="background: var(--rosa-pastel); border: none; width: 22px; height: 22px; border-radius: 50%; font-weight: bold; cursor: pointer;">-</button>
                        <button class="btn-mas" data-index="${index}" style="background: var(--rosa-pastel); border: none; width: 22px; height: 22px; border-radius: 50%; font-weight: bold; cursor: pointer;">+</button>
                        <button class="btn-eliminar" data-index="${index}" style="background: none; border: none; color: #C93A5B; font-weight: bold; cursor: pointer; font-size: 0.95rem; margin-left: 2px;">✕</button>
                    </div>
                </div>
                <div>
                    <input type="text" class="input-obs-item" data-index="${index}" value="${item.observacion || ''}" placeholder="Nota opcional: (Ej: En vez de color rosa...)" style="width: 100%; padding: 5px 8px; font-size: 0.8rem; border-radius: 8px; border: 1px solid var(--rosa-claro); background: white;">
                </div>
            `;
            listaItemsCarrito.appendChild(div);
        });

        if (totalPrecioCarrito) totalPrecioCarrito.textContent = `$${total.toFixed(2)}`;

        listaItemsCarrito.querySelectorAll('.btn-mas').forEach(btn => {
            btn.onclick = (e) => {
                carrito[e.target.dataset.index].cantidad += 1;
                guardarCarritoEnStorage();
                renderizarItemsCarritoLateral();
                actualizarContadorCarrito();
            };
        });

        listaItemsCarrito.querySelectorAll('.btn-menos').forEach(btn => {
            btn.onclick = (e) => {
                const idx = e.target.dataset.index;
                if (carrito[idx].cantidad > 1) {
                    carrito[idx].cantidad -= 1;
                } else {
                    carrito.splice(idx, 1);
                }
                guardarCarritoEnStorage();
                renderizarItemsCarritoLateral();
                actualizarContadorCarrito();
            };
        });

        listaItemsCarrito.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.onclick = (e) => {
                carrito.splice(e.target.dataset.index, 1);
                guardarCarritoEnStorage();
                renderizarItemsCarritoLateral();
                actualizarContadorCarrito();
            };
        });

        listaItemsCarrito.querySelectorAll('.input-obs-item').forEach(input => {
            input.oninput = (e) => {
                carrito[e.target.dataset.index].observacion = e.target.value;
                guardarCarritoEnStorage();
            };
        });
    }

    // --- GESTIÓN DE MODALES SEPARADOS ---
    const modalEncargoPersonalizado = document.getElementById('modal-encargo-personalizado');
    const modalPedidoCatalogo = document.getElementById('modal-pedido-catalogo');

    const btnAbrirModalPedido = document.getElementById('boton-abrir-modal-pedido');
    const btnHeroPedido = document.getElementById('boton-hero-pedido');
    const btnCerrarModalEncargo = document.getElementById('cerrar-modal-encargo');
    const btnCerrarModalCatalogo = document.getElementById('cerrar-modal-catalogo');

    function abrirEncargoPersonalizado() {
        if (modalEncargoPersonalizado) {
            modalEncargoPersonalizado.style.display = 'flex';
        }
    }

    function cerrarEncargoPersonalizado() {
        if (modalEncargoPersonalizado) {
            modalEncargoPersonalizado.style.display = 'none';
        }
    }

    function cerrarPedidoCatalogo() {
        if (modalPedidoCatalogo) {
            modalPedidoCatalogo.style.display = 'none';
        }
    }

    if (btnAbrirModalPedido) btnAbrirModalPedido.onclick = abrirEncargoPersonalizado;
    if (btnHeroPedido) btnHeroPedido.onclick = abrirEncargoPersonalizado;
    if (btnCerrarModalEncargo) btnCerrarModalEncargo.onclick = cerrarEncargoPersonalizado;
    if (btnCerrarModalCatalogo) btnCerrarModalCatalogo.onclick = cerrarPedidoCatalogo;

    if (modalEncargoPersonalizado) {
        modalEncargoPersonalizado.onclick = (e) => {
            if (e.target === modalEncargoPersonalizado) cerrarEncargoPersonalizado();
        };
    }

    if (modalPedidoCatalogo) {
        modalPedidoCatalogo.onclick = (e) => {
            if (e.target === modalPedidoCatalogo) cerrarPedidoCatalogo();
        };
    }

    if (btnProcederPedidoCarrito) {
        btnProcederPedidoCarrito.onclick = () => {
            if (carrito.length === 0) {
                mostrarToast('Agrega al menos una pieza a tu carrito.', 'error');
                return;
            }
            cerrarCarritoLateral();

            if (modalPedidoCatalogo) {
                modalPedidoCatalogo.style.display = 'flex';
            }

            const selectTipoCat = document.getElementById('tipo-producto-cat');
            if (selectTipoCat) {
                selectTipoCat.value = 'Diseño personalizado / Varios / Otro';
            }

            const detallesTextareaCat = document.getElementById('detalles-pedido-cat');
            if (detallesTextareaCat) {
                let resumen = 'Pedido desde el catálogo:\n';
                carrito.forEach(i => {
                    resumen += `- ${i.cantidad}x ${i.nombre} ($${((parseFloat(i.precio) || 0) * i.cantidad).toFixed(2)})`;
                    if (i.observacion) resumen += ` [Nota: ${i.observacion}]`;
                    resumen += '\n';
                });
                detallesTextareaCat.value = resumen;
            }
            mostrarToast('¡Productos cargados en el formulario de encargo!', 'exito');
        };
    }

    const contenedorCatalogoTienda = document.getElementById('contenedor-catalogo-tienda');

    async function renderizarCatalogoPublico() {
        if (!contenedorCatalogoTienda) return;
        const productos = await obtenerCatalogo();
        contenedorCatalogoTienda.innerHTML = '';

        productos.forEach(prod => {
            const card = document.createElement('article');
            card.className = 'tarjeta-producto';
            card.dataset.categoria = (prod.categoria || '').trim().toLowerCase();

            card.innerHTML = `
                <div class="imagen-producto">
                    <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='images/amigurumi.jpg'">
                    ${prod.categoria && prod.categoria.trim().toLowerCase() !== 'general' ? `<span class="etiqueta-categoria">${prod.categoria}</span>` : ''}
                </div>
                <div class="info-producto">
                    <h3 class="nombre-producto">${prod.nombre}</h3>
                    <p class="descripcion-producto">${prod.descripcion}</p>
                    <div class="pie-tarjeta" style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 0.8rem;">
                        <div class="contenedor-precio-referencial">
                            <span style="font-size: 0.75rem; color: var(--tinta); display: block; opacity: 0.8;">Precio referencial:</span>
                            <span class="precio-producto" style="font-weight: 700; color: var(--rosa); font-size: 1.05rem;">
                                $${parseFloat(prod.precio || 0).toFixed(2)}
                            </span>
                        </div>
                        <button class="boton-agregar-carrito boton-encargar-tarjeta" data-nombre="${prod.nombre}" data-precio="${prod.precio}" data-categoria="${prod.categoria}">
                            Agregar
                        </button>
                    </div>
                </div>
            `;
            contenedorCatalogoTienda.appendChild(card);
        });

        document.querySelectorAll('.boton-agregar-carrito').forEach(btn => {
            btn.onclick = (e) => {
                const dataset = e.target.dataset;
                agregarAlCarrito({
                    nombre: dataset.nombre,
                    precio: parseFloat(dataset.precio) || 0,
                    categoria: dataset.categoria
                });
            };
        });

        aplicarFiltrosCatalogo(productos);
    }

    function aplicarFiltrosCatalogo(productos) {
        const contenedorFiltros = document.getElementById('contenedor-filtros-catalogo');

        const categoriasSet = new Set();
        ['Amigurumis', 'Llaveros', 'Ramos de Flores'].forEach(c => categoriasSet.add(c));
        
        const categoriasIgnoradas = ['general', 'sin categoria', 'estandar'];

        productos.forEach(p => {
            if (p.categoria) {
                const nombreCat = p.categoria.trim();
                if (!categoriasIgnoradas.includes(nombreCat.toLowerCase())) {
                    const capitalizada = nombreCat.charAt(0).toUpperCase() + nombreCat.slice(1);
                    categoriasSet.add(capitalizada);
                }
            }
        });

        if (contenedorFiltros) {
            contenedorFiltros.innerHTML = `<button class="boton-filtro activo" data-filtro="todos">Todos</button>`;

            categoriasSet.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'boton-filtro';
                btn.dataset.filtro = cat.toLowerCase();
                btn.textContent = cat;
                contenedorFiltros.appendChild(btn);
            });

            const botonesFiltro = contenedorFiltros.querySelectorAll('.boton-filtro');
            const tarjetasProducto = document.querySelectorAll('#contenedor-catalogo-tienda .tarjeta-producto');

            botonesFiltro.forEach(boton => {
                boton.addEventListener('click', () => {
                    botonesFiltro.forEach(b => b.classList.remove('activo'));
                    boton.classList.add('activo');

                    const filtro = boton.dataset.filtro;

                    tarjetasProducto.forEach(tarjeta => {
                        const dataCategoria = (tarjeta.dataset.categoria || '').toLowerCase();
                        if (filtro === 'todos' || dataCategoria === filtro) {
                            tarjeta.style.display = '';
                        } else {
                            tarjeta.style.display = 'none';
                        }
                    });
                });
            });
        }

        // Actualizar selects de ambos formularios
        ['tipo-producto-encargo', 'tipo-producto-cat'].forEach(selectId => {
            const selectProductoPedido = document.getElementById(selectId);
            if (selectProductoPedido) {
                const valorActual = selectProductoPedido.value;
                selectProductoPedido.innerHTML = '<option value="" disabled selected>Selecciona qué deseas encargar</option>';
                categoriasSet.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat;
                    opt.textContent = cat;
                    selectProductoPedido.appendChild(opt);
                });
                selectProductoPedido.innerHTML += '<option value="Diseño personalizado / Varios / Otro">Diseño personalizado / Varios / Otro</option>';
                if (valorActual) selectProductoPedido.value = valorActual;
            }
        });
    }

    renderizarCatalogoPublico();

    function formatearFechaTexto(fechaIso) {
        if (!fechaIso) return 'Por definir';
        const partes = fechaIso.split('T')[0].split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return new Date(fechaIso).toLocaleDateString('es-EC');
    }

    function obtenerMesDeFecha(fechaIso) {
        if (!fechaIso) return null;
        const partes = fechaIso.split('T')[0].split('-');
        return partes.length === 3 ? parseInt(partes[1], 10) : new Date(fechaIso).getMonth() + 1;
    }

    const hoyStr = new Date().toISOString().split('T')[0];
    const inputFechaEncargo = document.getElementById('fecha-entrega-encargo');
    if (inputFechaEncargo) inputFechaEncargo.min = hoyStr;

    const inputFechaCat = document.getElementById('fecha-entrega-cat');
    if (inputFechaCat) inputFechaCat.min = hoyStr;

    const inputManualFecha = document.getElementById('manual-fecha-entrega');
    if (inputManualFecha) inputManualFecha.min = hoyStr;

    const inputArchivoRef = document.getElementById('imagen-referencia-pedido');
    const textoNombreArchivo = document.getElementById('nombre-archivo-pedido');

    if (inputArchivoRef && textoNombreArchivo) {
        inputArchivoRef.addEventListener('change', () => {
            if (inputArchivoRef.files && inputArchivoRef.files.length > 0) {
                textoNombreArchivo.textContent = inputArchivoRef.files[0].name;
                textoNombreArchivo.style.opacity = '1';
                textoNombreArchivo.style.fontWeight = '600';
            } else {
                textoNombreArchivo.textContent = 'Ningún archivo seleccionado';
                textoNombreArchivo.style.opacity = '0.75';
                textoNombreArchivo.style.fontWeight = 'normal';
            }
        });
    }

    const inputFotoPieza = document.getElementById('imagen-producto-admin');
    const textoFotoPieza = document.getElementById('nombre-foto-admin');

    if (inputFotoPieza && textoFotoPieza) {
        inputFotoPieza.addEventListener('change', () => {
            if (inputFotoPieza.files && inputFotoPieza.files.length > 0) {
                textoFotoPieza.textContent = inputFotoPieza.files[0].name;
                textoFotoPieza.style.opacity = '1';
                textoFotoPieza.style.fontWeight = '600';
            } else {
                textoFotoPieza.textContent = 'Ningún archivo seleccionado';
                textoFotoPieza.style.opacity = '0.75';
                textoFotoPieza.style.fontWeight = 'normal';
            }
        });
    }

    const selectCatAdmin = document.getElementById('nueva-categoria-producto');
    const inputOtraCatAdmin = document.getElementById('input-otra-categoria');

    if (selectCatAdmin && inputOtraCatAdmin) {
        selectCatAdmin.addEventListener('change', () => {
            if (selectCatAdmin.value === '__nueva__') {
                inputOtraCatAdmin.style.display = 'block';
                inputOtraCatAdmin.focus();
            } else {
                inputOtraCatAdmin.style.display = 'none';
            }
        });
    }

    const celularRegex = /^09\d{8}$/;

    // --- SUBMIT FORMULARIO ENCARGO PERSONALIZADO ---
    const formEncargoPersonalizado = document.getElementById('formulario-encargo-personalizado');
    if (formEncargoPersonalizado) {
        formEncargoPersonalizado.addEventListener('submit', (e) => {
            e.preventDefault();

            formEncargoPersonalizado.querySelectorAll('.mensaje-error-campo').forEach(el => el.remove());
            formEncargoPersonalizado.querySelectorAll('input, select, textarea').forEach(input => {
                input.style.borderColor = '';
            });

            const inputNombre = document.getElementById('nombre-cliente-encargo');
            const inputCorreo = document.getElementById('correo-cliente-encargo');
            const inputCelular = document.getElementById('celular-cliente-encargo');
            const inputProducto = document.getElementById('tipo-producto-encargo');
            const inputDetalles = document.getElementById('detalles-pedido-encargo');
            const inputFecha = document.getElementById('fecha-entrega-encargo');
            const inputSuscrito = document.getElementById('suscrito-club-encargo');

            const nombre = inputNombre?.value.trim();
            const correo = inputCorreo?.value.trim();
            const celular = inputCelular?.value.trim();
            const producto = inputProducto?.value;
            const detalles = inputDetalles?.value.trim();
            const fechaEntrega = inputFecha?.value;
            const suscritoClub = inputSuscrito ? inputSuscrito.checked : false;
            const archivoReferencia = inputArchivoRef?.files[0];

            function mostrarErrorCampo(inputEl, mensaje) {
                if (!inputEl) return;
                inputEl.style.borderColor = '#C93A5B';
                const errorTexto = document.createElement('span');
                errorTexto.className = 'mensaje-error-campo';
                errorTexto.style.cssText = 'color: #C93A5B; font-size: 0.8rem; font-weight: 600; margin-top: 4px; display: block;';
                errorTexto.textContent = mensaje;
                inputEl.parentNode.appendChild(errorTexto);
                inputEl.focus();
            }

            if (!nombre) { mostrarErrorCampo(inputNombre, 'Por favor, ingresa tu nombre completo.'); return; }
            if (!correo || !correo.includes('@') || !correo.includes('.')) { mostrarErrorCampo(inputCorreo, 'Por favor, ingresa un correo válido.'); return; }
            if (!celularRegex.test(celular)) { mostrarErrorCampo(inputCelular, 'Ingresa un celular válido (10 dígitos empezando con 09).'); return; }
            if (!producto) { mostrarErrorCampo(inputProducto, 'Selecciona una categoría o tipo de pieza.'); return; }
            if (!detalles) { mostrarErrorCampo(inputDetalles, 'Por favor, cuéntanos detalles sobre tu encargo.'); return; }
            if (!fechaEntrega || fechaEntrega < hoyStr) { mostrarErrorCampo(inputFecha, 'Selecciona una fecha válida a partir de hoy.'); return; }

            async function registrarPedido(imagenRefBase64 = null) {
                const nuevoPedido = {
                    nombre,
                    correo,
                    celular,
                    producto,
                    detalles,
                    fechaEntrega,
                    imagenReferencia: imagenRefBase64,
                    suscritoClub
                };

                try {
                    const respuesta = await fetch('/api/pedidos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(nuevoPedido)
                    });

                    const resultado = await respuesta.json();

                    if (respuesta.ok) {
                        mostrarToast(`Gracias ${nombre}, tu encargo ha sido registrado con éxito.`, 'exito');
                        formEncargoPersonalizado.reset();
                        cerrarEncargoPersonalizado();
                        if (textoNombreArchivo) {
                            textoNombreArchivo.textContent = 'Ningún archivo seleccionado';
                            textoNombreArchivo.style.opacity = '0.75';
                        }
                    } else {
                        mostrarToast(resultado.error || 'Error al registrar pedido', 'error');
                    }
                } catch (error) {
                    console.error('Error al conectar con el servidor:', error);
                    mostrarToast('Error de conexión al enviar el pedido.', 'error');
                }
            }

            if (archivoReferencia) {
                const lector = new FileReader();
                lector.onload = function (evento) { registrarPedido(evento.target.result); };
                lector.readAsDataURL(archivoReferencia);
            } else {
                registrarPedido(null);
            }
        });
    }

    // --- SUBMIT FORMULARIO PEDIDO CATÁLOGO ---
    const formPedidoCatalogo = document.getElementById('formulario-pedido-catalogo');
    if (formPedidoCatalogo) {
        formPedidoCatalogo.addEventListener('submit', async (e) => {
            e.preventDefault();

            formPedidoCatalogo.querySelectorAll('.mensaje-error-campo').forEach(el => el.remove());
            formPedidoCatalogo.querySelectorAll('input, select, textarea').forEach(input => {
                input.style.borderColor = '';
            });

            const inputNombre = document.getElementById('nombre-cliente-cat');
            const inputCorreo = document.getElementById('correo-cliente-cat');
            const inputCelular = document.getElementById('celular-cliente-cat');
            const inputProducto = document.getElementById('tipo-producto-cat');
            const inputDetalles = document.getElementById('detalles-pedido-cat');
            const inputFecha = document.getElementById('fecha-entrega-cat');
            const inputSuscrito = document.getElementById('suscrito-club-cat');

            const nombre = inputNombre?.value.trim();
            const correo = inputCorreo?.value.trim();
            const celular = inputCelular?.value.trim();
            const producto = inputProducto?.value;
            const detalles = inputDetalles?.value.trim();
            const fechaEntrega = inputFecha?.value;
            const suscritoClub = inputSuscrito ? inputSuscrito.checked : false;

            function mostrarErrorCampoCat(inputEl, mensaje) {
                if (!inputEl) return;
                inputEl.style.borderColor = '#C93A5B';
                const errorTexto = document.createElement('span');
                errorTexto.className = 'mensaje-error-campo';
                errorTexto.style.cssText = 'color: #C93A5B; font-size: 0.8rem; font-weight: 600; margin-top: 4px; display: block;';
                errorTexto.textContent = mensaje;
                inputEl.parentNode.appendChild(errorTexto);
                inputEl.focus();
            }

            if (!nombre) { mostrarErrorCampoCat(inputNombre, 'Por favor, ingresa tu nombre completo.'); return; }
            if (!correo || !correo.includes('@') || !correo.includes('.')) { mostrarErrorCampoCat(inputCorreo, 'Por favor, ingresa un correo válido.'); return; }
            if (!celularRegex.test(celular)) { mostrarErrorCampoCat(inputCelular, 'Ingresa un celular válido (10 dígitos empezando con 09).'); return; }
            if (!producto) { mostrarErrorCampoCat(inputProducto, 'Selecciona una categoría o tipo de pieza.'); return; }
            if (!detalles) { mostrarErrorCampoCat(inputDetalles, 'Por favor, ingresa los detalles del pedido.'); return; }
            if (!fechaEntrega || fechaEntrega < hoyStr) { mostrarErrorCampoCat(inputFecha, 'Selecciona una fecha válida a partir de hoy.'); return; }

            const nuevoPedido = {
                nombre,
                correo,
                celular,
                producto,
                detalles,
                fechaEntrega,
                imagenReferencia: null,
                suscritoClub
            };

            try {
                const respuesta = await fetch('/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoPedido)
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    mostrarToast(`Gracias ${nombre}, tu encargo ha sido registrado con éxito.`, 'exito');
                    formPedidoCatalogo.reset();
                    carrito = [];
                    localStorage.removeItem('balenzaa_carrito');
                    actualizarContadorCarrito();
                    cerrarPedidoCatalogo();
                } else {
                    mostrarToast(resultado.error || 'Error al registrar pedido', 'error');
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                mostrarToast('Error de conexión al enviar el pedido.', 'error');
            }
        });
    }

    // --- PANEL DE ADMINISTRACIÓN ---
    const formLoginAdmin = document.getElementById('formulario-login-admin');
    const seccionLoginAdmin = document.getElementById('seccion-login-admin');
    const panelContenido = document.getElementById('panel-contenido');
    const errorLogin = document.getElementById('error-login');
    const botonSalir = document.getElementById('boton-cerrar-sesion');
    const botonToggleAgenda = document.getElementById('boton-toggle-agenda');
    const cuerpoTablaPedidos = document.getElementById('cuerpo-tabla-pedidos');
    const contenedorCatalogoAdmin = document.getElementById('contenedor-catalogo-admin');

    const modalFoto = document.getElementById('modal-foto-referencia');
    const textoObsModal = document.getElementById('texto-observaciones-pedido');
    const contenedorFotoModal = document.getElementById('contenedor-foto-ref-interno');
    const imgModal = document.getElementById('img-modal-referencia');
    const btnCerrarModal = document.getElementById('cerrar-modal-foto');

    if (btnCerrarModal && modalFoto) {
        btnCerrarModal.onclick = () => { modalFoto.style.display = 'none'; };
        modalFoto.onclick = (e) => { if (e.target === modalFoto) modalFoto.style.display = 'none'; };
    }

    // --- FUNCIONALIDAD CLUB BALENZAA (SUSCRIPTORES / CORREOS ÚNICOS) ---
    const btnAbrirSuscriptores = document.getElementById('boton-abrir-suscriptores');
    const modalSuscriptores = document.getElementById('modal-suscriptores-club');
    const btnCerrarSuscriptores = document.getElementById('cerrar-modal-suscriptores');
    const contenedorListaSuscriptores = document.getElementById('lista-suscriptores-contenedor');
    const btnCopiarCorreos = document.getElementById('btn-copiar-todos-correos');
    const btnDescargarCsvSuscriptores = document.getElementById('btn-descargar-csv');

    async function abrirModalClubBalenzaa() {
        if (!modalSuscriptores || !contenedorListaSuscriptores) return;
        
        let pedidos = [];
        try {
            const respuesta = await fetch('/api/pedidos');
            if (respuesta.ok) pedidos = await respuesta.json();
        } catch (err) {
            console.error('Error al obtener pedidos para Club Balenzaa:', err);
        }

        // Obtener correos únicos de clientes que marcaron suscritoClub
        const mapaCorreosUnicos = new Map();
        pedidos.forEach(p => {
            if (p.suscritoClub && p.correo && p.correo.trim() !== '') {
                const correoLimpio = p.correo.trim().toLowerCase();
                if (!mapaCorreosUnicos.has(correoLimpio)) {
                    mapaCorreosUnicos.set(correoLimpio, {
                        correo: p.correo.trim(),
                        nombre: p.nombre ? p.nombre.trim() : 'Cliente'
                    });
                }
            }
        });

        const listaClientesUnicos = Array.from(mapaCorreosUnicos.values());
        contenedorListaSuscriptores.innerHTML = '';

        if (listaClientesUnicos.length === 0) {
            contenedorListaSuscriptores.innerHTML = '<p style="text-align: center; color: var(--tinta); padding: 1rem; font-size: 0.9rem;">No hay suscriptores registrados aún.</p>';
        } else {
            listaClientesUnicos.forEach(cliente => {
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = 'background: white; padding: 0.6rem 0.9rem; border-radius: 10px; border: 1.5px solid var(--rosa-claro); display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;';
                itemDiv.innerHTML = `
                    <span><strong>${cliente.nombre}</strong>: <a href="mailto:${cliente.correo}" style="color: var(--rosa); text-decoration: underline;">${cliente.correo}</a></span>
                `;
                contenedorListaSuscriptores.appendChild(itemDiv);
            });
        }

        modalSuscriptores.style.display = 'flex';
    }

    if (btnAbrirSuscriptores) {
        btnAbrirSuscriptores.addEventListener('click', abrirModalClubBalenzaa);
    }

    if (btnCerrarSuscriptores && modalSuscriptores) {
        btnCerrarSuscriptores.onclick = () => { modalSuscriptores.style.display = 'none'; };
        modalSuscriptores.onclick = (e) => { if (e.target === modalSuscriptores) modalSuscriptores.style.display = 'none'; };
    }

    if (btnCopiarCorreos) {
        btnCopiarCorreos.onclick = async () => {
            const divs = contenedorListaSuscriptores.querySelectorAll('a');
            if (divs.length === 0) {
                mostrarToast('No hay correos para copiar.', 'error');
                return;
            }
            const correos = Array.from(divs).map(a => a.textContent).join(', ');
            try {
                await navigator.clipboard.writeText(correos);
                mostrarToast('¡Correos copiados al portapapeles!', 'exito');
            } catch (err) {
                mostrarToast('Error al copiar correos.', 'error');
            }
        };
    }

    if (btnDescargarCsvSuscriptores) {
        btnDescargarCsvSuscriptores.onclick = async () => {
            let pedidos = [];
            try {
                const respuesta = await fetch('/api/pedidos');
                if (respuesta.ok) pedidos = await respuesta.json();
            } catch (err) { console.error(err); }

            const mapaCorreosUnicos = new Map();
            pedidos.forEach(p => {
                if (p.suscritoClub && p.correo && p.correo.trim() !== '') {
                    const correoLimpio = p.correo.trim().toLowerCase();
                    if (!mapaCorreosUnicos.has(correoLimpio)) {
                        mapaCorreosUnicos.set(correoLimpio, {
                            correo: p.correo.trim(),
                            nombre: p.nombre ? p.nombre.trim() : 'Cliente'
                        });
                    }
                }
            });

            const listaClientesUnicos = Array.from(mapaCorreosUnicos.values());
            if (listaClientesUnicos.length === 0) {
                mostrarToast('No hay suscriptores para exportar.', 'error');
                return;
            }

            let csvContent = '\uFEFFNombre,Correo\n';
            listaClientesUnicos.forEach(c => {
                const nombre = `"${c.nombre.replace(/"/g, '""')}"`;
                const correo = `"${c.correo.replace(/"/g, '""')}"`;
                csvContent += `${nombre},${correo}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'club_balenzaa_suscriptores.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            mostrarToast('CSV de Club Balenzaa descargado con éxito.', 'exito');
        };
    }

    // --- MODAL NUEVO ENCARGO MANUAL ---
    const btnAbrirModalPedidoManual = document.getElementById('boton-abrir-modal-pedido');
    const modalPedidoManual = document.getElementById('modal-pedido-manual');
    const btnCerrarModalPedidoManual = document.getElementById('cerrar-modal-pedido-manual');
    const formPedidoManual = document.getElementById('formulario-pedido-manual');

    if (btnAbrirModalPedidoManual && modalPedidoManual) {
        btnAbrirModalPedidoManual.onclick = () => {
            modalPedidoManual.style.display = 'flex';
        };
    }

    if (btnCerrarModalPedidoManual && modalPedidoManual) {
        btnCerrarModalPedidoManual.onclick = () => { modalPedidoManual.style.display = 'none'; };
        modalPedidoManual.onclick = (e) => { if (e.target === modalPedidoManual) modalPedidoManual.style.display = 'none'; };
    }

    if (formPedidoManual) {
        formPedidoManual.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('manual-nombre').value.trim();
            const correo = document.getElementById('manual-correo').value.trim();
            const celular = document.getElementById('manual-celular').value.trim();
            const producto = document.getElementById('manual-producto').value;
            const detalles = document.getElementById('manual-detalles').value.trim();
            const fechaEntrega = document.getElementById('manual-fecha-entrega').value;
            const precioTotal = parseFloat(document.getElementById('manual-precio').value) || 0;
            const horas = parseInt(document.getElementById('manual-horas').value) || 0;
            const minutos = parseInt(document.getElementById('manual-minutos').value) || 0;
            const estado = document.getElementById('manual-estado').value;

            if (!nombre || !correo || !celular || !producto || !detalles || !fechaEntrega) {
                mostrarToast('Por favor completa los campos obligatorios.', 'error');
                return;
            }

            const segundosTejidos = (horas * 3600) + (minutos * 60);

            const nuevoPedidoManual = {
                nombre,
                correo,
                celular,
                producto,
                detalles,
                fechaEntrega,
                precioTotal,
                segundosTejidos,
                cronometroActivo: false,
                estado,
                imagenReferencia: null,
                suscritoClub: true
            };

            try {
                const respuesta = await fetch('/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoPedidoManual)
                });

                if (respuesta.ok) {
                    mostrarToast('Encargo manual registrado con éxito.', 'exito');
                    formPedidoManual.reset();
                    modalPedidoManual.style.display = 'none';
                    renderizarPedidos();
                } else {
                    mostrarToast('Error al registrar encargo manual.', 'error');
                }
            } catch (err) {
                console.error(err);
                mostrarToast('Error de conexión.', 'error');
            }
        });
    }

    // --- MODAL AGREGAR NUEVA PIEZA AL CATÁLOGO ---
    const btnAbrirModalProductoAdmin = document.getElementById('boton-abrir-modal-producto');
    const modalNuevoProducto = document.getElementById('modal-nuevo-producto');
    const btnCerrarModalNuevoProducto = document.getElementById('cerrar-modal-nuevo-producto');

    if (btnAbrirModalProductoAdmin && modalNuevoProducto) {
        btnAbrirModalProductoAdmin.onclick = () => {
            modalNuevoProducto.style.display = 'flex';
        };
    }

    if (btnCerrarModalNuevoProducto && modalNuevoProducto) {
        btnCerrarModalNuevoProducto.onclick = () => { modalNuevoProducto.style.display = 'none'; };
        modalNuevoProducto.onclick = (e) => { if (e.target === modalNuevoProducto) modalNuevoProducto.style.display = 'none'; };
    }

    const btnExportarTodosPedidos = document.getElementById('btn-exportar-todos-pedidos-csv');
    if (btnExportarTodosPedidos) {
        btnExportarTodosPedidos.onclick = async () => {
            let pedidos = [];
            try {
                const respuesta = await fetch('/api/pedidos');
                if (respuesta.ok) pedidos = await respuesta.json();
            } catch (err) { console.error(err); }
            if (pedidos.length === 0) {
                mostrarToast('No hay pedidos para exportar.', 'error');
                return;
            }

            let csvContent = '\uFEFFFechaCreacion,Cliente,Correo,Celular,Pieza,FechaEntrega,PrecioTotal,Estado\n';
            pedidos.forEach(p => {
                const fechaC = `"${(p.fechaCreacion ? formatearFechaTexto(p.fechaCreacion) : '').replace(/"/g, '""')}"`;
                const nombre = `"${(p.nombre || '').replace(/"/g, '""')}"`;
                const correo = `"${(p.correo || '').replace(/"/g, '""')}"`;
                const celular = `"${(p.celular || '').replace(/"/g, '""')}"`;
                const producto = `"${(p.producto || '').replace(/"/g, '""')}"`;
                const fechaE = `"${(p.fechaEntrega ? formatearFechaTexto(p.fechaEntrega) : '').replace(/"/g, '""')}"`;
                const precio = `"${(p.precioTotal || 0)}"`;
                const estado = `"${(p.estado || 'Pendiente').replace(/"/g, '""')}"`;
                csvContent += `${fechaC},${nombre},${correo},${celular},${producto},${fechaE},${precio},${estado}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'todos_los_pedidos_balenzaa.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            mostrarToast('Archivo CSV descargado con éxito.', 'exito');
        };
    }

    let agendaCerrada = localStorage.getItem('balenzaa_agenda_cerrada') === 'true';

    function actualizarVisualAgenda(cerrada) {
        if (!botonToggleAgenda) return;
        if (cerrada) {
            botonToggleAgenda.textContent = 'Agenda Cerrada';
            botonToggleAgenda.style.backgroundColor = '#F8D7DA';
            botonToggleAgenda.style.color = '#721C24';
            botonToggleAgenda.classList.add('cerrada');
        } else {
            botonToggleAgenda.textContent = 'Agenda Abierta';
            botonToggleAgenda.style.backgroundColor = '#C3E6CB';
            botonToggleAgenda.style.color = '#155724';
            botonToggleAgenda.classList.remove('cerrada');
        }
    }

    actualizarVisualAgenda(agendaCerrada);

    if (botonToggleAgenda) {
        botonToggleAgenda.addEventListener('click', () => {
            agendaCerrada = !agendaCerrada;
            localStorage.setItem('balenzaa_agenda_cerrada', agendaCerrada);
            actualizarVisualAgenda(agendaCerrada);
            if (bannerAgenda) {
                if (agendaCerrada) {
                    bannerAgenda.textContent = 'Agenda cerrada por el momento';
                    bannerAgenda.className = 'agenda-cerrada';
                    bannerAgenda.style.color = '#721C24';
                } else {
                    bannerAgenda.textContent = 'Agenda abierta';
                    bannerAgenda.className = 'agenda-abierta';
                    bannerAgenda.style.color = '#155724';
                }
            }
            mostrarToast(agendaCerrada ? 'Agenda cerrada para nuevos pedidos.' : 'Agenda abierta para nuevos pedidos.', 'exito');
        });
    }

    function formatearTiempo(totalSegundos) {
        const seg = parseInt(totalSegundos) || 0;
        const horas = Math.floor(seg / 3600);
        const minutos = Math.floor((seg % 3600) / 60);
        const segundos = seg % 60;
        return [horas, minutos, segundos].map(v => v < 10 ? '0' + v : v).join(':');
    }

    if (window.intervaloCronometrosUI) clearInterval(window.intervaloCronometrosUI);
    window.intervaloCronometrosUI = setInterval(() => {
        document.querySelectorAll('.btn-toggle-timer').forEach(btn => {
            if (btn.title === 'Pausar') {
                const id = btn.dataset.id;
                const display = document.querySelector(`.timer-display[data-id="${id}"]`);
                if (display) {
                    const partes = display.textContent.split(':');
                    if (partes.length === 3) {
                        const totalSegs = parseInt(partes[0]) * 3600 + parseInt(partes[1]) * 60 + parseInt(partes[2]) + 1;
                        display.textContent = formatearTiempo(totalSegs);
                    }
                }
            }
        });
    }, 1000);

    let filtroMesSeleccionado = 'todos';
    let filtroTipoSeleccionado = 'todos';
    let estadoFiltroAdmin = 'todos';

    function inyectarControlesFiltro() {
        const seccionGestion = document.querySelector('.seccion-gestion-pedidos');
        if (!seccionGestion || document.getElementById('barra-filtros-pedidos')) return;

        const contenedorFiltros = document.createElement('div');
        contenedorFiltros.id = 'barra-filtros-pedidos';
        contenedorFiltros.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.2rem; background: #FFF7FA; padding: 1rem 1.2rem; border-radius: 18px; border: 1.5px solid var(--rosa-claro);';

        contenedorFiltros.innerHTML = `
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; border-bottom: 1.5px solid var(--rosa-claro); padding-bottom: 0.8rem;">
                <span style="font-weight: 700; color: var(--rosa); font-size: 0.92rem; margin-right: 0.5rem;">Estado:</span>
                <button class="btn-filtro-estado activo" data-estado="todos" style="padding: 0.4rem 1rem; border-radius: 999px; border: 1.5px solid var(--rosa-claro); background: var(--rosa); color: #fff; font-weight: 700; font-size: 0.85rem; cursor: pointer;">Todos</button>
                <button class="btn-filtro-estado" data-estado="Pendiente" style="padding: 0.4rem 1rem; border-radius: 999px; border: 1.5px solid var(--rosa-claro); background: #fff; color: var(--tinta); font-weight: 700; font-size: 0.85rem; cursor: pointer;">Pendientes</button>
                <button class="btn-filtro-estado" data-estado="En elaboración" style="padding: 0.4rem 1rem; border-radius: 999px; border: 1.5px solid var(--rosa-claro); background: #fff; color: var(--tinta); font-weight: 700; font-size: 0.85rem; cursor: pointer;">En elaboración</button>
                <button class="btn-filtro-estado" data-estado="Completado" style="padding: 0.4rem 1rem; border-radius: 999px; border: 1.5px solid var(--rosa-claro); background: #fff; color: var(--tinta); font-weight: 700; font-size: 0.85rem; cursor: pointer;">Completados</button>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
                <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <label for="filtro-mes-pedidos" style="font-size: 0.85rem; font-weight: 600; margin: 0;">Mes:</label>
                        <select id="filtro-mes-pedidos" style="padding: 5px 10px; border-radius: 10px; border: 1.5px solid var(--rosa-claro); font-size: 0.85rem; background: #fff; width: auto;">
                            <option value="todos">Todos los meses</option>
                            <option value="1">Enero</option><option value="2">Febrero</option><option value="3">Marzo</option>
                            <option value="4">Abril</option><option value="5">Mayo</option><option value="6">Junio</option>
                            <option value="7">Julio</option><option value="8">Agosto</option><option value="9">Septiembre</option>
                            <option value="10">Octubre</option><option value="11">Noviembre</option><option value="12">Diciembre</option>
                        </select>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <label for="filtro-tipo-pedidos" style="font-size: 0.85rem; font-weight: 600; margin: 0;">Tipo de pieza:</label>
                        <select id="filtro-tipo-pedidos" style="padding: 5px 10px; border-radius: 10px; border: 1.5px solid var(--rosa-claro); font-size: 0.85rem; background: #fff; width: auto;">
                            <option value="todos">Todas las piezas</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        const tabla = seccionGestion.querySelector('.contenedor-tabla');
        if (tabla) seccionGestion.insertBefore(contenedorFiltros, tabla);

        contenedorFiltros.querySelectorAll('.btn-filtro-estado').forEach(btn => {
            btn.addEventListener('click', (e) => {
                contenedorFiltros.querySelectorAll('.btn-filtro-estado').forEach(b => {
                    b.style.background = '#fff';
                    b.style.color = 'var(--tinta)';
                    b.classList.remove('activo');
                });
                e.target.style.background = 'var(--rosa)';
                e.target.style.color = '#fff';
                e.target.classList.add('activo');

                estadoFiltroAdmin = e.target.dataset.estado;
                renderizarPedidos();
            });
        });

        const selMes = document.getElementById('filtro-mes-pedidos');
        const selTipo = document.getElementById('filtro-tipo-pedidos');

        if (selMes) selMes.addEventListener('change', (e) => { filtroMesSeleccionado = e.target.value; renderizarPedidos(); });
        if (selTipo) selTipo.addEventListener('change', (e) => { filtroTipoSeleccionado = e.target.value; renderizarPedidos(); });
    }

    function actualizarOpcionesTipoPieza(pedidos) {
        const selTipo = document.getElementById('filtro-tipo-pedidos');
        if (!selTipo) return;

        const valorPrevio = selTipo.value;
        const tipos = new Set();
        pedidos.forEach(p => { if (p.producto) tipos.add(p.producto.trim()); });

        selTipo.innerHTML = '<option value="todos">Todas las piezas</option>';
        tipos.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            selTipo.appendChild(opt);
        });

        if (Array.from(tipos).includes(valorPrevio)) selTipo.value = valorPrevio;
    }

    async function renderizarPedidos() {
        if (!cuerpoTablaPedidos) return;
        inyectarControlesFiltro();

        let pedidos = [];
        try {
            const respuesta = await fetch('/api/pedidos');
            if (respuesta.ok) pedidos = await respuesta.json();
        } catch (error) { console.error('Error al obtener pedidos:', error); }

        actualizarOpcionesTipoPieza(pedidos);
        cuerpoTablaPedidos.innerHTML = '';

        let pendientes = 0, elaboracion = 0, completados = 0, totalCobrado = 0;

        const pedidosFiltrados = pedidos.map((p, indexOriginal) => ({ ...p, indexOriginal })).filter(p => {
            const estadoActual = p.estado || 'Pendiente';
            const cumpleEstado = (estadoFiltroAdmin === 'todos') || (estadoActual === estadoFiltroAdmin);
            const cumpleTipo = (filtroTipoSeleccionado === 'todos') || (p.producto && p.producto.trim().toLowerCase() === filtroTipoSeleccionado.trim().toLowerCase());

            let cumpleMes = true;
            if (filtroMesSeleccionado !== 'todos') {
                const mesCreacion = obtenerMesDeFecha(p.fechaCreacion);
                const mesEntrega = obtenerMesDeFecha(p.fechaEntrega);
                cumpleMes = (mesCreacion === parseInt(filtroMesSeleccionado, 10)) || (mesEntrega === parseInt(filtroMesSeleccionado, 10));
            }
            return cumpleEstado && cumpleTipo && cumpleMes;
        });

        pedidos.forEach(p => {
            const estado = p.estado || 'Pendiente';
            if (estado === 'Pendiente') pendientes++;
            else if (estado === 'En elaboración') elaboracion++;
            else if (estado === 'Completado') completados++;

            const precioNum = parseFloat(p.precioTotal) || 0;
            if (estado === 'En elaboración') totalCobrado += (precioNum * 0.50);
            else if (estado === 'Completado') totalCobrado += precioNum;
        });

        if (pedidosFiltrados.length === 0) {
            cuerpoTablaPedidos.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 1.5rem; color: var(--tinta);">No se encontraron encargos con este filtro.</td></tr>';
        } else {
            pedidosFiltrados.forEach((p) => {
                const idPedido = p._id || p.indexOriginal;
                const estado = p.estado || 'Pendiente';
                const precioNum = parseFloat(p.precioTotal) || 0;
                const tiempoFormateado = formatearTiempo(p.segundosTejidos || 0);
                const activo = p.cronometroActivo || false;
                const fechaCreacionTexto = p.fechaCreacion ? formatearFechaTexto(p.fechaCreacion) : 'Hoy';
                const fechaEntregaTexto = p.fechaEntrega ? formatearFechaTexto(p.fechaEntrega) : 'Por definir';
                const enlaceWs = p.celular ? `https://wa.me/593${p.celular.replace(/^0/, '')}` : '#';

                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td style="white-space: nowrap;">${fechaCreacionTexto}</td>
                    <td><strong>${p.nombre || 'Sin nombre'}</strong></td>
                    <td>${p.correo || 'Sin correo'}</td>
                    <td style="white-space: nowrap;">
                        ${p.celular ? `<a href="${enlaceWs}" target="_blank" rel="noopener noreferrer" style="color: #2F6224; font-weight: 700; text-decoration: underline;" title="Abrir en WhatsApp">${p.celular}</a>` : '<span style="color:#999;">-</span>'}
                    </td>
                    <td>
                        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 3px;">
                            <span style="font-weight: 600; color: var(--tinta); white-space: nowrap;">${p.producto || 'Diseño especial'}</span>
                            ${(p.imagenReferencia || p.detalles) ? `<button class="boton-ver-foto-ref" data-id="${idPedido}" style="background:none; border:none; padding:0; font-size:0.78rem; color:var(--rosa); font-weight:700; text-decoration:underline; cursor:pointer;">Ver detalles</button>` : ''}
                        </div>
                    </td>
                    <td style="white-space: nowrap;">${fechaEntregaTexto}</td>
                    <td>
                        <input type="number" step="0.50" min="0" class="input-precio-total" data-id="${idPedido}" value="${precioNum > 0 ? precioNum.toFixed(2) : ''}" placeholder="$0.00" style="width: 80px; padding: 5px 8px; border: 1.5px solid var(--rosa-claro); border-radius: 8px; font-weight: 700; text-align: center; font-size: 0.9rem; background-color: #fff;">
                    </td>
                    <td style="white-space: nowrap;">
                        <select class="select-cambio-estado" data-id="${idPedido}" style="padding: 5px 8px; border-radius: 8px; border: 1.5px solid var(--rosa-claro); font-size: 0.85rem; cursor: pointer; background-color: #fff; width: auto; min-width: 130px;">
                            <option value="Pendiente" ${estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="En elaboración" ${estado === 'En elaboración' ? 'selected' : ''}>En elaboración</option>
                            <option value="Completado" ${estado === 'Completado' ? 'selected' : ''}>Completado</option>
                        </select>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem; white-space: nowrap;">
                            <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: #fff; padding: 4px 10px; border-radius: 999px; border: 1.5px solid var(--rosa-claro);">
                                <span class="timer-display" data-id="${idPedido}" style="font-family: monospace; font-size: 0.84rem; font-weight: 700; color: var(--tinta); min-width: 62px; text-align: center;">${tiempoFormateado}</span>
                                <button class="btn-toggle-timer" data-id="${idPedido}" title="${activo ? 'Pausar' : 'Iniciar'}" style="background: ${activo ? '#FFD45C' : 'var(--rosa)'}; color: ${activo ? 'var(--tinta)' : '#fff'}; border: none; border-radius: 50%; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; cursor: pointer; line-height: 1;">
                                    ${activo ? '❚❚' : '▶'}
                                </button>
                                <button class="btn-reset-timer" data-id="${idPedido}" title="Reiniciar" style="background: none; border: none; color: #999; font-size: 0.9rem; cursor: pointer; padding: 0 3px; line-height: 1;">↺</button>
                            </div>
                            <button class="boton-eliminar-pedido" data-id="${idPedido}" title="Eliminar" style="background: none; border: none; color: #C93A5B; font-size: 1.15rem; font-weight: 700; cursor: pointer; padding: 4px; line-height: 1;">✕</button>
                        </div>
                    </td>
                `;
                cuerpoTablaPedidos.appendChild(fila);
            });
        }

        const elPendientes = document.getElementById('total-pendientes');
        const elElaboracion = document.getElementById('total-elaboracion');
        const elCompletados = document.getElementById('total-completados');
        const elIngresos = document.getElementById('total-ingresos');

        if (elPendientes) elPendientes.textContent = pendientes;
        if (elElaboracion) elElaboracion.textContent = elaboracion;
        if (elCompletados) elCompletados.textContent = completados;
        if (elIngresos) elIngresos.textContent = `$${totalCobrado.toFixed(2)}`;

        document.querySelectorAll('.btn-toggle-timer').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const p = pedidos.find(item => (item._id === id || item.indexOriginal == id));
                if (!p) return;
                const activoActual = p.cronometroActivo || false;
                const nuevoEstadoActivo = !activoActual;

                let segundosActuales = p.segundosTejidos || 0;
                const display = document.querySelector(`.timer-display[data-id="${id}"]`);
                if (display) {
                    const partes = display.textContent.split(':');
                    if (partes.length === 3) segundosActuales = parseInt(partes[0]) * 3600 + parseInt(partes[1]) * 60 + parseInt(partes[2]);
                }

                try {
                    await fetch(`/api/pedidos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cronometroActivo: nuevoEstadoActivo, segundosTejidos: segundosActuales })
                    });
                    renderizarPedidos();
                } catch (err) { console.error(err); }
            });
        });

        document.querySelectorAll('.btn-reset-timer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                mostrarConfirmacion('¿Reiniciar el cronómetro de este encargo a 00:00:00?', async () => {
                    try {
                        await fetch(`/api/pedidos/${id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ segundosTejidos: 0, cronometroActivo: false })
                        });
                        mostrarToast('Cronómetro reiniciado.', 'exito');
                        renderizarPedidos();
                    } catch (err) { console.error(err); }
                });
            });
        });

        document.querySelectorAll('.boton-ver-foto-ref').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const p = pedidos.find(item => item._id === id || item.indexOriginal == id);
                if (p) {
                    if (textoObsModal) {
                        textoObsModal.innerHTML = `
                            <strong style="color: var(--rosa); display: block; margin-bottom: 0.3rem; font-size: 1.05rem;">Cliente: ${p.nombre || 'Sin nombre'}</strong>
                            <p style="margin: 0.2rem 0;"><strong>Correo:</strong> ${p.correo || 'N/A'}</p>
                            <p style="margin: 0.2rem 0;"><strong>Celular:</strong> ${p.celular || 'N/A'}</p>
                            <p style="margin: 0.2rem 0;"><strong>Tipo:</strong> ${p.producto || 'N/A'}</p>
                            <p style="margin: 0.2rem 0;"><strong>Fecha de Entrega:</strong> ${p.fechaEntrega ? formatearFechaTexto(p.fechaEntrega) : 'N/A'}</p>
                            <hr style="border: none; border-top: 1px dashed var(--rosa-claro); margin: 0.6rem 0;">
                            <p style="margin: 0;"><strong>Observaciones:</strong><br>${p.detalles || 'Sin observaciones'}</p>
                        `;
                    }
                    if (contenedorFotoModal && imgModal) {
                        if (p.imagenReferencia) {
                            imgModal.src = p.imagenReferencia;
                            contenedorFotoModal.style.display = 'flex';
                        } else {
                            contenedorFotoModal.style.display = 'none';
                        }
                    }
                    if (modalFoto) modalFoto.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('.select-cambio-estado').forEach(sel => {
            sel.addEventListener('change', async (e) => {
                const id = e.target.dataset.id;
                const nuevoEstado = e.target.value;
                try {
                    await fetch(`/api/pedidos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ estado: nuevoEstado })
                    });
                    mostrarToast('Estado actualizado.', 'exito');
                } catch (err) { console.error(err); }
                renderizarPedidos();
            });
        });

        document.querySelectorAll('.input-precio-total').forEach(inp => {
            inp.addEventListener('change', async (e) => {
                const id = e.target.dataset.id;
                const nuevoPrecio = parseFloat(e.target.value) || 0;
                try {
                    await fetch(`/api/pedidos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ precioTotal: nuevoPrecio })
                    });
                    mostrarToast('Precio actualizado.', 'exito');
                } catch (err) { console.error(err); }
                renderizarPedidos();
            });
        });

        document.querySelectorAll('.boton-eliminar-pedido').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                mostrarConfirmacion('¿Estás segura de eliminar este encargo?', async () => {
                    try {
                        await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
                        mostrarToast('Encargo eliminado.', 'exito');
                    } catch (err) { console.error(err); }
                    renderizarPedidos();
                });
            });
        });
    }

    async function renderizarCatalogoAdmin() {
        if (!contenedorCatalogoAdmin) return;
        const productos = await obtenerCatalogo();
        contenedorCatalogoAdmin.innerHTML = '';

        if (productos.length === 0) {
            contenedorCatalogoAdmin.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--tinta); padding: 2rem;">No hay productos en el catálogo actualmente.</p>';
            return;
        }

        productos.forEach((prod) => {
            const idProd = prod._id;
            const card = document.createElement('article');
            card.className = 'tarjeta-producto';
            card.style.position = 'relative';

            card.innerHTML = `
                <button class="boton-eliminar-producto" data-id="${idProd}" title="Eliminar pieza" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: white; border: none; border-radius: 50%; width: 28px; height: 28px; color: #C93A5B; font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">✕</button>
                <div class="imagen-producto">
                    <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='images/amigurumi.jpg'">
                    <span class="etiqueta-categoria">${prod.categoria}</span>
                </div>
                <div class="info-producto" style="display: flex; flex-direction: column; gap: 0.3rem; padding: 1rem;">
                    <h3 class="nombre-producto editable-item" contenteditable="true" data-id="${idProd}" data-campo="nombre" style="font-size: 1rem; outline: none; margin: 0;">${prod.nombre}</h3>
                    <p class="descripcion-producto editable-item" contenteditable="true" data-id="${idProd}" data-campo="descripcion" style="font-size: 0.82rem; outline: none; margin: 0; color: var(--tinta);">${prod.descripcion}</p>
                    <div class="pie-tarjeta" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px solid #f0f0f0;">
                        <span style="font-size: 0.78rem; font-weight: 600;">Precio ($):</span>
                        <input type="number" step="0.50" min="0" class="input-precio-producto" data-id="${idProd}" value="${parseFloat(prod.precio || 0).toFixed(2)}" style="width: 75px; padding: 3px 6px; border: 1.5px solid var(--rosa-claro); border-radius: 8px; font-weight: 700; text-align: center; font-size: 0.85rem; background: #fff;">
                    </div>
                </div>
            `;
            contenedorCatalogoAdmin.appendChild(card);
        });

        document.querySelectorAll('.editable-item').forEach(el => {
            el.addEventListener('focus', (e) => { e.target.style.backgroundColor = '#FFF7FA'; e.target.style.borderColor = 'var(--rosa)'; });
            el.addEventListener('blur', async (e) => {
                e.target.style.backgroundColor = 'transparent';
                const id = e.target.dataset.id;
                const campo = e.target.dataset.campo;
                const valor = e.target.innerText.trim();
                if (!id) return;
                try {
                    await fetch(`/api/productos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ [campo]: valor })
                    });
                    renderizarCatalogoPublico();
                    mostrarToast('Cambio guardado.', 'exito');
                } catch (err) { console.error(err); }
            });
        });

        document.querySelectorAll('.input-precio-producto').forEach(inp => {
            inp.addEventListener('change', async (e) => {
                const id = e.target.dataset.id;
                const nuevoPrecio = parseFloat(e.target.value) || 0;
                if (!id) return;
                try {
                    await fetch(`/api/productos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ precio: nuevoPrecio })
                    });
                    renderizarCatalogoPublico();
                    mostrarToast('Precio actualizado.', 'exito');
                } catch (err) { console.error(err); }
            });
        });

        document.querySelectorAll('.boton-eliminar-producto').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (!id) return;
                mostrarConfirmacion('¿Estás segura de eliminar esta pieza?', async () => {
                    try {
                        await fetch(`/api/productos/${id}`, { method: 'DELETE' });
                        renderizarCatalogoAdmin();
                        renderizarCatalogoPublico();
                        mostrarToast('Pieza eliminada.', 'exito');
                    } catch (err) { console.error(err); }
                });
            });
        });
    }

    const formNuevaPieza = document.getElementById('formulario-nuevo-producto');
    if (formNuevaPieza) {
        formNuevaPieza.addEventListener('submit', async (e) => {
            e.preventDefault();
            const elNombre = document.getElementById('nuevo-nombre-producto');
            const elSelectCat = document.getElementById('nueva-categoria-producto');
            const elOtraCat = document.getElementById('input-otra-categoria');
            const elPrecio = document.getElementById('nuevo-precio-producto');
            const elDesc = document.getElementById('nueva-descripcion-producto');
            const elFoto = document.getElementById('imagen-producto-admin');

            const nombre = elNombre ? elNombre.value.trim() : '';
            const precio = parseFloat(elPrecio ? elPrecio.value : 0) || 0;
            let categoria = elSelectCat ? elSelectCat.value : '';
            if (categoria === '__nueva__' && elOtraCat && elOtraCat.value.trim()) categoria = elOtraCat.value.trim();
            const descripcion = elDesc ? elDesc.value.trim() : '';
            const archivo = elFoto?.files ? elFoto.files[0] : null;

            if (!nombre || !categoria || precio <= 0 || !archivo) {
                mostrarToast('Completa los campos obligatorios y selecciona una foto.', 'error');
                return;
            }

            const lector = new FileReader();
            lector.onload = async function (evento) {
                const nuevoProducto = { nombre, categoria, precio, descripcion, imagen: evento.target.result };
                try {
                    const respuesta = await fetch('/api/productos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(nuevoProducto)
                    });
                    if (respuesta.ok) {
                        mostrarToast('¡Pieza agregada con éxito!', 'exito');
                        formNuevaPieza.reset();
                        document.getElementById('modal-nuevo-producto').style.display = 'none';
                        renderizarCatalogoAdmin();
                        renderizarCatalogoPublico();
                    } else {
                        mostrarToast('Error al guardar.', 'error');
                    }
                } catch (err) { console.error(err); }
            };
            lector.readAsDataURL(archivo);
        });
    }

    const tokenGuardado = localStorage.getItem('balenzaa_token');
    if (tokenGuardado && seccionLoginAdmin && panelContenido) {
        seccionLoginAdmin.style.display = 'none';
        panelContenido.style.display = 'block';
        renderizarPedidos();
        renderizarCatalogoAdmin();
    }

    if (formLoginAdmin) {
        formLoginAdmin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usuario = document.getElementById('usuario-admin').value.trim();
            const clave = document.getElementById('clave-admin').value.trim();
            try {
                const respuesta = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, clave })
                });
                const datos = await respuesta.json();
                if (respuesta.ok) {
                    localStorage.setItem('balenzaa_token', datos.token);
                    seccionLoginAdmin.style.display = 'none';
                    panelContenido.style.display = 'block';
                    renderizarPedidos();
                    renderizarCatalogoAdmin();
                    mostrarToast('Sesión iniciada.', 'exito');
                } else {
                    if (errorLogin) { errorLogin.textContent = datos.error || 'Credenciales incorrectas.'; errorLogin.style.display = 'block'; }
                }
            } catch (err) { console.error(err); }
        });
    }

    if (botonSalir) {
        botonSalir.addEventListener('click', () => {
            localStorage.removeItem('balenzaa_token');
            panelContenido.style.display = 'none';
            seccionLoginAdmin.style.display = 'block';
            mostrarToast('Sesión cerrada.', 'exito');
        });
    }
});