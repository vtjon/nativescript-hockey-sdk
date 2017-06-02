import {Observable} from 'data/observable';
import { HockeyApp } from 'nativescript-hockey-sdk';

export class HelloWorldModel extends Observable {
    constructor() {
        super();

    }

    public onTap() {
        // Test HockeyApp event tracking
        HockeyApp.trackEvent("DEMO TAP");
    }

    public onFeedback() {
        // Test HockeyApp event tracking
        HockeyApp.showFeedback(true);
    }
}