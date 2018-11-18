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

class YourPregnancyScreen extends React.Component {
	
    
    static navigationOptions =({navigation, screenProps }) => ( {
      title: 'Your pregnancy',
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
                source={require('../assets/images/beforebirth_topicon.png')}
                style={{height:50, width:50}}
            />
      ),
    });
    componentDidMount(){
        /*console.log("navigation.state.key",this.props.navigation.state.routeName);
        if(this.props.navigation.state.routeName != "Main"){
        const resetAction = StackActions.reset({
            index: 0,
            key:null,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
            //actions: [NavigationActions.navigate({ routeName: 'MaternityUnits' })],
            //actions: [NavigationActions.navigate({ routeName: 'Main' })],
          });
          this.props.navigation.dispatch(resetAction);
        }*/
        var Analytics = require('../Data/Analytics').default;
		    Analytics.hitPage('YourPregnancyHome');
    }
   
     
    render(){
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        return (
            
                <View style={ styles.mainContainer}>
                    <CreateContent style={ styles.topView} slug = {"your-pregnancy"}/>
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
    Main:{screen:YourPregnancyScreen},
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
      
