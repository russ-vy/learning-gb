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
  constructor(container = '.cart-list__products') {
    super(container)
    this.amount = 0
    this.countGoods = 0

    this.setup()
  }

  setup() {
    let timerID = setInterval(self => {
      if (document.querySelectorAll('.buy-btn')) {
        clearInterval(timerID);

        document.querySelector('.btn-cart').addEventListener('click', this.showSwitcher);
        document.querySelector('.back-hiden').addEventListener('click', this.showSwitcher);
        document.querySelectorAll('.buy-btn').forEach(el => el.addEventListener('click', aaa => this.addProduct(aaa)));
        document.querySelectorAll('.del-btn').forEach(el => el.addEventListener('click', zzz => this.removeProduct(zzz)));
      }
    }, 300)
  }

  getProducts() {
    return fetch(`${API}/getBasket.json`)
      .then(response => response.json())
      .then(data => {
        this.amount = data.amount
        this.countGoods = data.countGoods
        data = data.contents
        // console.log(data)
        return data
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const block = document.querySelector(this.container);

    this.sum();
    this.showCurrentCount();

    for (let product of this.goods) {
      if (product.id_product in this._allProducts) { continue }

      const productObject = new CartItem(product);

      this._allProducts[productObject.id] = productObject;

      block.insertAdjacentHTML('beforeend', productObject.getGoodHTML());
    }

    this.showCurrentAmount();
  }

  showCurrentAmount() {
    const block = document.querySelector('.cart-list__amount');

    if (this.amount > 0) {
      block.innerHTML = `<h4>${this.amount} \u20bd</h4>`;
    }
    else {
      block.innerHTML = '<h3> Добавьте товар в корзину! </h3>';
    }
  }

  showCurrentCount() {
    const subEl = document.querySelector('.btn-cart sup')
    if (this.countGoods > 0) {
      subEl.textContent = this.countGoods
    }
    else {
      subEl.textContent = ''
    }
  }

  sum() {
    this.amount = this.goods.reduce((sum, { price, quantity }) => sum + (price * quantity), 0);
    this.countGoods = this.goods.reduce((sum, { quantity }) => sum + quantity, 0);
  }

  showSwitcher() {
    document.querySelector('.back-hiden').classList.toggle('visible')
    document.querySelector('.cart-list').classList.toggle('visible')
  }

  addProduct(event) {
    fetch(`${API}/addToBasket.json`)
      .then(response => response.json())
      .then(data => {

        if (data.result == 1) {
          let ID = event.target.parentNode.parentNode.getAttribute('data-id');

          let findEl = this.goods.find(curEl => {
            return curEl ? curEl.id_product == ID : false
          });

          if (findEl) {
            findEl.quantity++;
            document.querySelector(`${this.container} [data-id="${ID}"] input`).value = findEl.quantity;
            this.sum();
            this.showCurrentCount();
            this.showCurrentAmount();
          }
          else {  // ! если такого товара еще нет в корзине
            let product = list.goods.find(curEl => {
              return curEl.id_product == ID
            });
            this.goods.push({
              id_product: product.id_product,
              product_name: product.product_name,
              price: product.price,
              quantity: 1,
            })
            this.render();
            this.addEventRemoveProduct(ID);
          }

          console.log(data.result, ID, findEl);
        }
        else {
          console.log('Error: Товар не добавлен!');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  removeProduct(event) {
    fetch(`${API}/deleteFromBasket.json`)
      .then(response => response.json())
      .then(data => {

        if (data.result == 1) {
          let product = event.target.parentNode.parentNode;
          let ID = product.getAttribute('data-id');
          for (let x in this.goods) {
            if (this.goods[x].id_product == ID) {
              // delete this.goods[x];
              this.goods.splice(x, 1);
              break;
            }
          }
          // delete this._allProducts[ID];
          this._allProducts.splice(ID, 1);
          product.remove();
          this.sum();
          this.showCurrentCount();
          this.showCurrentAmount();

          console.log(ID, this.goods, this._allProducts);
        }
        else {
          clonsole.log('Error: Удаление не выполнено!')
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addEventRemoveProduct(ID) {
    const tmID = setInterval(() => {
      let node = document.querySelector(`${this.container} [data-id="${ID}"] .del-btn`);
      if (node) {
        clearInterval(tmID);
        node.addEventListener('click', zzz => this.removeProduct(zzz));
      }
    }, 300)
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
                <input type="number" value="${this.quantity}" min="1" disabled>
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
