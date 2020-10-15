// ----------- product classes --------------------
class ProductList {
  #goods;

  constructor(container = '.products') {
    this.container = container;
    this.#goods = [];
    this._allProducts = [];

    this._fetchGoods();
    this.#render();
  }

  _fetchGoods() {
    this.#goods = [
      { id: 1, title: 'Notebook', price: 20000 },
      { id: 2, title: 'Mouse', price: 1500 },
      { id: 3, title: 'Keyboard', price: 5000 },
      { id: 4, title: 'Gamepad', price: 4500 },
    ];
  }

  #render() {
    const block = document.querySelector(this.container);

    for (let product of this.#goods) {
      const productObject = new ProductItem(product);

      this._allProducts.push(productObject);

      block.insertAdjacentHTML('beforeend', productObject.getGoodHTML());
    }
  }
}

class ProductItem {
  constructor(product, img = 'https://placehold.it/200x150') {
    this.title = product.title;
    this.price = product.price;
    this.id = product.id;
    this.img = img;
  }

  getGoodHTML() {
    return `<div class="product-item" data-id="${this.id}">
              <img src="${this.img}" alt="Some img">
              <div class="desc">
                  <h3>${this.title}</h3>
                  <p>${this.price} \u20bd</p>
                  <button class="buy-btn">Купить</button>
              </div>
            </div>`;
  }
}

const list = new ProductList();

// ----------- cart classes -----------------------
// === task1 ===
/*
  Классы корзины схожи с класами продуктов
  Например данные могут хранится в одноименных переменных
  но будут различия в методах получения и обработки данных
  Появятся новые методы. Например такие как оплата товара, оформление доставки
*/
class CartList extends ProductList {
  #goods;

  constructor(options) {
    super(options)
  }

  _fetch() {
    // получаем список товаров добавленных в корзину
    // появилось новое поле count
    this.#goods = [
      { id: 1, title: 'Notebook', price: 20000, count: 1 },
    ]
  }

  #render() { }
  // === task2 ===
  get totalCost() { // общая стоимость товаров
    if (this.#goods.length) {
      let total = 0;
      for (product of this.#goods) {
        total += product.price * product.count;
      }
      return total;
    }
    return 0;
  }

  sendToPay() {
    // оплата товара
  }
}
/**
 * CartItem еще больше походит на ProductItem и отличается только разметкой
 * т.к. кнопка купить отдельный товар нам не нужна
 * зато нужно количество 
 */
class CartItem extends ProductItem {
  constructor(options) {
    super(options)
    this.count = options.count
  }

  getGoodHTML() {
    return `<div class="cart-item" data-id="crt_${this.id}">
              <img src="${this.img}" alt="Some img">
              <div class="desc">
                  <h3>${this.title}</h3>
                  <p>${this.price} \u20bd</p>
                  <input type="number" min="1" value="${this.count}">
              </div>
            </div>`;
  }
}
// ------------------------------------------------
// const products = [
//   {id: 1, title: 'Notebook', price: 20000},
//   {id: 2, title: 'Mouse', price: 1500},
//   {id: 3, title: 'Keyboard', price: 5000},
//   {id: 4, title: 'Gamepad', price: 4500},
// ];
//
// const renderProduct = (item, img='https://placehold.it/200x150') => `<div class="product-item" data-id="${this.id}">
//               <img src="${img}" alt="Some img">
//               <div class="desc">
//                   <h3>${item.title}</h3>
//                   <p>${item.price} \u20bd</p>
//                   <button class="buy-btn">Купить</button>
//               </div>
//           </div>`;
//
// const renderProducts = list => {
// document.querySelector('.products').insertAdjacentHTML('beforeend', list.map(item => renderProduct(item)).join(''));
// };
//
// renderProducts(products);
