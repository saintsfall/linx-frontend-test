// GLOBAL VARIABLES
const API_URL =
  "https://gist.githubusercontent.com/saintsfall/227de9692077c815e207a3ffbd7d01e8/raw/4a8ddba9938502fb43b788ecced3affa107000bb/products.json";
let data = {};
////////////////////////////////////////////////////////////////////////////////////

// BASKET
////////////////////////////////////////////////////////////////////////////////////
let basket = {
  $el: $(".basket"),
  productList: [],
  total: 0,
  renderProductList: function () {
    const basketProductListTemplate = this.productList.map(function ({ product, quantity }) {
      return `
      <li class="basket__item basket-product">
        <span class="basket-product__name">${product.name}</span>
        <span class="basket-product__quantity">(${quantity} ite${quantity > 1 ? "ns" : "m"})</span>
        <span class="basket-product__value">R$${adjustPrice(product.price * quantity)}</span>
        <button class="basket-product__remove" data-product-id="${product.id}">X</button>
      </li>
      `;
    });

    this.$el.find(".basket__list").html(basketProductListTemplate.join(""));
  },
  updateTotal: function () {
    let price = this.productList.map(function (element) {
      return element.product.price * element.quantity;
    });

    this.total = price.reduce(function (current, next) {
      return current + next;
    }, 0);

    this.$el.find(".basket__total").text(`R$${adjustPrice(this.total)}`);
  },
  updateStatus: function () {
    if (this.total) {
      let quantity = this.productList.length > 1 ? `${this.productList.length} produtos` : `1 produto`;
      this.$el.find(".basket__status").text(quantity);
    } else {
      this.$el.find(".basket__status").text("vazio");
    }
  },
  addProduct: function (product, quantity) {
    const hasProduct = this.productList.find(function (element) {
      return element.product.id === product.id;
    });

    if (hasProduct && hasProduct.quantity + parseInt(quantity) > product.stock) {
      // alert("Quantidade não disponivel no estoque");
      $(".error").addClass("visible");
      $(".error").text("Quantidade não disponivel em estoque");
      return;
    }

    if (hasProduct) {
      hasProduct.quantity += parseInt(quantity);
      $("span.error").removeClass("visible");
    } else {
      this.productList.push({
        product: product,
        quantity: parseInt(quantity),
      });
      closeModal();
      openModalById("message");
      $("span.error").removeClass("visible");
    }

    this.renderProductList();
    this.updateTotal();
    this.updateStatus();
  },
  removeProduct: function (id) {
    this.productList = this.productList.filter(function (element) {
      return element.product.id != id;
    });
    this.renderProductList();
    this.updateTotal();
    this.updateStatus();
  },
};
////////////////////////////////////////////////////////////////////////////////////

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
    <strong class="product-card__price">R$${adjustPrice(price)}</strong>
    <button class="product-card__buy" data-action="buy" data-product-id="${id}">Comprar</button>
  </div>
</li>
`;
const buyModalContentTemplate = ({ name, description, price }) => `
  <h3>${name}</h3>
  <p>
    ${description}
  </p>
  <strong>R$${adjustPrice(price)}</strong>
`;
const buyModalFooterTemplate = ({ id }) => `
  <form action="">
    <input type="text" name="quantity" placeholder="Informe a Quantidade" id="quantity" />
    <span class="error"></span>
    <button type="submit" data-product-id="${id}">COMPRAR</button>
  </form>
`;
const modalButtonsTemplate = (id) => `
  <button data-action="confirm" data-product-id="${id}">SIM</button><button data-action="cancel">NAO</button>
`;

////////////////////////////////////////////////////////////////////////////////////

// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////
const adjustPrice = (price) => {
  return price.toFixed(2).replace(".", ",");
};
const loadEvents = () => {
  // ADD PRODUCT
  $("[data-dynamic-values='shelfList']").on("click", '[data-action="buy"]', function () {
    const productId = $(this).attr("data-product-id");
    const product = data.products.find(function (element) {
      return parseInt(productId) === element.id;
    });
    openModalById("buy", {
      content: buyModalContentTemplate(product),
      footer: buyModalFooterTemplate(product),
    });
  });

  // ADD PRODUCT MODAL
  $('.modal[data-modal-id="modal-buy"]').on("submit", "form", function (e) {
    e.preventDefault();
    const quantity = $(this).find("#quantity").val();
    const id = $(this).find("button[type=submit]").data("product-id");
    const product = data.products.find(function (element) {
      return parseInt(id) === element.id;
    });

    if (!quantity || quantity.trim() === "") {
      $("span.error").addClass("visible");
      $("span.error").text("Por favor informe uma quantidade");
      return;
    }

    if (quantity > product.stock) {
      $("span.error").addClass("visible");
      $("span.error").text("Quantidade não disponivel em estoque");

      return;
    }

    basket.addProduct(product, quantity);
    $("span.error").removeClass("visible");
    $("span.error").text("");
  });

  // REMOVE PRODUCT HANDLER
  $('.modal[data-modal-id="modal-remove"]').on("click", "[data-action]", function () {
    if ($(this).attr("data-action") === "confirm") {
      basket.removeProduct($(this).attr("data-product-id"));
      closeModal();
    } else {
      closeModal();
    }
  });

  //REMOVE PRODUCT MODAL
  $(".basket").on("click", ".basket-product__remove", function () {
    const productId = $(this).attr("data-product-id");
    $(".modal__buttons").html(modalButtonsTemplate(productId));
    openModalById("remove", {});
  });

  // MODAL CLOSE
  $(".modal").on("click", '[data-action="close"]', function () {
    closeModal();
  });

  // BASKET CONTENT VISIBLE/HIDDEN
  $(".basket").on("click", function () {
    $(".basket__status").toggleClass("basket__status--open");
    $(".basket__content").toggleClass("basket__content--show");
  });

  // HEADER
  $(window).on("scroll", function () {
    if (window.pageYOffset > 115) {
      $(".header__container").addClass("shrink");
      $(".brand").addClass("shrink");
    } else {
      $(".header__container").removeClass("shrink");
      $(".brand").removeClass("shrink");
    }
  });
};
////////////////////////////////////////////////////////////////////////////////////

//RENDER
////////////////////////////////////////////////////////////////////////////////////
const renderProducts = (products) => {
  let productsHTML = "";
  products.forEach((product) => {
    productsHTML += productTemplate(product);
  });
  $("[data-dynamic-values='shelfList']").html(productsHTML);
};
////////////////////////////////////////////////////////////////////////////////////

// MODAL
////////////////////////////////////////////////////////////////////////////////////
const openModalById = (id, { content, footer } = {}) => {
  const modal = $(`[data-modal-id=modal-${id}]`);
  if (content) {
    modal.find(".modal__content").html(content);
  }
  if (footer) {
    modal.find(".modal__footer").html(footer);
  }
  modal.addClass("modal--show");
};

const closeModal = () => {
  $(".modal").removeClass("modal--show");
};
////////////////////////////////////////////////////////////////////////////////////

// INIT
////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  basket.updateStatus();
  $.ajax({
    dataType: "json",
    url: API_URL,
  }).done((res) => {
    data = res;
    loadEvents();
    renderProducts(data.products);
  });
});
////////////////////////////////////////////////////////////////////////////////////
