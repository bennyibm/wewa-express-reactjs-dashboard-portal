enum HttpStatusCode{
    OK = 200,
    CREATED = 201,
    UPDATED = 202,
    UNAUTHORIZED = 401,
    FORBIDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    GONE_EXPIRED = 410,
    LOCKED = 423,
    SERVER_ERROR = 500,
    CANT_REACH = 600
}

export default HttpStatusCode