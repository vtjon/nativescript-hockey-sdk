"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("application");
var hockeyapp_common_1 = require("./hockeyapp.common");
var HockeyAppAndroidPlugin = (function () {
    function HockeyAppAndroidPlugin() {
        this.initDone = false;
    }
    HockeyAppAndroidPlugin.prototype.init = function () {
        if (this.initDone) {
            console.log("HockeyAppAndroidPlugin already initialized");
            return;
        }
        if (!application.android) {
            return;
        }
        try {
            if (!net.hockeyapp.android.metrics.MetricsManager.getInstance()) {
                net.hockeyapp.android.metrics.MetricsManager.register(application.android.nativeApp);
                console.log("Registering Metrics Manager");
            }
            application.android.on(application.AndroidApplication.activityResumedEvent, function (activityEventData) {
                net.hockeyapp.android.CrashManager.register(activityEventData.activity);
            });
            this.initDone = true;
        }
        catch (e) {
            console.error("Error during init of HockeyApp", e);
        }
    };
    HockeyAppAndroidPlugin.prototype.trackEvent = function (eventName) {
        if (!net.hockeyapp.android.metrics.MetricsManager.getInstance()) {
            console.warn("Metrics manager is not initialized, event won't be tracked");
            return;
        }
        if (!eventName || !/^[a-zA-Z0-9_. -]+$/.test(eventName)) {
            console.warn("Invalid event name, it may not appear in HockeyApp");
        }
        net.hockeyapp.android.metrics.MetricsManager.trackEvent(eventName);
    };
    HockeyAppAndroidPlugin.prototype.showFeedback = function (takeScreenshot) {
        if (takeScreenshot) {
            net.hockeyapp.android.FeedbackManager.setActivityForScreenshot(application.android.foregroundActivity);
            net.hockeyapp.android.FeedbackManager.takeScreenshot(application.android.foregroundActivity);
        }
        net.hockeyapp.android.FeedbackManager.showFeedbackActivity(application.android.foregroundActivity, null, null);
    };
    return HockeyAppAndroidPlugin;
}());
exports.HockeyApp = hockeyapp_common_1.getInstance(HockeyAppAndroidPlugin);
