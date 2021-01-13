const app = require('../../app');
const agent = require('supertest').agent(app);
const client = require('../../config/prismaClient');
const packageJson = require('../../package.json');

const createError = require('http-errors');

afterAll(async () => {
	await client.$disconnect();
});
describe('API Endpoints', () => {
	it('GET / should return the name of the project and the version', async () => {
		const response = await agent
			.get('/')
			.expect(200)
			.expect('content-type', /json/);
		expect(response.body).toMatchSnapshot();
	});
	it('GET /404 should return a status 404 with not found', async () => {
		const response = await agent
			.get('/404')
			.expect(404)
			.expect('content-type', /json/);
		expect(response.body).toBeDefined();
		expect(response.body.message).toBe(createError(404).message);
	});
});
