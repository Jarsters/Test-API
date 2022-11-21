const sharp = require('sharp');
const fs = require('fs');

const randInt = (min, max) => {
  // include min, exclude max
  return Math.floor(Math.random() * (max - min));
};

const generateName = (length) => {
  const alphabetics = `1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM`;

  let output = '';
  for (let i = 0; i < length; i++) {
    output += alphabetics[randInt(0, alphabetics.length)];
  }

  return output;
};

const validateImageExtension = (image) => {
  const filename = image.hapi.filename;

  if (!filename) {
    /* Kalo gaada file yang diupload dia true
       karena bakalan dikasih sama defaultnya.
    */
    return true;
  }

  const ext = filename.split('.').slice(-1).join('.');
  const validExt = ['png', 'jpg', 'jpeg'];
  for (let i = 0; i < validExt.length; i++) {
    if (validExt[i] === ext) return true;
  }
  return false;
};

const saveImage = (file, path) => {
  return new Promise((resolve, reject) => {
    const filename = file.hapi.filename;
    const ext = filename.split('.').slice(-1).join('.');
    const name = generateName(50);
    const data = file._data;

    const dataImage = {
      large: `${path}/${name}-large.${ext}`,
      small: `${path}/${name}-small.${ext}`,
    };

    const largePath = `./public/images/${dataImage.large}`;
    const smallPath = `./public/images/${dataImage.small}`;

    sharp(data).resize(800).toFile(largePath);

    sharp(data).resize(480).toFile(smallPath);

    resolve({ message: 'Data berhasil disimpan!', data: dataImage });
  });
};

const helperDeleteImage = (path) => {
  fs.unlink('./public/images/' + path, function (err) {
    if (err && err.code == 'ENOENT') {
      // File doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // Other errors, e.g. maybe we don't have enough permission
      console.error('Error occurred while trying to remove file');
    } else {
      console.info(`removed`);
    }
  });
};

const deleteSavedImage = (image_large, image_small) => {
  helperDeleteImage(image_large);
  helperDeleteImage(image_small);
};

module.exports = { saveImage, deleteSavedImage, validateImageExtension };
