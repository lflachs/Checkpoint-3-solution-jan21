const {
	getAllAlbums,
	createAlbum,
	getAlbumById,
	updateAlbum,
	deleteAlbum,
	createSong,
	getAllSongs,
	updateSong,
} = require('../controller/album.controller');

const router = require('express').Router();

router.get('/', getAllAlbums);
router.post('/', createAlbum);
router.get('/:albumId', getAlbumById);
router.put('/:albumId', updateAlbum);
router.delete('/:albumId', deleteAlbum);

router.post('/:albumId/songs', createSong);
router.get('/:albumId/songs', getAllSongs);
router.delete('/:albumId/songs/:songId', getAllSongs);
router.put('/:albumId/songs/:songId', updateSong);

module.exports = router;
