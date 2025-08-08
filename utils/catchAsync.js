module.exports = fn =>{
    const handler = (req, res, next) =>{
        fn(req, res, next).catch(next);
    }
    return handler;
}