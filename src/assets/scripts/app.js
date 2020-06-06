let data = {};
const API_URL =
  "https://gist.githubusercontent.com/saintsfall/227de9692077c815e207a3ffbd7d01e8/raw/4a8ddba9938502fb43b788ecced3affa107000bb/products.json";

const shelfList = document.querySelector("[data-dynamic-values='shelfList']");
const modals = document.querySelectorAll(".modal");

// TEMPLATES
////////////////////////////////////////////////////////////////////////////////////
let productTemplate = ({ name, description, price, id }) => `
<li class="shelf__item">
  <div class="product-card">
    <span class="product-card__name">${name}</span>
    <img
      src="https://via.placeholder.com/160x120"
      title="product image"
      alt="product image"
      class="product-card__img"
    />
    <p class="product-card__description">
      ${description}
    </p>
    <strong class="product-card__price">R$${price.toFixed(2).replace(".", ",")}</strong>
    <button class="product-card__buy" data-action="buy" data-id="${id}">Comprar</button>
  </div>
</li>
`;

const productBuyTemplate = ({ name, description, price }) => `
  <h3>${name}</h3>
  <p>
    ${description}
  </p>
  <strong>R$${price.toFixed(2).replace(".", ",")}</strong>
`;
////////////////////////////////////////////////////////////////////////////////////

// MODAL HANDLERS
////////////////////////////////////////////////////////////////////////////////////
const openModal = ({ header, content, footer }) => {
  const modal = document.querySelector(".modal-buy .modal__content");
  modal.innerHTML = content;
};

const closeModal = () => {
  modals.forEach((modal) => modal.classList.remove("modal--show"));
};
////////////////////////////////////////////////////////////////////////////////////

// LOAD EVENTS
////////////////////////////////////////////////////////////////////////////////////
const loadEvents = () => {
  shelfList.addEventListener("click", function (e) {
    if (e.target.dataset.action === "buy") {
      document.querySelector(".modal-buy").classList.add("modal--show");

      const prod = data.products.find((product) => product.id == e.target.dataset.id);
      console.log(prod);
      openModal({
        content: productBuyTemplate(prod),
      });
    }
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target.dataset.action === "close") {
        closeModal();
      }
    });
  });
};
////////////////////////////////////////////////////////////////////////////////////

// RENDER
////////////////////////////////////////////////////////////////////////////////////
const renderProducts = (products) => {
  let productList = "";
  products.forEach((product) => (productList += productTemplate(product)));
  shelfList.innerHTML = productList;
};
////////////////////////////////////////////////////////////////////////////////////

// MAIN
////////////////////////////////////////////////////////////////////////////////////
async function app() {
  const res = await fetch(API_URL);
  data = await res.json();

  loadEvents();
  renderProducts(data.products);
}
////////////////////////////////////////////////////////////////////////////////////

app();
