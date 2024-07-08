"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "landingService",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		
		hello: {
			rest: {
				method: "GET",
				path: "/testing"
			},
			async handler() {
				return "Hello from the test service "
			}
		},

		welcome: {
			method : "POST",
			rest: "/welcome/test",
			params: {
				name: "string"
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		},

		callHelper:  {
			rest: {
				method : "POST",
				path : "/call/helper"
			},
			params : {
				testingQuery : "string"
			},
			async handler (ctx) {
				// now this is used to call the action that you have declared in any other service 
				const callAction = await ctx.call("helper.getRandomNum");
				
				return callAction 

			// 	const payload = `Modified in test service ${ctx.params.testingQuery}`
			// // this is used to send the message to a different service 
			// 	const emitResponse = await ctx.emit("helper.called" , payload);
			// 	this.logger.info(emitResponse)
			// 	return emitResponse;
			}
		},

		otpHandler : {
			rest : {
				method : "POST",
				path : "/otp/generate"
			},
			params : {
				username : "string"
			},
			async handler (ctx) {
				// this.logger.info("ctx in the test service api gateway " , ctx)
				const payload = ctx.params.username;
				console.log("payload in the test service " , payload);
				const callOtpHandler = await ctx.call("otp.generate" , payload);
				return callOtpHandler;
			}
		},

		validateOtp : {
			rest : {
				method : "POST",
				path :  "/otp/validate",
				},
			params : {
				username : "string",
				code : "string"
			},
			async handler (ctx) {
				const payload = {
					code : ctx.params.code,
					username : ctx.params.username
				};
				const callValidateOtpHandler = await ctx.call("otp.validate" , payload);
				return callValidateOtpHandler;
			}
			}
		},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
