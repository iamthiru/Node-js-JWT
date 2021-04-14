import React, {useState} from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import styles from './styles';
import CustomDropDown from '../../components/shared/CustomDropDown';
import AllEntryItemsData from '../../components/AllEntriesItems/AllEntryItemsData';
import {COLORS} from '../../constants/colors';

const data = [
  {
    key: 1,
    value: 'Most Recent',
    label: 'Most Recent ',
  },
  {
    key: 2,
    value: 'Recent',
    label: 'Recent',
  },
  {
    key: 2,
    value: 'Alphabetical',
    label: 'Alphabetical',
  },
];


const AllEntryCard = ({entriesData}) => {
  const [sortedValue, setSortedValue] = useState('Most Recent');
  const {width, height} = useWindowDimensions();

  
  return (
    <View
      style={[
        styles.patientCardContainer,
        {
          maxHeight: height * 0.535,
        },
      ]}>
      <View style={styles.allEntriesMainView}>
        <Text style={styles.allEntryText}>All Entries</Text>

        <CustomDropDown
          TextStylle={styles.textStyle}
          caretdown="caretdown"
          labelText="Sort By :"
          arrow={true}
          items={data}
          value={sortedValue}
          placeholderStyle={{
            fontWeight: 12,
          }}
          labelStyle={styles.dropDownLabel}
          onChangeValue={(item) => setSortedValue(item.value)}
          containerStyle={styles.containerStyle}
        />
      </View>
      <View style={styles.allEntryTimeText}>
        <Text style={{paddingLeft: 10}}>Time</Text>
        <Text style={{paddingLeft: 20}}>IMPACT Score</Text>
      </View>
      <AllEntryItemsData
        entriesData={entriesData}
        width={width}
        height={height}
      />
    </View>
  );
};

export default AllEntryCard;
