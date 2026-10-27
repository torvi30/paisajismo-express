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
- **📐 Medidas Reales del Terreno (Escala Métrica 1:1):** Configura el ancho y largo exactos en metros (ej: *6m × 12m* = *72 m²*) o selecciona plantillas rápidas (*Balcón*, *Patio*, *Jardín*, *Quinta*).
- **📏 Reglas Métricas en los Bordes:** Regla superior y lateral graduadas metro a metro (`0m, 1m, 2m...`) para medir visualmente paredes y linderos.
- **📐 Cuadrícula Métrica Proporcional:** Cuadrícula dinámica donde cada cuadro representa exactamente 1m × 1m del terreno real.
- **📏 Herramienta Cinta Métrica Interactiva:** Permite medir la distancia exacta en metros entre dos plantas o puntos del terreno con cotas visuales en tiempo real.
- **🌱 Selector de Madurez y Tamaño de Plantas:**
  - 🌱 **Joven (Pequeña):** ~50% de la copa adulta (tamaño de compra en maceta inicial).
  - 🌿 **Mediana:** ~80% de la copa adulta (1 a 2 años de crecimiento).
  - 🌳 **Adulta (Grande):** 100% de la copa plena madura para calcular sombras y evitar competencias radiculares.
  - 🎚️ **Ajuste Fino de Metros:** Controles `+` y `-` para calibrar el diámetro en metros con saltos de 20 cm.
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
