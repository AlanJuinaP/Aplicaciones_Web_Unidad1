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
            const p = peliculas.find(x => String(x.id) === String(idPelicula));
            if (!p) {
                $("#detalle-pelicula").html("<p>Pelicula no encontrada.</p>");
                return;
            }

            mostrarDetalle(p);
            cargarResenas(p.id);
        },
        error: function(){
            $("#detalle-pelicula").html("<p>Error al cargar el detalle.</p>");
        }
        
    });

    //Mostar detalle de pelicula
    function mostrarDetalle(p){
        const hoy = new Date();
        const estrenoDate = new Date(p.estreno);
        const diff = (hoy - estrenoDate) / (1000 * 60 * 60 * 24);
        let precio;
        let badge = "";

        if (diff >= 0 && diff <= 14){
            precio = p.precios.estreno;
            badge = `<span class="badge badge-estreno">ESTRENO</span>`;
        } else if (estrenoDate > hoy) {
            precio = p.precios.estreno;
            badge = `<span class="badge bg-info">PRÓXIMO ESTRENO</span>`;
        } else {
            precio = p.precios.normal;
            badge = `<span class="badge bg-secondary">EN CARTELERA</span>`;
        }

        const detalleHTML = `
            <div class="card mb-4">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="../${p.imagen}" class="img-fluid rounded-start" alt="${p.titulo}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h2 class="card-title">${p.titulo}</h2>
                            <p>${badge}</p>
                            <p><strong>Géneros:</strong> ${p.generos.join(", ")}</p>
                            <p><strong>Estreno:</strong> ${new Date(p.estreno).toLocaleDateString()}</p>
                            <p class="text-muted"><strong>Precio actual:</strong> $${precio.toFixed(2)}</p>
                            <p class="mt-3">${p.sinopsis}</p>
                            <button class="btn btn-primary mt-3" id="btn-trailer" data-trailer="${p.titulo}">Ver Trailer</button>
                            <a href="../index.html" class="btn btn-secondary mt-3">Volver</a>
                        </div>
                    </div>
                </div>
            </div>`;
        $("#detalle-pelicula").html(detalleHTML);

        //Evento para abrir modal del trailer
    $("#btn-trailer").on("click", function (){
        const trailerUrl = $(this).data("trailer");
        const titulo = $(this).data("titulo");
        abrirModalTrailer(trailerUrl, titulo);
    });
    
    }

    //funcion para abrir el modal con el video embedido
    function abrirModalTrailer(url, titulo){
        let embed = url;

        //convertir enlaces de youtube en formato embed(volvemos a implentar la funcion)
        if (url.includes("youtube.com/watch")) {
            const u = new URL(url);
            const v = u.searchParams.get("v");
            if (v) embed = `https://www.youtube.com/embed/${v}?autoplay=1`;
        }else if (url.includes("youtu.be/")) {
            const v = url.split("/").pop();
            embed = `https://www.youtube.com/embed/${v}?autoplay=1`;
        }

        $("#modalTrailerLabel").text("trailer - " + titulo);
        $("#trailer-container").html(`<iframe src="${embed}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`);

        const modal = new bootstrap.Modal(document.getElementById("modalTrailer"));
        modal.show();

        //limpiar iframe al cerrar modal
        $("#modalTrailer").on("hidden.bs.modal", function() {
            $("#trailer-container").html("");
        });
    }

    //Cargar reseñas desde resena.json
    function cargarResenas(peliculaId){
        $.ajax({
            url: "../data/reseñas.json",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const resenaData = data.find(r => String(r.peliculaId) === String(peliculaId));
                if (!resenaData || resenaData.resenas.length === 0) {
                    $("#lista-reseñas").html("<p class='text-muted'>No hay reseñas para esta película.</p>");
                    return;
                }

                mostrarResenas(resenaData.resenas);
            },
            error: function () {
                $("#lista-reseñas").html("<p class='text-danger'>Error al cargar las reseñas.</p>");
            }
        });
    }

    //mostrar resenas con estrellas
    function mostrarResenas(resenas){
        let html = "";
        resenas.forEach(r => {
            const estrellas = generarEstrellas(r.puntuacion);
            html += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-title mb-1">${r.usuario}</h6>
                        <div class="text-warning mb-2">${estrellas}</div>
                        <p class="card-text">${r.comentario}</p>
                    </div>
                </div>`;
        });
        $("lista-resenas").html(html);
    }

    //generar Html de estrellas
    function generarEstrellas(puntuacion){
        let estrellasHTML = "";
        for(let i = 1; i <= 5; i++){
            if (i <= puntuacion) estrellasHTML += "&#9733; ";//estrella llena
            else estrellasHTML += "&#9734; ";// estrella vacia
        }
        return estrellasHTML;
    }
});