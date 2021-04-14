import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: COLORS.GRAY_30,
        alignItems: "center",
        justifyContent: "center"
    },
    patientListMainView:{
            width: width,
            justifyContent: 'flex-start',
            alignItems: 'center',
    },
    secondMainView:{
        width: width * 0.9,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
      },
      mainLabelText:{
        color: COLORS.PRIMARY_MAIN,
        fontSize: 34,
        fontWeight: '300',
        lineHeight: 40,
      },
      addPatientView:{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.PRIMARY_MAIN,
        height: 20,
      },
      addPatientText:{
        color: COLORS.PRIMARY_MAIN,
        fontSize: 14,
        fontWeight: '700',
      },
      inputStyle:{
        width: width * 0.9,
        marginTop: 20,
      },
      dropDownView:{
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 20,
        marginBottom: 15,
      },
      dropDownTextStyle:{
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
      },
      dropDownLabelStyle:{
        fontSize: 12, 
        lineHeight: 24, 
        color: COLORS.GRAY_90, 
        marginHorizontal: 5,
      },
      dropDownPlaceHolder:{
        fontSize: 12,
        color: COLORS.GRAY_90,
      },
      dropDownContainer:{
        borderRadius: 20,
        borderColor: COLORS.PRIMARY_MAIN,
        minHeight: 30,
        width: 180,
        marginRight: 15,
      }

});

export default styles;