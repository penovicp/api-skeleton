'use strict';

const _ = require('lodash');
const Promise = require("bluebird");

const validator = require('../../middleware/validator');
const services = require('../../models/services');

const validate = {
	create: validator.validation(
		'body', {
			rules   : {
				count       : { type: 'positive' },
				prefix      : { type: 'norule' },
				suffixLength: {
					type  : 'positive',
					length: { min: 4 }
				},
				suffixType  : { type: ['alpha', 'alpha-num'] }
			},
			required: ['count', 'suffixType']
		}
	)
};

function create(req, res, next) {

	services.user.getById(req.params.userId)
		.then(
			user => _generate(user, [], req.body)
				.timeout(30000)
				.then(
					(passcodes) => services.passcode.bulkCreate(_mapPasscodes(user, passcodes))
						.then(
							(passcodes) => {
								res.status(201);
								res.locals = passcodes;
								next();
							}
						)
						.catch(err => next(err))
				)
				.catch(err => next(err))
		)
		.catch(err => next(err));
}

//TODO: ovo treba u servis prebacit
const optionsDefault = {
	count       : 1,
	prefix      : '',
	suffixLength: 4,
	suffixType  : 'alpha'
};

function _generate(user, passcodes, options = optionsDefault) {
	const deferred = Promise.defer();

	const neededCount = options.count - passcodes.length;
	if (neededCount <= 0) {
		deferred.resolve(passcodes);
	}

	options.count = neededCount;
	const testPasscodes = _createPasscodes(options);
	const validCandidatePasscodes = _.difference(testPasscodes, passcodes);

	services.passcode.listWithFilter(
		undefined,
		{
			code  : { $in: validCandidatePasscodes },
			userId: user.id + ''//TODO ask about this hack
		}
	)
		.then(
			(existing) => {
				if (existing.count > 0) {
					const existingPasscodes = _.map(existing.rows, (row) => row.code);
					const validPasscodes = _.difference(validCandidatePasscodes, existingPasscodes);

					_generate(user, _.concat(passcodes, validPasscodes), options)
						.then((newPasscodes) => deferred.resolve(newPasscodes))
						.catch(err => deferred.reject(err));
				} else {
					deferred.resolve(_.concat(passcodes, validCandidatePasscodes));
				}
			}
		)
		.catch(err => deferred.reject(err));

	return deferred.promise;
}

function _createPasscodes(options) {

	const passcodes = [];

	while (passcodes.length < options.count) {
		const passcode = _createPasscode(options);
		if (!_.includes(passcodes, passcode)) {
			passcodes.push(passcode);
		}
	}

	return passcodes;
}

const alphaDictionary = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphaNumericDictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function _createPasscode(options) {
	switch (options.suffixType) {
		case 'alpha-num':
			return options.prefix + _generateRandom(options.suffixLength, alphaNumericDictionary);
		default:
			return options.prefix + _generateRandom(options.suffixLength, alphaDictionary);
	}
}

function _generateRandom(length, dictionary) {
	const sample = _.times(length, () => _.sample(dictionary));
	return sample.join('');
}

function _mapPasscodes(user, passcodes) {
	return _.map(
		passcodes, (passcode) => {
			return {
				userId: user.id,
				code  : passcode
			};
		}
	);
}

module.exports = {
	create  : create,
	validate: validate
};
