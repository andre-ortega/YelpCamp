// alternative to wrapping server code in try/catch
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}
