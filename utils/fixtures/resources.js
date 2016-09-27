'use strict';

const uuid = require('node-uuid');
const populatePresets = require('../migrations').populatePresets;

const preset = () => ({
  path: uuid.v1(),
  mimetype: 'image/jpeg',
  extension: 'jpg'
});

const resources = [
  {
    // id 1
    // will be deleted because user updated image
    name: 'ecpImage.jpg'
  },
  {
    // id: 2
    // will be deleted because user deleted
    name: 'randomImage.jpg'
  },
  {
    // id: 3
    // will be deleted
    name: 'deleteImage.jpg'
  }
];

module.exports = populatePresets(resources, preset);