class Hamburger {
    constructor(container = '.hamburger') {
        this.container = container
        this.components = []
        this.basic = []
        this.optional = []

        this._fetchComponents()
        this._render()
    }

    _fetchComponents() {
        this.components = document.querySelectorAll('input');
        this.basic = document.querySelectorAll('input[name="basic"]');
        this.optional = document.querySelectorAll('input[name="optional"]');
    }

    _render() {
        document.querySelector(this.container).onclick = () => { this._control }
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

    _control() {
        let isChecked = false;
        for (let el of this.basic) {
            if (el.checked) {
                isChecked = true
            }
        }

        this._visibleOptional(isChecked);
        this._message(isChecked);
    }

    _visibleOptional(isVisible) {
        for (let el of this.optional) {
            el.visible = isVisible
        }
    }
}

new Hamburger();