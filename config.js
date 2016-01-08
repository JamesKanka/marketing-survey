module.exports = {
    // HTTP port
    port: process.env.PORT || 3000,

    // MongoDB connection string - MONGO_URL is for local dev,
    // MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
    mongoUrl: process.env.MONGOLAB_URI || process.env.MONGO_URL,

    // Your Twilio account SID and auth token, both found at:
	// https://www.twilio.com/user/account
	// 
	// A good practice is to store these string values as system environment
	// variables, and load them from there as we are doing below. Alternately,
	// you could hard code these values here as strings.
	accountSid: process.env.TWILIO_ACCOUNT_SID,
	authToken: process.env.TWILIO_AUTH_TOKEN,

	// A Twilio number you control - choose one from:
	// https://www.twilio.com/user/account/phone-numbers/incoming
	// Specify in E.164 format, e.g. "+16519998877"
	twilioNumber: process.env.TWILIO_NUMBER
};