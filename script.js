
// Efectos al pasar mouse y dar clic
document.querySelectorAll('.project').forEach(project => {
    const img = project.querySelector('.project-image');
    const title = project.querySelector('h3');

    project.addEventListener('mouseover', () => {
        img.style.transform = 'scale(1.1)'; // Amplía la imagen
        title.style.transform = 'scale(1.1)'; // Amplía el título
        title.style.color = '#0fdaf5'; // Cambia el color del título
    });

    project.addEventListener('mouseout', () => {
        img.style.transform = 'scale(1)';
        title.style.transform = 'scale(1)';
        title.style.color = '#e0e0e0';
    });
});

// Obtener el modal y sus elementos
var modal = document.getElementById("imageModal");
var modalImg = document.getElementById("modalImage");
var captionText = document.getElementById("caption");
var closeModal = document.getElementById("closeModal");

// Seleccionar solo imágenes con la clase "thumbnail"
document.querySelectorAll(".thumbnail").forEach(img => {
    img.addEventListener("click", function () {
        modal.style.display = "flex";  // Mostrar el modal
        modalImg.src = this.src;  // Asignar la imagen al modal
        captionText.innerHTML = "";  // No mostrar el texto del alt
        document.body.classList.add("no-scroll"); // Bloquear scroll del fondo
    });
});

// Cerrar modal al hacer clic en la "X"
closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll"); // Permitir scroll de nuevo
});

// Cerrar modal si se hace clic fuera de la imagen
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
    }
});

// Cerrar el modal si se presiona la tecla ESC
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll"); // Permitir scroll de nuevo
    }
});

//Cando se da clic en botón de Proyecto en GitHub Dependiendo el Proyecto
//PROYECTO DATAMART ACCIDENTS
function proyectoGitHub1() {
    window.open('https://github.com/Max-Silva-Parraguez/Project-SSIS-DataMart-Accidents', '_blank');
}

//Cando se da clic en botón de Descarga Directa
function descargarProyecto1() {
    window.open('https://github.com/Max-Silva-Parraguez/Project-SSIS-DataMart-Accidents/archive/refs/heads/main.zip', '_blank');
}

//PROYECTO REAL-TIME DATA
function proyectoGitHub2() {
    window.open('https://github.com/Max-Silva-Parraguez/Project-SSIS-Real-Time-Data-API', '_blank');
}

//Cando se da clic en botón de Descarga Directa
function descargarProyecto2() {
    window.open('https://github.com/Max-Silva-Parraguez/Project-SSIS-Real-Time-Data-API/archive/refs/heads/main.zip', '_blank');
}