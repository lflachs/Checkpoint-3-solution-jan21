const { Client } = require('pg');

const NodeEnvironment = require('jest-environment-node');
const { nanoid } = require('nanoid');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
require('dotenv').config();
const prismaBinary = './node_modules/.bin/prisma2';

class PrismaTestEnvironment extends NodeEnvironment {
	constructor(config) {
		super(config);
		// Generate a unique schema identifier for this test context
		this.schema = `test_${nanoid()}`;
		// Generate the mysql connection string for the test schema
		// test_2345jsak
		// baseUrl = postgres://whatever....
		// baseUrl = postgres://whatever..../test_2345jsak
		this.baseUrl = `${process.env.DB_SYSTEM}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/`;
		this.connectionString = `${process.env.DB_SYSTEM}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${this.schema}`;
	}

	async setup() {
		// Set the required environment variable to contain the connection string
		// to our database test schema
		process.env.DATABASE_URL = this.connectionString;
		this.global.process.env.DATABASE_URL = this.connectionString;

		// Run the migrations to ensure our schema has the required structure
		await exec(`${prismaBinary} migrate deploy --preview-feature`);

		return super.setup();
	}

	async teardown() {
		// Drop the schema after the tests have completed
		const client = new Client({
			connectionString: this.baseUrl,
		});

		await client.connect();
		await client.query(`drop database if exists "${this.schema}"`);
		await client.end();
	}
}

module.exports = PrismaTestEnvironment;
