$(document).ready(function(){
    //obtiene el nombre del archivo actual
    const path = window.location.pathname.split("/").pop();

    //por defecto, si no hay archivo, se asume index.html
    let currentPage = path === "" ? "index.html" : path;

    //Busca el enlace del navbar que coincida con el archivo actual
    $('.navbar-nav .nav-link').each(function(){
        const link = $(this).attr('href');
        if(link.includes(currentPage)){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });
});