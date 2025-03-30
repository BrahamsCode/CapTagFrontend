# Sistema de Anotación de Documentos "CapTagFrontend"

Un sistema frontend moderno para anotar documentos e imágenes con comentarios visuales. Permite marcar áreas específicas con rectángulos y añadir descripciones detalladas, facilitando la comunicación de cambios, errores o mejoras.

![Sistema de Anotación de Documentos](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4G6ieSUhGvlDNP01FmymOmOQZy64Ur.png)

## 🚀 Tecnologías

- **Next.js** - Framework de React para aplicaciones web
- **React** - Biblioteca para construir interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitario
- **shadcn/ui** - Componentes UI accesibles y personalizables
- **Canvas API** - Para dibujar y manipular gráficos
- **Lucide React** - Iconos SVG

## ✅ Características

- Carga de imágenes mediante arrastrar y soltar o selección de archivo
- Creación de anotaciones rectangulares en áreas específicas
- Numeración automática de anotaciones
- Selección de colores para las anotaciones
- Opciones de formato de texto (negrita, cursiva, subrayado)
- Barra lateral para visualizar todas las anotaciones
- Interacción entre documento y barra lateral (hover, selección)
- Diseño responsivo para diferentes dispositivos
- Preparado para integración con API Laravel

## 📋 Requisitos previos

- Node.js 18.x o superior
- npm o yarn
- API Laravel (backend) configurada para recibir/enviar datos de anotaciones (no implementando en esta versión gratuita)

## 🔧 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/BrahamsCode/CapTagFrontend
   cd CapTagFrontend
   
2. yarn install

3. yarn dev
   
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.