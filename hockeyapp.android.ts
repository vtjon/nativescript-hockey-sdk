import * as application from "application";
import { Android, getInstance } from "./hockeyapp.common";

declare var net: any;

class HockeyAppAndroidPlugin implements Android {
  private initDone = false;

  constructor() {}

  init(): void {
    if (this.initDone) {
      console.log("HockeyAppAndroidPlugin already initialized");
      return;
    }

    if (!application.android) {
      return;
    }

    try {
      if (!net.hockeyapp.android.metrics.MetricsManager.getInstance()) {
        net.hockeyapp.android.metrics.MetricsManager.register(
          application.android.nativeApp
        );
        console.log("Registering Metrics Manager");
      }

      application.android.on(
        application.AndroidApplication.activityResumedEvent,
        activityEventData => {
          net.hockeyapp.android.CrashManager.register(
            activityEventData.activity
          );
        }
      );

      this.initDone = true;
    } catch (e) {
      console.error("Error during init of HockeyApp", e);
    }
  }

  trackEvent(eventName: string): void {
    if (!net.hockeyapp.android.metrics.MetricsManager.getInstance()) {
      console.warn(
        "Metrics manager is not initialized, event won't be tracked"
      );
      return;
    }
    if (!eventName || !/^[a-zA-Z0-9_. -]+$/.test(eventName)) {
      console.warn("Invalid event name, it may not appear in HockeyApp");
    }
    net.hockeyapp.android.metrics.MetricsManager.trackEvent(eventName);
  }

  showFeedback(takeScreenshot: boolean): void {
    // we assume that the manager was registered directly in the app
    if (takeScreenshot) {
      net.hockeyapp.android.FeedbackManager.setActivityForScreenshot(
        application.android.foregroundActivity
      );
      net.hockeyapp.android.FeedbackManager.takeScreenshot(
        application.android.foregroundActivity
      );
    }

    net.hockeyapp.android.FeedbackManager.showFeedbackActivity(
      application.android.foregroundActivity,
      null,
      null
    );
  }
}

/**
 * Create new singleton instance
 */
export const HockeyApp: Android = getInstance(HockeyAppAndroidPlugin);
