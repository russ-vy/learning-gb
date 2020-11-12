const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        products: [],
        imgCatalog: 'https://placehold.it/200x150',
        imgCart: 'https://placehold.it/50x100',
        searchLine: '',
        isVisibleCart: false,
        cartProducts: [],
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(item) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartProducts.find(product => product.id_product === item.id_product);
                        if (find) {
                            find.quantity++;
                        } else {
                            let product = {
                                id_product: item.id_product,
                                price: item.price,
                                product_name: item.product_name,
                                quantity: 1
                            };
                            this.cartProducts.push(product);
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        removeProduct(item) {
            this.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartProducts.find(product => product.id_product === item.id_product);

                        if (find.quantity > 1) { // если товара > 1, то уменьшаем количество на 1
                            find.quantity--;
                        } else { // удаляем
                            this.cartProducts.splice(this.cartProducts.indexOf(find), 1);
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        filter() {
            const regexp = new RegExp(this.searchLine, 'i');

            this.products.forEach(el => {
                el.isShow = this.searchLine == '' || regexp.test(el.product_name);
            })
        },
    },
    // computed: {

    // },
    // beforeCreate() {
    //     console.log('beforeCreate');
    // },
    created() {
        // console.log('created');
        this.getJson(`${API}${this.catalogUrl}`)
            .then(data => {
                for (el of data) {
                    el.isShow = true;
                    this.products.push(el);
                }
            })
    },
    // beforeMount() {
    //     console.log('beforeMount');
    // },
    // mounted() {
    //     console.log('mounted');
    // },
    // beforeUpdate() {
    //     console.log('beforeUpdate');
    // },
    // updated() {
    //     console.log('updated');
    // },
    // beforeDestroy() {
    //     console.log('beforeDestroy');
    // },
    // destroyed() {
    //     console.log('destroyed');
    // },
});
