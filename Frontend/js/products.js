// Base de datos de productos
const productsDatabase = [
    {
        id: 1,
        name: "Pan Campesino",
        description: "Pan artesanal de masa madre con harina integral",
        price: "$2.500",
        category: "pan",
        image: "/Frontend/assets/images/pan-campesino.jpg",
        featured: true,
        badge: "⭐ Destacado"
    },
    {
        id: 2,
        name: "Pastel de Chocolate",
        description: "Torta de chocolate belga con relleno de ganache",
        price: "$12.000",
        category: "pastel",
        image: "/Frontend/assets/images/pastel-chocolate.jpg",
        featured: true,
        badge: "🔥 Más Vendido"
    },
    {
        id: 3,
        name: "Facturas Surteras",
        description: "Surrido de facturas dulces (6 unidades)",
        price: "$4.800",
        category: "factura",
        image: "/Frontend/assets/images/facturas-surteras.jpg",
        featured: true,
        badge: "🆕 Nuevo"
    },
    {
        id: 4,
        name: "Pan de Centeno",
        description: "Pan integral de centeno con semillas",
        price: "$3.200",
        category: "pan",
        image: "/Frontend/assets/images/pan-centeno.jpg",
        featured: false
    },
    {
        id: 5,
        name: "Pastel de Vainilla",
        description: "Torta esponjosa de vainilla con buttercream",
        price: "$10.500",
        category: "pastel",
        image: "/Frontend/assets/images/pastel-vainilla.jpg",
        featured: false
    },
    {
        id: 6,
        name: "Medialunas",
        description: "Croissants de mantequilla (4 unidades)",
        price: "$3.500",
        category: "factura",
        image: "/Frontend/assets/images/medialunas.jpg",
        featured: false
    },
    {
        id: 7,
        name: "Alfajores Artesanales",
        description: "Alfajores rellenos de dulce de leche (6 unidades)",
        price: "$5.200",
        category: "dulce",
        image: "/Frontend/assets/images/alfajores.jpg",
        featured: false
    },
    {
        id: 8,
        name: "Torta de Zanahoria",
        description: "Pastel de zanahoria con frosting de queso crema",
        price: "$11.800",
        category: "pastel",
        image: "/Frontend/assets/images/torta-zanahoria.jpg",
        featured: false
    },
    {
        id: 9,
        name: "Pan Brioche",
        description: "Pan dulce francés con mantequilla",
        price: "$4.000",
        category: "pan",
        image: "/Frontend/assets/images/pan-brioche.jpg",
        featured: false
    }
];

// Configuración de paginación
let currentPage = 1;
const productsPerPage = 6;
let filteredProducts = [...productsDatabase];

// Inicializar sistema de productos
function initProductsSystem() {
    renderProducts();
    setupFilters();
    setupPagination();
}

// Renderizar productos
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsGrid.innerHTML = '';

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros filtros o términos de búsqueda</p>
            </div>
        `;
        return;
    }

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    updatePaginationInfo();
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = `product-card ${product.featured ? 'featured' : ''}`;
    
    card.innerHTML = `
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='/Frontend/assets/images/placeholder-product.jpg'">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price}</div>
            <button class="btn-add-cart" data-product-id="${product.id}">Agregar al Carrito</button>
        </div>
    `;

    return card;
}

// Configurar filtros
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

// Aplicar filtros
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;
    const sort = document.getElementById('sort-filter').value;

    // Filtrar por categoría
    filteredProducts = productsDatabase.filter(product => {
        if (category !== 'all' && product.category !== category) {
            return false;
        }
        return true;
    });

    // Filtrar por precio
    if (price !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            const priceValue = parseInt(product.price.replace('$', '').replace('.', ''));
            
            switch(price) {
                case '0-5000':
                    return priceValue <= 5000;
                case '5000-10000':
                    return priceValue > 5000 && priceValue <= 10000;
                case '10000+':
                    return priceValue > 10000;
                default:
                    return true;
            }
        });
    }

    // Ordenar
    switch(sort) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => {
                const priceA = parseInt(a.price.replace('$', '').replace('.', ''));
                const priceB = parseInt(b.price.replace('$', '').replace('.', ''));
                return priceA - priceB;
            });
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => {
                const priceA = parseInt(a.price.replace('$', '').replace('.', ''));
                const priceB = parseInt(b.price.replace('$', '').replace('.', ''));
                return priceB - priceA;
            });
            break;
        case 'featured':
            filteredProducts.sort((a, b) => b.featured - a.featured);
            break;
    }

    currentPage = 1;
    renderProducts();
}

// Configurar paginación
function setupPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

// Actualizar información de paginación
function updatePaginationInfo() {
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (pageInfo) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }

    if (nextBtn) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        nextBtn.disabled = currentPage === totalPages;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('products-grid')) {
        initProductsSystem();
    }
});