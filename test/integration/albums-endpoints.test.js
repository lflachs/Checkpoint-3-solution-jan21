const app = require('../../app');
const agent = require('supertest').agent(app);
const client = require('../../config/prismaClient');

afterAll(async () => {
	await client.$disconnect();
});

describe('Album endpoints', () => {
	describe('User create, update and delete a album', () => {
		let album, song;
		it('1. as a user, I want to be able to create a new album', async () => {
			album = {
				title: 'Nevermind',
				genre: 'Rock',
				picture: 'http://sdfgdsas.com/cover.png',
				artist: 'Nirvana',
			};
			const response = await agent.post('/albums').send(album);
			expect(response.body).toMatchSnapshot();
			album.id = response.body.id;
		});
		it('2. as a user, I want to create and assign a song to an album.', async () => {
			song = {
				title: 'Come as you are',
				youtubeUrl: 'http://abc.com/12456',
			};
			const response = await agent
				.post(`/albums/${album.id}/songs`)
				.send(song)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.title).toBe(song.title);
			expect(response.body.id).toBe(1);
			expect(response.body.youtubeUrl).toBe(song.youtubeUrl);
			song.id = response.body.id;
		});
		it('3. as a user, I want to list all the songs from an album.', async () => {
			const response = await agent
				.get(`/albums/${album.id}/songs`)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.length).toBe(1);
			expect(response.body[0].id).toBe(song.id);
			expect(response.body[0].title).toBe(song.title);
		});
		it('4. User check the albums list', async () => {
			const response = await agent
				.get('/albums')
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.length).toBe(1);
			expect(response.body[0].id).toBe(album.id);
			expect(response.body[0].genre).toBe(album.genre);
			expect(response.body[0].picture).toBe(album.picture);
			expect(response.body[0].artist).toBe(album.artist);
		});
		it('5. User update an album', async () => {
			let modifiedAlbum = {
				title: 'Another album',
				genre: 'Classic',
				picture: 'http://lolcat.com/cover.png',
				artist: 'Some random cat',
			};
			const response = await agent
				.put(`/albums/${album.id}`)
				.send(modifiedAlbum)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.title).toBe(modifiedAlbum.title);
			expect(response.body.genre).toBe(modifiedAlbum.genre);
			expect(response.body.picture).toBe(modifiedAlbum.picture);
			expect(response.body.artist).toBe(modifiedAlbum.artist);
			album = response.body;
		});
		it('5. User update a song', async () => {
			let modifiedSong = {
				title: 'Another title',
				youtubeUrl: 'http://somethingElse/cover.png',
			};
			const response = await agent
				.put(`/albums/${album.id}/songs/${song.id}`)
				.send(modifiedSong)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.title).toBe(modifiedSong.title);
			expect(response.body.genre).toBe(modifiedSong.genre);
			expect(response.body.picture).toBe(modifiedSong.picture);
			expect(response.body.artist).toBe(modifiedSong.artist);
			song = response.body;
		});
		it('6. as a user, I want to delete a song.', async () => {
			const response = await agent
				.delete(`/albums/${album.id}/songs/${song.id}`)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body[0].title).toBe(song.title);
			expect(response.body[0].youtubeUrl).toBe(song.youtubeUrl);
		});
		it('7. User retrieve the album', async () => {
			const response = await agent
				.get(`/albums/${album.id}`)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.title).toBe(album.title);
			expect(response.body.genre).toBe(album.genre);
			expect(response.body.picture).toBe(album.picture);
			expect(response.body.artist).toBe(album.artist);
			expect(response.body.tracks).toBeDefined();
			expect(response.body.tracks[0].title).toBe(song.title);
			expect(response.body.tracks[0].youtubeUrl).toBe(song.youtubeUrl);
		});
		it('8. User delete an album', async () => {
			const response = await agent
				.delete(`/albums/${album.id}`)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.message).toBe('Deleted');
		});
		it("9. Album shouldn't be present after deletion", async () => {
			const response = await agent
				.get(`/albums`)
				.expect(200)
				.expect('Content-Type', /json/);
			expect(response.body.length).toBe(0);
		});
	});
	describe('User error handling', () => {
		it('1. User update a song with a wrong album id', async () => {
			const response = await agent
				.put('/albums/12345/songs/1')
				.expect(404)
				.expect('Content-Type', /json/);
			console.log(response.body);
			expect(response.body.message).toBe('Album not found');
		});
	});
});
