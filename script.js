document.addEventListener("DOMContentLoaded", () => {

let products = JSON.parse(localStorage.getItem("products")) || [];
let invoice = [];
let currentProduct = null;
let qty = 1;

const categoryBox = document.getElementById("category-boxes");
const productGrid = document.getElementById("product-grid");
const invoiceEl = document.getElementById("invoice");
const totalEl = document.getElementById("total");

/* CATEGORY */
function renderCategories(){
  let cats = [...new Set(products.map(p => p.category))];
  categoryBox.innerHTML = "";

  cats.forEach(c => {
    let div = document.createElement("div");
    div.className = "category-box";
    div.innerText = c;
    div.onclick = () => filterProducts(c);
    categoryBox.appendChild(div);
  });
}

/* PRODUCTS */
function filterProducts(cat){
  productGrid.innerHTML = "";

  products.filter(p => p.category === cat).forEach(p => {

    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td>${p.stock}</td>
    `;

    tr.onclick = () => selectProduct(p);

    productGrid.appendChild(tr);
  });
}

/* SELECT */
function selectProduct(p){
  currentProduct = p;
  qty = 1;

  document.getElementById("selected-name").innerText = p.name;
  document.getElementById("selected-price").innerText = p.price;
  document.getElementById("qty").innerText = qty;
}

/* QTY */
window.plusQty = () => {
  qty++;
  document.getElementById("qty").innerText = qty;
};

window.minusQty = () => {
  if(qty > 1){
    qty--;
    document.getElementById("qty").innerText = qty;
  }
};

/* ADD */
window.addToCart = () => {

  if(!currentProduct) return;

  let exist = invoice.find(i => i.name === currentProduct.name);

  if(exist){
    exist.qty += qty;
  } else {
    invoice.push({
      name: currentProduct.name,
      price: currentProduct.price,
      qty: qty
    });
  }

  currentProduct.stock -= qty;
  localStorage.setItem("products", JSON.stringify(products));

  renderInvoice();
};

/* INVOICE */
function renderInvoice(){
  invoiceEl.innerHTML = "";
  let total = 0;

  invoice.forEach(i => {

    let t = i.qty * i.price;
    total += t;

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i.name}</td>
      <td>${i.qty}</td>
      <td>${t}</td>
    `;

    invoiceEl.appendChild(tr);
  });

  totalEl.innerText = total + " FCFA";
}

/* INIT */
renderCategories();

});
