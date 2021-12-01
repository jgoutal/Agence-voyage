let jwt = require('jsonwebtoken')

exports.authentification = (req, res, next) => {
    try {
        let token = req.session.authorization.token
        let decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
        let clientId = decodeToken.clientId
        if (req.session.authorization.clientId !== clientId) {
            throw 'Invalid client ID'
        } else {
            req.session.currentclient = clientId
            next()
        }
    } catch {
        res.status(401)
        res.redirect('/login')
    }
}