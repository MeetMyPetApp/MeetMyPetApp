module.exports = (hbs) => {
    hbs.registerHelper('ifeq', function (arg1, arg2, options) {
        return (arg1.toString() == arg2.toString()) ? options.fn(this) : options.inverse(this);
    })

    hbs.registerHelper('ifneq', function (arg1, arg2, options) {
        return (arg1.toString() !== arg2.toString()) ? options.fn(this) : options.inverse(this);
    })
}

