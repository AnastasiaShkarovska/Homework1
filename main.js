var products = [
  { id: 1, name: 'Apple',  qty: 2, bought: false },
  { id: 2, name: 'Tomato', qty: 1, bought: false },
  { id: 3, name: 'Cheese', qty: 3, bought: false },
];

var nextId = 4;

var productList   = document.getElementById('product-list');
var productInput  = document.getElementById('product-input');
var addButton     = document.getElementById('add-button');
var statRemaining = document.getElementById('stat-remaining');
var statBought    = document.getElementById('stat-bought');

function renderList() {
  productList.innerHTML = '';

  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    var li = createProductItem(product);
    productList.appendChild(li);
  }

  renderStats();
}

function createProductItem(product) {
  var li = document.createElement('li');
  li.className = 'product-item' + (product.bought ? ' is-bought' : '');
  li.dataset.id = product.id;


  var nameSpan = document.createElement('span');
  nameSpan.className = 'product-name';
  nameSpan.textContent = product.name;

  if (!product.bought) {
    nameSpan.addEventListener('click', function () {
      startEditName(product.id, li, nameSpan);
    });
  }

  li.appendChild(nameSpan);

  var controls = document.createElement('div');
  controls.className = 'product-controls';

  if (!product.bought) {
    var minusBtn = document.createElement('button');
    minusBtn.className = 'minus-button';
    minusBtn.setAttribute('aria-label', 'Зменшити кількість');
    minusBtn.textContent = '−';
    
    minusBtn.disabled = product.qty <= 1; 
    minusBtn.addEventListener('click', function () {
      changeQty(product.id, -1);
    });

    // Кількість
    var amountSpan = document.createElement('span');
    amountSpan.className = 'amount';
    amountSpan.setAttribute('aria-label', 'Кількість');
    amountSpan.textContent = product.qty;

    // кнопка «+»
    var plusBtn = document.createElement('button');
    plusBtn.className = 'plus-button';
    plusBtn.setAttribute('aria-label', 'Збільшити кількість');
    plusBtn.textContent = '+';
    plusBtn.addEventListener('click', function () {
      changeQty(product.id, 1);
    });

    controls.appendChild(minusBtn);
    controls.appendChild(amountSpan);
    controls.appendChild(plusBtn);
  }

  // кнопка «Куплено» або «Не куплено»
  if (!product.bought) {
    var buyBtn = document.createElement('button');
    buyBtn.className = 'buy-button';
    buyBtn.textContent = 'Куплено';
    buyBtn.addEventListener('click', function () {
      setBought(product.id, true);
    });
    controls.appendChild(buyBtn);
  } else {
    var uncheckBtn = document.createElement('button');
    uncheckBtn.className = 'uncheck-button';
    uncheckBtn.textContent = 'Не куплено';
    uncheckBtn.addEventListener('click', function () {
      setBought(product.id, false);
    });
    controls.appendChild(uncheckBtn);
  }

  if (!product.bought) {
    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.setAttribute('aria-label', 'Видалити товар');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', function () {
      deleteProduct(product.id);
    });
    controls.appendChild(deleteBtn);
  }

  li.appendChild(controls);
  return li;
}

function startEditName(id, li, nameSpan) {
    var product = getProductById(id);
  if (!product) return;

  var nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'product-name-input';
  nameInput.value = product.name;
  nameInput.setAttribute('aria-label', 'Назва товару');

  li.replaceChild(nameInput, nameSpan);
  nameInput.focus();

  nameInput.addEventListener('blur', function () {
    finishEditName(id, nameInput.value.trim(), li, nameInput);
  });

  nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') nameInput.blur();
  });
}

function finishEditName(id, newName, li, nameInput) {
  var product = getProductById(id);
  if (!product) return;

  if (newName !== '') {
    product.name = newName;
  }

  var nameSpan = document.createElement('span');
  nameSpan.className = 'product-name';
  nameSpan.textContent = product.name;
  nameSpan.addEventListener('click', function () {
    startEditName(id, li, nameSpan);
  });

  li.replaceChild(nameSpan, nameInput);
  renderStats(); 
}

function addProduct() {
  var name = productInput.value.trim();
  if (name === '') return;

  var newProduct = {
    id: nextId,
    name: name,
    qty: 1,       
    bought: false,
  };

  nextId = nextId + 1;
  products.push(newProduct);

  productInput.value = ''; // очистити поле
  productInput.focus();    // курсор залишається в полі

  renderList();
}

function deleteProduct(id) {
  var newProducts = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].id !== id) {
      newProducts.push(products[i]);
    }
  }
  products = newProducts;
  renderList();
}

function setBought(id, value) {
  var product = getProductById(id);
  if (product) {
    product.bought = value;
  }
  renderList();
}

function changeQty(id, delta) {
  var product = getProductById(id);
  if (!product) return;

  var newQty = product.qty + delta;
  if (newQty >= 1) {
    product.qty = newQty;
  }
  renderList();
}

function renderStats() {
  var remaining = [];
  var bought    = [];

  for (var i = 0; i < products.length; i++) {
    if (products[i].bought) {
      bought.push(products[i]);
    } else {
      remaining.push(products[i]);
    }
  }

  renderStatList(statRemaining, remaining);
  renderStatList(statBought, bought);
}

function renderStatList(container, list) {
  container.innerHTML = '';

  if (list.length === 0) {
    var empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = 'Порожньо';
    container.appendChild(empty);
    return;
  }

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var li = document.createElement('li');
    li.className = 'product-item-right';

    var nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;

    var qtySpan = document.createElement('span');
    qtySpan.className = 'amount-right';
    qtySpan.textContent = item.qty;

    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    container.appendChild(li);
  }
}

function getProductById(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].
        id === id) return products[i];
  }
  return null;
}

//  кнопка «Додати»
addButton.addEventListener('click', function () {
  addProduct();
});

productInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addProduct();
  }
});

renderList();