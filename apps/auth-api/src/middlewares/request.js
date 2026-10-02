export const requestId = (req, res, next) => {
    const reqId =  crypto.randomUUID()
    res.setHeader("X-Request-Id", reqId);
    req.id = reqId;
    next()
}