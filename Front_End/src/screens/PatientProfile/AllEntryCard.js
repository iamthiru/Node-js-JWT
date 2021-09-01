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
    value: 'All',
    label: 'All',
  },
];


const AllEntryCard = ({allEntries}) => {
  const [sortedValue, setSortedValue] = useState('Most Recent');
  const {width, height} = useWindowDimensions();

  
  return (
    <View
      style={[
        styles.patientCardContainer,
        {
          height: height * 0.535,
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
     
      {
        Boolean(allEntries?.length) ?
        <>
       <View style={styles.allEntryTimeText}>
        <Text style={{paddingLeft: 10}}>Time</Text>
        <Text style={{paddingLeft: 20}}>IMPACT Score</Text>
      </View> 
      <AllEntryItemsData
        width={width}
        height={height}
        allEntries ={allEntries}
        sortedValue ={sortedValue}
      />
      </>
      :
      <Text style ={styles.noEntryText}>No Entries</Text>
}
    </View>
  );
};

export default AllEntryCard;
