let pageCount = 1; // Contador de páginas
const linesPerPage = 25; // Número de líneas en la hoja 1
const linesPerPage2 = 26; // Número de líneas en la hoja 1
let selectedImage = null; // Variable para almacenar la imagen seleccionada
let actionHistory = []; // Historial de acciones para deshacer

// Función para agregar líneas a la hoja 1
function fillSheetWithLines(sheetId) {
    const content = document.getElementById(`content${sheetId}`);
    for (let i = 0; i < linesPerPage; i++) {
        const line = document.createElement("div");
        line.className = "line";
        line.contentEditable = true;
        line.textContent = "______________________________________________";
        //line.style.color = "blue"

        // Evento para manejar la entrada de texto
        line.addEventListener("focus", () => {
            if (line.textContent.trim() === "______________________________________________") {
                line.textContent = ""; // Limpiar la línea al enfocarla
                line.style.color = "black"
            }
        });


        line.addEventListener("blur", () => {
            if (line.textContent.trim() === "") {
                line.textContent = "______________________________________________"; // Restaurar la línea si está vacía
                line.style.color = "white"
            }
        });

        // Detectar cuando el texto alcanza el borde de la línea
        line.addEventListener("input", (e) => {
            checkLineOverflow(e.target, content);
        });

        // Detectar la tecla Enter y mover a la siguiente línea
        line.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                moveToNextLineOnEnter(e.target);
            }
        });

        content.appendChild(line);
    }
}

// Llenar la hoja inicial con líneas
fillSheetWithLines(1);

// Función para agregar líneas a la hoja 2 en adelante
function fillSheetWithLines2(sheetId) {
    const content = document.getElementById(`content${sheetId}`);
    for (let i = 0; i < linesPerPage2; i++) {
        const line = document.createElement("div");
        line.className = "line";
        line.contentEditable = true;
        line.textContent = "______________________________________________";

        // Evento para manejar la entrada de texto
        line.addEventListener("focus", () => {
            if (line.textContent.trim() === "______________________________________________") {
                line.textContent = ""; // Limpiar la línea al enfocarla
                line.style.color = "black"
            }
        });

        line.addEventListener("blur", () => {
            if (line.textContent.trim() === "") {
                line.textContent = "______________________________________________"; // Restaurar la línea si está vacía
                line.style.color = "white"
            }
        });

        // Detectar cuando el texto alcanza el borde de la línea
        line.addEventListener("input", (e) => {
            checkLineOverflow(e.target, content);
        });

        // Detectar la tecla Enter y mover a la siguiente línea
        line.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                moveToNextLineOnEnter(e.target);
            }
        });

        content.appendChild(line);
    }
}

// Función para verificar si el texto ha llegado al final de la línea
function checkLineOverflow(currentLine, content) {
    const parentWidth = currentLine.parentElement.clientWidth; // Ancho del contenedor
    const textWidth = getTextWidth(currentLine.textContent, window.getComputedStyle(currentLine).font); // Ancho del texto

    // Si el ancho del texto es mayor o igual al ancho del contenedor, pasamos a la siguiente línea
    if (textWidth >= parentWidth - 20) { // -10 para margen de seguridad
        const nextLine = currentLine.nextElementSibling;
        if (nextLine && nextLine.classList.contains("line")) {
            nextLine.focus();
            nextLine.textContent = ""; // Limpiar el texto inicial de la siguiente línea
        }
    }
}

// Función para calcular el ancho del texto en píxeles
function getTextWidth(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

// Función para moverse a la siguiente línea al presionar Enter
function moveToNextLineOnEnter(currentLine) {
    const nextLine = currentLine.nextElementSibling;
    if (nextLine && nextLine.classList.contains("line")) {
        nextLine.focus();
        nextLine.textContent = ""; // Limpiar el texto inicial de la siguiente línea
    }
}



// Función para agregar una nueva hoja
function addSheet() {
    pageCount++; // Incrementa el contador de páginas

    // Crear nuevo contenedor de hoja
    const newSheet = document.createElement("div");
    newSheet.className = "sheet";
    newSheet.id = `sheet${pageCount}`;

    // Solo agregar líneas de contenido (sin título ni autor)
    newSheet.innerHTML = `
        <div class="content" id="content${pageCount}">
            <!-- Las líneas se añadirán aquí -->
        </div>
        <div class="footer">
            Hoja ${pageCount}
        </div>
    `;

    // Agregar la nueva hoja al contenedor de hojas
    document.querySelector(".sheet-container").appendChild(newSheet);

    // Llenar automáticamente las líneas
    fillSheetWithLines2(pageCount);
}

// Función para eliminar la última hoja
function removeLastSheet() {
    if (pageCount > 1) {
        // Mostrar el modal de confirmación
        const modal = document.getElementById("confirmModal");
        const pageNumber = document.getElementById("pageNumber");
        pageNumber.textContent = pageCount; // Mostrar el número de la página a eliminar
        modal.style.display = "flex"; // Hacer visible el modal

        // Función cuando se hace clic en "Sí"
        document.getElementById("confirmYes").onclick = function () {
            const lastSheet = document.getElementById(`sheet${pageCount}`);
            lastSheet.remove();
            pageCount--;
            modal.style.display = "none"; // Ocultar el modal después de eliminar
        };

        // Función cuando se hace clic en "No"
        document.getElementById("confirmNo").onclick = function () {
            modal.style.display = "none"; // Ocultar el modal sin hacer nada
        };
    } else {
        alert("No se puede eliminar la primera hoja.");
    }
}

// Función para cambiar el color del texto seleccionado o del título y autor
function changeTextColor(color) {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo
        span.style.color = color; // Establecer el color del texto seleccionado
        span.style.fontWeight = "bold";
        span.style.fontStyle = "italic";
        span.style.fontSize = 18 + "px";
        range.surroundContents(span); // Rodear el texto seleccionado con el span con el color aplicado
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        title.style.color = color; // Establecer el color del texto seleccionado

    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        author.style.color = color; // Cambiar el color del autor
    }
}

function changeTextColorNormal(black) {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo
        span.style.color = black; // Establecer el color del texto seleccionado
        span.style.fontWeight = "normal";
        span.style.fontStyle = "normal";
        span.style.fontSize = 25 + "px";
        range.surroundContents(span); // Rodear el texto seleccionado con el span con el color aplicado
    }

}


function Subrayado() {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar o quitar el subrayado

        // Verificar si el texto seleccionado ya está subrayado
        const parentNode = selection.anchorNode.parentNode;
        if (parentNode.tagName === "SPAN" && parentNode.style.textDecoration === "underline") {
            // Si ya está subrayado, eliminar el subrayado quitando el span
            const textContent = parentNode.textContent; // Obtener el contenido de texto
            parentNode.replaceWith(document.createTextNode(textContent)); // Reemplazar el span por el texto puro
        } else {
            // Si no está subrayado, aplicarlo
            span.style.textDecoration = "underline"; // Aplicar subrayado
            range.surroundContents(span); // Rodear el texto seleccionado con el span
        }
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        title.style.textDecoration = title.style.textDecoration === "underline" ? "none" : "underline";
    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        author.style.textDecoration = author.style.textDecoration === "underline" ? "none" : "underline";
    }
}

function Negrita() {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const parentElement = selection.anchorNode.parentElement; // Obtener el elemento padre del texto seleccionado

        // Si ya está en negrita, quitar el formato
        if (parentElement && parentElement.tagName === "SPAN" && parentElement.style.fontWeight === "bold") {
            parentElement.style.fontWeight = "normal"; // Quitar negrita
        } else {
            const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo
            span.style.fontWeight = "bold"; // Aplicar negrita
            range.surroundContents(span); // Rodear el texto seleccionado con el span
        }
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        // Alternar entre negrita y normal para todo el texto del título
        title.style.fontWeight = title.style.fontWeight === "bold" ? "normal" : "bold";
    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        // Alternar entre negrita y normal para todo el texto del autor
        author.style.fontWeight = author.style.fontWeight === "bold" ? "normal" : "bold";
    }
}

function Cursiva() {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo

        // Verificar si el texto seleccionado ya está dentro de un elemento cursivo
        const parentNode = range.commonAncestorContainer.parentNode;

        if (parentNode.tagName === "SPAN" && parentNode.style.fontStyle === "italic") {
            // Si ya está en cursiva, quitar el span y devolver el texto a su estado original
            const textContent = parentNode.textContent;
            parentNode.replaceWith(document.createTextNode(textContent));
        } else {
            // Si no está en cursiva, aplicarle el estilo cursivo
            span.style.fontStyle = "italic";
            range.surroundContents(span); // Rodear el texto seleccionado con el span
        }
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        // Alternar la cursiva en el título
        title.style.fontStyle = title.style.fontStyle === "italic" ? "normal" : "italic";
    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        // Alternar la cursiva en el autor
        author.style.fontStyle = author.style.fontStyle === "italic" ? "normal" : "italic";
    }
}

function addImageSegma() {
    const img = document.createElement('img');
    img.src = './Imagenes/Segno.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image');

    let content = document.getElementById('content1');
    let sheet1 = document.getElementById('sheet1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }


    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(sheet1.clientWidth - 100) / 2}px`;
    img.style.top = `${(sheet1.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });

}


function addImageCoda() {
    const img = document.createElement('img');
    img.src = './Imagenes/Coda.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });


}

function InicioRepeticion() {
    const img = document.createElement('img');
    img.src = './Imagenes/InicioRep.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Rep');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });


}

function FinRepeticion() {
    const img = document.createElement('img');
    img.src = './Imagenes/FinRep.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Rep');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });


}

function addParada() {
    const img = document.createElement('img');
    img.src = './Imagenes/parada.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Parada');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}

function addParadaRaya() {
    const img = document.createElement('img');
    img.src = './Imagenes/paradaRaya.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_ParadaRaya');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}

function addGuion() {
    const img = document.createElement('img');
    img.src = './Imagenes/guion.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Parada');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}

function addsalida1() {
    const img = document.createElement('img');
    img.src = './Imagenes/salida1.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_salida');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}

function addsalida2() {
    const img = document.createElement('img');
    img.src = './Imagenes/salida2.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_salida');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}
function addsalida3() {
    const img = document.createElement('img');
    img.src = './Imagenes/salida3.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_salida');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}

function addsalida4() {
    const img = document.createElement('img');
    img.src = './Imagenes/salida4.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_salida');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }

    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}

function addsalida5() {
    const img = document.createElement('img');
    img.src = './Imagenes/salida5.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_salida');

    let content = document.getElementById('content1');

    if (pageCount == 1) {
        content = document.getElementById('content1');
    } else {
        if (pageCount == 2) {
            content = document.getElementById('content2');
        } else {
            if (pageCount == 3) {
                content = document.getElementById('content3');
            } else {
                content = document.getElementById('content4');
            }
        }
    }
    // Colocar la imagen en el centro del contenedor
    img.style.left = `${(content.clientWidth - 150) / 2}px`;
    img.style.top = `${(content.clientHeight - 150) / 2}px`;

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
}


//Funcion para hacer la imagen arrastrable
function makeImageDraggable(img) {
    let offsetX = 0, offsetY = 0;

    img.addEventListener('mousedown', (e) => {
        const sheet = img.closest('.sheet'); // Contenedor de la hoja
        const sheetRect = sheet.getBoundingClientRect(); // Límites de la hoja

        offsetX = e.clientX - img.getBoundingClientRect().left;
        offsetY = e.clientY - img.getBoundingClientRect().top;

        function onMouseMove(event) {
            // Ajustar el margen derecho máximo
            const rightMargin = 10; // Por ejemplo, 20px de margen adicional
            const bottomMargin = 30; // Margen inferior, si lo deseas

            // Calcular la posición dentro de los límites
            const newLeft = Math.min(
                Math.max(event.clientX - sheetRect.left - offsetX, 0), // Mínimo 0 (borde izquierdo)
                sheetRect.width - img.offsetWidth - rightMargin // Máximo ancho menos ancho de la imagen menos margen derecho
            );

            const newTop = Math.min(
                Math.max(event.clientY - sheetRect.top - offsetY, 0), // Mínimo 0 (borde superior)
                sheetRect.height - img.offsetHeight - bottomMargin // Máximo altura menos altura de la imagen menos margen inferior
            );

            // Aplicar las posiciones calculadas
            img.style.left = `${newLeft}px`;
            img.style.top = `${newTop}px`;
        }

        function onMouseUp() {
            // Eliminar los eventos cuando se suelta el botón del mouse
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault(); // Prevenir comportamientos no deseados
    });
}

// Función para seleccionar una imagen
function selectImage(img) {
    if (selectedImage && selectedImage !== img) {
        deselectImage(); // Deseleccionar la imagen previamente seleccionada
    }

    selectedImage = img;
    selectedImage.classList.add('selected');
}


// Escuchar el evento de tecla presionada para eliminar la imagen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedImage) {
        // Guardar la acción de eliminar imagen en el historial
        actionHistory.push({
            action: 'delete',
            element: selectedImage,
            position: { left: parseInt(selectedImage.style.left), top: parseInt(selectedImage.style.top) }
        });

        selectedImage.remove();
        selectedImage = null;
    }
});

// Función para deseleccionar una imagen
function deselectImage() {
    if (selectedImage) {
        selectedImage.classList.remove('selected'); // Quitar la clase 'selected'
        selectedImage = null; // Restablecer la variable a null
    }
}

//Deseleccionar la imagen al hacer clic fuera de cualquier imagen 
document.addEventListener('click', (event) => {
    if (selectedImage && !event.target.classList.contains('image')) {
        deselectImage(); // Deseleccionar la imagen si el clic fue fuera de una imagen
    }
});

// Función para deshacer la última imagen agregada
function removeLast() {
    if (actionHistory.length === 0) return;

    const lastAction = actionHistory.pop();

    switch (lastAction.action) {
        case 'add':
            // Deshacer agregar imagen
            lastAction.element.remove();
            break;
        case 'move':
            // Deshacer mover imagen
            lastAction.element.style.left = `${lastAction.previousPosition.left}px`;
            lastAction.element.style.top = `${lastAction.previousPosition.top}px`;
            break;
        case 'delete':
            // Deshacer eliminar imagen
            a4Sheet.appendChild(lastAction.element);
            lastAction.element.style.left = `${lastAction.position.left}px`;
            lastAction.element.style.top = `${lastAction.position.top}px`;
            break;
    }
}

// Función para Exportar Imagenes
function exportIMG() {
    const sheet = document.getElementById("sheet1");

    domtoimage.toPng(sheet)
        .then(function(dataUrl) {
            const link = document.createElement("a");
            link.download = "hoja_completa.png";
            link.href = dataUrl;
            link.click();
        })
        .catch(function(error) {
            console.error("Error al exportar la hoja:", error);
            alert("Hubo un problema al generar la imagen.");
        });
}


