function addTimeStamp(req, res, next) {
	const requestTimestamp = new Date().toISOString();
	req.requestTimestamp = requestTimestamp;
	res.locals.requestTimestamp = requestTimestamp;
	res.setHeader('X-Request-Timestamp', requestTimestamp);
	next();
}

module.exports = addTimeStamp;
