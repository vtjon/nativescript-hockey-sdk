export interface HockeyAppPlugin {
    init: Function;
    trackEvent(eventName: string): void;
    showFeedback(takeScreenshot: boolean): void;
}
export interface Android extends HockeyAppPlugin {
}
export interface IOS extends HockeyAppPlugin {
}
export declare function getInstance(T: new () => HockeyAppPlugin): HockeyAppPlugin;
