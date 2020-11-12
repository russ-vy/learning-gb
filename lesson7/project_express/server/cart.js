const add = (cart, req) => {
  cart.contents.push(req.body);
  return {
    newCart: JSON.stringify(cart, null, 4)
    ,product: {
      product_name: req.body.product_name
      ,id_product: req.body.id_product
    }
  }
};
const change = (cart, req) => {
  const find = cart.contents.find(el => el.id_product === +req.params.id);
  find.quantity += req.body.quantity;
  return {
    newCart: JSON.stringify(cart, null, 4)
    ,product: {
      product_name: find.product_name
      ,id_product: find.id_product
    }
  }
};
const del = (cart, req) => {
  const find = cart.contents.find(el => el.id_product === +req.params.id);
  find.quantity > 1 ? find.quantity-- : cart.contents.splice(cart.contents.indexOf(find), 1)
  return {
    newCart: JSON.stringify(cart, null, 4)
    ,product: {
      product_name: req.body.product_name
      ,id_product: req.body.id_product
    }
  }
};

module.exports = {
  add,
  change,
  del,
};
