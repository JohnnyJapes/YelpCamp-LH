//extends error so you use super() to be able to access the parents functions/properties(Error in this case)
class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }

}

module.exports= ExpressError;