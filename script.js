const categories = [
  "Savon","Lotion","Body Butter","Masque Cheveux","Sérum Cheveux","Sérum Visage"
];

const products = [
  {name:"Rose vanille", price:3000, category:"Savon"},
  {name:"Velours café", price:3000, category:"Savon"}
];

let invoice = [];

const catBox = document.getElementById("categories");
const prodBox = document.getElementById("products");
const invoiceBox = document.getElementById("invoice");
const totalEl = document.getElementById("total");

/* CATEGORIES */
categories.forEach(c=>{
  let div=document.createElement("div");
  div.className="category";
  div.innerText=c;
  div.onclick=()=>showProducts(c);
  catBox.appendChild(div);
});

/* PRODUCTS */
function showProducts(cat){
  prodBox.innerHTML="";

  products.filter(p=>p.category===cat).forEach(p=>{
    let div=document.createElement("div");

    div.innerHTML = `
      ${p.name} - ${p.price} FCFA
      <button onclick="addToCart('${p.name}',${p.price})">+</button>
    `;

    prodBox.appendChild(div);
  });
}

/* ADD */
function addToCart(name,price){

  let item = invoice.find(i=>i.name===name);

  if(item){
    item.qty++;
  } else {
    invoice.push({name,price,qty:1});
  }

  renderInvoice();
}

/* RENDER */
function renderInvoice(){

  invoiceBox.innerHTML="";
  let total=0;

  invoice.forEach(i=>{
    let t=i.qty*i.price;
    total+=t;

    let tr=document.createElement("tr");
    tr.innerHTML=`<td>${i.name}</td><td>${i.qty}</td><td>${t}</td>`;
    invoiceBox.appendChild(tr);
  });

  totalEl.innerText=total+" FCFA";
}
