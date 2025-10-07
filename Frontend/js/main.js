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

// ==================== FUNCIONES MEJORADAS PARA CARRITO ====================

// Función para actualizar el carrito en el navbar
function updateNavCart() {
    const cartCounter = document.getElementById('cart-counter');
    const navCart = document.getElementById('nav-cart');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
    
    if (navCart) {
        // Actualizar clases según el estado
        if (totalItems === 0) {
            navCart.classList.add('empty');
            navCart.classList.remove('has-items');
            navCart.setAttribute('data-tooltip', 'Carrito vacío');
        } else {
            navCart.classList.remove('empty');
            navCart.classList.add('has-items');
            const totalPrice = cart.reduce((sum, item) => {
                return sum + (parseFloat(item.price.replace('$', '').replace('.', '')) * item.quantity);
            }, 0);
            navCart.setAttribute('data-tooltip', `${totalItems} items - $${totalPrice.toLocaleString()}`);
        }
    }
}

// Función para agregar productos al carrito (modificada)
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
    updateNavCart(); // ← Nueva línea
    saveCartToStorage();
    showCartNotification(productName);
    renderCartItems();
    
    // Efecto visual en el carrito del navbar
    const navCart = document.getElementById('nav-cart');
    if (navCart) {
        navCart.classList.add('adding-item', 'highlight');
        setTimeout(() => {
            navCart.classList.remove('adding-item', 'highlight');
        }, 1000);
    }
}

// Función para actualizar contador del carrito (modificada)
function updateCartCounter() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounter = document.getElementById('cart-counter');
    
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        
        // Animación cuando cambia el número
        cartCounter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCounter.style.transform = 'scale(1)';
        }, 300);
    }
    
    updateNavCart(); // ← Nueva línea
}

// Modificar las funciones que afectan el carrito
function increaseQuantity(index) {
    cart[index].quantity++;
    renderCartItems();
    updateCartCounter();
    updateNavCart(); // ← Nueva línea
    saveCartToStorage();
    return false;
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
        return false;
    }
    renderCartItems();
    updateCartCounter();
    updateNavCart(); // ← Nueva línea
    saveCartToStorage();
    return false;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCartItems();
    updateCartCounter();
    updateNavCart(); // ← Nueva línea
    saveCartToStorage();
    return false;
}

// Cargar carrito desde localStorage (modificada)
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('dulceHogarCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCounter();
        updateNavCart(); // ← Nueva línea
    }
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
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers;
}

function showError(inputId, message) {
    console.log('❌ showError llamado:', inputId, message);
    
    const errorElement = document.getElementById(inputId);
    const inputElement = document.querySelector(`#${inputId.replace('-error', '')}`);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.minHeight = '1rem';

        inputElement.style.borderColor = '#dc3545';
        inputElement.style.backgroundColor = '#fff8f8';
        inputElement.style.boxShadow = '0 0 0 2px rgba(220, 53, 69, 0.2)';
    }
}

function clearError(inputId) {
    const errorElement = document.getElementById(inputId);
    const inputElement = document.querySelector(`#${inputId.replace('-error', '')}`);
    
    if (errorElement && inputElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';

        inputElement.style.borderColor = '';
        inputElement.style.backgroundColor = '';
        inputElement.style.boxShadow = '';
    }
}

function markFieldValid(inputId) {
    const inputElement = document.querySelector(`#${inputId}`);
    if (inputElement) {
        inputElement.style.borderColor = '#28a745';
        inputElement.style.backgroundColor = '#f8fff9';
        inputElement.style.boxShadow = '0 0 0 2px rgba(40, 167, 69, 0.2)';
    }
}

function showSuccess(message) {
    console.log('🎉 showSuccess llamado:', message);
    
    // Primero, limpiar cualquier mensaje anterior
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Crear elemento de éxito MÁS VISIBLE
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.innerHTML = `
        <div style="
            color: #155724;
            background: #d4edda;
            border: 2px solid #c3e6cb;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            font-weight: bold;
            font-size: 1.1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            animation: fadeIn 0.5s ease;
        ">
            ✅ ${message}
        </div>
    `;
    
    // Insertar ANTES del formulario para que sea más visible
    const form = document.querySelector('#login-form') || document.querySelector('#register-form');
    const authContainer = document.querySelector('.auth-container');
    
    if (form && authContainer) {
        authContainer.insertBefore(successElement, form);
        console.log('✅ Mensaje de éxito insertado');
    } else {
        console.log('❌ No se pudo encontrar donde insertar el mensaje');
    }
    
    // Remover después de 4 segundos
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.remove();
            console.log('🗑️ Mensaje de éxito removido');
        }
    }, 4000);
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

//--------------------------- ENVIO DEL FORMULARIO ------------------------------
function handleLoginSubmit(e) {
    e.preventDefault();
    console.log('🔵 handleLoginSubmit EJECUTADO');
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const loginBtn = document.getElementById('login-btn');
    
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    
    if (!loginBtn) return;
    
    // Validación final antes de enviar
    let isValid = true;
    
    if (!validateEmail(email)) {
        console.log('❌ Email inválido');
        showError('email-error', 'Por favor ingresa un email válido');
        isValid = false;
    } else {
        clearError('email-error');
    }
    
    if (password.trim() === '') {
        console.log('❌ Password vacío');
        showError('password-error', 'La contraseña es requerida');
        isValid = false;
    } else {
        clearError('password-error');
    }
    
    if (!isValid) {
        console.log('❌ Formulario no válido, deteniendo envío');
        return;
    }
    
    console.log('✅ Formulario válido, procediendo con login...');
    
    // Simulación del proceso de login
    loginBtn.classList.add('btn-loading');
    loginBtn.disabled = true;
    loginBtn.textContent = '';
    
    simulateLogin(email, password).then(success => {
        console.log('🔐 Resultado del login:', success);
        
        setTimeout(() => {
            loginBtn.classList.remove('btn-loading');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Ingresar';
            
            if (success) {
                console.log('✅ Login exitoso');
                showSuccess('¡Login exitoso! Redirigiendo...');
                setTimeout(() => {
                    alert(`¡Bienvenido ${email}!`);
                    document.getElementById('login-form').reset();
                    clearError('email-error');
                    clearError('password-error');
                }, 2000);
            } else {
                console.log('❌ Login fallido');
                
                // ✅ MOSTRAR ERRORES VISUALES EN AMBOS CAMPOS - SIN ALERT
                showError('email-error', 'Correo electrónico no encontrado o contraseña incorrecta');
                showError('password-error', 'Verifica tus credenciales e intenta nuevamente');
                
                // Aplicar estilos de error a ambos inputs
                const emailInput = document.getElementById('login-email');
                const passwordInput = document.getElementById('login-password');
                
                if (emailInput && passwordInput) {
                    emailInput.classList.add('invalid');
                    emailInput.classList.remove('valid');
                    passwordInput.classList.add('invalid');
                    passwordInput.classList.remove('valid');
                }
                
                // ✅ MOSTRAR UN MENSAJE DE ÉXITO/ERROR GENERAL EN EL FORMULARIO
                showFormMessage('error', 'Credenciales incorrectas.');
            }
        }, 800);
    });
}

//------------------------- MENSAJES GENERALES ---------------------------------------
function showFormMessage(type, message) {
    // Eliminar mensaje anterior si existe
    const existingMessage = document.getElementById('form-general-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.id = 'form-general-message';
    
    if (type === 'error') {
        messageElement.innerHTML = `
            <div style="
                color: #721c24;
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                padding: 1rem;
                border-radius: 5px;
                margin: 1rem 0;
                text-align: center;
                font-size: 0.9rem;
            ">
                ❌ ${message}
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div style="
                color: #155724;
                background: #d4edda;
                border: 1px solid #c3e6cb;
                padding: 1rem;
                border-radius: 5px;
                margin: 1rem 0;
                text-align: center;
                font-size: 0.9rem;
            ">
                ✅ ${message}
            </div>
        `;
    }
    
    // Insertar en el formulario
    const form = document.querySelector('#login-form') || document.querySelector('#register-form');
    if (form) {
        form.parentNode.insertBefore(messageElement, form);
    }
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

//------------------------- SECCION DEL CARRUSEL DEL HERO ---------------------------------------
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // VERIFICAR QUE EXISTAN ELEMENTOS
    if (slides.length === 0) {
        console.log('❌ No se encontraron slides');
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;

    // Función para mostrar slide específico
    function showSlide(index) {
        // VERIFICAR QUE LOS SLIDES EXISTAN
        if (slides.length === 0 || indicators.length === 0) return;
        
        // Remover clase active de todos los slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Asegurar que el índice esté dentro de los límites
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        
        // VERIFICAR QUE EL SLIDE ACTUAL EXISTA
        if (slides[currentSlide] && indicators[currentSlide]) {
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }
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

    // Event listeners para controles - SOLO SI EXISTEN
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

    // Event listeners para indicadores - SOLO SI EXISTEN
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetInterval();
        });
    });

    // Auto-avance cada 10 segundos
    function startInterval() {
        slideInterval = setInterval(nextSlide, 10000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Iniciar carrusel
    startInterval();

    // Pausar carrusel cuando el mouse está sobre él - SOLO SI EXISTE
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
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            if (password.trim() === '') {
                showError('password-error', 'La contraseña es requerida');
            } else if (password.length < 8) {
                showError('password-error', 'Mínimo 8 caracteres');
            } else if (!/(?=.*[A-Z])/.test(password)) {
                showError('password-error', 'Debe incluir al menos 1 mayúscula');
            } else if (!/(?=.*[a-z])/.test(password)) {
                showError('password-error', 'Debe incluir al menos 1 minúscula');
            } else if (!/(?=.*\d)/.test(password)) {
                showError('password-error', 'Debe incluir al menos 1 número');
            } else {
                clearError('password-error');
                markFieldValid('register-password');
            }
        });

        // Validación más estricta al perder foco
        passwordInput.addEventListener('blur', function() {
            const password = this.value;
            if (!validatePassword(password)) {
                showError('password-error', 'Mínimo 8 caracteres con 1 mayúscula, 1 minúscula y 1 número');
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
    console.log('✅ Formulario registro enviado');
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const phone = document.getElementById('register-phone').value;
    const terms = document.getElementById('register-terms').checked;
    const registerBtn = document.getElementById('register-btn');
    
    if (!registerBtn) return;
    
    // Validación final MÁS ESTRICTA antes de enviar
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
        showError('password-error', 'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número');
        isValid = false;
    }
    
    if (!validatePasswordMatch(password, confirmPassword)) {
        showError('confirm-error', 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    if (phone && !validatePhone(phone)) {
        showError('phone-error', 'Formato de teléfono inválido');
        isValid = false;
    }
    
    if (!terms) {
        showError('terms-error', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }
    
    if (!isValid) {
        // Mostrar mensaje general de error
        showError('register-general-error', 'Por favor corrige los errores en el formulario');
        return;
    }
    
    registerBtn.classList.add('btn-loading');
    registerBtn.disabled = true;
    registerBtn.textContent = '';
    
    const userData = { name, email, password, phone };
    
    simulateRegister(userData).then(result => {
        setTimeout(() => {
            registerBtn.classList.remove('btn-loading');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Crear Cuenta';
            
            if (result.success) {
                showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
                setTimeout(() => {
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

// ==================== MANEJO DE ESTADOS ACTIVOS EN NAVBAR ====================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            (currentPage === 'productos.html' && linkHref === 'productos.html') ||
            (currentPage === 'login.html' && linkHref === 'login.html') ||
            (currentPage === 'registro.html' && linkHref === 'registro.html')) {
            link.classList.add('active');
        }
    });
}

// ==================== ANIMACIONES PARA MENÚ MÓVIL ====================

function setupMobileMenuAnimations() {
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link, .nav-menu .nav-cart');
    
    navLinks.forEach((link, index) => {
        link.style.setProperty('--item-index', index);
    });
}

//--------------------------------- EVENT LISTENERS ----------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Cargado - JavaScript funcionando');
    
    loadCartFromStorage();
    setupRegisterValidation();
    setActiveNavLink();
    setupMobileMenuAnimations();
    
    // INICIALIZAR SOLO SI EXISTEN LOS ELEMENTOS
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        initHeroSlider();
    }
    
    // Búsqueda - solo si existe
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        initSearchSystem();
    }

    // Botones "Agregar al Carrito" - solo en index.html
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                
                addToCart(productName, productPrice);
            });
        });
    }

    // Carrito - solo si existe en la página
    const cartLink = document.querySelector('a[href="#carrito"]');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }

    // Modal del carrito - solo si existe
    if (closeModal) {
        closeModal.addEventListener('click', closeCartModal);
    }

    // Cerrar modal al hacer click fuera - solo si existe
    if (cartModal) {
        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }

    const navCart = document.getElementById('nav-cart');
    if (navCart) {
        navCart.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }

    updateNavCart();

    // Botón de checkout - solo si existe
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Event listeners del carrito - SOLO SI EXISTE EL CONTENEDOR
    if (cartItemsContainer) {
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
    }

    // Configuración de validación de formularios
    setupFormValidation();
    
    // Manejo del envío del formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('✅ Login form encontrado, agregando event listener');
        loginForm.addEventListener('submit', handleLoginSubmit);
    } else {
        console.log('❌ Login form NO encontrado');
    }

    // Manejo del envío del formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        console.log('✅ Register form encontrado, agregando event listener');
        registerForm.addEventListener('submit', handleRegisterSubmit);
    } else {
        console.log('❌ Register form NO encontrado');
    }
    
    // Pre-llenar email si viene por URL (desde el registro)
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam && document.getElementById('login-email')) {
        document.getElementById('login-email').value = emailParam;
    }
    
    console.log('✅ Todos los event listeners configurados');
});