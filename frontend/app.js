// BALENZAA

document.addEventListener('DOMContentLoaded', () => {

    // 0. Banner de Estado de la Agenda (Tienda pública)
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

    // 4. Panel de Administración (admin.html)
    const formLoginAdmin = document.getElementById('formulario-login-admin');
    const seccionLoginAdmin = document.getElementById('seccion-login-admin');
    const panelContenido = document.getElementById('panel-contenido');
    const errorLogin = document.getElementById('error-login');
    const botonSalir = document.getElementById('boton-cerrar-sesion');
    const botonToggleAgenda = document.getElementById('boton-toggle-agenda');
    const cuerpoTablaPedidos = document.getElementById('cuerpo-tabla-pedidos');
    const formNuevaPieza = document.getElementById('formulario-nueva-pieza');

    // Métricas
    const elPendientes = document.querySelector('.tarjeta-metrica:nth-child(1) .numero-metrica, #pedidos-pendientes');
    const elElaboracion = document.querySelector('.tarjeta-metrica:nth-child(2) .numero-metrica, #pedidos-elaboracion');
    const elCompletados = document.querySelector('.tarjeta-metrica:nth-child(3) .numero-metrica, #pedidos-completados');

    // Sincronizar estado inicial de agenda
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

    // Cargar y sincronizar pedidos en tabla y métricas
    function renderizarPedidos() {
        if (!cuerpoTablaPedidos) return;

        const pedidos = JSON.parse(localStorage.getItem('balenzaa_pedidos') || '[]');
        cuerpoTablaPedidos.innerHTML = '';

        let pendientes = 0;
        let elaboracion = 0;
        let completados = 0;

        if (pedidos.length === 0) {
            cuerpoTablaPedidos.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 1.5rem; color: var(--tinta);">No hay pedidos registrados aún.</td></tr>';
        } else {
            pedidos.forEach((p, index) => {
                const estado = p.estado || 'Pendiente';
                if (estado === 'Pendiente') pendientes++;
                else if (estado === 'En elaboración') elaboracion++;
                else if (estado === 'Completado') completados++;

                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.fechaCreacion || 'Hoy'}</td>
                    <td><strong>${p.nombre}</strong></td>
                    <td>
                        ${p.correo}
                        ${p.suscritoClub ? '<br><span style="font-size:0.75rem; background:var(--rosa-pastel); color:var(--tinta); padding:2px 8px; border-radius:999px;">Club 💌</span>' : ''}
                    </td>
                    <td>${p.producto}</td>
                    <td>${p.fechaEntrega || 'Sin fecha'}</td>
                    <td>
                        <span class="badge-estado badge-${estado.toLowerCase().replace(/\s+/g, '-')}">
                            ${estado}
                        </span>
                    </td>
                    <td>
                        <select class="select-cambio-estado" data-index="${index}" style="padding: 4px 24px 4px 8px; min-width: 135px; border-radius: 8px; border: 1px solid var(--rosa-claro); font-size: 0.82rem; cursor: pointer; background-color: #fff;">
                            <option value="Pendiente" ${estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="En elaboración" ${estado === 'En elaboración' ? 'selected' : ''}>En elaboración</option>
                            <option value="Completado" ${estado === 'Completado' ? 'selected' : ''}>Completado</option>
                        </select>
                    </td>
                `;
                cuerpoTablaPedidos.appendChild(fila);
            });
        }

        // Actualizar contadores
        if (elPendientes) elPendientes.textContent = pendientes;
        if (elElaboracion) elElaboracion.textContent = elaboracion;
        if (elCompletados) elCompletados.textContent = completados;

        // Event listener para selects de cambio de estado
        document.querySelectorAll('.select-cambio-estado').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const i = e.target.dataset.index;
                pedidos[i].estado = e.target.value;
                localStorage.setItem('balenzaa_pedidos', JSON.stringify(pedidos));
                renderizarPedidos();
            });
        });
    }

    // Mantener sesión abierta si ya existe token
    const tokenGuardado = localStorage.getItem('balenzaa_token');
    if (tokenGuardado && seccionLoginAdmin && panelContenido) {
        seccionLoginAdmin.style.display = 'none';
        panelContenido.style.display = 'block';
        renderizarPedidos();
    }

    // Iniciar Sesión
    if (formLoginAdmin) {
        formLoginAdmin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usuario = document.getElementById('usuario-admin').value.trim();
            const clave = document.getElementById('clave-admin').value.trim();

            try {
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
                } else {
                    if (errorLogin) {
                        errorLogin.textContent = data.mensaje || 'Usuario o contraseña incorrectos';
                        errorLogin.style.display = 'block';
                    }
                }
            } catch (err) {
                // Respaldo de desarrollo mientras levantamos el servidor en Node
                if (usuario === 'RomiReyes' && clave === 'presidentedebalenzaa04') {
                    localStorage.setItem('balenzaa_token', 'temp-dev-token');
                    seccionLoginAdmin.style.display = 'none';
                    panelContenido.style.display = 'block';
                    if (errorLogin) errorLogin.style.display = 'none';
                    renderizarPedidos();
                } else if (errorLogin) {
                    errorLogin.textContent = 'Credenciales incorrectas';
                    errorLogin.style.display = 'block';
                }
            }
        });
    }

    // Cerrar Sesión
    if (botonSalir) {
        botonSalir.addEventListener('click', () => {
            localStorage.removeItem('balenzaa_token');
            panelContenido.style.display = 'none';
            seccionLoginAdmin.style.display = 'block';
            if (formLoginAdmin) formLoginAdmin.reset();
        });
    }

    // Agenda
    if (botonToggleAgenda) {
        botonToggleAgenda.addEventListener('click', () => {
            const actualmenteCerrada = botonToggleAgenda.classList.contains('cerrada');
            const nuevoEstadoCerrada = !actualmenteCerrada;
            localStorage.setItem('balenzaa_agenda_cerrada', nuevoEstadoCerrada);
            actualizarVisualAgenda(nuevoEstadoCerrada);
        });
    }

    // Agregar Nueva Pieza
    if (formNuevaPieza) {
        formNuevaPieza.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre-nueva-pieza')?.value.trim();
            const categoria = document.getElementById('categoria-nueva-pieza')?.value;
            const precio = document.getElementById('precio-nueva-pieza')?.value;
            const descripcion = document.getElementById('descripcion-nueva-pieza')?.value.trim();
            const archivoInput = document.getElementById('imagen-producto-admin');

            const archivo = archivoInput?.files[0];
            if (!archivo) {
                alert('Por favor selecciona una fotografía.');
                return;
            }

            const lector = new FileReader();
            lector.onload = function (evento) {
                const imagenBase64 = evento.target.result;

                const nuevaPieza = {
                    id: Date.now(),
                    nombre,
                    categoria,
                    precio,
                    descripcion,
                    imagen: imagenBase64
                };

                const catalogoDinamico = JSON.parse(localStorage.getItem('balenzaa_catalogo_extra') || '[]');
                catalogoDinamico.push(nuevaPieza);
                localStorage.setItem('balenzaa_catalogo_extra', JSON.stringify(catalogoDinamico));

                alert(`¡Pieza "${nombre}" agregada al catálogo exitosamente! 🧶`);
                formNuevaPieza.reset();
            };

            lector.readAsDataURL(archivo);
        });
    }
});