const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const fileLocation = require('../utils/fileLocation');
const imagekit = require('../utils/ImageKit');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

exports.uploadPhoto = upload.single('photo');

exports.renamseUserImg = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('🚫 This route is not for password updates.', 400)
    );
  }

  const imgKit = await imagekit.upload({
    file: req.file.buffer,
    fileName: req.file.filename,
    folder: 'spotify/users',
  });

  const userData = {};
  if (req.body.name) userData.name = req.body.name;
  if (req.body.email) userData.email = req.body.email;
  if (imgKit.url) userData.img = imgKit.url;

  const user = await User.findByIdAndUpdate(req.user.id, userData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.becomeArtist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { role: 'artist' },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: user.role,
  });
});

exports.getArtist = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id).populate('songs');

  if (!artist || artist.role !== 'artist') {
    return next(new AppError('No artist found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: artist,
  });
});

exports.followArtist = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id);

  if (!artist || artist.role !== 'artist') {
    return next(new AppError('You can only follow artists', 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { followedArtists: req.params.id } },
    { runValidators: true, new: true }
  ).populate('followedArtists', 'name img role');

  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  user.followedArtists.map((artist) => {
    artist.img = `${serverUrl}public/users/${artist.img}`;
  });

  res.status(200).json({
    status: 'success',
    data: user.followedArtists,
  });
});

exports.unfollowArtist = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id);

  if (!artist || artist.role !== 'artist') {
    return next(new AppError('No artist found with that id', 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { followedArtists: req.params.id } },
    { runValidators: true, new: true }
  ).populate('followedArtists', 'name img role');

  res.status(200).json({
    status: 'success',
    data: user.followedArtists,
  });
});

exports.likeSong = catchAsync(async (req, res, next) => {
  const { song } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { likedSongs: song } },
    { runValidators: true, new: true }
  ).populate('likedSongs');

  res.status(200).json({
    status: 'success',
    songs: user.likedSongs,
  });
});

exports.dislikeSong = catchAsync(async (req, res, next) => {
  const { song } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { likedSongs: song } },
    { runValidators: true, new: true }
  ).populate('likedSongs');

  res.status(200).json({
    status: 'success',
    songs: user.likedSongs,
  });
});
