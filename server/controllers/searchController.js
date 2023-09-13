const catchAsync = require('../utils/catchAsync');
const Song = require('../models/songModel');
const Playlist = require('../models/playlistModel');
const AppError = require('../utils/appError');

exports.searchSong = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  const songs = await Song.find({
    name: { $regex: name, $options: 'ix' },
  });

  if (songs.length === 0) return next(new AppError('No song found', 404));

  res.status(200).json({
    status: 'success',
    data: songs,
  });
});

exports.searchPlaylist = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  const playlists = await Playlist.find({
    name: { $regex: name, $options: 'ix' },
  });

  if (playlists.length === 0)
    return next(new AppError('No playlist found', 404));

  res.status(200).json({
    status: 'success',
    data: playlists,
  });
});
