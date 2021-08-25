import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {DEFAULT_ENVIRONMENT_KEY, ENVIRONMENT} from '../constants/environment';

const FIREBASE_USER_EMAIL = 'mbaranikumar@bententech.com';
const FIREBASE_USER_PASSWORD = 'Bententech1';

let userId = 'unknown';
let userName = 'unknown';
let envKey = DEFAULT_ENVIRONMENT_KEY;
let path = '';

function incrementCount(path) {
  const reference = database().ref(path);

  return reference.transaction((count) => {
    if (count === null) return 1;
    return count + 1;
  });
}

function increaseCountAndDuration(path, duration, startTime, endTime) {
  database()
    .ref(path)
    .once('value')
    .then((snapshot) => {
      let value = snapshot.val();
      let data = {
        count: value && value.count ? value.count + 1 : 1,
        timeSpent:
          value && value.timeSpent ? value.timeSpent + duration : duration,
      };
      data.avgTimeSpent = data.timeSpent / data.count;
      database()
        .ref(path)
        .update(data)
        .then(() => {
          database()
            .ref(`${path}/inOutTime`)
            .update({
              [data.count - 1]: {
                inTime: new Date(startTime).toString(),
                outTime: new Date(endTime).toString(),
              },
            })
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

function setData(path, data, callbackFn) {
  database()
    .ref(path)
    .set(data)
    .then(() => {
      if (callbackFn) {
        callbackFn();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export const updateData = ({
  id,
  name,
  dob,
  age,
  medicalRecordNumber,
  gender,
}) => {
  let path = `/${ENVIRONMENT[envKey].ANALYTICS_DATA_ROOT}/${userName}/patients/${id}`;
  database()
    .ref(path)
    .update({
      id: id,
      name: name,
      dob: dob,
      age: age,
      medicalRecordNumber: medicalRecordNumber,
      gender: gender,
    })
    .then(() => {})
    .catch((err) => {
      console.log('update failed', err);
    });
};

export const removeData = (data) => {
  path = `/${ENVIRONMENT[envKey].ANALYTICS_DATA_ROOT}/${userName}/${data}`;
  if (path) {
    database()
      .ref(path)
      .remove()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }
};

export const doFirebaseSignIn = () => {
  auth()
    .signInWithEmailAndPassword(FIREBASE_USER_EMAIL, FIREBASE_USER_PASSWORD)
    .then(() => {
      console.log('Firebase user signed in!');
    })
    .catch((error) => {
      console.log('Firebase user signed in error: ', error);
    });
};

export const setUserId = (id) => {
  if (id) {
    userId = id;
  } else {
    userId = 'unknown';
  }
};

export const setUserName = (uname) => {
  if (uname) {
    userName = uname;
  } else {
    userName = 'unknown';
  }
};

export const setEnvKey = (key) => {
  envKey = key;
};

export const onSignIn = (userObject) => {
  const {id, email} = userObject;
  setUserId(id);
  setUserName(email);
  setData(
    `/${ENVIRONMENT[envKey].ANALYTICS_DATA_ROOT}/${userName}/id`,
    userId,
    () => {
      logEvent('sign_in');
    },
  );
};
export const setPatientInfo = (
  id,
  name,
  dob,
  age,
  medicalRecordNumber,
  gender,
) => {
  setData(
    `/${ENVIRONMENT[envKey].ANALYTICS_DATA_ROOT}/${userName}/patientsDataList/${id}`,
    {id, name, dob, age, medicalRecordNumber, gender},
    () => {
      logEvent('patientInfo');
    },
  );
};
export const setAssessmentData = (
  id,
  patientId,
  date,
  impactScore,
  nrsScore,
  reminder,
) => {
  setData(
    `/${ENVIRONMENT[envKey].ANALYTICS_DATA_ROOT}/${userName}/assessment_data/${id}`,
    {id, patientId, date, impactScore, nrsScore, reminder},
    () => {
      logEvent('assessmentInfo');
    },
  );
};

export const setCurrentScreen = (screenName, duration, startTime, endTime) => {
  increaseCountAndDuration(
    `/${ENVIRONMENT[envKey].ANALYTICS_DATA_ROOT}/${userName}/screen_view/${screenName}`,
    duration,
    startTime,
    endTime,
  );
};

export const logEvent = (eventName, propertyObject = {}) => {
  incrementCount(
    `/${ENVIRONMENT[envKey].ANALYTICS_DATA_ROOT}/${userName}/events/${eventName}/count`,
  ).then((transaction) => {});
};
