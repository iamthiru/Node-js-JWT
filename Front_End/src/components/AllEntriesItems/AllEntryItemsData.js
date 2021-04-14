import React from 'react';
import {FlatList, View} from 'react-native';
import AllEntries from './AllEntries';

const AllEntryItemsData = ({entriesData, width, height}) => {
  return (
      <FlatList
      data = {entriesData}
      style={{
        marginBottom: 30
      }}
      nestedScrollEnabled
      keyExtractor = {(item) =>item.key}
      renderItem ={({item}) =>{
        return (
          <AllEntries
            data={item}
            width={width}
            height={height}
          />
        )
      }}
      />
  );
};
export default AllEntryItemsData;
