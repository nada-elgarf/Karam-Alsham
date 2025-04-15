document.addEventListener('DOMContentLoaded', function () {
  const cartButton = document.getElementById('cart-button')
  const cartSidebar = document.getElementById('cart-sidebar')
  const closeCart = document.getElementById('close-cart')
  const cartOverlay = document.getElementById('cart-overlay')
  const cartItems = document.getElementById('cart-items')
  const cartCount = document.getElementById('cart-count')
  const cartTotalAmount = document.getElementById('cart-total-amount')
  const addToCartButtons = document.querySelectorAll('.add-to-cart')

  const filterButtons = document.querySelectorAll('.filter-btn')
  const searchButton = document.getElementById('search-btn')
  const searchInput = document.getElementById('menu-search-input')

  let cart = []

  loadCart()

  if (cartButton) {
    cartButton.addEventListener('click', function () {
      cartSidebar.classList.add('active')
      cartOverlay.classList.add('active')
      document.body.style.overflow = 'hidden'
    })
  }

  const closeCartSidebar = function () {
    if (cartSidebar) {
      cartSidebar.classList.remove('active')
      cartOverlay.classList.remove('active')
      document.body.style.overflow = ''
    }
  }

  if (closeCart) {
    closeCart.addEventListener('click', closeCartSidebar)
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartSidebar)
  }

  if (addToCartButtons) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function () {
        const id = this.getAttribute('data-id')
        const name = this.getAttribute('data-name')
        const price = parseFloat(this.getAttribute('data-price'))
        const image = this.getAttribute('data-image')

        const existingItem = cart.find(item => item.id === id)

        if (existingItem) {
          existingItem.quantity++
        } else {
          cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
          })
        }

        updateCart()
        saveCart()
        showNotification(`${name} أضيف إلى السلة!`)

        if (cartSidebar) {
          cartSidebar.classList.add('active')
          cartOverlay.classList.add('active')
          document.body.style.overflow = 'hidden'
        }
      })
    })
  }

  function updateCart () {
    if (!cartCount) return

    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0)

    if (cart.length === 0) {
      cartItems.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart mb-3" style="font-size: 3rem; color: #ddd;"></i>
                    <p>Your cart is empty</p>
                </div>
            `
    } else {
      cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="mb-1">EGP ${item.price}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="btn-close remove-item" data-id="${item.id}"></button>
                </div>
            `).join('')

      document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function () {
          const id = this.getAttribute('data-id')
          const item = cart.find(item => item.id === id)
          item.quantity++
          updateCart()
          saveCart()
        })
      })

      document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function () {
          const id = this.getAttribute('data-id')
          const item = cart.find(item => item.id === id)
          if (item.quantity > 1) {
            item.quantity--
          } else {
            cart = cart.filter(cartItem => cartItem.id !== id)
          }
          updateCart()
          saveCart()
        })
      })

      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
          const id = this.getAttribute('data-id')
          cart = cart.filter(item => item.id !== id)
          updateCart()
          saveCart()
        })
      })
    }

    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    if (cartTotalAmount) {
      cartTotalAmount.textContent = `EGP ${total.toFixed(2)}`
    }
  }

  if (filterButtons) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        filterButtons.forEach(btn => btn.classList.remove('active'))
        this.classList.add('active')

        const category = this.getAttribute('data-filter')
        filterMenuItems(category)
      })
    })
  }

  function filterMenuItems (category) {
    const menuItems = document.querySelectorAll('.menu-item')

    menuItems.forEach(item => {
      if (category === 'all') {
        item.style.display = 'block'
      } else {
        if (item.getAttribute('data-category') === category) {
          item.style.display = 'block'
        } else {
          item.style.display = 'none'
        }
      }
    })
  }

  if (searchButton && searchInput) {
    searchButton.addEventListener('click', function () {
      searchMenuItems(searchInput.value)
    })

    searchInput.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        searchMenuItems(this.value)
      }
    })
  }

  function searchMenuItems (query) {
    query = query.toLowerCase().trim()
    const menuItems = document.querySelectorAll('.menu-item')

    if (query === '') {
      menuItems.forEach(item => {
        item.style.display = 'block'
      })
      return
    }

    menuItems.forEach(item => {
      const name = item.querySelector('h4').textContent.toLowerCase()
      const description = item.querySelector('p').textContent.toLowerCase()

      if (name.includes(query) || description.includes(query)) {
        item.style.display = 'block'
      } else {
        item.style.display = 'none'
      }
    })
  }

  function saveCart () {
    localStorage.setItem('karmAlShamCart', JSON.stringify(cart))
  }

  function loadCart () {
    const savedCart = localStorage.getItem('karmAlShamCart')
    if (savedCart) {
      cart = JSON.parse(savedCart)
      updateCart()
    }
  }

  function showNotification (message) {
    let notification = document.getElementById('notification')
    if (!notification) {
      notification = document.createElement('div')
      notification.id = 'notification'
      document.body.appendChild(notification)
    }

    notification.textContent = message
    notification.classList.add('show')

    setTimeout(() => {
      notification.classList.remove('show')
    }, 3000)
  }

  const checkoutButton = document.querySelector('.cart-total + .btn')
  if (checkoutButton) {
    checkoutButton.href = 'checkout.html'

    checkoutButton.addEventListener('click', function () {
      if (cart.length === 0) {
        showNotification('أضف بعض الأطباق إلى السلة أولاً')
        return false
      } else {
        showNotification('جاري الانتقال إلى صفحة الدفع...')
      }
    })
  }

  const checkoutItems = document.getElementById('checkout-items')
  if (checkoutItems) {
    displayCheckoutItems()
  }

  function displayCheckoutItems () {
    if (cart.length === 0) {
      checkoutItems.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-shopping-cart mb-3" style="font-size: 3rem; color: #ddd;"></i>
          <p>Your cart is empty</p>
        </div>
      `
      const placeOrderBtn = document.getElementById('placeOrderBtn')
      if (placeOrderBtn) {
        placeOrderBtn.disabled = true
      }
    } else {
      checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item mb-3">
          <div class="row align-items-center">
            <div class="col-3 col-md-2">
              <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
            </div>
            <div class="col-9 col-md-10">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">${item.name}</h5>
                <div class="d-flex align-items-center">
                  <span class="me-3">x${item.quantity}</span>
                  <span>EGP ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')
    }

    updateTotals()
  }

  function updateTotals () {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    const deliveryFee = 25
    const finalTotal = subtotal + deliveryFee

    const elements = {
      'checkout-total-amount': subtotal.toFixed(2),
      'checkout-subtotal': subtotal.toFixed(2),
      'checkout-final-total': finalTotal.toFixed(2)
    }

    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id)
      if (element) {
        element.textContent = `EGP ${value}`
      }
    }
  }

  const creditCardRadio = document.getElementById('creditCard')
  const cashOnDeliveryRadio = document.getElementById('cashOnDelivery')
  const creditCardDetails = document.getElementById('creditCardDetails')

  if (creditCardRadio && cashOnDeliveryRadio && creditCardDetails) {
    creditCardRadio.addEventListener('change', function () {
      if (this.checked) {
        creditCardDetails.classList.remove('d-none')
      }
    })

    cashOnDeliveryRadio.addEventListener('change', function () {
      if (this.checked) {
        creditCardDetails.classList.add('d-none')
      }
    })
  }

  const placeOrderBtn = document.getElementById('placeOrderBtn')
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function () {
      if (cart.length === 0) {
        showNotification('أضف بعض الأطباق إلى السلة أولاً')
        return
      }

      const deliveryForm = document.getElementById('deliveryForm')
      if (!deliveryForm.checkValidity()) {
        deliveryForm.reportValidity()
        return
      }

      if (creditCardRadio && creditCardRadio.checked) {
        const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName']
        for (const field of cardFields) {
          const input = document.getElementById(field)
          if (!input || !input.value.trim()) {
            showNotification('الرجاء إدخال تفاصيل بطاقة الائتمان')
            return
          }
        }
      }

      const orderData = {
        items: cart,
        customer: {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
          notes: document.getElementById('notes').value
        },
        paymentMethod: creditCardRadio && creditCardRadio.checked ? 'credit' : 'cash',
        total: parseFloat(document.getElementById('checkout-final-total').textContent.replace('EGP ', ''))
      }

      console.log('Order placed:', orderData)
      showNotification('تم تقديم طلبك بنجاح!')
      localStorage.removeItem('karmAlShamCart')

      setTimeout(() => {
        window.location.href = 'index.html'
      }, 2000)
    })
  }
})

const contactForm = document.getElementById('contactForm')
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    this.reset()
  })
}

const reservationForm = document.getElementById('reservationForm')
if (reservationForm) {
  reservationForm.addEventListener('submit', function (e) {
    e.preventDefault()
    alert('Your reservation request has been submitted! We will confirm your reservation shortly.')
    this.reset()
  })
}
