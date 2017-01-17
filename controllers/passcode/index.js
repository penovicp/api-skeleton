'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const services = require('../../models/services');

const defaultSufixType = 'alpha';

const validate = {
  create: validator.validation('body', {
    rules: {
      count: { type: 'positive'}},
      prefix: { type: 'norule'},
      sufixLength: { type: 'positive', length: { min: 4 }},
      sufixType: { type: ['alpha', 'alpha-num']}
    },
    required: ['email', 'password']
  })
};

function _hasPasscode(userId, passcode){
  //create passcode
}

function createPasscodes(
  userId,
  options = {
    count: 1,
    prefix: '',
    sufixLength: 4,
    sufixType: defaultSufixType
  }
) {

  var passcodes = [];

  do {
    var passcode = createPasscode(userId, options)
    if(!_.includes(passcodes, passcode)){
      passcodes.push(passcode);
    }
  } while(passcodes.length <= options.count);

  return passcodes;
}

function createPasscode(userId, options){
  services.passcodes.
}

function create(req, res, next) {
  services.user.getById(
    req.params.userId
  ).then(user => {
    const passcodes....
    services.passcode.getExistingPasscodes({where : {code: ['....']}})
    .then(existing => REKURZIJA)
    services.passcode.doesNotExist({ where: { userId: user.id, code: 'nesto' }})
    .then( () => services.user.create(req.body))
    .then( user => services.emailConfirmation.createToken(user)
      .then( emailConfirmation => services.emailConfirmation.sendMail({
        email: user.email, token: emailConfirmation.token
      }))
      .then( () => {
        res.status(201);
        res.locals = user;
        next();
      })
    )
  )
  .catch(err => next(err));
}

module.exports = {
  create: create
};
