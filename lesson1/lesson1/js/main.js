const products = [
  { id: 1, title: 'Notebook', price: 20000 },
  { id: 2, title: 'Mouse', price: 1500 },
  { id: 3, title: 'Keyboard', price: 5000 },
  { id: 4, title: 'Gamepad', price: 4500 },
];

const renderProduct = ({ title, price, img = "https://via.placeholder.com/250x300" }) => {
  return `<div class="product__item">
            <img src="${img}" alt="">
            <h3>${title}</h3>
            <p>${price}</p>
            <button class="btn-by">Добавить в корзину</button>
          </div>`;
};

const renderProducts = (list) => {
  const productList = list.map(item => renderProduct(item));
  // console.log(productList);
  productList.forEach(item => {
    document.querySelector('.products').insertAdjacentHTML('beforeend', item);
  });
};

renderProducts(products);
