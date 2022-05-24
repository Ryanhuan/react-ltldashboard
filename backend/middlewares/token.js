const jwt = require("jsonwebtoken");
const config = require("../config/token");

module.exports.accessToken = {

    createToken: (user) => {
        try {
            const nowTime = new Date().setSeconds(new Date().getSeconds());

            let expiredAt = new Date();
            expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtExpiration);

            const accessPayload = {
                guid: user.guid,
                email: user.email,
                iat: nowTime,
                exp: expiredAt.getTime()
            };
            const accessToken = jwt.sign(accessPayload, config.jwtKey);
            return accessToken;

        } catch (err) {
            return err.message;
        }
    },

    verifyToken: (token) => {
        var rtn = {};
        try {
            var decoded_accessToken;

            jwt.verify(token.accessToken, config.jwtKey, function (err, decoded) {
                if (err != null) {
                    rtn.result = false;
                    rtn.msg = "AccessToken_Is_Denied"
                    return rtn;
                } else {
                    decoded_accessToken = decoded;
                }
            });
            if ((decoded_accessToken.exp) > (new Date().getTime())) {
                rtn.result = true;
                rtn.msg = "AccessToken_Is_Access";
                rtn.decodeData=decoded_accessToken;
                return rtn;
            } else {
                rtn.result = false;
                rtn.msg = "AccessToken_Is_Expired";
                rtn.decodeData=decoded_accessToken;
                return rtn;
            }    
        } catch (err) {
            rtn.result = false;
            rtn.msg = err.message;
            return rtn;
        }
    }
};

module.exports.refreshToken = {

    createToken: (user) => {
        try {
            const nowTime = new Date().setSeconds(new Date().getSeconds());

            let expiredAt = new Date();
            expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

            const refreshTokenPayload = {
                guid: user.guid,
                iat: nowTime,
                exp: expiredAt.getTime()
            };
            const refreshToken = jwt.sign(refreshTokenPayload, config.jwtKey);
            return refreshToken;

        } catch (err) {
            return err.message;
        }
    },
    verifyToken: (token) => {
        var rtn = {};
        try {
            var decoded_refreshToken;
            jwt.verify(token.refreshToken, config.jwtKey, function (err, decoded) {
                if (err != null) {
                    rtn.result = false;
                    rtn.msg = "RefreshToken_Is_Denied"
                    return rtn;
                } else {
                    decoded_refreshToken = decoded;
                }
            });
            if ((decoded_refreshToken.exp) > (new Date().getTime())) {
                rtn.result = true;
                rtn.msg = "RefreshToken_Is_Access"
                rtn.decodeData=decoded_refreshToken;
                return rtn;
            } else {
                rtn.result = false;
                rtn.msg = "RefreshToken_Is_Expired";
                return rtn;
            }    
        } catch (err) {
            rtn.result = false;
            rtn.msg = err.message;
            return rtn;
        }
    }
};
