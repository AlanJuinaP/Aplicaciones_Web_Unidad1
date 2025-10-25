$(document).ready(function (){
    $.ajax({
        url: "data/peliulas.json",
        method: "GET",
        dataType: "json",
        success: function (peliulas){
            mostrarPeliculas(peliulas);
        },
        error: function (xhr, status, error){
            console.error("Error al cargar las peliculas:",error);
            
            
        }
    });
}); 

//fundion para mostrar las peliculas en la galeria 
function mostrarPeliculas(peliculas){
    const contenedor = $("#lista-peliculas");
    contenedor.empty();

    const hoy = new Date();
    
    peliculas.forEach((peli) =>{
        const fechaEstreno = new Date(peli.estreno);
        const esEstreno = hoy < fechaEstreno;
        const precio = esEstreno ? peli.precios.estreno : peli.precios.normal;

        const tarjeta = `
            <div class = "col-md-4 mb-4">
                <div> class="card h-100 shadow-sm>
                    <img src="${peli.imagen}" class="card-img-top" alt=${peli.titulo}">
                    <div class="card-body">
                        <h5 class="card-tittle">${peli.titulo}</h5>
                        <p class="text-muted"><strong>Precio:</strong> $${precio.toFixed(2)}</p>
                        <p>${peli.sinopsis.substring(0, 100)}...</p>
                        <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary">Ver Detalle</a>
                    </div>
                </div>
            </div>
        `;

        contenedor.append(tarjeta);
    })
}