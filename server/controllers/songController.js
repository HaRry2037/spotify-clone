const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Song = require('../models/songModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileLocation = require('../utils/fileLocation');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else if (file.mimetype.split('/')[0] === 'audio') {
    cb(null, true);
  } else {
    cb(new Error('Only images and audios are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

exports.uploadSongFiles = upload.fields([
  {
    name: 'song',
    maxCount: 1,
  },
  {
    name: 'img',
    maxCount: 1,
  },
]);

exports.resizeSongImg = catchAsync(async (req, res, next) => {
  if (!req.files.img) return next();

  req.files.img[0].filename = `img-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.files.img[0].buffer)
    .resize(520, 520)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/songs/${req.files.img[0].filename}`);

  next();
});

exports.saveSongFile = catchAsync(async (req, res, next) => {
  if (!req.files.song) return next();

  req.files.song[0].filename = `song-${req.user.id}-${Date.now()}.mp3`;
  fs.writeFileSync(
    `public/songs/${req.files.song[0].filename}`,
    req.files.song[0].buffer
  );

  next();
});

exports.getAllSongs = catchAsync(async (req, res, next) => {
  const songs = await Song.find({ artist: req.user.id });

  fileLocation(req, songs, 'songs', true, true);

  res.status(200).json({
    status: 'success',
    results: songs.length,
    data: {
      songs,
    },
  });
});

exports.getSong = catchAsync(async (req, res, next) => {
  await Song.findByIdAndUpdate(req.params.id, {
    $inc: { plays: 1 },
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.createSong = catchAsync(async (req, res, next) => {
  req.body.song = req.files.song[0].filename;
  req.body.img = req.files.img[0].filename;
  req.body.artist = req.user.id;

  if (!req.body.song || !req.body.img || !req.body.name) {
    return next(new AppError('👎 Something is missing', 400));
  }

  const song = await Song.create(req.body);

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  song.song = `${serverUrl}public/songs/${song.song}`;
  song.img = `${serverUrl}public/songs/${song.img}`;

  res.status(200).json({
    status: 'success',
    data: {
      song,
    },
  });
});

exports.updateSong = catchAsync(async (req, res, next) => {
  if (req.body.song)
    return next(new AppError('You can not update a song file', 400));

  const data = {};
  if (req.files.img) {
    data.img = req.files.img[0].filename;
  }
  if (req.body.name) data.name = req.body.name;

  const song = await Song.findByIdAndUpdate(req.params.id, data, {
    runValidators: true,
    new: true,
  });

  if (!song) return next(new AppError('No song found with given id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      song,
    },
  });
});

exports.deleteSong = catchAsync(async (req, res, next) => {
  const song = await Song.findByIdAndDelete(req.params.id);

  if (!song) return next(new AppError('No song found with given id', 404));

  fs.unlink(`public/songs/${song.song}`, (err) => console.log(err));
  fs.unlink(`public/songs/${song.img}`, (err) => console.log(err));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
