document.addEventListener("DOMContentLoaded", () => {

let products = JSON.parse(localStorage.getItem("products")) || [];
let invoice = [];

let currentProduct = null;
let qty = 1;

/* ================= ELEMENTS ================= */
const categoryBox = document.getElementById("category-boxes");
const productGrid = document.getElementById("product-grid");

const nameEl = document.getElementById("selected-name");
const priceEl = document.getElementById("selected-price");
const qtyEl = document.getElementById("qty");

const invoiceEl = document.getElementById("invoice");
const totalEl = document.getElementById("total");

const dateInput = document.getElementById("invoice-date");
const invoiceIdEl = document.getElementById("invoice-id");

/* ================= INIT ================= */
setDefaultDate();
generateInvoiceNumber();
renderCategories();

/* ================= DATE ================= */
function setDefaultDate(){
  if(dateInput){
    dateInput.value = new Date().toISOString().split("T")[0];
  }
}

/* ================= INVOICE NUMBER ================= */
function generateInvoiceNumber(){
  let counter = localStorage.getItem("invoice-counter");

  if(!counter){
    counter = 1;
  } else {
    counter = parseInt(counter) + 1;
  }

  localStorage.setItem("invoice-counter", counter);

  let number = "2026" + String(counter).padStart(3, "0");

  if(invoiceIdEl){
    invoiceIdEl.innerText = number;
  }

  return number;
}

/* ================= CATEGORIES ================= */
function renderCategories(){

  if(!categoryBox) return;

  let categories = [...new Set(products.map(p => p.category))];

  categoryBox.innerHTML = "";

  categories.forEach(cat => {

    let div = document.createElement("div");
    div.className = "category-box";
    div.innerText = cat;

    div.onclick = () => filterProducts(cat);

    categoryBox.appendChild(div);
  });
}

/* ================= FILTER PRODUCTS ================= */
function filterProducts(category){

  productGrid.innerHTML = "";

  let filtered = products.filter(p => p.category === category);

  filtered.forEach(p => {

    let div = document.createElement("div");
    div.className = "product-box";

    div.innerHTML = `
      <strong>${p.name}</strong><br>
      ${p.price} FCFA
    `;

    div.onclick = () => selectProduct(p);

    productGrid.appendChild(div);
  });
}

/* ================= SELECT PRODUCT ================= */
function selectProduct(p){
  currentProduct = p;
  qty = 1;

  nameEl.innerText = p.name;
  priceEl.innerText = p.price;
  qtyEl.innerText = qty;
}

/* ================= QTY ================= */
window.plusQty = () => {
  qty++;
  qtyEl.innerText = qty;
};

window.minusQty = () => {
  if(qty > 1){
    qty--;
    qtyEl.innerText = qty;
  }
};

/* ================= ADD TO INVOICE ================= */
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

  currentProduct = null;
  qty = 1;

  nameEl.innerText = "-";
  priceEl.innerText = "0";
  qtyEl.innerText = "1";

  renderInvoice();
};

/* ================= RENDER INVOICE ================= */
function renderInvoice(){

  invoiceEl.innerHTML = "";

  let total = 0;

  invoice.forEach(item => {

    let lineTotal = item.qty * item.price;
    total += lineTotal;

    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${lineTotal} FCFA</td>
    `;

    invoiceEl.appendChild(tr);
  });

  totalEl.innerText = total + " FCFA";
}

/* ================= PRINT ================= */
const printBtn = document.getElementById("print-btn");

if(printBtn){
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

/* ================= SAVE ================= */
const saveBtn = document.getElementById("save-btn");

if(saveBtn){
  saveBtn.addEventListener("click", () => {

    let sales = JSON.parse(localStorage.getItem("sales")) || [];

    sales.push({
      id: invoiceIdEl.innerText,
      date: dateInput.value,
      items: invoice,
      total: totalEl.innerText
    });

    localStorage.setItem("sales", JSON.stringify(sales));

    alert("Facture sauvegardée 💗");
  });
}

});
