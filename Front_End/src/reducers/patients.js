import { PATIENT_ACTIONS } from "../constants/actions";

const initialState = {
    all: [
        {
            id: "1",
            name: 'Monika Baranikumar',
            time: '3:00 pm',
            dob: "03/12/1997",
            medicalNumber: '01232167',
            gender: 'female'
        },
        {
            id: "2",
            name: 'Vishal Kumar',
            time: '4:00 pm',
            dob: "03/12/2004",
            medicalNumber: '01232767',
            gender: 'male'
        },
        {
            id: "3",
            name: 'Sankar Kumar',
            time: '5:00 pm',
            dob: "03/12/1998",
            medicalNumber: '01232463',
            gender: 'male'
        },
        {
            id: "4",
            name: 'Priyanka Kumari',
            time: '6:00 pm',
            dob: "03/12/1991",
            medicalNumber: '01232498',
            gender: 'female'
        },
        {
            id: "5",
            name: 'Srishti Srivastav',
            time: '7:00 pm',
            dob: "03/12/1992",
            medicalNumber: '01232489',
            gender: 'female'
        },
    ]
}

const patient = (state = initialState, action) => {
    switch (action.type) {
        case PATIENT_ACTIONS.ADD_PATIENT:
            return {
                ...state,
                all: [
                    ...state.all,
                    action.payload
                ]
            };
        default:
            return state;
    }
};

export default patient;