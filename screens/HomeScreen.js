import React from 'react';
import {Text, View, AsyncStorage,Image} from 'react-native';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions, NavigationActions, StackActions} from 'react-navigation';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import CreateContent from '../Components/CreateContent';
import SecondScreen from "./SecondScreen";
import ThirdScreen from "./ThirdScreen";
import User from "../Data/User";
import DefaultContent from './DefaultContentScreen';
//const util = require('util');



class HomeScreen extends React.Component {
	
    static navigationOptions =({navigation, screenProps }) => ( {
        headerTitle: 'Home',
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
            
            <View></View>
        ),
    });
    componentDidMount(){
		var Analytics = require('../Data/Analytics').default;
		Analytics.hitPage('Home');
    }
    
    render(){
        var {navigate} =  this.props.navigation;
        return(
            <View style={{
				flex: 1,
				backgroundColor: 'white'
			  }}>
                <CreateContent  slug = {"home-page"}/>     
            </View>
        );

    }
    
}
export default createStackNavigator({
    Main:{screen:HomeScreen},
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

