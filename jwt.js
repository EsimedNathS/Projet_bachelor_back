const jwt = require('jsonwebtoken')
const jwtKey = 'exemple_cours_secret_key'
const jwtExpirySeconds = 36000

module.exports = (userAccountService) => {
    return {
        validateJWT(req, res, next) {
            if (req.headers.authorization === undefined) {
                res.status(401).end()
                return
            }
            const token = req.headers.authorization.split(" ")[1];

            jwt.verify(token, jwtKey, {algorithm: "HS256"},  async (err, user) => {

                if (err) {
                    return res.status(401).end()
                }
                console.log(user)
                try {
                    req.user = await userAccountService.dao.getById(user.id)
                    if (req.user == null){
                        return res.status(401).end()
                    }
                    res.status(200)
                    return next()
                } catch(e) {
                    console.log(e)
                    res.status(402).end()
                }

            })
        },
        generateJWT(id) {
            return jwt.sign({id}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            })
        }
    }
}
