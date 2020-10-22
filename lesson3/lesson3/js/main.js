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
  #goods;

  constructor(container = '.products') {
    this.container = container;
    this.#goods = [];
    this._allProducts = [];

    // this._fetchGoods();
    this.#getProducts().then((data) => {
      this.#goods = [...data];
      // this.#goods = Array.from(data);
      this.#render();
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

  #getProducts() {
    return fetch(`${API}/catalogData.json`)
      .then(response => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  sum() {
    return this.#goods.reduce((sum, { price }) => sum + price, 0);
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
            </div>`;
  }
}

const list = new ProductList();

// –--------------------------------
class CartList extends ProductList {
  #goods;

  constructor() {
    super(container = '.cart-list');
    this.container = container;

    this.#getProducts().then((data) => {
      this.#goods = [...data];
      // this.#goods = Array.from(data);
      this.#render();
    });
  }

  #getProducts() {
    return fetch(`${API}/getBasket.json`)
      .then(response => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  #render() {
    // for (let product of this.#goods) {
    //   const productObject = new ProductItem(product);

    //   this._allProducts.push(productObject);

    let HTML = `<modal id='cart-modal'></modal> `;
    body.insertAdjacentHTML('beforeend', HTML);
    // }
  }

  open() {
    this.#render();
    // body.insertAdjacentHTML('beforeend', productObject.getGoodHTML());
  }
}

class CartItem extends ProductItem {

}

const cart = new CartList();
document.querySelector('.btn-cart').addEventListener('click', cart.open());