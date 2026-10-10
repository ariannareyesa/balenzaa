// BALENZAA — Lógica de Cliente (frontend/app.js)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Filtrado de Categorías en el Catálogo

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

                    // Coincidencia flexible (todos, amigurumi, llavero, ramo/flor)
                    const coincideTodos = filtro.includes('todo');
                    const coincideAmigurumi = filtro.includes('amigurumi') && (textoCategoria.includes('amigurumi') || dataCategoria.includes('amigurumi'));
                    const coincideLlavero = filtro.includes('llavero') && (textoCategoria.includes('llavero') || dataCategoria.includes('llavero'));
                    const coincideFlores = (filtro.includes('flor') || filtro.includes('ramo')) && (textoCategoria.includes('flor') || textoCategoria.includes('ramo') || dataCategoria.includes('flor'));

                    if (coincideTodos || coincideAmigurumi || coincideLlavero || coincideFlores) {
                        tarjeta.style.display = 'flex';
                    } else {
                        tarjeta.style.display = 'none';
                    }
                });
            });
        });
    }
});