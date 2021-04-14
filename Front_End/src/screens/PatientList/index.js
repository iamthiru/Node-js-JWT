import React, {useState} from 'react';
import {View, Text, SafeAreaView, Dimensions} from 'react-native';
import Footer from '../../components/Footer';
import CustomDropDown from '../../components/shared/CustomDropDown';
import CustomTextInput from '../../components/shared/CustomTextInput';
import {sortByListOptions} from '../../constants/AssignPatientConstants';
import NewPatientPopUp from '../HomeScreen/NewPatientPopUp';
import AllPatientList from '../../components/SectionListPatient';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import styles from './styles';

const PatientList = ({navigation}) => {
  const [searchString, setSearchString] = useState('');
  const [sortBy, setSortedBy] = useState('lastName');
  const [openNewPatient, setOpenNewPatient] = useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View style={styles.patientListMainView}>
        <View style={styles.secondMainView}>
          <Text style={styles.mainLabelText}>Patient List</Text>
          <CustomTouchableOpacity
            onPress={() => {
              setOpenNewPatient(true);
            }}
            style={styles.addPatientView}>
            <Text style={styles.addPatientText}>Add Patient</Text>
          </CustomTouchableOpacity>
        </View>

        <CustomTextInput
          placeholder="Search Name, DOB, medical number"
          inputStyle={styles.inputStyle}
          value={searchString}
          onChangeText={(text) => setSearchString(text)}
        />
        <View style={styles.dropDownView}>
          <CustomDropDown
            TextStylle={styles.dropDownTextStyle}
            labelStyle={styles.dropDownLabelStyle}
            caretdown="caretdown"
            labelText="Sort By :"
            arrow={true}
            arrowSize = {20}
            items={sortByListOptions}
            value={sortBy}
            placeholderStyle={styles.dropDownPlaceHolder}
            onChangeValue={(item) => setSortedBy(item.value)}
            containerStyle={styles.dropDownContainer}
          />
        </View>
      </View>
      <AllPatientList
        sortBy={sortBy}
        searchString={searchString}
        moveUp={true}
      />
      <NewPatientPopUp
        open={openNewPatient}
        onClose={() => {
          setOpenNewPatient(false);
        }}
      />

      <Footer marginBottom={-5} />
    </SafeAreaView>
  );
};

export default PatientList;
