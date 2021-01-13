const client = require('../config/prismaClient');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const findAlbumById = async (id) => {
	const album = await client.album.findUnique({ where: { id } });
	if (!album) {
		throw createError(404, 'Album not found');
	}
	return album;
};
exports.getAllAlbums = asyncHandler(async (req, res, next) => {
	const albums = await client.album.findMany();
	res.status(200).json(albums);
});

exports.createAlbum = asyncHandler(async (req, res, next) => {
	const { title, genre, artist, picture } = req.body;
	const newAlbum = await client.album.create({
		data: { title, genre, artist, picture },
	});
	res.status(200).json(newAlbum);
});

exports.updateAlbum = asyncHandler(async (req, res, next) => {
	const { title, genre, artist, picture } = req.body;
	const albumId = Number(req.params.albumId);
	const updatedAlbum = await client.album.update({
		where: { id: albumId },
		data: { title, genre, artist, picture },
	});
	res.status(200).json(updatedAlbum);
});

exports.deleteAlbum = asyncHandler(async (req, res, next) => {
	const albumId = Number(req.params.albumId);
	const deletedAlbum = await client.album.delete({ where: { id: albumId } });
	res.status(200).json({ message: 'Deleted' });
});

exports.getAlbumById = asyncHandler(async (req, res, next) => {
	const albumId = Number(req.params.albumId);
	const album = await client.album.findUnique({
		where: { id: albumId },
		include: { tracks: true },
	});
	res.status(200).json(album);
});

exports.createSong = asyncHandler(async (req, res, next) => {
	const albumId = Number(req.params.albumId);
	const { title, youtubeUrl } = req.body;
	const newAlbum = await client.track.create({
		data: { title, youtubeUrl, album: { connect: { id: albumId } } },
	});
	res.status(200).json(newAlbum);
});

exports.getAllSongs = asyncHandler(async (req, res, next) => {
	const albumId = Number(req.params.albumId);
	const album = await findAlbumById(albumId);
	const songs = await client.track.findMany({
		where: { album: { id: album.id } },
	});
	res.status(200).json(songs);
});
exports.deleteSong = asyncHandler(async (req, res, next) => {
	const songId = Number(req.params.songId);
	const deletedSong = await client.track.delete({ where: { id: songId } });
	res.status(200).json(deletedSong);
});
exports.updateSong = asyncHandler(async (req, res, next) => {
	const { title, youtubeUrl } = req.body;

	const albumId = Number(req.params.albumId);
	const songId = Number(req.params.songId);

	await findAlbumById(albumId);
	const updatedSong = await client.track.update({
		where: { id: songId },
		data: { title, youtubeUrl },
	});
	res.status(200).json(updatedSong);
});
