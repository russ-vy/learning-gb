const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Переделать в ДЗ не использовать fetch а Promise
let getRequest = (url, cb) => {
  new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          reject(xhr.response)
        } else {
          resolve(xhr.response)
        }
      }
    };
    xhr.send();
  })
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(err => {
      console.log(`Error!!! ${err}`);
    })
};

// getRequest(`${API}/catalogData.json`)

// –--------------------------------
class ProductList {
  constructor(container = '.products') {
    this.container = container;
    this.goods = [];
    this._allProducts = [];

    // this._fetchGoods();
    this.getProducts().then((data) => {
      this.goods = [...data];
      // this.goods = Array.from(data);
      this.render();
    });
  }

  // _fetchGoods() {
  //   getRequest(`${API}/catalogData.json`, (data) => {
  //     console.log(data);
  //     this.#goods = JSON.parse(data);
  //     this.#render();
  //     console.log(this.#goods);
  //   });
  // }

  getProducts() {
    return fetch(`${API}/catalogData.json`)
      .then(response => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  sum() {
    return this.goods.reduce((sum, { price }) => sum + price, 0);
  }

  render() {
    const block = document.querySelector(this.container);

    for (let product of this.goods) {
      const productObject = new ProductItem(product);

      this._allProducts.push(productObject);

      block.insertAdjacentHTML('beforeend', productObject.getGoodHTML());
    }
  }
}

class ProductItem {
  constructor(product, img = 'https://placehold.it/200x150') {
    this.title = product.product_name;
    this.price = product.price;
    this.id = product.id_product;
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
            </div>`
  }
}

const list = new ProductList();

// –--------------------------------
class CartList extends ProductList {
  constructor(container = '.cart-list') {
    super(container)
    this.amount = 0
    this.countGoods = 0
  }

  checkCountGoods() {
    const subEl = document.querySelector('.btn-cart sup')
    if (this.countGoods > 0) {
      subEl.textContent = this.countGoods
    }
    else {
      subEl.textContent = ''
      this.countGoods = 0
    }
  }

  getProducts() {
    return fetch(`${API}/getBasket.json`)
      .then(response => response.json())
      .then(data => {
        this.amount = data.amount
        this.countGoods = data.countGoods
        data = data.contents
        console.log(data)
        return data
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const block = document.querySelector(this.container);

    for (let product of this.goods) {
      const productObject = new CartItem(product);

      this._allProducts.push(productObject);

      block.insertAdjacentHTML('beforeend', productObject.getGoodHTML());
    }

    this.setup()
  }

  setup() {
    document.querySelector('.btn-cart').addEventListener('click', this.showSwitcher);
    document.querySelector('.back-hiden').addEventListener('click', this.showSwitcher);
    this.checkCountGoods();
    document.querySelectorAll('.buy-btn').forEach(el => el.addEventListener('click', this.addProduct))
    document.querySelectorAll('.del-btn').forEach(el => el.addEventListener('click', this.removeProduct))
  }

  showSwitcher() {
    document.querySelector('.back-hiden').classList.toggle('visible')
    document.querySelector('.cart-list').classList.toggle('visible')
  }

  addProduct(el) {
    fetch(`${API}/addToBasket.json`)
      .then(response => response.json())
      .then(data => {
        console.log(
          data.result
          , el.target.parentNode.parentNode.getAttribute('data-id')
        )
      })
      .catch((error) => {
        console.log(error);
      });
  }

  removeProduct(el) {
    fetch(`${API}/deleteFromBasket.json`)
      .then(response => response.json())
      .then(data => {
        console.log(
          data.result
          , el.target.parentNode.parentNode.getAttribute('data-id')
        )
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

class CartItem extends ProductItem {
  constructor(product, img = 'https://placehold.it/100x75') {
    super(product, img)
    this.quantity = product.quantity
  }

  getGoodHTML() {
    return `<div class="product-row" data-id="${this.id}">
              <div class="col1">
                <img src="${this.img}" alt="Some img">
              </div>
              <div class="col2">
                <h3>${this.title}</h3>
              </div>
              <div class="col3">
                <input type="number" value="${this.quantity}" min="1">
              </div>
              <div class="col4">
              <button class="del-btn">Удалить</button>
                </div>
              <div class="col5">
              <p>${this.price} \u20bd</p>
              </div>
            </div>`
  }
}

const cart = new CartList();
