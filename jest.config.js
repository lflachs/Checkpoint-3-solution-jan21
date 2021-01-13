const path = require('path');
const prismaTestEnv = require('./prisma/prisma-test-environment');
module.exports = {
	testEnvironment: path.join(__dirname, './prisma/prisma-test-environment.js'),
};
