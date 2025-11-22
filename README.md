# meeting5-FRONTEND
## Descripción general: 
Meeting5 es una página web de videollamadas desarrollada con React, TypeScript, tailwind CSS y vite, la cual tiene un diseño inspirado en zoom y meet.
Su nombre "meeting5" viene de la palabra meetings, que significa reuniones, pero, se cambio la s por un 5, ya que ademas de parecerse, somos 5 en el grupo.

## Rutas de la página:
1. **Landing page (`/`)**  
   La primera página que ve el usuario al entrar a meeting5.

2. **Autenticación**
   - `/sign-in`: Permite iniciar sesión con correo y contraseña.  
   - `/sign-up`: Permite crear una nueva cuenta de usuario.

3. **Gestión de cuenta**
   - `/recover-password`: Envío de enlace para restablecer la contraseña.  
   - `/reset-password`: Pantalla para definir una nueva contraseña.

4. **Perfil de usuario**
   - `/profile`: Visualización de los datos del usuario, los cuales tambien pueden ser editados, e incluso eliminar el perfil.
  
5. **Videollamadas**
  - `/create-meet`: Página principal de las videollamadas, la cual solo es accesible luego de iniciar sesión. En esta el usuario puede crear su propia videollamada o unirse a una.
  - `/meeting:id`: Página de las reuniones, donde id es una combinacion alfanumerica única que se crea automaticamente cuando el usuario crea una nueva reunión.

6. **Información general**
   - `/#about-us`: Sección donde se describe el proyecto y su propósito.
  
## Dependencias principales usadas

- **React 19 + TypeScript** → Base del frontend  
- **Vite** → Bundler rápido para desarrollo  
- **TailwindCSS** → Estilos utilitarios  
- **React Router** → Sistema de rutas  
- **Lucide Icons** → Iconografía  
- **Socket.io-client** → Socket para enviar y recibir mensajes

---

## Ejecución del proyecto:
Nota: En este repositorio solo se encuentra el frontend, por lo que solo vas a poder mirar la parte visual sin funciones.
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
