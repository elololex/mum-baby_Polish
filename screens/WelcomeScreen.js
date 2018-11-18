import React from 'react';
import {Text, View, AsyncStorage,Dimensions, Image, StyleSheet, Modal} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Footer, FooterTab } from 'native-base';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import CreateContent from '../Components/CreateContent';
import WelcomeCarousel from '../Components/WelcomeCarousel';
//const util = require('util');
import CodeInput from 'react-native-confirmation-code-input';

export default class WelcomeScreen extends React.Component {
	
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Welcome',
        headerTitleStyle: {
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
        header: null,
    });

    constructor(props){
        super(props)
    }
    async componentDidMount (){
        var Analytics = require('../Data/Analytics').default;
		    Analytics.hitPage('WelcomeScreen');

    }
    
    render(){
        var {navigate} =  this.props.navigation;
        const dimensions = Dimensions.get('window');
		const imageHeight = Math.round((dimensions.width) * 274 / 346);
		const imageWidth = dimensions.width;
        return(
            <View style={{
				flex: 1,
				backgroundColor: '#fff',
			  }}>
              
                <CreateContent slug = {"welcome-to-mum-baby"}/>  


                    <Footer style = {{backgroundColor:'#2CC4AA'}}>
                            <FooterTab style = {{backgroundColor:'#2CC4AA'}}>
                                <Button onPress={() => this.loadHomeScreen()} transparent iconRight>
                                    <View style={styles.footerbutton}>
                                    <View style={styles.footerImageContainer}>
                                    
                                    </View>
                                        <View style={styles.footerTextContainer}>
                                            <Text style = {styles.textStyle}>CONTINUE</Text>
                                        </View>
                                        <View style={styles.footerArrowContainer}>
                                            <Image
                                                source={require('../assets/images/white_arrow.png')}
                                                style={styles.footerArrowImage}
                                            />
                                        </View>
                                    </View>
                                </Button>
                            </FooterTab>
                    </Footer> 
            </View>
        );

    }
    loadHomeScreen (){

        var {navigate} =  this.props.navigation;
		navigate("Home", {})
        
    }
    

}
const styles = StyleSheet.create(
    {
        footerbutton: {
            backgroundColor:'#2CC4AA',
            flexGrow:1,
            flexDirection: 'row',
            width:null,
            alignItems: 'center',
            
          },
          footerImageContainer:{
            flex:1,
            alignItems: 'center',
            justifyContent:'center',
        },
        footerItemImage: {
            height:36,
            width:36,
          },
          footerTextContainer:{
            flex:4,
            alignItems: 'center',
            justifyContent:'center',
        },
        footerArrowContainer:{
            flex:1,
            alignItems: 'center',
            justifyContent:'center',
        },
        footerArrowImage: {
            height:14,
            width:8,
          },
       mainContainer:{
        flex:1, 
        backgroundColor: 'white',
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
          fontSize:16,

        }
    });
