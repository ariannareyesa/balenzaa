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

    // 1. Catálogo Compartido: Obtención y Sincronización
    const catalogoInicial = [
        {
            id: 1,
            nombre: 'Nombre del amigurumi',
            categoria: 'Amigurumis',
            precio: '15.00',
            descripcion: 'Descripción del amigurumi y detalles de tejido.',
            imagen: 'images/amigurumi.jpg'
        },
        {
            id: 2,
            nombre: 'Nombre del llavero',
            categoria: 'Llaveros',
            precio: '5.00',
            descripcion: 'Descripción del llavero y opciones de personalización.',
            imagen: 'images/llavero.jpg'
        },
        {
            id: 3,
            nombre: 'Nombre del ramo de flores',
            categoria: 'Ramos de Flores',
            precio: '20.00',
            descripcion: 'Descripción del ramo de flores y cantidad de piezas.',
            imagen: 'images/ramo.jpg'
        }
    ];

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

    // Renderizar catálogo dinámico en la tienda pública (index.html)
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

        aplicarFiltrosCatalogo(productos);
    }

    // Generar botones de filtro dinámicos y sincronizar select de pedidos
    function aplicarFiltrosCatalogo(productos) {
        const contenedorFiltros = document.getElementById('contenedor-filtros-catalogo');

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
            selectProductoPedido.innerHTML = '<option value="" disabled selected>Selecciona qué deseas encargar</option>';
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

    // Subida de imagen de referencia en pedidos
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

    // 2. Envío del Formulario de Pedidos hacia MongoDB Atlas
    const formPedido = document.getElementById('formulario-pedido');
    if (formPedido) {
        formPedido.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre-cliente')?.value.trim();
            const correo = document.getElementById('correo-cliente')?.value.trim();
            const celular = document.getElementById('celular-cliente')?.value.trim();
            const suscribir = document.getElementById('suscribir-newsletter')?.checked;
            const archivoReferencia = inputArchivoRef?.files[0];

            async function registrarPedido(imagenRefBase64 = null) {
                const nuevoPedido = {
                    nombre,
                    correo,
                    celular,
                    producto: document.getElementById('tipo-producto')?.value,
                    detalles: document.getElementById('detalles-pedido')?.value,
                    fechaEntrega: document.getElementById('fecha-entrega')?.value,
                    imagenReferencia: imagenRefBase64,
                    suscritoClub: suscribir
                };

                try {
                    const respuesta = await fetch('/api/pedidos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(nuevoPedido)
                    });

                    const resultado = await respuesta.json();

                    if (respuesta.ok) {
                        alert(`¡Gracias, ${nombre}! Tu encargo ha sido registrado en MongoDB Atlas con éxito.`);
                        formPedido.reset();
                        if (textoNombreArchivo) {
                            textoNombreArchivo.textContent = 'Ningún archivo seleccionado';
                            textoNombreArchivo.style.opacity = '0.75';
                        }
                    } else {
                        alert(`Error al registrar encargo: ${resultado.error}`);
                    }
                } catch (error) {
                    console.error('Error al conectar con el servidor:', error);
                    alert('Hubo un error de conexión al enviar el pedido.');
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

    // 3. Panel de Administración (admin.html)
    const formLoginAdmin = document.getElementById('formulario-login-admin');
    const seccionLoginAdmin = document.getElementById('seccion-login-admin');
    const panelContenido = document.getElementById('panel-contenido');
    const errorLogin = document.getElementById('error-login');
    const botonSalir = document.getElementById('boton-cerrar-sesion');
    const botonToggleAgenda = document.getElementById('boton-toggle-agenda');
    const cuerpoTablaPedidos = document.getElementById('cuerpo-tabla-pedidos');
    const formNuevaPieza = document.getElementById('formulario-nueva-pieza') || document.getElementById('formulario-nuevo-producto');

    // Modales
    const modalFoto = document.getElementById('modal-foto-referencia');
    const imgModal = document.getElementById('img-modal-referencia');
    const btnCerrarModal = document.getElementById('cerrar-modal-foto');

    if (btnCerrarModal && modalFoto) {
        btnCerrarModal.onclick = () => { modalFoto.style.display = 'none'; };
        modalFoto.onclick = (e) => {
            if (e.target === modalFoto) modalFoto.style.display = 'none';
        };
    }

    // Métricas
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

    // Formatear segundos a formato HH:MM:SS
    function formatearTiempo(totalSegundos) {
        const seg = parseInt(totalSegundos) || 0;
        const horas = Math.floor(seg / 3600);
        const minutos = Math.floor((seg % 3600) / 60);
        const segundos = seg % 60;
        return [horas, minutos, segundos]
            .map(v => v < 10 ? '0' + v : v)
            .join(':');
    }

    // Exportar suscriptores del Club Balenzaa
    async function exportarClubCSV() {
        let pedidos = [];
        try {
            const res = await fetch('/api/pedidos');
            if (res.ok) pedidos = await res.json();
        } catch (err) {
            pedidos = JSON.parse(localStorage.getItem('balenzaa_pedidos') || '[]');
        }

        const suscriptores = pedidos.filter(p => p.suscritoClub && p.correo);

        if (suscriptores.length === 0) {
            alert('Aún no hay suscriptores registrados en el Club Balenzaa.');
            return;
        }

        const filas = [['Nombre', 'Correo', 'Celular', 'Fecha de Registro']];
        suscriptores.forEach(s => {
            filas.push([
                `"${(s.nombre || '').replace(/"/g, '""')}"`,
                `"${(s.correo || '').replace(/"/g, '""')}"`,
                `"${(s.celular || '').replace(/"/g, '""')}"`,
                `"${s.fechaCreacion ? new Date(s.fechaCreacion).toLocaleDateString('es-EC') : ''}"`
            ]);
        });

        const csvContenido = '\uFEFF' + filas.map(f => f.join(',')).join('\n');
        const blob = new Blob([csvContenido], { type: 'text/csv;charset=utf-8;' });
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = `club_balenzaa_${new Date().toISOString().slice(0, 10)}.csv`;
        enlace.click();
    }

    let filtroMesSeleccionado = 'todos';
    let filtroTipoSeleccionado = 'todos';

    function inyectarControlesFiltro() {
        const seccionGestion = document.querySelector('.seccion-gestion-pedidos');
        if (!seccionGestion || document.getElementById('barra-filtros-pedidos')) return;

        const contenedorFiltros = document.createElement('div');
        contenedorFiltros.id = 'barra-filtros-pedidos';
        contenedorFiltros.style.cssText = 'display: flex; gap: 1rem; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; flex-wrap: wrap; background: #FFF7FA; padding: 0.9rem 1.2rem; border-radius: 18px; border: 1.5px solid var(--rosa-claro);';

        contenedorFiltros.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <span style="font-weight: 700; color: var(--rosa); font-size: 0.92rem;">Filtrar encargos y métricas:</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <label for="filtro-mes-pedidos" style="font-size: 0.85rem; font-weight: 600; margin: 0;">Mes:</label>
                    <select id="filtro-mes-pedidos" style="padding: 5px 10px; border-radius: 10px; border: 1.5px solid var(--rosa-claro); font-size: 0.85rem; background: #fff; width: auto;">
                        <option value="todos">Todos los meses</option>
                        <option value="1">Enero</option>
                        <option value="2">Febrero</option>
                        <option value="3">Marzo</option>
                        <option value="4">Abril</option>
                        <option value="5">Mayo</option>
                        <option value="6">Junio</option>
                        <option value="7">Julio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <label for="filtro-tipo-pedidos" style="font-size: 0.85rem; font-weight: 600; margin: 0;">Tipo de pieza:</label>
                    <select id="filtro-tipo-pedidos" style="padding: 5px 10px; border-radius: 10px; border: 1.5px solid var(--rosa-claro); font-size: 0.85rem; background: #fff; width: auto;">
                        <option value="todos">Todas las piezas</option>
                    </select>
                </div>
            </div>

            <button id="btn-exportar-club-csv" title="Descargar lista de miembros del Club Balenzaa en CSV" style="background-color: var(--rosa); color: white; border: none; padding: 6px 14px; border-radius: 999px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; transition: transform 0.15s ease;">
                Exportar Club CSV
            </button>
        `;

        const tabla = seccionGestion.querySelector('.contenedor-tabla');
        if (tabla) seccionGestion.insertBefore(contenedorFiltros, tabla);

        const selMes = document.getElementById('filtro-mes-pedidos');
        const selTipo = document.getElementById('filtro-tipo-pedidos');
        const btnCSV = document.getElementById('btn-exportar-club-csv');

        selMes.addEventListener('change', (e) => {
            filtroMesSeleccionado = e.target.value;
            renderizarPedidos();
        });

        selTipo.addEventListener('change', (e) => {
            filtroTipoSeleccionado = e.target.value;
            renderizarPedidos();
        });

        if (btnCSV) {
            btnCSV.addEventListener('click', exportarClubCSV);
        }
    }

    function actualizarOpcionesTipoPieza(pedidos) {
        const selTipo = document.getElementById('filtro-tipo-pedidos');
        if (!selTipo) return;

        const valorPrevio = selTipo.value;
        const tipos = new Set();
        pedidos.forEach(p => {
            if (p.producto) tipos.add(p.producto.trim());
        });

        selTipo.innerHTML = '<option value="todos">Todas las piezas</option>';
        tipos.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            selTipo.appendChild(opt);
        });

        if (Array.from(tipos).includes(valorPrevio)) {
            selTipo.value = valorPrevio;
        }
    }

    function obtenerMesDeFecha(fecha) {
        if (!fecha) return null;
        const d = new Date(fecha);
        return isNaN(d.getTime()) ? null : d.getMonth() + 1;
    }

    // Renderizar Pedidos consultando MongoDB Atlas
    async function renderizarPedidos() {
        if (!cuerpoTablaPedidos) return;
        inyectarControlesFiltro();

        let pedidos = [];
        try {
            const respuesta = await fetch('/api/pedidos');
            if (respuesta.ok) {
                pedidos = await respuesta.json();
            }
        } catch (error) {
            console.error('Error al obtener pedidos de MongoDB:', error);
            pedidos = JSON.parse(localStorage.getItem('balenzaa_pedidos') || '[]');
        }

        actualizarOpcionesTipoPieza(pedidos);
        cuerpoTablaPedidos.innerHTML = '';

        let pendientes = 0;
        let elaboracion = 0;
        let completados = 0;
        let totalCobrado = 0;

        const pedidosFiltrados = pedidos.map((p, indexOriginal) => ({ ...p, indexOriginal })).filter(p => {
            const cumpleTipo = (filtroTipoSeleccionado === 'todos') || (p.producto && p.producto.trim().toLowerCase() === filtroTipoSeleccionado.trim().toLowerCase());

            let cumpleMes = true;
            if (filtroMesSeleccionado !== 'todos') {
                const mesCreacion = obtenerMesDeFecha(p.fechaCreacion);
                const mesEntrega = obtenerMesDeFecha(p.fechaEntrega);
                cumpleMes = (mesCreacion === parseInt(filtroMesSeleccionado, 10)) || (mesEntrega === parseInt(filtroMesSeleccionado, 10));
            }

            return cumpleTipo && cumpleMes;
        });

        if (pedidosFiltrados.length === 0) {
            cuerpoTablaPedidos.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 1.5rem; color: var(--tinta);">No se encontraron encargos para los filtros seleccionados.</td></tr>';
        } else {
            pedidosFiltrados.forEach((p) => {
                const idPedido = p._id || p.indexOriginal;
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

                const tiempoFormateado = formatearTiempo(p.segundosTejidos || 0);
                const activo = p.cronometroActivo || false;
                const fechaCreacionTexto = p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString('es-EC') : 'Hoy';
                const fechaEntregaTexto = p.fechaEntrega ? new Date(p.fechaEntrega).toLocaleDateString('es-EC') : 'Por definir';

                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td style="white-space: nowrap;">${fechaCreacionTexto}</td>
                    <td><strong>${p.nombre || 'Sin nombre'}</strong></td>
                    <td>
                        ${p.correo || 'Sin correo'}
                        ${p.suscritoClub ? '<br><span style="font-size:0.75rem; background:var(--rosa-pastel); color:var(--tinta); padding:2px 8px; border-radius:999px;">Club</span>' : ''}
                    </td>
                    <td style="white-space: nowrap;">
                        ${p.celular ? `<a href="https://wa.me/593${p.celular.replace(/^0/, '')}" target="_blank" rel="noopener noreferrer" style="color: #2F6224; font-weight: 700; text-decoration: underline;">${p.celular}</a>` : '<span style="color:#999;">-</span>'}
                    </td>
                    <td>
                        ${p.producto || 'Diseño especial'}
                        ${p.imagenReferencia ? `<br><button class="boton-ver-foto-ref" data-id="${idPedido}" style="background:none; border:none; padding:0; font-size:0.75rem; color:var(--rosa); font-weight:700; text-decoration:underline; cursor:pointer;">Ver foto</button>` : ''}
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
                                <button class="btn-toggle-timer" data-id="${idPedido}" title="${activo ? 'Pausar' : 'Iniciar'}" style="background: ${activo ? '#FFD45C' : 'var(--rosa)'}; color: ${activo ? 'var(--tinta)' : '#fff'}; border: none; border-radius: 50%; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; cursor: pointer; line-height: 1; transition: transform 0.15s ease;">
                                    ${activo ? '❚❚' : '▶'}
                                </button>
                                <button class="btn-reset-timer" data-id="${idPedido}" title="Reiniciar a 00:00:00" style="background: none; border: none; color: #999; font-size: 0.9rem; cursor: pointer; padding: 0 3px; line-height: 1;">
                                    ↺
                                </button>
                            </div>

                            <button class="boton-eliminar-pedido" data-id="${idPedido}" title="Eliminar encargo" style="background: none; border: none; color: #C93A5B; font-size: 1.15rem; font-weight: 700; cursor: pointer; padding: 4px; line-height: 1;">
                                ✕
                            </button>
                        </div>
                    </td>
                `;
                cuerpoTablaPedidos.appendChild(fila);
            });
        }

        if (elPendientes) elPendientes.textContent = pendientes;
        if (elElaboracion) elElaboracion.textContent = elaboracion;
        if (elCompletados) elCompletados.textContent = completados;
        if (elIngresos) elIngresos.textContent = `$${totalCobrado.toFixed(2)}`;

        // Eventos generales de la tabla
        document.querySelectorAll('.boton-ver-foto-ref').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const p = pedidos.find(item => item._id === id || item.indexOriginal == id);
                if (p && p.imagenReferencia && modalFoto && imgModal) {
                    imgModal.src = p.imagenReferencia;
                    modalFoto.style.display = 'flex';
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
                } catch (err) {
                    console.error('Error al actualizar estado:', err);
                }
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
                } catch (err) {
                    console.error('Error al actualizar precio:', err);
                }
                renderizarPedidos();
            });
        });

        document.querySelectorAll('.boton-eliminar-pedido').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const confirma = confirm('¿Estás segura de eliminar este encargo?');
                if (confirma) {
                    try {
                        await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
                    } catch (err) {
                        console.error('Error al eliminar pedido:', err);
                    }
                    renderizarPedidos();
                }
            });
        });
    }

    // --- GESTIÓN VISUAL DEL CATÁLOGO EN ADMIN ---
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

    async function renderizarCatalogoAdmin() {
        if (!contenedorCatalogoAdmin) return;
        const productos = await obtenerCatalogo();
        contenedorCatalogoAdmin.innerHTML = '';

        if (productos.length === 0) {
            contenedorCatalogoAdmin.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--tinta); padding: 2rem;">No hay productos en el catálogo actualmente.</p>';
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
                    <h3 class="nombre-producto editable-item" contenteditable="true" data-index="${index}" data-campo="nombre" style="border-bottom: 1px dashed transparent; outline: none; border-radius: 4px; padding: 2px;">
                        ${prod.nombre}
                    </h3>
                    <p class="descripcion-producto editable-item" contenteditable="true" data-index="${index}" data-campo="descripcion" style="border-bottom: 1px dashed transparent; outline: none; border-radius: 4px; padding: 2px; min-height: 40px;">
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
    }

    // --- AUTENTICACIÓN Y SESIÓN ADMIN ---
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
});