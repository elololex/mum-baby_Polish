import React from 'react';
import {Text,TouchableOpacity, View, AsyncStorage, StyleSheet, Image} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import CreateContent from '../Components/CreateContent';
import DefaultContent from './DefaultContentScreen';
import MaternityUnitsScreen from './MaternityUnitsScreen';
import HospitalPageScreen from './HospitalPageScreen';
import FormScreen from './FormScreen';
// import AppointmentsScreen from './AppointmentsScreen';

//const util = require('util');

//screen
import AppointmentScreen from './AppointmentsScreen';
import AddAppointmentScreen from './appointment_stack/AddAppointment';
import ViewAppointmentScreen from './appointment_stack/ViewAppointments';
import EditAppointmentScreen from './appointment_stack/EditAppointment';
//const util = require('util');

class AfterYourBabyIsBornScreen extends React.Component {
	
    
    static navigationOptions =({navigation, screenProps }) => ( {
      title: 'After you baby is born',
      headerTitleStyle: {
        fontFamily: 'Lato-Regular',
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
        headerLeft: (
            
            <Button transparent
            onPress={() => navigation.openDrawer()}>
              <Icon ios='ios-menu' android="md-menu" style={{fontSize: 30, color: 'white'}}/>
            </Button>
        ),
        headerRight: (
            
          <Image
                source={require('../assets/images/afterbirth_topicon.png')}
                style={{height:50, width:50}}
            />
      ),
    });
    componentDidMount(){
      var Analytics = require('../Data/Analytics').default;
      Analytics.hitPage('AfterYouBabyIsBorn');
    }
   
     
    render(){
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        return (
            
                <View style={ styles.mainContainer}>
                    <CreateContent style={ styles.topView} slug = {"after-your-baby-is-born"}/>
                </View>
        );
    }
}
const styles = StyleSheet.create(
    {
       mainContainer:{
        flex:1, 
        backgroundColor: '#fff',
       },
       topView:{
        height: 70,
        flex:1, 
       },
        bottomView:{
     
          width: '100%', 
          height: 70, 
          backgroundColor: '#808080', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          flex:1, 
        },
     
        textStyle:{
        fontFamily: 'Lato-Regular',
          color: '#fff',
          fontSize:16
        }
    });
export default createStackNavigator({
    Main:{screen:AfterYourBabyIsBornScreen},
    DefaultContent:{screen:DefaultContent},
    MaternityUnits:{screen:createStackNavigator({
        MaternityUnitsScreen : {
          screen:MaternityUnitsScreen,
            navigationOptions : ({navigation})=>({
            headerLeft: (
                <Button transparent
                onPress={() => navigation.goBack(null)}>
                  <Icon name="arrow-back" style={{fontSize: 30, color: 'white'}}/>
                </Button>
            ),    
            headerStyle: {
                backgroundColor: '#FA7E5B',
                
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Lato-Regular',
              }

          })
        },
        HospitalPage:{screen:HospitalPageScreen,
            navigationOptions : ({navigation})=>({
            headerLeft: (
                <Button transparent
                onPress={() => navigation.goBack(null)}>
                  <Icon name="arrow-back" style={{fontSize: 30, color: 'white'}}/>
                </Button>
            ),    
            headerStyle: {
                backgroundColor: '#FA7E5B',
                
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Lato-Regular',
              }

          })
        
        },
      }),
      navigationOptions: {
        header: null,
      }
    },
    Forms:{screen:FormScreen},
    Appointments:{screen:createStackNavigator({
        AppointmentScreen : {screen:AppointmentScreen,    navigationOptions : ({navigation})=>({
            headerLeft: (
                <Button transparent
                onPress={() => navigation.goBack(null)}>
                  <Icon name="arrow-back" style={{fontSize: 30, color: 'white'}}/>
                </Button>
            ),    
            headerStyle: {
                backgroundColor: '#FA7E5B',
                
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Lato-Regular',
              }

          })},
        AddAppointmentScreen : {screen:AddAppointmentScreen,    navigationOptions : ({navigation})=>({
            headerLeft: (
                <Button transparent
                onPress={() => navigation.goBack(null)}>
                  <Icon name="arrow-back" style={{fontSize: 30, color: 'white'}}/>
                </Button>
            ),    
            headerStyle: {
                backgroundColor: '#FA7E5B',
                
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Lato-Regular',
              }

          })},
        ViewAppointmentScreen : {screen:ViewAppointmentScreen,    navigationOptions : ({navigation})=>({
            headerLeft: (
                <Button transparent
                onPress={() => navigation.goBack(null)}>
                  <Icon name="arrow-back" style={{fontSize: 30, color: 'white'}}/>
                </Button>
            ),    
            headerStyle: {
                backgroundColor: '#FA7E5B',
                
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Lato-Regular',
              }

          })},
        EditAppointmentScreen : {screen:EditAppointmentScreen,   navigationOptions : ({navigation})=>({
            headerLeft: (
                <Button transparent
                onPress={() => navigation.goBack(null)}>
                  <Icon name="arrow-back" style={{fontSize: 30, color: 'white'}}/>
                </Button>
            ),    
            headerStyle: {
                backgroundColor: '#FA7E5B',
                
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Lato-Regular',
              }

          })}
    
    }),
        navigationOptions: {
            header: null,
          }
        }
},
{
    headerMode: 'float',
  /* The header config from HomeScreen is now here */
  navigationOptions: ({navigation, screenProps }) => ({
    headerStyle: {
      backgroundColor: '#FA7E5B',
    },
    headerBackTitle: null,
    headerTintColor: '#fff',
    headerMode: 'screen',
    headerTitleStyle: {
        fontFamily: 'Lato-Regular',
    }
  })
});
      