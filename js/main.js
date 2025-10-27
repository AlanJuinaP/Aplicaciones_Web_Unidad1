$(document).ready(function (){

    //mostrar welcome alert solo una vez
    if (!localStorage.getItem('cineplus_welcome_shown')) {
        const welcomeHtml = `
        <div class="alert alert-success alert-dismissible fade show rounded-0 m-0 text-center" role="alert">
                <strong>Bienvenido a CinePlus!</strong> Disfruta las mejores peliculas en cartelera.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
        $('#welcome-alert-container').html(welcomeHtml);
        localStorage.setItem('cineplus_welcome_shown','1');
    }
    //Mostar spinner y luego cargar
    $('#spinner-container').show();
    setTimeout(loadPeliculas, 5000);

    function loadPeliculas(){
        $.ajax({
            url: "data/peliulas.json",
            method: "GET",
            dataType: "json",
            success: function (peliculas){
                $('#spinner-container').hide();
                mostrarPeliculas(peliculas);
            },
            error: function (){
                $('#spinner-container').hide();
                $('#alert-carga').html(`<div class="alert alert-danger">Error al cargar las películas. Revise la consola.</div>`);
            }
        });
    }

    //Muestra tarjetas con animacion
    function mostrarPeliculas(peliculas){
        const $lista = $('#lista-peliculas');
        $lista.empty();

        peliculas.forEach((p, index) => {
            const hoy = new Date();
            const estrenoDate = new Date(p.estreno);
            const diff = (hoy - estrenoDate) / (1000*60*60*24);
            let precio, badgeHTML;

            if (diff >= 0 && diff <= 14) {
                //estreno reciente (14 dias)
                precio = p.precios.estreno;
                badgeHTML = `<span class="badge badge-estreno">ESTRENO</span>`;
            }else if(estrenoDate > hoy){
                //aun no se estrena
                precio = p.precios.estreno;
                badgeHTML = `<span class="badge bg-info">PRÓXIMO ESTRENO</span>`;
            }else{
                //normal
                precio = p.precios.normal;
                badgeHTML = `<span class="badge bg-secondary">EN CARTELERA</span>`;
            }

            const  card = `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4 card-fade" style="animation-delay:${index * 0.1}s">
                <div class="card card-movie h-100">
                    <img src="${p.imagen}" class="card-img-top" alt="${p.titulo}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${p.titulo}</h5>
                        <p class="mb-1">${badgeHTML}</p>
                        <p class="text-muted"><small>${p.generos.join(", ")}</small></p>
                        <p class="mb-2 text-muted"><strong>Precio: </strong>$${precio.toFixed(2)}</p>
                        <p><strong>Precio:</strong> $${precio.toFixed(2)}</p>
                        <div class="mt-auto d-grid gap-2">
                            <a href="pages/detalle.html?id=${p.id}" class="btn btn-outline-primary btn-sm">Ver detalle</a>
                            <button class="btn btn-primary btn-sm btn-trailer" data-trailer="${p.trailer}" data-title="${p.titulo}">Ver tráiler</button>
                        </div>
                    </div>
                </div>
            </div>`;

            $lista.append(card);
        });

        //manejar clic en ver trailer
        $(document).on('click', '.btn-trailer', function(){
            const trailerUrl = $(this).data('trailer');
            const title = $(this).data('title');
            openTrailerModal(trailerUrl, title);
        });
    }

    //abrir trailer en modal
    function openTrailerModal(url, title){
        //extraemos id de youtube si aplica y poner iframe, sino se abre el url en iframe
        let embed = url;
        if (url.includes('youtube.com/watch')) {
            const u =  new URL(url);
            const v = u.searchParams.get('v');
            if(v)embed= `https://www.youtube.com/embed/${v}?autoplay=1`;
        }else if (url.includes('youtube.be/')) {
            const v = url.split('/').pop();
            embed = `https://www.youtube.com/embed/${v}?autoplay=1`;
        }

        $('#trailerModalTitle').text(title);
        $('#trailerModalBody').html(`<iframe src="${embed}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`);

        const modal = new bootstrap.Modal(document.getElementById('trailerModal'));
        modal.show();

        // limpiar iframe al cerrar
        $('#trailerModal').on('hidden.bs.modal', function () {
            $('#trailerModalBody').html('');
        });
    }

}); 