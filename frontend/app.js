// BALENZAA

document.addEventListener('DOMContentLoaded', () => {

    // 0. Banner de Estado de la Agenda (Tienda publica)
    const bannerAgenda = document.getElementById('banner-estado-agenda');
    if (bannerAgenda) {
        const estaCerrada = localStorage.getItem('balenzaa_agenda_cerrada') === 'true';
        if (estaCerrada) {
            bannerAgenda.textContent = 'Agenda cerrada por el momento';
            bannerAgenda.className = 'agenda-cerrada';
        } else {
            bannerAgenda.textContent = 'Agenda abierta';
            bannerAgenda.className = 'agenda-abierta';
        }
    }

    // 1. Catalogo Compartido: Obtencion y Sincronizacion
    const catalogoInicial = [
        {
            id: 1,
            nombre: 'Nombre del amigurumi',
            categoria: 'Amigurumis',
            precio: '15.00',
            descripcion: 'Descripcion del amigurumi y detalles de tejido.',
            imagen: 'images/amigurumi.jpg'
        },
        {
            id: 2,
            nombre: 'Nombre del llavero',
            categoria: 'Llaveros',
            precio: '5.00',
            descripcion: 'Descripcion del llavero y opciones de personalizacion.',
            imagen: 'images/llavero.jpg'
        },
        {
            id: 3,
            nombre: 'Nombre del ramo de flores',
            categoria: 'Ramos de Flores',
            precio: '20.00',
            descripcion: 'Descripcion del ramo de flores y cantidad de piezas.',
            imagen: 'images/ramo.jpg'
        }
    ];

    function obtenerCatalogo() {
        const guardado = localStorage.getItem('balenzaa_catalogo');
        if (!guardado) {
            localStorage.setItem('balenzaa_catalogo', JSON.stringify(catalogoInicial));
            return catalogoInicial;
        }
        return JSON.parse(guardado);
    }

    // Renderizar catalogo dinamico en la tienda publica (index.html)
    const contenedorCatalogoTienda = document.getElementById('contenedor-catalogo-tienda');

    function renderizarCatalogoPublico() {
        if (!contenedorCatalogoTienda) return;
        const productos = obtenerCatalogo();
        contenedorCatalogoTienda.innerHTML = '';

        productos.forEach(prod => {
            const card = document.createElement('article');
            card.className = 'tarjeta-producto';
            card.dataset.categoria = (prod.categoria || '').trim().toLowerCase();

            card.innerHTML = `
                <div class="imagen-producto">
                    <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='images/amigurumi.jpg'">
                    <span class="etiqueta-categoria">${prod.categoria}</span>
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
                        <a href="#pedidos" class="boton-encargar" style="font-size: 0.9rem; font-weight: 600; text-decoration: underline; cursor: pointer; color: var(--tinta);">
                            Encargar
                        </a>
                    </div>
                </div>
            `;
            contenedorCatalogoTienda.appendChild(card);
        });

        aplicarFiltrosCatalogo();
    }

    // Generar botones de filtro dinamicos y sincronizar select de pedidos
    function aplicarFiltrosCatalogo() {
        const contenedorFiltros = document.getElementById('contenedor-filtros-catalogo');
        const productos = obtenerCatalogo();

        const categoriasSet = new Set();
        ['Amigurumis', 'Llaveros', 'Ramos de Flores'].forEach(c => categoriasSet.add(c));
        productos.forEach(p => {
            if (p.categoria) {
                const nombreCat = p.categoria.trim();
                const capitalizada = nombreCat.charAt(0).toUpperCase() + nombreCat.slice(1);
                categoriasSet.add(capitalizada);
            }
        });

        if (contenedorFiltros) {
            contenedorFiltros.innerHTML = `
                <button class="boton-filtro activo" data-filtro="todos">Todos</button>
            `;

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

        const selectProductoPedido = document.getElementById('tipo-producto');
        if (selectProductoPedido) {
            const valorActual = selectProductoPedido.value;
            selectProductoPedido.innerHTML = '<option value="" disabled selected>Selecciona que deseas encargar</option>';
            categoriasSet.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                selectProductoPedido.appendChild(opt);
            });
            selectProductoPedido.innerHTML += '<option value="Diseño especial">Diseño personalizado / Otro</option>';
            if (valorActual) selectProductoPedido.value = valorActual;
        }
    }

    renderizarCatalogoPublico();

    // 2. Interaccion con BalenzIA (Popup Flotante)
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

    // Nombre de archivo seleccionado en formulario de pedidos
    const inputArchivoRef = document.getElementById('imagen-referencia-pedido');
    const textoNombreArchivo = document.getElementById('nombre-archivo-pedido');

    if (inputArchivoRef && textoNombreArchivo) {
        inputArchivoRef.addEventListener('change', () => {
            if (inputArchivoRef.files && inputArchivoRef.files.length > 0) {
                textoNombreArchivo.textContent = inputArchivoRef.files[0].name;
                textoNombreArchivo.style.opacity = '1';
                textoNombreArchivo.style.fontWeight = '600';
            } else {
                textoNombreArchivo.textContent = 'Ningun archivo seleccionado';
                textoNombreArchivo.style.opacity = '0.75';
                textoNombreArchivo.style.fontWeight = 'normal';
            }
        });
    }

    // 3. Envio del Formulario de Pedidos
    const formPedido = document.getElementById('formulario-pedido');
    if (formPedido) {
        formPedido.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre-cliente')?.value.trim();
            const correo = document.getElementById('correo-cliente')?.value.trim();
            const celular = document.getElementById('celular-cliente')?.value.trim();
            const suscribir = document.getElementById('suscribir-newsletter')?.checked;
            const archivoReferencia = inputArchivoRef?.files[0];

            function registrarPedido(imagenRefBase64 = null) {
                const nuevoPedido = {
                    id: Date.now(),
                    nombre,
                    correo,
                    celular,
                    producto: document.getElementById('tipo-producto')?.value,
                    detalles: document.getElementById('detalles-pedido')?.value,
                    fechaEntrega: document.getElementById('fecha-entrega')?.value,
                    imagenReferencia: imagenRefBase64,
                    suscritoClub: suscribir,
                    fechaCreacion: new Date().toLocaleDateString('es-EC')
                };

                const pedidosGuardados = JSON.parse(localStorage.getItem('balenzaa_pedidos') || '[]');
                pedidosGuardados.push(nuevoPedido);
                localStorage.setItem('balenzaa_pedidos', JSON.stringify(pedidosGuardados));

                alert(`Gracias, ${nombre}! Tu encargo ha sido registrado con exito en Balenzaa.` + (suscribir ? ' Te has sumado al Club Balenzaa' : ''));
                formPedido.reset();
                if (textoNombreArchivo) {
                    textoNombreArchivo.textContent = 'Ningun archivo seleccionado';
                    textoNombreArchivo.style.opacity = '0.75';
                    textoNombreArchivo.style.fontWeight = 'normal';
                }
            }

            if (archivoReferencia) {
                const lector = new FileReader();
                lector.onload = function (evento) {
                    registrarPedido(evento.target.result);
                };
                lector.readAsDataURL(archivoReferencia);
            } else {
                registrarPedido(null);
            }
        });
    }

    // 4. Panel de Administracion (admin.html)
    const formLoginAdmin = document.getElementById('formulario-login-admin');
    const seccionLoginAdmin = document.getElementById('seccion-login-admin');
    const panelContenido = document.getElementById('panel-contenido');
    const errorLogin = document.getElementById('error-login');
    const botonSalir = document.getElementById('boton-cerrar-sesion');
    const botonToggleAgenda = document.getElementById('boton-toggle-agenda');
    const cuerpoTablaPedidos = document.getElementById('cuerpo-tabla-pedidos');
    const formNuevaPieza = document.getElementById('formulario-nueva-pieza') || document.getElementById('formulario-nuevo-producto');

    // Modal de imagen de referencia
    const modalFoto = document.getElementById('modal-foto-referencia');
    const imgModal = document.getElementById('img-modal-referencia');
    const btnCerrarModal = document.getElementById('cerrar-modal-foto');

    if (btnCerrarModal && modalFoto) {
        btnCerrarModal.onclick = () => { modalFoto.style.display = 'none'; };
        modalFoto.onclick = (e) => {
            if (e.target === modalFoto) modalFoto.style.display = 'none';
        };
    }

    // Metricas
    const elPendientes = document.getElementById('total-pendientes');
    const elElaboracion = document.getElementById('total-elaboracion');
    const elCompletados = document.getElementById('total-completados');
    const elIngresos = document.getElementById('total-ingresos');

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

    const agendaGuardadaCerrada = localStorage.getItem('balenzaa_agenda_cerrada') === 'true';
    actualizarVisualAgenda(agendaGuardadaCerrada);

    // Renderizar Pedidos
    function renderizarPedidos() {
        if (!cuerpoTablaPedidos) return;

        const pedidos = JSON.parse(localStorage.getItem('balenzaa_pedidos') || '[]');
        cuerpoTablaPedidos.innerHTML = '';

        let pendientes = 0;
        let elaboracion = 0;
        let completados = 0;
        let totalCobrado = 0;

        if (pedidos.length === 0) {
            cuerpoTablaPedidos.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 1.5rem; color: var(--tinta);">No hay pedidos registrados aun.</td></tr>';
        } else {
            pedidos.forEach((p, index) => {
                const estado = p.estado || 'Pendiente';
                if (estado === 'Pendiente') pendientes++;
                else if (estado === 'En elaboración') elaboracion++;
                else if (estado === 'Completado') completados++;

                const precioNum = parseFloat(p.precioTotal) || 0;

                if (estado === 'En elaboración') {
                    totalCobrado += (precioNum * 0.50);
                } else if (estado === 'Completado') {
                    totalCobrado += precioNum;
                }

                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.fechaCreacion || 'Hoy'}</td>
                    <td><strong>${p.nombre || 'Sin nombre'}</strong></td>
                    <td>
                        ${p.correo || 'Sin correo'}
                        ${p.suscritoClub ? '<br><span style="font-size:0.75rem; background:var(--rosa-pastel); color:var(--tinta); padding:2px 8px; border-radius:999px;">Club</span>' : ''}
                    </td>
                    <td>
                        ${p.celular ? `<a href="https://wa.me/593${p.celular.replace(/^0/, '')}" target="_blank" style="color: #2F6224; font-weight: 600; text-decoration: underline;">${p.celular}</a>` : '<span style="color:#999;">-</span>'}
                    </td>
                    <td>
                        ${p.producto || 'Diseño especial'}
                        ${p.imagenReferencia ? `<br><button class="boton-ver-foto-ref" data-index="${index}" style="background:none; border:none; padding:0; font-size:0.75rem; color:var(--rosa); font-weight:700; text-decoration:underline; cursor:pointer;">Ver foto</button>` : ''}
                    </td>
                    <td>${p.fechaEntrega || 'Por definir'}</td>
                    <td>
                        <input type="number" step="0.50" min="0" class="input-precio-total" data-index="${index}" value="${precioNum > 0 ? precioNum.toFixed(2) : ''}" placeholder="$0.00" style="width: 85px; padding: 5px 8px; border: 1.5px solid var(--rosa-claro); border-radius: 8px; font-weight: 700; text-align: center; font-size: 0.9rem; background-color: #fff;">
                    </td>
                    <td>
                        <select class="select-cambio-estado" data-index="${index}" style="padding: 5px 8px; border-radius: 8px; border: 1.5px solid var(--rosa-claro); font-size: 0.85rem; cursor: pointer; background-color: #fff;">
                            <option value="Pendiente" ${estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="En elaboración" ${estado === 'En elaboración' ? 'selected' : ''}>En elaboración</option>
                            <option value="Completado" ${estado === 'Completado' ? 'selected' : ''}>Completado</option>
                        </select>
                    </td>
                    <td>
                        <button class="boton-eliminar-pedido" data-index="${index}" title="Eliminar encargo" style="background: none; border: none; color: #C93A5B; font-size: 1.15rem; font-weight: 700; cursor: pointer; padding: 4px 8px; line-height: 1; transition: transform 0.15s ease;">
                            ✕
                        </button>
                    </td>
                `;
                cuerpoTablaPedidos.appendChild(fila);
            });
        }

        if (elPendientes) elPendientes.textContent = pendientes;
        if (elElaboracion) elElaboracion.textContent = elaboracion;
        if (elCompletados) elCompletados.textContent = completados;
        if (elIngresos) elIngresos.textContent = `$${totalCobrado.toFixed(2)}`;

        document.querySelectorAll('.boton-ver-foto-ref').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = e.target.dataset.index;
                const prods = JSON.parse(localStorage.getItem('balenzaa_pedidos') || '[]');
                if (prods[i] && prods[i].imagenReferencia && modalFoto && imgModal) {
                    imgModal.src = prods[i].imagenReferencia;
                    modalFoto.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('.input-precio-total').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const i = e.target.dataset.index;
                pedidos[i].precioTotal = parseFloat(e.target.value) || 0;
                localStorage.setItem('balenzaa_pedidos', JSON.stringify(pedidos));
                renderizarPedidos();
            });
        });

        document.querySelectorAll('.select-cambio-estado').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const i = e.target.dataset.index;
                pedidos[i].estado = e.target.value;
                localStorage.setItem('balenzaa_pedidos', JSON.stringify(pedidos));
                renderizarPedidos();
            });
        });

        document.querySelectorAll('.boton-eliminar-pedido').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = e.target.dataset.index;
                const pedidoAEliminar = pedidos[i];
                const confirma = confirm(`Estas segura de eliminar el encargo de ${pedidoAEliminar.nombre || 'este cliente'}?`);
                if (confirma) {
                    pedidos.splice(i, 1);
                    localStorage.setItem('balenzaa_pedidos', JSON.stringify(pedidos));
                    renderizarPedidos();
                }
            });
        });
    }

    // --- GESTION VISUAL DEL CATALOGO EN ADMIN ---
    const contenedorCatalogoAdmin = document.getElementById('contenedor-catalogo-admin');
    const selectCategoria = document.getElementById('nueva-categoria-producto') || document.getElementById('categoria-nueva-pieza');
    const inputOtraCat = document.getElementById('input-otra-categoria') || document.getElementById('input-categoria-personalizada');

    if (selectCategoria && inputOtraCat) {
        selectCategoria.addEventListener('change', (e) => {
            if (e.target.value === '__nueva__') {
                inputOtraCat.style.display = 'block';
                inputOtraCat.required = true;
                inputOtraCat.focus();
            } else {
                inputOtraCat.style.display = 'none';
                inputOtraCat.required = false;
                inputOtraCat.value = '';
            }
        });
    }

    function renderizarCatalogoAdmin() {
        if (!contenedorCatalogoAdmin) return;
        const productos = obtenerCatalogo();
        contenedorCatalogoAdmin.innerHTML = '';

        if (productos.length === 0) {
            contenedorCatalogoAdmin.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--tinta); padding: 2rem;">No hay productos en el catalogo actualmente.</p>';
            return;
        }

        productos.forEach((prod, index) => {
            const card = document.createElement('article');
            card.className = 'tarjeta-producto';
            card.style.position = 'relative';

            card.innerHTML = `
                <button class="boton-eliminar-producto" data-index="${index}" title="Eliminar pieza" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: white; border: none; border-radius: 50%; width: 28px; height: 28px; color: #C93A5B; font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">
                    ✕
                </button>
                <div class="imagen-producto">
                    <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='images/amigurumi.jpg'">
                    <span class="etiqueta-categoria">${prod.categoria}</span>
                </div>
                <div class="info-producto" style="display: flex; flex-direction: column; gap: 0.4rem;">
                    <h3 class="nombre-producto editable-item" contenteditable="true" data-index="${index}" data-campo="nombre" title="Haz clic para editar el nombre" style="border-bottom: 1px dashed transparent; outline: none; border-radius: 4px; padding: 2px;">
                        ${prod.nombre}
                    </h3>
                    <p class="descripcion-producto editable-item" contenteditable="true" data-index="${index}" data-campo="descripcion" title="Haz clic para editar la descripcion" style="border-bottom: 1px dashed transparent; outline: none; border-radius: 4px; padding: 2px; min-height: 40px;">
                        ${prod.descripcion}
                    </p>
                    <div class="pie-tarjeta" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                        <span style="font-size: 0.85rem; font-weight: 600;">Precio (USD):</span>
                        <input type="number" step="0.50" min="0" class="input-precio-producto" data-index="${index}" value="${parseFloat(prod.precio || 0).toFixed(2)}" style="width: 85px; padding: 4px 6px; border: 1.5px solid var(--rosa-claro); border-radius: 8px; font-weight: 700; text-align: center; font-size: 0.9rem; background: #fff;">
                    </div>
                </div>
            `;
            contenedorCatalogoAdmin.appendChild(card);
        });

        document.querySelectorAll('.editable-item').forEach(el => {
            el.addEventListener('focus', (e) => {
                e.target.style.backgroundColor = '#FFF7FA';
                e.target.style.borderColor = 'var(--rosa)';
            });
            el.addEventListener('blur', (e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'transparent';
                const i = e.target.dataset.index;
                const campo = e.target.dataset.campo;
                const valor = e.target.innerText.trim();
                const prods = obtenerCatalogo();
                prods[i][campo] = valor;
                localStorage.setItem('balenzaa_catalogo', JSON.stringify(prods));
                renderizarCatalogoPublico();
            });
        });

        document.querySelectorAll('.input-precio-producto').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const i = e.target.dataset.index;
                const nuevoPrecio = parseFloat(e.target.value) || 0;
                const prods = obtenerCatalogo();
                prods[i].precio = nuevoPrecio.toFixed(2);
                localStorage.setItem('balenzaa_catalogo', JSON.stringify(prods));
                renderizarCatalogoPublico();
            });
        });

        document.querySelectorAll('.boton-eliminar-producto').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = e.target.dataset.index;
                const prods = obtenerCatalogo();
                const confirma = confirm(`Estas segura de eliminar "${prods[i].nombre}" del catalogo?`);
                if (confirma) {
                    prods.splice(i, 1);
                    localStorage.setItem('balenzaa_catalogo', JSON.stringify(prods));
                    renderizarCatalogoAdmin();
                    renderizarCatalogoPublico();
                }
            });
        });
    }

    // --- AUTENTICACION Y SESION ADMIN ---
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
                // Intento con backend real si estuviera encendido
                const respuesta = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, clave })
                });

                const data = await respuesta.json();

                if (respuesta.ok && data.token) {
                    localStorage.setItem('balenzaa_token', data.token);
                    seccionLoginAdmin.style.display = 'none';
                    panelContenido.style.display = 'block';
                    if (errorLogin) errorLogin.style.display = 'none';
                    renderizarPedidos();
                    renderizarCatalogoAdmin();
                } else {
                    if (errorLogin) {
                        errorLogin.textContent = data.mensaje || 'Usuario o contraseña incorrectos';
                        errorLogin.style.display = 'block';
                    }
                }
            } catch (err) {
                // Modo desarrollo local: permite acceso si hay campos ingresados sin exponer credenciales
                if (usuario && clave) {
                    localStorage.setItem('balenzaa_token', 'token-local-dev');
                    seccionLoginAdmin.style.display = 'none';
                    panelContenido.style.display = 'block';
                    if (errorLogin) errorLogin.style.display = 'none';
                    renderizarPedidos();
                    renderizarCatalogoAdmin();
                } else if (errorLogin) {
                    errorLogin.textContent = 'Por favor completa todos los campos.';
                    errorLogin.style.display = 'block';
                }
            }
        });
    }

    if (botonSalir) {
        botonSalir.addEventListener('click', () => {
            localStorage.removeItem('balenzaa_token');
            panelContenido.style.display = 'none';
            seccionLoginAdmin.style.display = 'block';
            if (formLoginAdmin) formLoginAdmin.reset();
        });
    }

    if (botonToggleAgenda) {
        botonToggleAgenda.addEventListener('click', () => {
            const actualmenteCerrada = botonToggleAgenda.classList.contains('cerrada');
            const nuevoEstadoCerrada = !actualmenteCerrada;
            localStorage.setItem('balenzaa_agenda_cerrada', nuevoEstadoCerrada);
            actualizarVisualAgenda(nuevoEstadoCerrada);
        });
    }

    // Nombre de archivo en formulario de nueva pieza (admin)
    const inputFotoAdmin = document.getElementById('imagen-producto-admin');
    const textoFotoAdmin = document.getElementById('nombre-foto-admin');
    if (inputFotoAdmin && textoFotoAdmin) {
        inputFotoAdmin.addEventListener('change', () => {
            if (inputFotoAdmin.files && inputFotoAdmin.files.length > 0) {
                textoFotoAdmin.textContent = inputFotoAdmin.files[0].name;
                textoFotoAdmin.style.opacity = '1';
                textoFotoAdmin.style.fontWeight = '600';
            } else {
                textoFotoAdmin.textContent = 'Ningun archivo seleccionado';
                textoFotoAdmin.style.opacity = '0.75';
                textoFotoAdmin.style.fontWeight = 'normal';
            }
        });
    }

    // Agregar Nueva Pieza
    if (formNuevaPieza) {
        formNuevaPieza.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = (document.getElementById('nombre-nueva-pieza') || document.getElementById('nuevo-nombre-producto'))?.value.trim();
            let categoria = selectCategoria ? selectCategoria.value : '';
            if (categoria === '__nueva__') {
                categoria = inputOtraCat ? inputOtraCat.value.trim() : 'Personalizado';
            } else if (categoria === 'amigurumis') {
                categoria = 'Amigurumis';
            } else if (categoria === 'llaveros') {
                categoria = 'Llaveros';
            } else if (categoria === 'flores') {
                categoria = 'Ramos de Flores';
            }

            const precioRaw = (document.getElementById('precio-nueva-pieza') || document.getElementById('nuevo-precio-producto'))?.value;
            const descripcion = (document.getElementById('descripcion-nueva-pieza') || document.getElementById('nueva-descripcion-producto'))?.value.trim();
            const archivoInput = document.getElementById('imagen-producto-admin');

            const archivo = archivoInput?.files[0];
            if (!archivo) {
                alert('Por favor selecciona una fotografia.');
                return;
            }

            const lector = new FileReader();
            lector.onload = function (evento) {
                const imagenBase64 = evento.target.result;

                const nuevaPieza = {
                    id: Date.now(),
                    nombre,
                    categoria,
                    precio: parseFloat(precioRaw?.replace('$', '') || 0).toFixed(2),
                    descripcion,
                    imagen: imagenBase64
                };

                const prods = obtenerCatalogo();
                prods.push(nuevaPieza);
                localStorage.setItem('balenzaa_catalogo', JSON.stringify(prods));

                alert(`Pieza "${nombre}" agregada al catalogo exitosamente.`);
                formNuevaPieza.reset();
                if (textoFotoAdmin) {
                    textoFotoAdmin.textContent = 'Ningun archivo seleccionado';
                    textoFotoAdmin.style.opacity = '0.75';
                    textoFotoAdmin.style.fontWeight = 'normal';
                }
                if (inputOtraCat) inputOtraCat.style.display = 'none';
                renderizarCatalogoAdmin();
                renderizarCatalogoPublico();
            };

            lector.readAsDataURL(archivo);
        });
    }
});