$(document).ready(function () {

    // Mostrar mensaje de bienvenida una sola vez
    if (!localStorage.getItem('cineplus_welcome_shown')) {
        const welcomeHtml = `
        <div class="alert alert-success alert-dismissible fade show rounded-0 m-0 text-center" role="alert">
            <strong>Bienvenido a CinePlus!</strong> Disfruta las mejores películas en cartelera.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
        $('#welcome-alert-container').html(welcomeHtml);
        localStorage.setItem('cineplus_welcome_shown', '1');
    }

    // Mostrar spinner y luego cargar
    $('#spinner-container').show();
    setTimeout(loadPeliculas, 1000); // reducido a 1 segundo

    function loadPeliculas() {
        $.ajax({
            url: "data/peliculas.json", 
            method: "GET",
            dataType: "json",
            success: function (peliculas) {
                $('#spinner-container').hide();
                mostrarPeliculas(peliculas);
            },
            error: function (xhr, status, error) {
                $('#spinner-container').hide();
                console.error("Error al cargar JSON:", status, error);
                $('#alert-carga').html(`
                    <div class="alert alert-danger text-center">
                        Error al cargar las películas.<br>
                        Verifique la ruta del archivo JSON en consola.
                    </div>
                `);
            }
        });
    }

    function mostrarPeliculas(peliculas) {
        const $lista = $('#lista-peliculas');
        $lista.empty();

        peliculas.forEach((p, index) => {
            const hoy = new Date();
            const estrenoDate = new Date(p.estreno);
            const diff = (hoy - estrenoDate) / (1000 * 60 * 60 * 24);

            let precio, badgeHTML;
            if (diff >= 0 && diff <= 14) {
                precio = p.precios.estreno;
                badgeHTML = `<span class="badge badge-estreno">ESTRENO</span>`;
            } else if (estrenoDate > hoy) {
                precio = p.precios.estreno;
                badgeHTML = `<span class="badge badge-proximo">PRÓXIMAMENTE</span>`;
            } else {
                precio = p.precios.normal;
                badgeHTML = `<span class="badge badge-normal">EN CARTELERA</span>`;
            }

            const cardHTML = `
            <div class="col-md-3 mb-4">
                <div class="card shadow-sm h-100">
                    <img src="${p.imagen}" class="card-img-top" alt="${p.titulo}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${p.titulo}</h5>
                        ${badgeHTML}
                        <p class="card-text mt-2">${p.genero}</p>
                        <p class="card-text"><strong>$${precio.toFixed(2)}</strong></p>
                        <a href="pages/detalle.html?id=${p.id}" class="btn btn-primary btn-sm">Ver detalles</a>
                    </div>
                </div>
            </div>`;
            $lista.append(cardHTML);
        });
    }
});
