import React, { useEffect, useState } from 'react';
import {FlatList, View} from 'react-native';
import AllEntries from './AllEntries';

const AllEntryItemsData = ({

  width,
   height,
   allEntries,
   sortedValue
  }) => {
    const [allEntriesSortedList,setAllEntriesSortedList] = useState([])


    useEffect(()=>{

      if(sortedValue && allEntries && allEntries.length)
      {
       
        if(sortedValue !== 'All'){
          const allEntriesSortedData = allEntries.sort((item1,item2)=>new Date(item2.createdAt)- new Date(item1.createdAt))
          setAllEntriesSortedList(allEntriesSortedData)
        }
        else{
         setAllEntriesSortedList(allEntries)
         } 
        
      }
    },[allEntries,sortedValue])
  return (
      <FlatList
      data = {allEntriesSortedList || []}
      style={{
        marginBottom: 30
      }}
      nestedScrollEnabled
      keyExtractor = {(item) =>item?.id.toString()}
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
