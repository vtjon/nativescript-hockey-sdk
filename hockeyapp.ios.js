"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("platform");
var hockeyapp_common_1 = require("./hockeyapp.common");
var utils = require("utils/utils");
var APP_ID_KEY = "HockeyAppId";
var HockeyAppIOSPlugin = (function () {
    function HockeyAppIOSPlugin() {
        this.initDone = false;
        this.metricsManager = null;
        this.feedbackManager = null;
    }
    HockeyAppIOSPlugin.prototype.init = function (appId) {
        if (this.initDone) {
            console.log("HockeyAppIOSPlugin already initialized");
            return;
        }
        if (!platform_1.isIOS) {
            return;
        }
        try {
            if (!appId) {
                var mainBundle = utils.ios.getter(NSBundle, NSBundle.mainBundle);
                appId = mainBundle.infoDictionary.objectForKey(APP_ID_KEY);
            }
            if (!appId) {
                console.error("No HockeyApp app ID was found. Please set an entry in Info.plist with key " + APP_ID_KEY);
                return;
            }
            BITHockeyManager.sharedHockeyManager().configureWithIdentifier(appId);
            BITHockeyManager.sharedHockeyManager().startManager();
            BITHockeyManager.sharedHockeyManager().authenticator.authenticateInstallation();
            this.metricsManager = BITHockeyManager.sharedHockeyManager().metricsManager;
            this.feedbackManager = BITHockeyManager.sharedHockeyManager().feedbackManager;
            this.initDone = true;
        }
        catch (e) {
            console.error('Error during init of HockeyApp', e);
        }
    };
    HockeyAppIOSPlugin.prototype.trackEvent = function (eventName) {
        if (!this.metricsManager) {
            console.warn("Metrics manager is not initialized, event won't be tracked");
            return;
        }
        if (!eventName || !/^[a-zA-Z0-9_. -]+$/.test(eventName)) {
            console.warn("Invalid event name, it may not appear in HockeyApp");
        }
        this.metricsManager.trackEventWithName(eventName);
    };
    HockeyAppIOSPlugin.prototype.showFeedback = function (takeScreenshot) {
        if (!this.feedbackManager) {
            console.warn("Feedback manager is not initialized, feedback will not be shown");
            return;
        }
        this.feedbackManager.showFeedbackListView();
    };
    return HockeyAppIOSPlugin;
}());
exports.HockeyApp = hockeyapp_common_1.getInstance(HockeyAppIOSPlugin);
