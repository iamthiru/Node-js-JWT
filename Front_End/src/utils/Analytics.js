 import analytics, { firebase } from '@react-native-firebase/analytics';
import * as firebaseAPI from '../api/firebase';

class Analytics {
    static init() {
        if (firebase.app().utils().isRunningInTestLab) {
            analytics().setAnalyticsCollectionEnabled(false);
        } else {
            analytics().setAnalyticsCollectionEnabled(true);
        }
    }

    static onSignIn = async userObject => {
        const { id, email } = userObject;
        await Promise.all([
            analytics().setUserId((""+id)),
            // analytics().setUserProperty('email', email), // ←- DON'T DO THIS !!!
            this.logEvent("sign_in", {}, true)
        ]);
        firebaseAPI.onSignIn(userObject);
    };

    static onSignUp = async userObject => {
        const { id, email } = userObject;
        await Promise.all([
            analytics().setUserId(id),
            // analytics().setUserProperty('email', email), // ←- DON'T DO THIS !!!
            analytics().setUserProperty('created_at', new Date()),
            this.logEvent("sign_up")
        ]);
    };

    static setCurrentScreen = async (screenName, duration, startTime, endTime) => {
        await analytics().logScreenView({ screen_class: screenName, screen_name: screenName });
        firebaseAPI.setCurrentScreen(screenName, duration, startTime, endTime);
    };
    static setPatientInfo =async(id,name,dob,age,medicalRecordNumber,gender) =>{
        await firebaseAPI.setPatientInfo(id,name,dob,age,medicalRecordNumber,gender)
    }
    static setAssessmentData = async (id,patientId,date,impactScore,nrsScore,reminder)=>{
        await firebaseAPI.setAssessmentData(id,patientId,date,impactScore,nrsScore,reminder)
    }

    static logEvent = async (eventName, propertyObject = {}, skipFirebaseLogEvent = false) => {
        await analytics().logEvent(eventName, propertyObject);
        if(!skipFirebaseLogEvent) {
            firebaseAPI.logEvent(eventName, propertyObject);
        }
        
    }

    static onSignOut = async () => {
        await analytics().resetAnalyticsData();
    };
}

export default Analytics;