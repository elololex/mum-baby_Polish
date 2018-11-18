import React from 'react';
import {Text, View, AsyncStorage, Image} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Footer, FooterTab } from 'native-base';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import CreateContent from "../Components/CreateContent";
import DefaultContent from './DefaultContentScreen';
import FormScreen from './FormScreen';
import PDFScreen from './PDFScreen';
//const util = require('util');

class PersonalCarePlanScreen extends React.Component {
	
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Your personal care',
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
                  source={require('../assets/images/forms_topicon.png')}
                  style={{height:50, width:50}}
              />
        ),
    });
    componentDidMount(){
    	var Analytics = require('../Data/Analytics').default;
		Analytics.hitPage('PersonalCarePlansHome');
    }
    
    
    render(){
        var {navigate} =  this.props.navigation;
        return(
            <View style={{
				flex: 1,
				backgroundColor: 'white'
			  }}>
                <CreateContent  slug = {"personal-care-welcome-page"}/>    
            </View>
        );

    }
    
    

}
export default createStackNavigator({
    Main:{screen:PersonalCarePlanScreen},
    FormPage:{screen:FormScreen},
    PDFScreen:{screen:PDFScreen},
    DefaultContent:{screen:DefaultContent},
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

