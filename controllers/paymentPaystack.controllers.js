require('dotenv').config();
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const msgClass = require('../errors/error');
const paymentPaystackService = require('../services/paymentPaystack.services');
const { doSomeAsyncMagik } = require('../utils/utils');
// const paymentPaystackModel = require('../models/paymentPaystack.models');

// createPage
const createPage = async (req, res) => {
	const {
		name,
		description,
		amount,
		slug,
		redirect_url = 'www.zulfahgroup.com',
	} = req.body;
	const createPageSchema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string(),
		amount: Joi.string(),
		slug: Joi.string(),
		redirect_url: Joi.string(),
	});
	try {
		const responseFromJoiValidation = createPageSchema.validate(req.body);
		console.log('im came from Joi:', responseFromJoiValidation);
		if (responseFromJoiValidation.error) {
			throw new Error('Bad request (Joi validation)');
		}
		const [err, CreateResponse] = await doSomeAsyncMagik(
			paymentPaystackService.createPageServices(req.body)
		);

		if (err) {
			throw new Error('Sorry, page cannot be created at this moment');
		}

		res.status(200).send({
			status: true,
			message: 'page successfully created',
			data: CreateResponse.data.data,
		});
	} catch (e) {
		res.status(400).send({
			status: false,
			message: e.message || msgClass.GeneralError,
		});
	}
};

// list page

const listPage = async (req, res) => {
	const perPage = parseInt(req.query.perPage) || 50;
	const page = parseInt(req.query.page) || 1;
	// const { page, perPage } = req.params;

	try {
		const [err, pageListResponse] = await doSomeAsyncMagik(
			paymentPaystackService.listPageServices(page, perPage)
		);
		if (err) {
			throw new Error(
				'We could not load this page at this. Kindly contact support'
			);
		}

		res.status(200).send({
			status: true,
			message: 'Transaction successfully initiated',
			data: pageListResponse.data.data,
		});
	} catch (e) {
		// console.log(`error: ${e.message}`)
		res.status(400).send({
			status: false,
			message: e.message || msgClass.GeneralError,
		});
	}
};

// updatePage
const updatePage = async (req, res) => {
	const { name, description, amount, active } = req.body;
	const { slug } = req.params;
	const createPageSchema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
		amount: Joi.string(),
		// slug: Joi.string(),
		active: Joi.boolean(),
	});
	try {
		const responseFromJoiValidation = createPageSchema.validate(req.body);
		console.log('from joi:=>', responseFromJoiValidation);
		if (responseFromJoiValidation.error) {
			throw new Error('Bad request (Joi validation)');
		}
		const [err, updatePageResponse] = await doSomeAsyncMagik(
			paymentPaystackService.updatePageServices(
				slug,

				{
					name,
					description,
					amount,
				}

				// active
			)
		);

		if (err) {
			console.log('herkr', err);
			throw new Error('Sorry, this page cannot be updated at this moment');
		}
		console.log('hello:', updatePageResponse.data.data),
			res.status(200).send({
				status: true,
				message: 'page successfully updated',
				data: updatePageResponse.data.data,
			});
	} catch (e) {
		res.status(400).send({
			status: false,
			message: e.message || msgClass.GeneralError,
		});
	}
};

// fetchPage
const fetchPage = async (req, res) => {
	// const { amount, paymentOptionType, email, phone, fullname, customer_id } = req.body
	const { id } = req.params;

	try {
		const [err, fetchPageResponse] = await doSomeAsyncMagik(
			paymentPaystackService.fetchPageServices(id)
		);
		if (err) {
			throw new Error(
				'We could not be able to fetch this details. Kindly contact support'
			);
		}

		res.status(200).send({
			status: true,
			message: 'Page successfully fetched',
			data: fetchPageResponse.data.data,
		});
	} catch (e) {
		// console.log(`error: ${e.message}`)
		res.status(400).send({
			status: false,
			message: e.message || msgClass.GeneralError,
		});
	}
};
// check for availability
const CheckSlugAvailability = async (req, res) => {
	// const { amount, paymentOptionType, email, phone, fullname, customer_id } = req.body
	const { slug } = req.params;

	try {
		const [err, CheckSlugAvailabilityResponse] = await doSomeAsyncMagik(
			paymentPaystackService.CheckSlugAvailabilityServices(slug)
		);
		if (err) {
			console.log('error i"m here: ', err);

			throw new Error(
				'sorry the slug Id details is already in use. Kindly contact support'
			);
		}

		res.status(200).send({
			status: true,
			message: 'slug Id details is available',
		});
	} catch (e) {
		// console.log(`error: ${e.message}`)
		res.status(400).send({
			status: false,
			message: e.message || msgClass.GeneralError,
		});
	}
};

// test
const test = async (req, res) => {
	// console.log('im here');
	try {
		const testResponse = await paymentPaystackService.testServices(req.body);
		console.log(`test response : ${testResponse}`);

		res.status(200).send({
			status: true,
			message: 'test successfully worked',
			data: testResponse,
		});
	} catch (e) {
		res.status(400).send({
			status: false,
			message: e.message || msgClass.GeneralError,
		});
	}
};

module.exports = {
	createPage,
	listPage,
	fetchPage,
	CheckSlugAvailability,
	test,
	updatePage,
};
