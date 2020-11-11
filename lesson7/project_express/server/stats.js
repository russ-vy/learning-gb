const moment = require('moment');
const fs = require('fs');

function stats (action, product) {
    // console.log(req);
    const content = {
        date: moment().format('DD.MM.YYYY, hh:mm:ss')
        ,action: action
        ,product: product
    }

    fs.appendFile('./log/stats.json', JSON.stringify(content, null, 4),'utf-8', err => {
        if (err) {
            console.log(err);
        }
    })
}

module.exports = stats;