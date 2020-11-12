class Hamburger {
    constructor(selector = '.btn') {
        this.selector = selector

        this._render()
    }

    _render() {
        document.querySelector(this.selector).addEventListener('click', event => this._control)
    }

    get total() {
        let totalCost = 0;
        let totalCalory = 0;
        for (let item of this.components) {
            if (item.checked) {
                totalCost += +item.getAtribute("data-price");
                totalCalory += +item.getAtribute("data-calory");
            }
        }
        return { totalCost: totalCost, totalCalory: totalCalory };
    }

    _message(err) {
        let message = 'Пожалуйста выберите начинку';
        if (!err) {
            message = `Стоимость гамбургера ${this.total.totalCost} руб.<br>Каллорийность ${this.total.totalCalory} ККал`
        }
        document.querySelector('.message').textContent = message
    }

    _control(event) {
        console.log(event.target);
        let isChecked = false;
        for (let el of this.basic) {
            if (el.checked) {
                isChecked = true
            }
        }

        this._visibleOptional(isChecked);
        this._message(isChecked);
    }

}

new Hamburger();