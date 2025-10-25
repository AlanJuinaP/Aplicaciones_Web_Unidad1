$(document).ready(function () {
    // Obtener el parámetro 'id' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get("id");

    if (!idPelicula) {
        $("#detalle-pelicula").html("<p>No se ha seleccionado ninguna película.</p>");
        return;
    }

    // Cargar las películas desde el JSON
    $.ajax({
        url: "../data/peliculas.json",
        type: "GET",
        dataType: "json",
        success: function (peliculas) {
        const pelicula = peliculas.find(p => p.id == idPelicula);
            if (pelicula) {
            mostrarDetalle(pelicula);
            } else {
            $("#detalle-pelicula").html("<p>Película no encontrada.</p>");
        }
    },
        error: function () {
        $("#detalle-pelicula").html("<p>Error al cargar los datos.</p>");
        }
    });
});

    // Función que genera el detalle dinámico
    function mostrarDetalle(p) {
    const hoy = new Date();
    const fechaEstreno = new Date(p.estreno);
    const esEstreno = hoy < fechaEstreno;
    const precio = esEstreno ? p.precios.estreno : p.precios.normal;

    const badge = esEstreno
        ? `<span class="badge bg-danger fs-6">🎉 Estreno</span>`
        : `<span class="badge bg-success fs-6">🎟️ En Cartelera</span>`;

    const detalleHTML = `
        <div class="col-md-8">
            <div class="card shadow">
            <img src="../${p.imagen}" class="card-img-top" alt="${p.titulo}">
            <div class="card-body">
            <h2 class="card-title">${p.titulo}</h2>
            <p>${badge}</p>
            <p><strong>Géneros:</strong> ${p.generos.join(", ")}</p>
            <p><strong>Estreno:</strong> ${new Date(p.estreno).toLocaleDateString()}</p>
            <p class="text-muted"><strong>Precio actual:</strong> $${precio.toFixed(2)}</p>
            <p class="mt-3">${p.sinopsis}</p>
            <a href="${p.trailer}" target="_blank" class="btn btn-outline-primary mt-3">Ver Tráiler 🎥</a>
            <a href="../index.html" class="btn btn-secondary mt-3">Volver</a>
            </div>
        </div>
    </div>
    `;

    $("#detalle-pelicula").html(detalleHTML);
}