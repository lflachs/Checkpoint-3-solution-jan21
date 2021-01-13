const express = require('express');
const app = express();
const createError = require('http-errors');
const errorHandling = require('./middleware/error-handling.middleware');
const mainRouter = require('./routes');
const PORT = process.env.port || 8000;

app.use(express.json());
app.get('/', (req, res, next) => {
	const packageJson = require('./package.json');
	res
		.status(200)
		.json({ name: packageJson.name, version: packageJson.version });
});
app.use('/', mainRouter);
app.use('*', (req, res, next) => {
	next(createError(404));
});

app.use(errorHandling);

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`app is running on ${PORT}`);
	});
}

module.exports = app;
