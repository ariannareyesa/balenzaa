# 🧶 Balenzaa — Plataforma Web de Crochet Artesanal

Plataforma web full-stack desarrollada con el stack **MERN** (MongoDB, Express.js, React + Vite y Node.js) para **Balenzaa**, un emprendimiento de tejido artesanal en Guayaquil, Ecuador. Integra una vitrina interactiva con carrito de compras, encargos personalizados y el asistente virtual **BalenzIA**, junto con un Panel de Control Administrativo privado para la gestión de pedidos, métricas financieras, suscriptores y catálogo.

---

## Características Principales

### Tienda Pública (Cliente)

* **Catálogo Dinámico & Filtros:** Visualización en tiempo real de piezas (*Amigurumis*, *Llaveros*, *Ramos de Flores*) consumidas desde MongoDB Atlas.
* **Carrito de Compras (`CartDrawer`):** Selección de múltiples piezas del catálogo y envío directo de pedidos.
* **Encargos Personalizados (`OrderModal`):** Formulario con validación de correo, WhatsApp local, fecha de entrega requerida y carga de imagen de referencia.
* **Asistente Virtual (`balenzIA`):** Chatbot interactivo integrado en la tienda para resolver dudas sobre precios, tiempos de elaboración, envíos y cuidados.
* **Banner de Estado de Agenda:** Indicador en tiempo real (*"Agenda abierta"* / *"Agenda cerrada"*).
* **Secciones Editoriales:** Historia de la creadora (*Sobre mí*), guía de cuidados del crochet, preguntas frecuentes (FAQ), suscripción a novedades e integración directa con WhatsApp.

### Panel de Control Administrativo (`/#admin`)

* **Autenticación JWT:** Inicio de sesión protegido con tokens Bearer y contraseñas encriptadas mediante `bcryptjs`.
* **Métricas Financieras & Operativas (`AdminMetrics`):**
  * Conteo de pedidos por estado (*Pendientes*, *En elaboración*, *Completados*).
  * Cálculo dinámico de ingresos (abono del 50% en elaboración y 100% en completados).
* **Gestión de Encargos (`AdminOrdersTable` & `OrderDetailsModal`):** Cambio de estado, actualización de precios, visualización de referencias y **cronómetro por pedido** para medir el tiempo de tejido.
* **Pedidos Manuales (`ManualOrderModal`):** Registro rápido de ventas o encargos tomados por redes sociales o WhatsApp.
* **Gestión del Catálogo (`AdminCatalog` & `NewProductModal`):** Creación, edición rápida en vivo y eliminación de piezas del catálogo.
* **Gestión de Suscriptores (`SubscribersModal`):** Visualización de la comunidad suscrita desde la tienda pública.

---

## Arquitectura del Proyecto

```text
balenzaa/
├── backend/
│   ├── models/                 # Esquemas de Mongoose
│   │   ├── Pedido.js
│   │   ├── Producto.js
│   │   └── Usuario.js
│   ├── routes/                 # Rutas de la API REST
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── pedidos.js
│   │   └── productos.js
│   ├── scripts/                # Scripts de mantenimiento
│   │   └── crearAdmin.js
│   ├── server.js               # Servidor Express, conexión MongoDB y entrega de SPA
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── images/             # Recursos gráficos estáticos (balenzIA.png, logo_balenzaa.png, etc.)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── modals/
│   │   │   │   │   ├── ManualOrderModal.jsx
│   │   │   │   │   ├── NewProductModal.jsx
│   │   │   │   │   ├── OrderDetailsModal.jsx
│   │   │   │   │   └── SubscribersModal.jsx
│   │   │   │   ├── AdminCatalog.jsx
│   │   │   │   ├── AdminMetrics.jsx
│   │   │   │   ├── AdminOrdersTable.jsx
│   │   │   │   └── AdminPanel.jsx
│   │   │   ├── About.jsx
│   │   │   ├── BalenzIA.jsx
│   │   │   ├── CareGuide.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── Catalog.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderModal.jsx
│   │   │   └── WhatsAppButton.jsx
│   │   ├── App.jsx             # Componente raíz y enrutamiento de vista pública / #admin
│   │   ├── main.jsx            # Punto de entrada de React en el DOM
│   │   └── styles.css          # Estilos globales y diseño responsivo
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vercel.json             # Reglas de rewrite (/api/*) hacia el backend en Render
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Stack Técnico

| Tecnología | Rol en la Aplicación |
| :--- | :--- |
| ![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | **Base de Datos:** Persistencia NoSQL en la nube con Mongoose ODM. |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | **Backend API:** Servidor RESTful, rutas modulares y lógica de negocio. |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | **Frontend:** Interfaz modular basada en componentes funcionales, Hooks y empaquetado rápido con Vite. |
| ![Node.js](https://img.shields.io/badge/Node.js-v18+-68A063?style=for-the-badge&logo=node.js&logoColor=white) | **Entorno de Ejecución:** Runtime asíncrono en el servidor. |
| ![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | **Lenguajes y Estilos:** JavaScript moderno (Async/Await, Fetch API) y CSS responsivo. |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | **Seguridad:** Autenticación por Tokens Bearer y encriptación con `bcryptjs`. |
| ![Google Gemini](https://img.shields.io/badge/balenzIA_Chatbot-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white) | **Asistente Virtual:** Integración de IA conversacional mediante la ruta `/api/chat`. |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black) | **Despliegue:** Frontend estático en CDN global con Vercel y API REST en Render. |

---

## Instalación y Uso Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ariannareyesa/balenzaa.git
cd balenzaa
```

### 2. Instalar dependencias (Backend y Frontend)

```bash
# Instalar dependencias del servidor
cd backend
npm install

# Instalar dependencias del cliente React
cd ../frontend
npm install
```

### 3. Configurar Variables de Entorno (`backend/.env`)

Crea un archivo `.env` dentro de la carpeta `backend/` con los siguientes parámetros:

```env
PORT=3000
MONGODB_URI=tu_cadena_de_conexion_mongodb_atlas
JWT_SECRET=tu_clave_secreta_jwt
ADMIN_USER=tu_usuario_admin
ADMIN_PASS=tu_clave_admin
GEMINI_API_KEY=tu_api_key_de_ia
```

### 4. Crear usuario administrador y ejecutar en desarrollo

En una terminal (dentro de `backend/`):

```bash
node scripts/crearAdmin.js
npm start
```

En una segunda terminal (dentro de `frontend/`):

```bash
npm run dev
```

Abre tu navegador en la URL local que indica Vite (`http://localhost:5173/`). Para acceder al panel administrativo, ingresa a `/#admin`.

---

## Despliegue en Producción (Vercel + Render)

La arquitectura de producción separa la entrega de la interfaz y el procesamiento del servidor para optimizar los tiempos de carga:

* **Frontend en Vercel (`https://balenzaa-ten.vercel.app`):** Sirve el compilado de React + Vite (`frontend/dist/`) desde su CDN global y redirige las peticiones `/api/*` hacia el servidor mediante las reglas configuradas en `frontend/vercel.json`.
* **Backend en Render (`https://balenzaa.onrender.com`):** Ejecuta la API REST en Node.js/Express (`backend/server.js`) conectada a MongoDB Atlas y sirve también el compilado de producción como respaldo monolítico (`npm run build` + `npm start`).

---

## Seguridad Implementada

1. **Protección de Credenciales:** Variables de entorno aisladas en `.env` (excluidas mediante `.gitignore`) para ocultar cadenas de conexión, secretos JWT y llaves de API.
2. **Encriptación Hashing:** Contraseñas protegidas mediante `bcryptjs` con sal de 10 rondas.
3. **Autenticación basada en Tokens:** Control de acceso a rutas privadas mediante encabezados `Authorization: Bearer <token>`.
4. **Validación de Datos:** Restricciones de esquema en Mongoose (`enum`, `trim`, `required`, expresiones regulares de correo) y validaciones en el cliente.

---

## Autora

Desarrollado por **Arianna Reyes**
* GitHub: [@ariannareyesa](https://github.com/ariannareyesa)
* Proyecto para: **Balenzaa — Crochet Artesanal** (Guayaquil, Ecuador)