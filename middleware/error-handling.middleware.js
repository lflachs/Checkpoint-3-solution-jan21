module.exports = (err, req, res, next) => {
	err.status = err.status || 500;
	if (err.status === 500) {
		console.log(err);
	}
	if (process.env.NODE_ENV === 'production' && res.status === 500) {
		err.message = 'Something went wrong';
	}
	res.status(err.status).json({ message: err.message });
};
