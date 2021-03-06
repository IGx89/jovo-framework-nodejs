import {HandleRequest, JovoRequest, TestSuite} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {GoogleAssistant} from "../src";
import {DialogflowResponse} from "jovo-platform-dialogflow";
import {GoogleActionResponse} from "../src/core/GoogleActionResponse";
import _get = require('lodash.get');


process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;

beforeEach(() => {
    app = new App();
    const ga = new GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});

describe('test ON_SIGN_IN', () => {

    test('test askForSignIn', async (done) => {

        app.setHandler({
            LAUNCH() {
                this.$googleAction!.askForSignIn('SignInContext');
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {
            const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

            const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual(
                 {
                    "intent": "actions.intent.SIGN_IN",
                        "inputValueData": {
                        "@type": "type.googleapis.com/google.actions.v2.SignInValueSpec",
                            "optContext": "SignInContext"
                    }
                },
            );

            expect(_get(googleActionResponse, 'inputPrompt')).toEqual(
                {
                    "initialPrompts": [
                        {
                            "textToSpeech": "PLACEHOLDER_FOR_SIGN_IN"
                        }
                    ],
                    "noInputPrompts": []
                },
            );
            done();
        });
    }, 250);



    test('test correct type', async (done) => {

        app.setHandler({
            ON_SIGN_IN() {
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('SignInCancelled');
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('after.router', (handleRequest: HandleRequest) => {
            expect(handleRequest.jovo!.$type.type).toBe('ON_SIGN_IN');
            done();
        });
    }, 250);


    test('test correct isSignInCancelled', async (done) => {
        app.setHandler({
            ON_SIGN_IN() {
                expect(this.$googleAction!.isSignInCancelled()).toBe(true);
                expect(this.$googleAction!.getSignInStatus()).toBe('CANCELLED');
                done();
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('SignInCancelled');
        app.handle(ExpressJS.dummyRequest(launchRequest));
    }, 250);


    test('test correct isSignInOk', async (done) => {
        app.setHandler({
            ON_SIGN_IN() {
                expect(this.$googleAction!.isSignInOk()).toBe(true);
                expect(this.$googleAction!.getSignInStatus()).toBe('OK');
                //TODO: check for access token
                done();
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('SignInOk');
        app.handle(ExpressJS.dummyRequest(launchRequest));
    }, 250);
});


describe('test ON_PERMISSION', () => {
    test('test askForName', async (done) => {

        app.setHandler({
            LAUNCH() {
                this.$googleAction!.askForName('AskForNameContext');
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {
            const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

            const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual(
                {
                    "intent": "actions.intent.PERMISSION",
                    "inputValueData": {
                        "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
                        "optContext": "AskForNameContext",
                        "permissions": [
                            "NAME"
                        ]
                    }
                },
            );
            done();
        });
    }, 250);



    test('test askForName correct type ', async (done) => {

        app.setHandler({
            ON_PERMISSION() {
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('OnPermissionName');
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('after.router', (handleRequest: HandleRequest) => {
            expect(handleRequest.jovo!.$type.type).toBe('ON_PERMISSION');
            done();
        });
    }, 250);





    test('test askForPreciseLocation()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction!.askForPreciseLocation('AskForPreciseLocationContext');
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {
            const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

            const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual(
                {
                    "intent": "actions.intent.PERMISSION",
                    "inputValueData": {
                        "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
                        "optContext": "AskForPreciseLocationContext",
                        "permissions": [
                            "DEVICE_PRECISE_LOCATION"
                        ]
                    }
                },
            );
            done();
        });
    }, 250);


    test('test askForZipCodeAndCity()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction!.askForZipCodeAndCity('AskForZipCodeAndCityContext');
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {
            const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

            const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual(
                {
                    "intent": "actions.intent.PERMISSION",
                    "inputValueData": {
                        "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
                        "optContext": "AskForZipCodeAndCityContext",
                        "permissions": [
                            "DEVICE_COARSE_LOCATION"
                        ]
                    }
                },
            );
            done();
        });
    }, 250);

    test('test askForPermission()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction!.askForPermission(['NAME', 'DEVICE_COARSE_LOCATION'], 'AskForPermissionContext');
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {
            const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

            const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual(
                {
                    "intent": "actions.intent.PERMISSION",
                    "inputValueData": {
                        "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
                        "optContext": "AskForPermissionContext",
                        "permissions": [
                            "NAME",
                            "DEVICE_COARSE_LOCATION"
                        ]
                    }
                },
            );
            done();
        });
    }, 250);


    test('test askForPermission() without optContext', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction!.askForPermission(['NAME', 'DEVICE_COARSE_LOCATION']);
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {
            const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

            const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual(
                {
                    "intent": "actions.intent.PERMISSION",
                    "inputValueData": {
                        "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
                        "optContext": "",
                        "permissions": [
                            "NAME",
                            "DEVICE_COARSE_LOCATION"
                        ]
                    }
                },
            );
            done();
        });
    }, 250);

    test('test askForName correct type ', async (done) => {

        app.setHandler({
            ON_PERMISSION() {
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('OnPermissionName');
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('after.router', (handleRequest: HandleRequest) => {
            expect(handleRequest.jovo!.$type.type).toBe('ON_PERMISSION');
            done();
        });
    }, 250);

    test('test askForPreciseLocation correct type ', async (done) => {

        app.setHandler({
            ON_PERMISSION() {
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('OnPermissionPreciseLocation');
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('after.router', (handleRequest: HandleRequest) => {
            expect(handleRequest.jovo!.$type.type).toBe('ON_PERMISSION');
            done();
        });
    }, 250);


    test('test askForName for profile ', async (done) => {
        app.setHandler({
            ON_PERMISSION() {
                expect(this.$googleAction!.$user.hasNamePermission()).toBe(true);
                expect(this.$googleAction!.$user.getProfile()).toEqual({ displayName: 'John Doe', givenName: 'John', familyName: 'Doe' });
                done();
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('OnPermissionName');
        app.handle(ExpressJS.dummyRequest(launchRequest));

    }, 250);

    test('test askForPreciseLocation for precise location ', async (done) => {
        app.setHandler({
            ON_PERMISSION() {
                expect(this.$googleAction!.$user.hasPreciseLocationPermission()).toBe(true);
                expect(this.$googleAction!.getDevice()).toEqual({"location": {
                    "coordinates": {
                        "latitude": 37.4219806,
                            "longitude": -122.0841979
                    }
                }});
                done();
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('OnPermissionPreciseLocation');
        app.handle(ExpressJS.dummyRequest(launchRequest));

    }, 250);

});
