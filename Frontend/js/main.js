// Menu Toggle para celular
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cierre del menú al hacer click en un link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll
//Es el desplazamiento suave cuando hago click en un enlace del menú.
//Sin smooth scroll: Salta instantáneamente a la sección
//Con smooth scroll: Se desliza suavemente hasta la sección
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

//--------------------- CARRITO DE COMPRAS --------------------------
let cart = [];

// Elementos del DOM
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCounter = document.getElementById('cart-counter');
const closeModal = document.querySelector('.close-modal');

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('dulceHogarCart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('dulceHogarCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCounter();
    }
}

// Función para abrir el modal del carrito
function openCartModal() {
    cartModal.style.display = 'block';
    renderCartItems();
}

// Función para cerrar el modal
function closeCartModal() {
    cartModal.style.display = 'none';
}

// Función para renderizar los items del carrito
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Tu carrito está vacío</p>
            </div>
        `;
        cartTotalElement.textContent = '0';
        return;
    }

    let total = 0;
    
    // Guardar el scroll position antes de actualizar
    const scrollTop = cartItemsContainer.scrollTop;
    
    // Usar fragmento de documento para actualizar sin "pestañeo"
    const fragment = document.createDocumentFragment();

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace('$', '').replace('.', '')) * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                </div>
                <button class="remove-item" data-action="remove" data-index="${index}">Eliminar</button>
            </div>
        `;
        fragment.appendChild(cartItemElement);
    });

    // Reemplazar todo el contenido de una vez
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.appendChild(fragment);
    
    // Restaurar scroll position
    cartItemsContainer.scrollTop = scrollTop;
    
    cartTotalElement.textContent = total.toLocaleString();
}

// Función para agregar productos al carrito
function addToCart(productName, price) {
    const existingItemIndex = cart.findIndex(item => item.name === productName);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity++;
    } else {
        const product = {
            name: productName,
            price: price,
            quantity: 1
        };
        cart.push(product);
    }
    
    updateCartCounter();
    saveCartToStorage();
    showCartNotification(productName);
    renderCartItems();
}

// Función para aumentar cantidad 
function increaseQuantity(index) {
    cart[index].quantity++;
    renderCartItems();
    updateCartCounter();
    saveCartToStorage();
    return false;
}

// Función para disminuir cantidad 
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
        return false;
    }
    renderCartItems();
    updateCartCounter();
    saveCartToStorage();
    return false;
}

// Función para eliminar producto del carrito 
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCartItems();
    updateCartCounter();
    saveCartToStorage();
    return false;
}

// Actualizar contador del carrito
function updateCartCounter() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
}

// Notificación
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    
    // Limitar el nombre del producto si es muy largo
    const displayName = productName.length > 20 
        ? productName.substring(0, 20) + '...' 
        : productName;
    
    notification.innerHTML = `
        <span>✅ ${displayName} agregado al carrito</span>
    `;
    
    // Aplicar estilos
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 1000;
        min-width: 250px;
        max-width: 300px;
        text-align: center;
        word-wrap: break-word;
        animation: slideIn 0.3s ease forwards;
    `;
    
    document.body.appendChild(notification);
    
    // Remover con animación de salida
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300); // Tiempo de la animación de salida
    }, 2700); // Timepo de la animación antes de empezar a desaparecer
}

//------------------- Función para proceder al pago ---------------------
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.price.replace('$', '').replace('.', '')) * item.quantity);
    }, 0);
    
    alert(`¡Gracias por tu compra! Total: $${total.toLocaleString()}\n\nEsta es una simulación. En producción aquí se conectaría con la pasarela de pago.`);
    
    // Vaciar carrito después de la compra
    cart = [];
    updateCartCounter();
    renderCartItems();
    closeCartModal();
    saveCartToStorage();
    
    // Mostrar mensaje de confirmación
    showCartNotification('¡Compra realizada con éxito!');
}

//-------------------------- FORMULARIO -----------------------------
// Validación de formularios
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Mínimo 8 caracteres, al menos 1 mayúscula
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}

function showError(inputId, message) {
    const errorElement = document.getElementById(inputId);
    const inputElement = document.querySelector(`#${inputId.replace('-error', '')}`);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        inputElement.classList.add('invalid');
        inputElement.classList.remove('valid');
    }
}

function clearError(inputId) {
    const errorElement = document.getElementById(inputId);
    const inputElement = document.querySelector(`#${inputId.replace('-error', '')}`);
    
    if (errorElement && inputElement) {
        errorElement.textContent = '';
        inputElement.classList.remove('invalid');
        inputElement.classList.remove('valid');
    }
}

function markFieldValid(inputId) {
    const inputElement = document.querySelector(`#${inputId}`);
    if (inputElement) {
        inputElement.classList.add('valid');
        inputElement.classList.remove('invalid');
    }
}

function showSuccess(message) {
    // Creación del elemento de éxito si no existe
    let successElement = document.querySelector('.success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        document.querySelector('#login-form').appendChild(successElement);
    }
    successElement.textContent = message;
    
    // Remover después de 3 segundos
    setTimeout(() => {
        successElement.textContent = '';
    }, 3000);
}

// Base de datos simulada de usuarios
const usersDatabase = [
    { email: 'ana@example.com', password: 'Clave2025' },
    { email: 'pedro@example.com', password: 'Password123' },
    { email: 'cliente@dulcehogar.com', password: 'Cliente2025' }
];

// Validación en tiempo real
function setupFormValidation() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (!emailInput || !passwordInput) return;
    
    // Validación de email en tiempo real (input + blur)
    emailInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError('email-error', 'El email es requerido');
        } else if (!validateEmail(this.value)) {
            showError('email-error', 'Por favor ingresa un email válido (debe contener @ y dominio)');
        } else {
            clearError('email-error');
            markFieldValid('login-email');
        }
    });
    
    emailInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            showError('email-error', 'El email es requerido');
        } else if (!validateEmail(this.value)) {
            showError('email-error', 'Por favor ingresa un email válido');
        }
    });
    
    // Validación de contraseña en tiempo real (input + blur)
    passwordInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError('password-error', 'La contraseña es requerida');
        } else if (this.value.length < 8) {
            showError('password-error', 'Mínimo 8 caracteres');
        } else if (!/(?=.*[A-Z])/.test(this.value)) {
            showError('password-error', 'Debe incluir al menos 1 mayúscula');
        } else {
            clearError('password-error');
            markFieldValid('login-password');
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            showError('password-error', 'La contraseña es requerida');
        } else if (!validatePassword(this.value)) {
            showError('password-error', 'Mínimo 8 caracteres con al menos 1 mayúscula');
        }
    });
}

// Simulación del login MEJORADA
function simulateLogin(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Buscar usuario en la base de datos simulada
            const user = usersDatabase.find(u => 
                u.email === email && u.password === password
            );
            resolve(!!user); // true si existe, false si no
        }, 1500);
    });
}

// Manejo del envío del formulario
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginBtn = document.getElementById('login-btn');
    
    if (!loginBtn) return;
    
    // Validación final antes de enviar
    let isValid = true;
    
    if (!validateEmail(email)) {
        showError('email-error', 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        showError('password-error', 'La contraseña debe tener mínimo 8 caracteres e incluir 1 mayúscula');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Simulación del proceso de login
    loginBtn.classList.add('btn-loading');
    loginBtn.disabled = true;
    loginBtn.textContent = '';
    
    simulateLogin(email, password).then(success => {
        setTimeout(() => {
            loginBtn.classList.remove('btn-loading');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Ingresar';
            
            if (success) {
                showSuccess('¡Login exitoso! Redirigiendo...');
                // Aquí iría la redirección real
                setTimeout(() => {
                    alert(`¡Bienvenido ${email}! En una implementación real, aquí se redirigiría al dashboard del usuario.`);
                    // Limpiar formulario
                    document.getElementById('login-form').reset();
                    clearError('email-error');
                    clearError('password-error');
                }, 2000);
            } else {
                showError('password-error', 'Credenciales incorrectas. Prueba con: ana@example.com / Clave2025');
                
                const emailInput = document.getElementById('login-email');
                const passwordInput = document.getElementById('login-password');
                
                if (emailInput && passwordInput) {
                    emailInput.classList.add('invalid');
                    emailInput.classList.remove('valid');
                    passwordInput.classList.add('invalid');
                    passwordInput.classList.remove('valid');
                }
            }
        }, 500);
    });
}

//------------------------------------ SECCION DEL CARRUSEL DEL HERO ---------------------------------------
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    let slideInterval;

    // Función para mostrar slide específico
    function showSlide(index) {
        // Remover clase active de todos los slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Asegurar que el índice esté dentro de los límites
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        
        // Agregar clase active al slide actual
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // Función para siguiente slide
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) currentSlide = 0;
        showSlide(currentSlide);
    }

    // Función para slide anterior
    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        showSlide(currentSlide);
    }

    // Event listeners para controles
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetInterval();
        });
    });

    // Auto-avance cada 8 segundos
    function startInterval() {
        slideInterval = setInterval(nextSlide, 10000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Iniciar carrusel
    startInterval();

    // Pausar carrusel cuando el mouse está sobre él
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        heroSlider.addEventListener('mouseleave', () => {
            startInterval();
        });
    }
}

//------------------------------ SISTEMA DE REGISTRO ---------------------------------
function validateName(name) {
    return name.trim().length >= 2 && name.trim().length <= 50;
}

function validatePhone(phone) {
    if (!phone.trim()) return true; // Opcional
    const phoneRegex = /^[0-9+-\s()]{8,20}$/;
    return phoneRegex.test(phone);
}

function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

// Configurar validación del formulario de registro
function setupRegisterValidation() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmInput = document.getElementById('register-confirm');
    const phoneInput = document.getElementById('register-phone');
    const termsInput = document.getElementById('register-terms');

    // Validación de nombre
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (!validateName(this.value)) {
                showError('name-error', 'El nombre debe tener entre 2 y 50 caracteres');
            } else {
                clearError('name-error');
                markFieldValid('register-name');
            }
        });
    }

    // Validación de email
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (!validateEmail(this.value)) {
                showError('email-error', 'Por favor ingresa un email válido');
            } else {
                clearError('email-error');
                markFieldValid('register-email');
            }
        });
    }

    // Validación de contraseña
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (!validatePassword(this.value)) {
                showError('password-error', 'Mínimo 8 caracteres con al menos 1 mayúscula');
            } else {
                clearError('password-error');
                markFieldValid('register-password');
            }
        });
    }

    // Validación de confirmación de contraseña
    if (confirmInput) {
        confirmInput.addEventListener('blur', function() {
            const password = passwordInput ? passwordInput.value : '';
            if (!validatePasswordMatch(password, this.value)) {
                showError('confirm-error', 'Las contraseñas no coinciden');
            } else {
                clearError('confirm-error');
                markFieldValid('register-confirm');
            }
        });
    }

    // Validación de teléfono
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (!validatePhone(this.value)) {
                showError('phone-error', 'Formato de teléfono inválido');
            } else {
                clearError('phone-error');
                markFieldValid('register-phone');
            }
        });
    }
}

// Simular registro de usuario
function simulateRegister(userData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Verificar si el email ya existe
            const existingUser = usersDatabase.find(user => user.email === userData.email);
            if (existingUser) {
                resolve({ success: false, error: 'El email ya está registrado' });
            } else {
                // Agregar nuevo usuario a la "base de datos"
                usersDatabase.push({
                    email: userData.email,
                    password: userData.password,
                    name: userData.name,
                    phone: userData.phone
                });
                resolve({ success: true });
            }
        }, 1500);
    });
}

// Manejar envío del formulario de registro
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const phone = document.getElementById('register-phone').value;
    const terms = document.getElementById('register-terms').checked;
    const registerBtn = document.getElementById('register-btn');
    
    if (!registerBtn) return;
    
    // Validación final antes de enviar
    let isValid = true;
    
    if (!validateName(name)) {
        showError('name-error', 'El nombre debe tener entre 2 y 50 caracteres');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        showError('email-error', 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        showError('password-error', 'Mínimo 8 caracteres con al menos 1 mayúscula');
        isValid = false;
    }
    
    if (!validatePasswordMatch(password, confirmPassword)) {
        showError('confirm-error', 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    if (!validatePhone(phone)) {
        showError('phone-error', 'Formato de teléfono inválido');
        isValid = false;
    }
    
    if (!terms) {
        showError('terms-error', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Simular proceso de registro
    registerBtn.classList.add('btn-loading');
    registerBtn.disabled = true;
    registerBtn.textContent = '';
    
    const userData = { name, email, password, phone };
    
    simulateRegister(userData).then(result => {
        // Restaurar botón
        setTimeout(() => {
            registerBtn.classList.remove('btn-loading');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Crear Cuenta';
            
            if (result.success) {
                showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
                setTimeout(() => {
                    // Redirigir a login con el email pre-llenado
                    window.location.href = `login.html?email=${encodeURIComponent(email)}`;
                }, 2000);
            } else {
                showError('email-error', result.error);
            }
        }, 500);
    });
}

//------------------------- SISTEMA DE BÚSQUEDA ----------------------------
function initSearchSystem() {
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const resultsCount = document.getElementById('search-results-count');
    
    if (!searchInput) return;
    
    // Evento de búsqueda en tiempo real
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        performSearch(searchTerm);
        
        // Mostrar/ocultar botón de limpiar
        if (searchTerm.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
            if (resultsCount) resultsCount.textContent = '';
        }
    });
    
    // Botón para limpiar búsqueda
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            clearSearchBtn.style.display = 'none';
            performSearch('');
            if (resultsCount) resultsCount.textContent = '';
        });
    }
    
    // Tecla Escape para limpiar búsqueda
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch('');
            if (resultsCount) resultsCount.textContent = '';
            clearSearchBtn.style.display = 'none';
        }
    });
}

function performSearch(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    const productGrid = document.querySelector('.product-grid');
    const resultsCount = document.getElementById('search-results-count');
    
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
        
        // Buscar en nombre y descripción
        const matchesSearch = searchTerm === '' || 
                            productName.includes(searchTerm) || 
                            productDescription.includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
            
            // Resaltar texto si hay búsqueda
            if (searchTerm !== '') {
                highlightText(card, searchTerm);
            } else {
                removeHighlight(card);
            }
        } else {
            card.style.display = 'none';
            removeHighlight(card);
        }
    });
    
    // Actualizar contador de resultados
    if (resultsCount) {
        if (searchTerm === '') {
            resultsCount.textContent = '';
        } else {
            resultsCount.textContent = `${visibleCount} producto${visibleCount !== 1 ? 's' : ''} encontrado${visibleCount !== 1 ? 's' : ''}`;
        }
    }
    
    // Mostrar mensaje si no hay resultados
    showNoResultsMessage(visibleCount === 0 && searchTerm !== '');
}

function highlightText(card, searchTerm) {
    const productName = card.querySelector('h3');
    const productDesc = card.querySelector('.product-description');
    
    // Guardar texto original si no existe
    if (!productName.dataset.original) {
        productName.dataset.original = productName.innerHTML;
        productDesc.dataset.original = productDesc.innerHTML;
    }
    
    // Resaltar en nombre
    const nameRegex = new RegExp(`(${searchTerm})`, 'gi');
    productName.innerHTML = productName.dataset.original.replace(
        nameRegex, 
        '<span class="search-highlight">$1</span>'
    );
    
    // Resaltar en descripción
    const descRegex = new RegExp(`(${searchTerm})`, 'gi');
    productDesc.innerHTML = productDesc.dataset.original.replace(
        descRegex, 
        '<span class="search-highlight">$1</span>'
    );
}

function removeHighlight(card) {
    const productName = card.querySelector('h3');
    const productDesc = card.querySelector('.product-description');
    
    // Restaurar texto original si existe
    if (productName.dataset.original) {
        productName.innerHTML = productName.dataset.original;
        productDesc.innerHTML = productDesc.dataset.original;
    }
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <h3>No encontramos productos</h3>
            <p>Intenta con otros términos como "pan", "pastel" o "facturas"</p>
        `;
        
        const productGrid = document.querySelector('.product-grid');
        productGrid.parentNode.insertBefore(noResultsMsg, productGrid.nextSibling);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

//--------------------------------- EVENT LISTENERS ----------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage(); //Carga del carrito de compras al iniciar
    initHeroSlider(); // Inicializar carrusel del hero
    setupRegisterValidation(); // Configurar validación del formulario de registro
    initSearchSystem();

    // Botones "Agregar al Carrito"
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            addToCart(productName, productPrice);
        });
    });

    // Abrir modal al hacer click en "Carrito"
    const cartLink = document.querySelector('a[href="#carrito"]');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }

    // Cerrar modal
    closeModal.addEventListener('click', closeCartModal);

    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });

    // Botón de checkout
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Configuración de validación de formularios
    setupFormValidation();
    
    // Manejo del envío del formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // Manejar clicks en los botones del carrito (delegación de eventos)
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.matches('[data-action]')) {
            e.preventDefault();
            const action = e.target.getAttribute('data-action');
            const index = parseInt(e.target.getAttribute('data-index'));
            
            switch(action) {
                case 'increase':
                    increaseQuantity(index);
                    break;
                case 'decrease':
                    decreaseQuantity(index);
                    break;
                case 'remove':
                    removeFromCart(index);
                    break;
            }
        }
    });

    // Manejo del envío del formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // Pre-llenar email si viene por URL (desde el registro)
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam && document.getElementById('login-email')) {
        document.getElementById('login-email').value = emailParam;
    }
});