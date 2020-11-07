Vue.component('search', {
    data() {
        return {
            userSearch: '',
        }
    },
    methods: {
        filterProducts() {
            this.$root.$refs.products.filter();
        }
    },
    template: `
        <form action="#" class="search-form" @submit.prevent="filterProducts()">
            <input type="text" class="search-field" v-model="userSearch">
            <button class="btn-search" type="submit">
                <i class="fas fa-search"></i>
            </button>
        </form>
    `
});