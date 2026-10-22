/**
 * SkyBridge CloudMart - Client Application Logic
 * Course: SOFT807 Cloud Applications Development - Assessment 1
 * Organization: SkyBridge Tech Innovations Ltd.
 * Framework: jQuery & Vanilla JS
 */

$(document).ready(function () {
  // Application State
  let currentUser = {
    UserID: 2,
    FullName: 'Jaykumar Patel',
    Email: 'jaykumar@customer.co.nz',
    UserRole: 'Customer'
  };

  let productsCache = [];
  let isEditingProduct = false;

  // Initialize UI
  checkCloudStatus();
  updateAuthUI();
  loadProducts();
  loadCart(currentUser.UserID);

  // --------------------------------------------------------------------------
  // 1. Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info', icon = 'fa-circle-info') {
    const typeClasses = {
      success: 'toast-success',
      danger: 'toast-danger',
      warning: 'toast-warning',
      info: ''
    };

    const icons = {
      success: 'fa-circle-check',
      danger: 'fa-triangle-exclamation',
      warning: 'fa-circle-exclamation',
      info: 'fa-circle-info'
    };

    const toastHtml = `
      <div class="toast ${typeClasses[type] || ''}">
        <i class="fa-solid ${icons[type] || icon}"></i>
        <span>${message}</span>
      </div>
    `;

    const $toast = $(toastHtml);
    $('#toastContainer').append($toast);

    setTimeout(() => {
      $toast.fadeOut(300, function () {
        $(this).remove();
      });
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 2. Cloud Database Health & Status Polling
  // --------------------------------------------------------------------------
  function checkCloudStatus() {
    $.ajax({
      url: '/api/status',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        if (data && data.database) {
          $('#dbStatusLabel').text(`${data.database.provider}: Active`);
          $('#dbModeLabel').text(data.database.mode);
        }
      },
      error: function () {
        $('#dbStatusLabel').text('Resilient Engine: Active');
        $('#dbModeLabel').text('Local/Cloud Resilient Fallback');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. User Authentication & Session Management
  // --------------------------------------------------------------------------
  function updateAuthUI() {
    if (currentUser) {
      $('#guestActions').addClass('hidden');
      $('#userSessionPill').removeClass('hidden');
      $('#sessionUserName').text(currentUser.FullName);
      $('#sessionUserRole').text(currentUser.UserRole);

      if (currentUser.UserRole === 'Admin') {
        $('#sessionUserRole').addClass('role-admin');
        $('#userRoleIcon').attr('class', 'fa-solid fa-user-gear');
        $('#adminCmsSection').removeClass('hidden');
        $('#cartCustomerName').text(`${currentUser.FullName} (Admin Test Mode)`);
      } else {
        $('#sessionUserRole').removeClass('role-admin');
        $('#userRoleIcon').attr('class', 'fa-solid fa-user-shield');
        $('#adminCmsSection').addClass('hidden');
        $('#cartCustomerName').text(`${currentUser.FullName} (Customer)`);
      }
    } else {
      $('#guestActions').removeClass('hidden');
      $('#userSessionPill').addClass('hidden');
      $('#adminCmsSection').addClass('hidden');
      $('#cartCustomerName').text('Guest');
    }
  }

  // Logout
  $('#btnLogout').on('click', function () {
    currentUser = null;
    updateAuthUI();
    showToast('You have been securely logged out.', 'info');
    $('#cartTableBody').empty();
    $('#cartEmptyState').removeClass('hidden');
    $('#cartTableWrapper').addClass('hidden');
    $('#summaryItemCount').text('0');
    $('#summaryTotalUnits').text('0');
    $('#summaryGrandTotal').text('$0.00');
  });

  // Login Form Submission
  $('#formLogin').on('submit', function (e) {
    e.preventDefault();
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val().trim();
    const $alert = $('#loginAlertBox');

    $alert.addClass('hidden').removeClass('alert-danger alert-success');

    if (!email || !password) {
      $alert.addClass('alert-danger').html('<i class="fa-solid fa-triangle-exclamation"></i> Please enter both email and password.').removeClass('hidden');
      return;
    }

    $.ajax({
      url: '/api/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (res) {
        if (res.success) {
          currentUser = res.user;
          updateAuthUI();
          loadCart(currentUser.UserID);
          showToast(`Welcome back, ${currentUser.FullName}!`, 'success');
          $alert.addClass('alert-success').html(`<i class="fa-solid fa-circle-check"></i> ${res.message}`).removeClass('hidden');
          setTimeout(() => $alert.addClass('hidden'), 3500);

          if (currentUser.UserRole === 'Admin') {
            $('html, body').animate({
              scrollTop: $('#adminCmsSection').offset().top - 80
            }, 500);
          }
        }
      },
      error: function (xhr) {
        const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Authentication failed.';
        $alert.addClass('alert-danger').html(`<i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}`).removeClass('hidden');
        showToast(errorMsg, 'danger');
      }
    });
  });

  // Customer Registration Form Submission
  $('#formRegister').on('submit', function (e) {
    e.preventDefault();
    const fullName = $('#regFullName').val().trim();
    const email = $('#regEmail').val().trim();
    const password = $('#regPassword').val().trim();
    const $alert = $('#regAlertBox');

    $alert.addClass('hidden').removeClass('alert-danger alert-success');

    // Client-side validations
    if (!fullName || fullName.length < 3) {
      $alert.addClass('alert-danger').html('<i class="fa-solid fa-circle-exclamation"></i> Full Name must be at least 3 characters long.').removeClass('hidden');
      $('#regFullName').focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      $alert.addClass('alert-danger').html('<i class="fa-solid fa-circle-exclamation"></i> Please provide a valid email address format.').removeClass('hidden');
      $('#regEmail').focus();
      return;
    }

    if (!password || password.length < 6) {
      $alert.addClass('alert-danger').html('<i class="fa-solid fa-circle-exclamation"></i> Password must be at least 6 characters long for security compliance.').removeClass('hidden');
      $('#regPassword').focus();
      return;
    }

    // Submit to server API
    $.ajax({
      url: '/api/register',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ fullName, email, password }),
      success: function (res) {
        if (res.success) {
          $alert.addClass('alert-success').html(`<i class="fa-solid fa-circle-check"></i> ${res.message}`).removeClass('hidden');
          showToast('Customer account registered successfully!', 'success');
          // Auto login newly registered customer
          currentUser = res.user;
          updateAuthUI();
          loadCart(currentUser.UserID);
          $('#formRegister')[0].reset();
        }
      },
      error: function (xhr) {
        const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Registration failed.';
        $alert.addClass('alert-danger').html(`<i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}`).removeClass('hidden');
        showToast(errorMsg, 'danger');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Products Catalog: Fetch & Render
  // --------------------------------------------------------------------------
  function loadProducts() {
    $.ajax({
      url: '/api/products',
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.success) {
          productsCache = res.products;
          renderStorefrontCatalog(res.products);
          renderCmsTable(res.products);
        }
      },
      error: function () {
        showToast('Failed to load products from cloud catalog.', 'danger');
      }
    });
  }

  function renderStorefrontCatalog(products) {
    const $grid = $('#productsGrid');
    $grid.empty();

    $('#catalogCountPill').text(`${products.length} Enterprise Solutions Available`);

    products.forEach(p => {
      const cardHtml = `
        <div class="product-card" data-id="${p.ProductID}">
          <div class="product-top">
            <span class="product-category">${escapeHtml(p.Category)}</span>
            <span class="stock-tag"><i class="fa-solid fa-check-double"></i> ${p.StockQuantity} In Stock</span>
          </div>
          <h4 class="product-title">${escapeHtml(p.ProductName)}</h4>
          <p class="product-desc">${escapeHtml(p.Description || 'Enterprise-grade cloud implementation package.')}</p>
          <div class="product-bottom">
            <div class="price-tag">
              <span class="price-label">Price (NZD)</span>
              <span class="price-amount">$${parseFloat(p.Price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <button class="btn btn-primary btn-sm btn-add-cart" data-id="${p.ProductID}">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
      $grid.append(cardHtml);
    });
  }

  function renderCmsTable(products) {
    const $tbody = $('#cmsTableBody');
    $tbody.empty();
    $('#cmsProductCount').text(products.length);

    products.forEach(p => {
      const rowHtml = `
        <tr data-id="${p.ProductID}">
          <td><strong>#${p.ProductID}</strong></td>
          <td>
            <strong>${escapeHtml(p.ProductName)}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(p.Description ? p.Description.substring(0, 55) + '...' : '')}</div>
          </td>
          <td><span class="product-category">${escapeHtml(p.Category)}</span></td>
          <td><strong>$${parseFloat(p.Price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
          <td>${p.StockQuantity} units</td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline btn-cms-edit" data-id="${p.ProductID}" title="Edit Product">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger btn-cms-delete" data-id="${p.ProductID}" title="Delete Product">
              <i class="fa-solid fa-trash-can"></i> Delete
            </button>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Shopping Cart Operations (CRUD)
  // --------------------------------------------------------------------------
  function loadCart(userId) {
    if (!userId) {
      userId = currentUser ? currentUser.UserID : 2;
    }

    $.ajax({
      url: `/api/cart/${userId}`,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.success) {
          renderCart(res.items, res.summary);
        }
      },
      error: function () {
        showToast('Unable to load shopping cart.', 'danger');
      }
    });
  }

  function renderCart(items, summary) {
    const $tbody = $('#cartTableBody');
    $tbody.empty();

    if (!items || items.length === 0) {
      $('#cartEmptyState').removeClass('hidden');
      $('#cartTableWrapper').addClass('hidden');
      $('#summaryItemCount').text('0');
      $('#summaryTotalUnits').text('0');
      $('#summaryGrandTotal').text('$0.00');
      return;
    }

    $('#cartEmptyState').addClass('hidden');
    $('#cartTableWrapper').removeClass('hidden');

    items.forEach(item => {
      const rowHtml = `
        <tr data-cart-id="${item.CartItemID}">
          <td>
            <strong>${escapeHtml(item.ProductName)}</strong>
          </td>
          <td><span class="product-category">${escapeHtml(item.Category)}</span></td>
          <td>$${parseFloat(item.Price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td>
            <div class="qty-control">
              <button class="qty-btn btn-qty-minus" data-cart-id="${item.CartItemID}" data-current="${item.Quantity}">-</button>
              <input type="number" class="qty-input input-cart-qty" data-cart-id="${item.CartItemID}" value="${item.Quantity}" min="1" max="99">
              <button class="qty-btn btn-qty-plus" data-cart-id="${item.CartItemID}" data-current="${item.Quantity}">+</button>
            </div>
          </td>
          <td><strong>$${parseFloat(item.Subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
          <td class="text-right">
            <button class="btn btn-sm btn-danger btn-cart-remove" data-cart-id="${item.CartItemID}">
              <i class="fa-solid fa-trash-can"></i> Remove
            </button>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    if (summary) {
      $('#summaryItemCount').text(summary.itemCount);
      $('#summaryTotalUnits').text(summary.totalUnits);
      $('#summaryGrandTotal').text(`$${parseFloat(summary.grandTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    }
  }

  // Add to Cart Event
  $(document).on('click', '.btn-add-cart', function () {
    const productId = $(this).data('id');
    const userId = currentUser ? currentUser.UserID : 2;

    $.ajax({
      url: '/api/cart',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ userId, productId, quantity: 1 }),
      success: function (res) {
        if (res.success) {
          showToast(res.message, 'success');
          loadCart(userId);
        }
      },
      error: function (xhr) {
        const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Failed to add item to cart.';
        showToast(errorMsg, 'danger');
      }
    });
  });

  // Quantity Change Events
  $(document).on('click', '.btn-qty-plus', function () {
    const cartItemId = $(this).data('cart-id');
    const currentQty = parseInt($(this).data('current'), 10) || 1;
    updateCartItemQty(cartItemId, currentQty + 1);
  });

  $(document).on('click', '.btn-qty-minus', function () {
    const cartItemId = $(this).data('cart-id');
    const currentQty = parseInt($(this).data('current'), 10) || 1;
    if (currentQty > 1) {
      updateCartItemQty(cartItemId, currentQty - 1);
    } else {
      showToast('Quantity cannot be less than 1. Click Remove to delete the item.', 'warning');
    }
  });

  $(document).on('change', '.input-cart-qty', function () {
    const cartItemId = $(this).data('cart-id');
    const newQty = parseInt($(this).val(), 10);
    if (newQty >= 1) {
      updateCartItemQty(cartItemId, newQty);
    } else {
      $(this).val(1);
      updateCartItemQty(cartItemId, 1);
    }
  });

  function updateCartItemQty(cartItemId, newQuantity) {
    $.ajax({
      url: `/api/cart/${cartItemId}`,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ quantity: newQuantity }),
      success: function (res) {
        if (res.success) {
          showToast(res.message, 'success');
          loadCart(currentUser ? currentUser.UserID : 2);
        }
      },
      error: function (xhr) {
        const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Failed to update quantity.';
        showToast(errorMsg, 'danger');
      }
    });
  }

  // Remove Cart Item Event
  $(document).on('click', '.btn-cart-remove', function () {
    const cartItemId = $(this).data('cart-id');

    $.ajax({
      url: `/api/cart/${cartItemId}`,
      method: 'DELETE',
      success: function (res) {
        if (res.success) {
          showToast(res.message, 'info');
          loadCart(currentUser ? currentUser.UserID : 2);
        }
      },
      error: function (xhr) {
        const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Failed to remove item.';
        showToast(errorMsg, 'danger');
      }
    });
  });

  // Checkout Action
  $('#btnCheckout').on('click', function () {
    showToast('Cloud Deployment Provisioning Request Submitted to Azure Resource Manager!', 'success', 'fa-rocket');
  });

  // --------------------------------------------------------------------------
  // 6. Admin CMS Product Operations (Create, Update, Delete)
  // --------------------------------------------------------------------------
  $('#formProductCms').on('submit', function (e) {
    e.preventDefault();

    const productId = $('#cmsProductId').val();
    const productName = $('#cmsProductName').val().trim();
    const category = $('#cmsCategory').val();
    const price = parseFloat($('#cmsPrice').val());
    const stockQuantity = parseInt($('#cmsStock').val(), 10);
    const description = $('#cmsDescription').val().trim();
    const $alert = $('#cmsAlertBox');

    $alert.addClass('hidden').removeClass('alert-danger alert-success');

    if (!productName || productName.length < 3) {
      $alert.addClass('alert-danger').html('<i class="fa-solid fa-circle-exclamation"></i> Product name must be at least 3 characters.').removeClass('hidden');
      return;
    }

    if (!category) {
      $alert.addClass('alert-danger').html('<i class="fa-solid fa-circle-exclamation"></i> Please select a valid service category.').removeClass('hidden');
      return;
    }

    if (isNaN(price) || price < 0) {
      $alert.addClass('alert-danger').html('<i class="fa-solid fa-circle-exclamation"></i> Valid price is required.').removeClass('hidden');
      return;
    }

    const payload = { productName, category, price, stockQuantity, description };

    if (isEditingProduct && productId) {
      // UPDATE Product (PUT)
      $.ajax({
        url: `/api/products/${productId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (res) {
          if (res.success) {
            showToast(res.message, 'success');
            resetCmsForm();
            loadProducts();
            loadCart(currentUser ? currentUser.UserID : 2);
          }
        },
        error: function (xhr) {
          const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Failed to update product.';
          $alert.addClass('alert-danger').html(`<i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}`).removeClass('hidden');
          showToast(errorMsg, 'danger');
        }
      });
    } else {
      // CREATE Product (POST)
      $.ajax({
        url: '/api/products',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (res) {
          if (res.success) {
            showToast(res.message, 'success');
            resetCmsForm();
            loadProducts();
          }
        },
        error: function (xhr) {
          const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Failed to add product.';
          $alert.addClass('alert-danger').html(`<i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}`).removeClass('hidden');
          showToast(errorMsg, 'danger');
        }
      });
    }
  });

  // Edit Button Clicked in CMS Table
  $(document).on('click', '.btn-cms-edit', function () {
    const productId = $(this).data('id');
    const product = productsCache.find(p => p.ProductID === productId);

    if (!product) return;

    isEditingProduct = true;
    $('#cmsProductId').val(product.ProductID);
    $('#cmsProductName').val(product.ProductName);
    $('#cmsCategory').val(product.Category);
    $('#cmsPrice').val(product.Price);
    $('#cmsStock').val(product.StockQuantity);
    $('#cmsDescription').val(product.Description || '');

    $('#cmsFormTitle').html(`<i class="fa-solid fa-pen-nib"></i> Edit Cloud Service #${product.ProductID}`);
    $('#cmsModeBadge').text('Edit Mode').addClass('badge-warning');
    $('#btnCmsSaveText').text('Update Product Details');
    $('#btnCmsCancel').removeClass('hidden');

    $('html, body').animate({
      scrollTop: $('#adminCmsSection').offset().top - 80
    }, 400);
  });

  // Cancel Edit Button
  $('#btnCmsCancel').on('click', function () {
    resetCmsForm();
  });

  function resetCmsForm() {
    isEditingProduct = false;
    $('#formProductCms')[0].reset();
    $('#cmsProductId').val('');
    $('#cmsFormTitle').html('<i class="fa-solid fa-circle-plus"></i> Add New Cloud Service');
    $('#cmsModeBadge').text('Create Mode').removeClass('badge-warning');
    $('#btnCmsSaveText').text('Publish to Cloud Catalog');
    $('#btnCmsCancel').addClass('hidden');
    $('#cmsAlertBox').addClass('hidden');
  }

  // Delete Button Clicked in CMS Table
  $(document).on('click', '.btn-cms-delete', function () {
    const productId = $(this).data('id');
    const product = productsCache.find(p => p.ProductID === productId);
    const prodName = product ? product.ProductName : `#${productId}`;

    if (!confirm(`Are you sure you want to delete "${prodName}" from the cloud catalog?`)) {
      return;
    }

    $.ajax({
      url: `/api/products/${productId}`,
      method: 'DELETE',
      success: function (res) {
        if (res.success) {
          showToast(res.message, 'success');
          loadProducts();
          loadCart(currentUser ? currentUser.UserID : 2);
        }
      },
      error: function (xhr) {
        const errorMsg = (xhr.responseJSON && xhr.responseJSON.message) || 'Failed to delete product.';
        showToast(errorMsg, 'danger');
      }
    });
  });

  $('#btnRefreshCatalog').on('click', function () {
    loadProducts();
    showToast('Cloud Catalog synchronized with Azure SQL Database.', 'info');
  });

  // Utility to prevent XSS
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
