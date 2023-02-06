/* eslint-disable no-mixed-operators */
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const STREAMS = [
  {
    'token': 'dabble-radio-1',
    'url': 'https://radios.digital:8006/stream',
    'metadata': {
      'title': '90 FM Blumenau',
      'subtitle': 'Música boa sem parar!',
      'art': {
        'sources': [
          {
            'contentDescription': 'Dabble Radio',
            'url': 'https://www.90fmblumenau.com.br/media/img/logo.png',
            'widthPixels': 158,
            'heightPixels': 76,
          },
        ],
      },
      'backgroundImage': {
        'sources': [
          {
            'contentDescription': 'Dabble Radio',
            'url': 'hhttps://www.90fmblumenau.com.br/uploads/banners/90FM-Banner-LadyGaga.png',
            'widthPixels': 811,
            'heightPixels': 244,
          },
        ],
      },
    },
  },
];

const PlayStreamIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (
        handlerInput.requestEnvelope.request.intent.name === 'PlayStreamIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOnIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOnIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
      );
  },
  handle(handlerInput) {
    const stream = STREAMS[0];

    handlerInput.responseBuilder
      .speak(`bem vindo a rádio ${stream.metadata.title}`)
      .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, stream.token, 0, null, stream.metadata);

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'This skill plays an audio stream when it is started. It does not have any additional functionality.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const AboutIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
    const speechText = 'This is an audio streaming skill that was built with a free template from skill templates dot com';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOffIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOffIntent'
      );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .speak(`obrigada pela sintonia!`)
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'PlaybackController.PauseCommandIssued'
      || handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const ExceptionEncounteredRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return true;
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(handlerInput.requestEnvelope.request.type);
    return handlerInput.responseBuilder
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    PlayStreamIntentHandler,
    PlaybackStartedIntentHandler,
    CancelAndStopIntentHandler,
    PlaybackStoppedIntentHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    ExceptionEncounteredRequestHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
