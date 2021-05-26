import React, {useState, useEffect} from 'react';
import {View, Text, SectionList, useWindowDimensions} from 'react-native';
import {COLORS} from '../../constants/colors';
import Section from './Sections';
import {useSelector} from 'react-redux';
import {titles} from '../../constants/AssignPatientConstants';
import assignPatientStyles from '../../screens/AssignPatient/styles';

const AllPatientList = ({
  sortBy,
  painAssessment,
  searchString,
  moveUp,
  setShowPatient,
  setPatientData,
}) => {
  const recentPatients = useSelector(
    (state) => state?.allPatients?.all_patients,
  );

  const [sectionListData, setSectionList] = useState([]);
  const {width, height} = useWindowDimensions();
  const styles = assignPatientStyles({width, height, COLORS});

  useEffect(() => {
    const sortedList = [];

    const filteredAllPatient = recentPatients.filter((patient) =>
      JSON.stringify(patient?.first_name + ' ' + patient?.last_name).includes(
        searchString.toLowerCase(),
      ),
    );

    titles.forEach((section) => {
      const filteredData = filteredAllPatient.filter(
        (patient) => patient[sortBy]?.[0]?.toUpperCase() === section,
      );
      if (filteredData?.length) {
        sortedList.push({
          title: section,
          data: filteredData,
        });
      }
    });

    setSectionList(sortedList);
  }, [sortBy, recentPatients, searchString]);

  return (
    <View
      style={{
        shadowOffset: {height: 0, width: 0},
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 10,
        flex: 1,
        paddingBottom: moveUp ? 0 : 30,
      }}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sectionListData}
        keyExtractor={(item, index) => item + index}
        renderItem={(props) => (
          <Section
            items={props}
            setShowPatient={setShowPatient}
            setPatientData={setPatientData}
            painAssessment={painAssessment}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.titleText}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
};
export default AllPatientList;
