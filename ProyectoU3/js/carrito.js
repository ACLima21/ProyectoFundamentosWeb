let propiedades = [];
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();

    document.getElementById("busqueda").addEventListener("input", aplicarFiltros);
    document.getElementById("filtroCiudad").addEventListener("change", aplicarFiltros);
    document.getElementById("ordenPrecio").addEventListener("change", aplicarFiltros);
});

function cargarDatos() {
    fetch("data.json")
        .then(res => res.json())
        .then(data => {
            propiedades = data;
            carrito = propiedades.filter(p => p.reservado === true);
            llenarFiltroCiudades();
            mostrarCarrito(carrito);
        });
}

function llenarFiltroCiudades() {
    const ciudades = [...new Set(propiedades.map(p => p.ciudad))];
    const select = document.getElementById("filtroCiudad");

    ciudades.forEach(ciudad => {
        const option = document.createElement("option");
        option.value = ciudad;
        option.textContent = ciudad;
        select.appendChild(option);
    });
}

function aplicarFiltros() {
    let resultado = [...carrito];

    const texto = document.getElementById("busqueda").value.toLowerCase();
    const ciudad = document.getElementById("filtroCiudad").value;
    const orden = document.getElementById("ordenPrecio").value;

    if (texto) {
        resultado = resultado.filter(p =>
            p.nombre_propiedad.toLowerCase().includes(texto) ||
            p.ciudad.toLowerCase().includes(texto)
        );
    }

    if (ciudad) {
        resultado = resultado.filter(p => p.ciudad === ciudad);
    }

    if (orden === "asc") {
        resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === "desc") {
        resultado.sort((a, b) => b.precio - a.precio);
    }

    mostrarCarrito(resultado);
}

function mostrarCarrito(lista) {
    const contenedor = document.getElementById("listaCarrito");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No hay propiedades en el carrito.</p>";
        return;
    }

    lista.forEach(propiedad => {
        const card = document.createElement("div");
        card.classList.add("card-carrito");

        card.innerHTML = `
            <img src="imgs/${propiedad.imagen}" alt="${propiedad.nombre_propiedad}">
            <div class="card-body">
                <h3>${propiedad.nombre_propiedad}</h3>
                <p>${propiedad.ciudad}</p>
                <div class="precio">$${propiedad.precio} / noche</div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}
