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
            
            // Verificamos si ya se realizó un pago para no duplicar o mostrar lo ya pagado
            let yaPagado = localStorage.getItem('pagadoCompleto');
            let carritoJson = [];
            
            if (!yaPagado) {
                carritoJson = propiedades.filter(p => p.reservado === true);
            }
            
            // Cargamos las reservas dinámicas del LocalStorage
            let carritoLocal = JSON.parse(localStorage.getItem('carritoReservas')) || [];
            
            let reservasNuevas = carritoLocal.map(res => {
                return {
                    id_local: res.id,
                    nombre_propiedad: res.nombre,
                    ciudad: "Nueva York",
                    precio: res.precio,
                    imagen: res.imagen ? res.imagen : "Habitacion.png",
                    reservado: true,
                    estado: res.estado
                };
            });

            // Combinamos las fuentes de datos
            carrito = [...carritoJson, ...reservasNuevas];

            llenarFiltroCiudades();
            mostrarCarrito(carrito);
        })
        .catch(error => {
            console.error("Error cargando data.json:", error);
            let carritoLocal = JSON.parse(localStorage.getItem('carritoReservas')) || [];
            carrito = carritoLocal.map(res => ({
                id_local: res.id,
                nombre_propiedad: res.nombre,
                ciudad: "Nueva York",
                precio: res.precio,
                imagen: res.imagen ? res.imagen : "Habitacion.png",
                reservado: true,
                estado: res.estado
            }));
            mostrarCarrito(carrito);
        });
}

function llenarFiltroCiudades() {
    const ciudades = [...new Set(propiedades.map(p => p.ciudad).filter(c => c))];
    const select = document.getElementById("filtroCiudad");
    select.innerHTML = '<option value="">Todas las ciudades</option>';

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
            (p.nombre_propiedad && p.nombre_propiedad.toLowerCase().includes(texto)) ||
            (p.ciudad && p.ciudad.toLowerCase().includes(texto))
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

// FUNCIÓN PARA DETECTAR LA CARPETA CORRECTA DE LA IMAGEN
function obtenerRutaImagen(nombre) {
    if (!nombre) return "imgs/avatar.png";
    if (nombre === "avatar.png" || nombre === "SalaPrincipal.avif") return "imgs/" + nombre;
    
    // Lista de imágenes según tus carpetas enviadas
    const huesped = ["Ambato.jpg", "Cuenca.jpg", "Guayaquil.jpg", "Guayaquil2.jpg", "Ibarra.jpg", "Manta.jpg", "Mindo.jpg", "Quito.jpg", "Quito2.jpg", "Salinas.jpg", "Tena.jpg"];
    const cliente = ["Baño.png", "Cocina.png", "Comedor.png", "Habitacion.png", "Recibidor.png"];

    if (huesped.includes(nombre)) return "imgs/imagenes_Huesped/" + nombre;
    if (cliente.includes(nombre)) return "imgs/imagenes_Cliente/" + nombre;
    
    return "imgs/" + nombre;
}

function mostrarCarrito(lista) {
    const contenedor = document.getElementById("listaCarrito");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; color: #666; font-size: 1.2rem; margin-top: 40px;'>El carrito está vacío.</p>";
        return;
    }

    let total = lista.reduce((suma, p) => suma + parseFloat(p.precio), 0);

    lista.forEach(propiedad => {
        const card = document.createElement("div");
        card.classList.add("card-carrito");

        card.innerHTML = `
            <img src="${obtenerRutaImagen(propiedad.imagen)}" alt="${propiedad.nombre_propiedad}" style="height: 180px; width: 100%; object-fit: cover;">
            <div class="card-body" style="padding: 15px;">
                <h3 style="font-size: 18px;">${propiedad.nombre_propiedad}</h3>
                <p style="color: #666; font-size: 14px;">${propiedad.ciudad}</p>
                <p style="color: #D66A6A; font-size: 13px; font-weight: bold; margin-top: 5px;">Estado: ${propiedad.estado ? propiedad.estado : 'Pendiente'}</p>
                <div class="precio" style="font-weight: bold; margin-top: 10px; font-size: 18px; color: #1a1a1a;">$${propiedad.precio}</div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // FOOTER DE PAGO
    const footer = document.createElement("div");
    footer.style.gridColumn = "1 / -1";
    footer.style.textAlign = "right";
    footer.style.marginTop = "20px";
    footer.style.padding = "20px";
    footer.style.borderTop = "1px solid #ccc";
    footer.innerHTML = `
        <h2 style="margin-bottom: 15px;">Total: <span style="color: #D66A6A;">$${total.toFixed(2)}</span></h2>
        <button id="btnPagar" style="background: #D66A6A; color: white; padding: 12px 30px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Pagar Ahora</button>
    `;
    contenedor.appendChild(footer);

    document.getElementById("btnPagar").addEventListener("click", () => {
        if (confirm("¿Confirmar el pago de $" + total.toFixed(2) + "?")) {
            alert("¡Pago exitoso!");
            localStorage.removeItem('carritoReservas');
            localStorage.setItem('pagadoCompleto', 'true'); // Bandera para limpiar el JSON visualmente
            window.location.href = 'catalogo.html';
        }
    });
}