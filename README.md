# 🧶 Balenzaa — Plataforma Web de Crochet Artesanal

![Node.js](https://img.shields.io/badge/Node.js-v18+-68A063?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

Plataforma web full-stack desarrollada para **Balenzaa**, un emprendimiento artesanal en Guayaquil, Ecuador. Integra un catálogo interactivo con tienda pública para personalizar encargos y un **Panel de Control Administrativo privado** con autenticación segura, control financiero, gestión de agenda y seguimiento de tiempos de tejido.

---

## Características Principales

### Tienda Pública (Cliente)
- **Catálogo Dinámico & Filtros:** Visualización en tiempo real de piezas (Amigurumis, Llaveros, Ramos de Flores) desde MongoDB Atlas.
- **Formulario de Encargos Personalizados:** Validación de campos (email con Regex, WhatsApp local, fecha requerida).
- **Subida de Imagen de Referencia:** Conversión y envío de imágenes en formato Base64.
- **Banner de Estado de Agenda:** Indicador en tiempo real ("Agenda abierta" / "Agenda cerrada").
- **Secciones Editoriales:** Historia de la creadora, guía de cuidados del crochet, FAQ e integración a WhatsApp.

### Panel de Control Administrativo (`/admin`)
- **Autenticación JWT:** Inicio de sesión seguro con contraseñas encriptadas mediante `bcryptjs`.
- **Panel de Métricas Financieras & Encargos:**
  - Métricas de estado (Pendientes, En elaboración, Completados).
  - Cálculo dinámico de ingresos (abono del 50% en elaboración y 100% en completados).
- **Gestión de Encargos:** Cambio de estado, actualización de precios y visualización de imágenes de referencia.
- **Cronómetro por Pedido:** Medidor de tiempo invertido en la elaboración de cada pieza.
- **Gestión del Catálogo:** Creación, edición rápida en vivo (*contenteditable*) y eliminación de piezas.
- **Filtros Avanzados:** Filtrado multidimensional de pedidos por mes y categoría.

---

## Arquitectura del Proyecto

```text
balenzaa/
├── backend/
│   ├── models/             # Esquemas de Mongoose (Pedido, Producto, Usuario)
│   ├── crearAdmin.js       # Script de creación inicial de administrador
│   ├── server.js           # Servidor Express & conexión Mongoose
│   └── package.json
├── frontend/
│   ├── admin.html          # Panel de administración
│   ├── app.js              # Lógica de cliente y peticiones API
│   ├── index.html          # Tienda pública
│   ├── styles.css          # Estilos y diseño responsivo
│   └── images/             # Recursos gráficos
├── netlify.toml            # Configuración serverless
└── vercel.json             # Configuración de despliegue Vercel
```

### Stack Técnico
- **Backend:** Node.js, Express.js (API RESTful).
- **Base de Datos:** MongoDB Atlas con ODM Mongoose.
- **Seguridad:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, middlewares de verificación.
- **Frontend:** HTML5, CSS3 (Custom Properties, Flexbox, Grid), JavaScript ES6+ Vanilla.

---

## Instalación y Uso Local

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/ariannareyesa/balenzaa.git
cd balenzaa/backend
npm install
```

### 2. Variables de Entorno (`.env`)
Crea un archivo `.env` dentro de la carpeta `backend/` con esta estructura de ejemplo:

```env
PORT=3000
MONGODB_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
ADMIN_USER=tu_usuario_admin
ADMIN_PASS=tu_clave_admin
```

### 3. Crear usuario administrador e iniciar
```bash
node crearAdmin.js
npm start
```

Abre tu navegador e ingresa a:
- **Tienda Pública:** `http://localhost:3000/`
- **Panel Administrativo:** `http://localhost:3000/admin`

---

## Seguridad Implementada

1. **Protección de Credenciales:** Variables de entorno para ocultar cadenas de conexión y claves secretas.
2. **Encriptación Hashing:** Contraseñas protegidas mediante `bcryptjs` con sal de 10 rondas.
3. **Autenticación basada en Tokens:** Control de acceso a rutas administrativas mediante encabezados HTTP Bearer.
4. **Validación de Datos:** Restricciones de esquema Mongoose (`enum`, `trim`, `match` de correo).

---

## Autora

Desarrollado por **Arianna Reyes**  
- **GitHub:** [@ariannareyesa](https://github.com/ariannareyesa)  
- **Proyecto para:** Balenzaa — Crochet Artesanal (Guayaquil, Ecuador)