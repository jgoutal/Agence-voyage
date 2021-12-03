let pretty_date = function (date) {
    // convert date from sql to French date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    let str = date.toLocaleDateString('FR', options)
    return (str.slice(0,1).toUpperCase()+str.slice(1))
}

exports.pretty_date = pretty_date