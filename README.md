# CINEMA-SPACE-FRONTEND

## 🧭 Descripción general
Cinema Space es una aplicación web desarrollada con **React + TypeScript + TailwindCSS + Vite**, cuyo propósito es ofrecer una experiencia moderna para explorar, registrar y gestionar información relacionada con películas y usuarios.

La aplicación está organizada modularmente para mantener un flujo claro y escalable entre los componentes, páginas y servicios API.


## 🌐 Mapa del sitio (FooterNavbar)

El componente `FooterNavbar` define el mapa del sitio visible en el pie de página de la aplicación.  
Incluye enlaces de navegación hacia las secciones principales del sitio:

| Ruta | Descripción |
|------|--------------|
| `/home` | Página principal de la aplicación |
| `/sign-in` | Página de inicio de sesión |
| `/sign-up` | Página de creación de cuenta |
| `/recover-password` | Recuperación de contraseña |
| `/about-us` | Página informativa "Sobre nosotros" |

---

## ⚙️ Flujo general

1. **Inicio (`/home`)**  
   El usuario accede al catálogo principal de películas.

2. **Autenticación**
   - `/sign-in`: Permite iniciar sesión con correo y contraseña.  
   - `/sign-up`: Permite crear una nueva cuenta de usuario.

3. **Gestión de cuenta**
   - `/recover-password`: Envío de enlace para restablecer la contraseña.  
   - `/reset-password`: Pantalla para definir una nueva contraseña.

4. **Perfil de usuario**
   - `/profile`: Visualización de la información personal y opciones de configuración.

5. **Información general**
   - `/about-us`: Sección donde se describe el proyecto y su propósito.

---

## 🧩 Tecnologías principales

- **React 18 + TypeScript** → Base del frontend  
- **Vite** → Bundler rápido para desarrollo  
- **TailwindCSS** → Estilos utilitarios  
- **React Router** → Sistema de rutas  
- **Lucide Icons** → Iconografía  
- **Zod / Yup (opcional)** → Validaciones de esquemas

---

## 🚀 Ejecución del proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
