var config = require('../config');
var twilio = require('twilio');
var client = require('twilio')(config.accountSid, config.authToken);
var SurveyResponse = require('../models/SurveyResponse');
var Subscriber = require('../models/Subscriber');
var survey = require('../survey_data');
// add chron to set up monthly surveys

// Handle SMS submissions
module.exports = function(request, response) {
    var phone = request.body.From;
    var input = request.body.Body;

    // respond with message TwiML content
    function respond(message) {
        var twiml = new twilio.TwimlResponse();
        twiml.message(message);
        response.type('text/xml');
        response.send(twiml.toString());
    }

    // Try to find a subscriber with the given phone number
    Subscriber.findOne({
        phone: phone
    }, function(err, sub) {
        if (err) return respond('Derp! Please text back again later.');

        if (!sub) {
            // If there's no subscriber associated with this phone number,
            // create one
            var newSubscriber = new Subscriber({
                phone: phone
            });
            newSubscriber.subscribed = true;
            newSubscriber.save(function(err, newSub) {
                if (err || !newSub)
                    return respond('We couldn\'t sign you up - try again.');
            });
        }
    });

    // Check if there are any responses for the current number in an incomplete
    // survey response
    SurveyResponse.findOne({
        phone: phone,
        complete: false
    }, function(err, doc) {
        if (!doc) {
            var newSurvey = new SurveyResponse({
                phone: phone
            });
            newSurvey.save(function(err, doc) {
                // Skip the input and just ask the first question
                handleNextQuestion(err, doc, 0);
            });
        } else {
            // After the first message, start processing input
            SurveyResponse.advanceSurvey({
                phone: phone,
                input: input,
                survey: survey
            }, handleNextQuestion);
        }
    });

    // Ask the next question based on the current index
    function handleNextQuestion(err, surveyResponse, questionIndex) {
        var question = survey[questionIndex];
        var responseMessage = '';

        if (err || !surveyResponse) {
            return respond('Terribly sorry, but an error has occurred. ' + 'Please retry your message.');
        }

        // If question is null, we're done!
        if (!question) {
            Subscriber.findOne({
                phone: phone
            }, function(err, sub) {
                if (err) return respond('Derp! Please text back again later.');
                sub.surveys.push(surveyResponse._id);
                sub.save();
            });
            return respond('Done! You are awesome and your feedback is invaluable. Goodbye and Thanks!');
        }

        // Add a greeting if this is the first question
        if (questionIndex === 0) {
            responseMessage += 'Please take a moment to complete this quick survey! ';
        }

        // Add question text
        responseMessage += question.text;

        // Add question instructions for special types
        if (question.type === 'boolean') {
            responseMessage += ' Type "yes" or "no".';
        }

        // reply with message
        respond(responseMessage);
    }
};