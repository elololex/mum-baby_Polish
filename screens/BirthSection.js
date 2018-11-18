import React from '../../Library/Caches/typescript/2.9/node_modules/@types/react';
import {Text, View, Button, AsyncStorage} from 'react-native';
import {StackNavigator} from "../../Library/Caches/typescript/2.9/node_modules/@types/react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from '../../Library/Caches/typescript/2.9/node_modules/@types/react-navigation';
import User from "../Data/User";
//const util = require('util');

export default class MaternityUnitsScreen extends React.Component {
	
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Maternity units',
        headerTitleStyle: {
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
    });
    componentDidMount(){
    	var user:User = require('../Data/User').default;
		var Analytics = require('../Data/Analytics').default;
        Analytics.hitPage('LabourAndBirth');
    }
    
    
    render(){
        var {navigate} =  this.props.navigation;
        return(
            <View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'white'
			  }}>
                <Text>Loadingscreen</Text>
                                    <Button
                        onPress = {
                            () => this.loadHomeScreen()

                        }
                        title = "Choose Hospital"
                    />
            </View>
        );

    }
    loadHomeScreen (){
        var {navigate} =  this.props.navigation;
		navigate("Third", {})
        
    }
    

}

