# 🌿 Paisajismo Express

Aplicación web interactiva de diseño paisajístico y alta conversión creada para viveros y diseñadores de jardines. Permite a los clientes diseñar su espacio exterior sobre plantillas o una fotografía propia de su hogar, arrastrar plantas y solicitar una cotización directa por WhatsApp con un solo clic.

---

## 🚀 Tecnologías Utilizadas

- **React 18** (SPA rápida y reactiva)
- **Vite 5** (Empaquetado y recarga en caliente ultrarrápida)
- **Tailwind CSS 3** (Paleta botánica moderna, glassmorphism y micro-interacciones)
- **Lucide Icons** (Iconografía limpia y consistente)
- **Google Fonts** (Tipografías *Outfit* y *Plus Jakarta Sans*)

---

## ✨ Características Principales

### 1. 🖼️ Modo Dual de Visualización (Frente ↔ Plano Cenital 2D)
- **Interruptor Instantáneo en Header:**
  - **👁️ Vista Frente:** Perfecto para fachadas, balcones, terrazas y muros. Renderiza plantas recortadas sin fondo (`PNG Cutout`) a la altura de los ojos con sombra de suelo realista.
  - **📐 Plano Desde Arriba (Cenital):** Especialmente diseñado para **espacios y terrenos grandes, quintas o countries**. Convierte las plantas en **copas botánicas arquitectónicas 2D** con texturas estilizadas por especie (palmeras radiadas, copas de árboles, topiarias, flores, suculentas).
- **📐 Cuadrícula Métrica (1m x 1m):** Activable en el plano cenital para medir distancias exactas y perímetros.
- **🌱 Diámetro de Copa Adulta (Ø Metros):** Muestra un halo perimetral punteado con la cobertura adulta de cada ejemplar (ej: *Ø 2.0 m*, *Ø 0.8 m*) para evitar el error de plantar demasiado junto.
- **🛰️ Subida de Foto Satelital / Dron:** Permite subir capturas de Google Maps, Google Earth o fotos de dron del predio y diseñar directamente encima.

### 2. 🎯 Catálogo y Lienzo Interactivo
- **Catálogo Lateral con Buscador en Vivo:** Filtrado por nombre común, científico y requerimiento lumínico (*Sol*, *Sombra*, *Semisombra*).
- **Herramientas por Planta:** Agrandar/achicar copa, duplicar, invertir orientación, capas (frente/fondo) y eliminar.

### 2. 🎯 Interactividad Avanzada del Lienzo
- **Arrastre libre (Mouse & Touch):** Mueve cualquier planta a la posición deseada en el lienzo con coordenadas responsivas (`%`).
- **Barra de herramientas flotante en cada ejemplar:**
  - 🔍 **Agrandar / Reducir:** Ajusta la escala para simular perspectiva de profundidad o madurez de la planta.
  - 🔄 **Invertir orientación (Flip Horizontal):** Variabilidad natural del follaje.
  - 📑 **Traer al frente / Enviar atrás:** Manejo de capas de vegetación.
  - ➕ **Duplicar:** Agrega rápidamente otro ejemplar de la misma especie.
  - 🗑️ **Eliminar:** Quita la planta del lienzo.

### 3. 💬 Panel Flotante de Resumen y Cotización (WhatsApp)
- **Fijación Dual (Arriba ⬆️ / Abajo ⬇️):** Permite anclar el panel en la parte superior o inferior de la pantalla para despejar el suelo del jardín y organizar las plantas cómodamente.
- **Organización y Ordenamiento de Especies:** Filtros de ordenación rápida dentro del panel (*Original*, *Mayor cantidad*, *Mayor precio*, *Alfabético A-Z*).
- **Plantilla Negra (Plano Técnico CAD):** Lienzo arquitectónico oscuro con cuadrícula milimétrica tanto en vista cenital (desde arriba) como frontal.
- Conteo en tiempo real de unidades totales y desglose por especie.
- Cálculo de presupuesto estimado.
- **Botón Verde de WhatsApp de Alta Conversión:** Genera el enlace directo a WhatsApp (`https://wa.me/...`) con el mensaje preformateado y listo para enviar al vivero:
  - Espacio seleccionado (o foto personalizada).
  - Cantidad exacta y especies seleccionadas (ej: *3x Monstera Deliciosa (Sombra)*).
  - Nombre del cliente y notas opcionales.

---

## 🛠️ Cómo Iniciar el Proyecto

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

El servidor estará disponible en `http://localhost:5173/`.
