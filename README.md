# 🎮 Gestor de Colección de Videojuegos

Aplicación web **CRUD** para administrar una colección personal de videojuegos. Fue construida únicamente con **HTML5, CSS3 y JavaScript puro (Vanilla JS)**, y guarda los datos en el **`localStorage`** del navegador, así que no necesita servidor, base de datos ni instalar dependencias.

El objetivo del proyecto es poner en práctica las cuatro operaciones fundamentales de persistencia de datos (**Create, Read, Update, Delete**) en una interfaz moderna, responsiva y fácil de usar.

**Funcionalidades principales:**

- **Crear:** formulario para registrar un juego con *Título*, *Plataforma* (PC, Nintendo Switch, PS Vita, PS5, Xbox), *Género* y *Estado* (Pendiente, Jugando, Completado). Valida los campos vacíos y evita registrar dos veces el mismo juego en la misma plataforma.
- **Leer:** cuadrícula de tarjetas que se actualiza al instante y muestra un mensaje amigable cuando la colección está vacía.
- **Actualizar:** el botón *Editar* carga el juego en el formulario, el botón principal cambia a *Guardar Cambios* y aparece la opción *Cancelar edición*.
- **Eliminar:** el botón *Eliminar* abre una ventana de confirmación propia (no usa `confirm()`) antes de borrar el registro de forma permanente.
- Búsqueda por título o género, filtro por estado y ordenamiento por *Más recientes*, *Alfabético (A-Z)* o *Por Estado*.
- Contadores por estado, avisos cortos (*toasts*) y **modo claro / oscuro**. El tema y el orden elegidos se recuerdan entre visitas.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| **HTML5** | Estructura semántica de la página, formulario, listado y ventana de confirmación (`index.html`). |
| **CSS3** | Diseño responsivo con CSS Grid y Flexbox, variables CSS para los temas claro y oscuro, y animaciones (`styles.css`). |
| **JavaScript (ES6+)** | Lógica del CRUD, validaciones, búsqueda, filtros, ordenamiento y manejo de eventos (`app.js`). |
| **Web Storage API (`localStorage`)** | Guarda los juegos, el tema y el orden elegido directamente en el navegador. |
| **Git y GitHub** | Control de versiones y alojamiento del repositorio. |

**Estructura del proyecto:**

```
gestor-videojuegos/
├── index.html   # Estructura de la interfaz
├── styles.css   # Estilos, temas y diseño responsivo
├── app.js       # Lógica del CRUD y persistencia en localStorage
└── README.md    # Documentación del proyecto
```

---

## 🚀 Instalación y ejecución en local

No hace falta instalar nada: basta con un navegador moderno (Chrome, Edge, Firefox o Safari).

### Opción A: clonar con Git

1. Abre una terminal en la carpeta donde quieras guardar el proyecto.
2. Clona el repositorio:
   ```bash
   git clone https://github.com/chuck3ds/gestor-videojuegos.git
   ```
3. Entra a la carpeta del proyecto:
   ```bash
   cd gestor-videojuegos
   ```
4. Abre el archivo `index.html` con doble clic, o arrástralo a una ventana del navegador.

### Opción B: descargar el ZIP

1. En la página del repositorio en GitHub, haz clic en **Code → Download ZIP**.
2. Descomprime el archivo en tu computador.
3. Abre la carpeta descomprimida y haz doble clic en `index.html`.

### Opción C (recomendada para desarrollo): usar Live Server

1. Abre la carpeta del proyecto en **Visual Studio Code**.
2. Instala la extensión **Live Server** (de Ritwick Dey).
3. Haz clic derecho sobre `index.html` y elige **Open with Live Server**.
4. El navegador se abrirá en `http://127.0.0.1:5500` y la página se recargará sola cada vez que guardes un cambio.

> 💡 **Nota:** los datos se guardan en el `localStorage` de cada navegador. Si abres la app en otro navegador o en otro equipo, la colección empezará vacía. Para borrar todos los datos, abre las herramientas de desarrollador (**F12 → Application → Local Storage**) y elimina la clave `gameCollection`.

---

## 📸 Capturas de pantalla

### Vista principal (modo oscuro)
![Vista principal](ruta/imagen.png)

### Vista principal (modo claro)
![Modo claro](ruta/modo-claro.png)

### Colección vacía
![Colección vacía](ruta/coleccion-vacia.png)

### Agregar un juego (Create)
![Formulario para agregar un juego](ruta/agregar-juego.png)

### Editar un juego (Update)
![Modo edición](ruta/editar-juego.png)

### Confirmación antes de eliminar (Delete)
![Ventana de confirmación](ruta/confirmar-eliminar.png)

### Búsqueda, filtro y ordenamiento
![Filtros y ordenamiento](ruta/filtros-orden.png)

### Vista en celular (responsivo)
![Vista en celular](ruta/vista-movil.png)

> Reemplaza cada `ruta/...png` por la ruta real de tus imágenes, por ejemplo `capturas/vista-principal.png`.

---

## 🤖 Desarrollo asistido por IA

Este proyecto se desarrolló con ayuda de **Claude (Anthropic)** como asistente de programación. A continuación se documentan los prompts utilizados, en el orden en que se hicieron, junto con el propósito de cada uno y el resultado obtenido.

### Prompt 1: Construcción de la aplicación base

> Actúa como un desarrollador frontend senior. Necesito crear una aplicación web CRUD completa y funcional utilizando únicamente HTML5, CSS3 y JavaScript puro (Vanilla JS), guardando los datos en localStorage para que no requiera servidor ni base de datos externa.
>
> La temática de la aplicación será un "Gestor de Colección de Videojuegos".
>
> Requisitos funcionales del CRUD:
> 1. Create (Crear): Un formulario para agregar un juego con los campos: Título, Plataforma (PC, Nintendo Switch, PS Vita, PS5, Xbox), Género y Estado (Pendiente, Jugando, Completado).
> 2. Read (Leer): Una tabla o cuadrícula de tarjetas donde se muestren todos los juegos guardados en localStorage en tiempo real. Si no hay registros, mostrar un mensaje amigable.
> 3. Update (Actualizar): Un botón "Editar" en cada registro que cargue los datos del juego en el formulario (cambiando el botón principal a "Guardar Cambios") para modificar su información y actualizarla en localStorage.
> 4. Delete (Eliminar): Un botón "Eliminar" en cada registro que pida confirmación antes de borrarlo permanentemente.
>
> Requisitos de entrega:
> - Entrégame el código separado en tres archivos claros: `index.html`, `styles.css` y `app.js`.
> - Agrega comentarios explicativos en el código señalando claramente dónde ocurre cada operación del CRUD (Create, Read, Update, Delete).
> - Usa un diseño moderno, limpio y responsivo con paleta de colores oscura (Dark Mode).

**Propósito:** definir el alcance completo del proyecto (temática, campos, las cuatro operaciones CRUD, tecnologías permitidas y estilo visual) y obtener una primera versión funcional separada en tres archivos.

**Resultado:** se generaron `index.html`, `styles.css` y `app.js`, con comentarios que marcan cada operación del CRUD, validación de formulario, búsqueda, filtro por estado, contadores y una ventana de confirmación propia para eliminar.

### Prompt 2: Mejoras de experiencia de usuario (primera iteración)

> Quiero mejorar la experiencia de usuario de la aplicación actual sin cambiar la estructura base de archivos:
> 1. Ordenamiento (Sorting): Agrega un selector para ordenar los registros por: "Más recientes", "Alfabético (A-Z)", o "Por Estado".
> 2. Modal de confirmación personalizado: Reemplaza el `confirm()` nativo del navegador al eliminar un registro por un modal HTML/CSS limpio y estilizado que combine con el diseño oscuro de la app.
> 3. Modo edición claro: Cuando esté editando un registro, agrega un botón "Cancelar edición" junto al de "Guardar cambios" para limpiar el formulario y salir del modo edición si me arrepiento.
>
> Entrégame únicamente las funciones y bloques CSS/HTML nuevos o modificados.

**Propósito:** mejorar la usabilidad sin reescribir la aplicación, recibiendo solo los fragmentos de código que cambian.

**Resultado:** se agregó la función `sortGames()` y el selector de orden. La IA señaló que la ventana de confirmación y el botón de cancelar ya existían desde la versión base, así que solo se cambió el texto a "Cancelar edición" y se añadió la tecla **Esc** para cancelar.

### Prompt 3: Mejoras de experiencia de usuario (modo claro / oscuro)

> Quiero mejorar la experiencia de usuario de la aplicación actual sin cambiar la estructura base de archivos:
> 1. Ordenamiento (Sorting): Agrega un selector para ordenar los registros por: "Más recientes", "Alfabético (A-Z)", o "Por Estado".
> 2. Modal de confirmación personalizado: Reemplaza el `confirm()` nativo del navegador al eliminar un registro por un modal HTML/CSS limpio y estilizado que combine con el diseño oscuro de la app.
> 3. Modo claro o oscuro

**Propósito:** integrar el ordenamiento en los archivos completos y añadir un selector de tema para que la aplicación tenga modo claro y modo oscuro.

**Resultado:** se agregó un botón ☀️/🌙 en el encabezado, un conjunto de variables CSS para el tema claro (`:root[data-theme="light"]`) y un script que aplica el tema guardado antes de que se dibuje la página. Durante las pruebas también se corrigió un aviso que se asomaba en la parte inferior y se acortó el texto de un filtro.

### Prompt 4: Documentación del proyecto

> Actúa como un ingeniero de software documentando un proyecto en GitHub. Genera el contenido completo de un archivo `README.md` profesional en español para este proyecto de Gestor de Colección de Videojuegos (CRUD con HTML, CSS, JavaScript y localStorage).
>
> Debe incluir exactamente estas secciones:
> 1. Nombre del proyecto y una descripción breve del objetivo.
> 2. Tecnologías utilizadas.
> 3. Instrucciones paso a paso para descargar y ejecutar el proyecto en local.
> 4. Sección de "Capturas de pantalla" con marcadores de posición listos para que yo agregue mis imágenes.
> 5. Sección de "Desarrollo asistido por IA" donde se documenten los prompts utilizados durante el desarrollo y el propósito de cada uno.

**Propósito:** generar la documentación del repositorio para que cualquier persona entienda el proyecto, pueda ejecutarlo y conozca cómo se usó la IA durante el desarrollo.

**Resultado:** este archivo `README.md`.

### Reflexión sobre el uso de la IA

- **Prompts con rol y requisitos claros:** indicar un rol ("desarrollador frontend senior"), las restricciones técnicas y el formato de entrega produjo código organizado desde la primera respuesta.
- **Iteración incremental:** en lugar de pedir todo de una vez, las mejoras se solicitaron por etapas, lo que facilitó revisar y entender cada cambio.
- **Revisión humana:** el código generado se revisó y se probó en el navegador. La IA también detectó requisitos que ya estaban cumplidos, lo que evitó trabajo duplicado.
