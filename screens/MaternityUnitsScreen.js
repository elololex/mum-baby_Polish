import React from 'react';
import {Text,TouchableOpacity, View, AsyncStorage, StyleSheet, Image} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Footer, FooterTab } from 'native-base';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import CreateContent from '../Components/CreateContent';
import DefaultContent from './DefaultContentScreen';
import HospitalPageScreen from './HospitalPageScreen';
import HomeScreen from './HomeScreen';
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
        drawerLabel: 'Maternity units',
        headerLeft: (
            
            <Button transparent 
            onPress={() => navigation.openDrawer()}>
              <Icon ios='ios-menu' android="md-menu" style={{fontSize: 30, color: 'white'}}/>
            </Button>
        ),
        headerRight: (
            
            <Image
                  source={require('../assets/images/hospital_topicon.png')}
                  style={{height:50, width:50}}
              />
        ),
    });
    constructor(props){
        super(props);
        this.state ={ isLoading: true, 
                        hospitalSelected:"0", 
                        hospitalContent:(<View></View>),hospitalFooter:(<View></View>)
						}
    }
    componentDidMount(){
        this.getMyHospital();
        console.log("Loaded state: ",this.props.navigation.state.routeName);
        var Analytics = require('../Data/Analytics').default;
		    Analytics.hitPage('ExploringMaternityUnits');
        //this.props.navigation.setParams({replacementTitle: jsonData.title.rendered});
    }
    async getMyHospital(currentPage) {
        try {
        	console.log("try get title: " + currentPage);
			const value = await AsyncStorage.getItem('@MyHospital:key');
            const pageSlug = value;
            let hospitalContent;
            let hospitalFooter;
            if(pageSlug !== null){
                hospitalContent = (
                <View style={ styles.mainContainer}>
                    <CreateContent style={styles.topView} slug = {pageSlug}/>
                    
                </View>
                );
                hospitalFooter = (
                <Footer style = {{backgroundColor:'#2CC4AA'}}>
                            <FooterTab style = {{backgroundColor:'#2CC4AA'}}>
                                <Button onPress={() => this.resetHospital()} transparent iconRight>
                                    <View style={styles.footerbutton}>
                                    <View style={styles.footerImageContainer}>
                                    
                                    </View>
                                        <View style={styles.footerTextContainer}>
                                            <Text style = {styles.textStyle}>CHANGE MATERNITY UNIT</Text>
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
            );
            }
            else{
                hospitalContent = (
                <View style={ styles.mainContainer}>
                    <CreateContent style={styles.topView} slug = {"maternity-units"}/>
                     
                </View>
                    );
                hospitalFooter = (
                        <Footer style = {{backgroundColor:'#2CC4AA'}}>
                        <FooterTab style = {{backgroundColor:'#2CC4AA'}}>
                            <Button onPress={() => this.gotoSelection()} transparent iconRight>
                                
                                <View style={styles.footerbutton}>
                                <View style={styles.footerImageContainer}>
                                
                                </View>
                                    <View style={styles.footerTextContainer}>
                                        <Text style = {styles.textStyle}>FIND A MATERNITY UNIT</Text>
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
                    );
                
            }
            this.setState({hospitalSelected: pageSlug, hospitalContent: hospitalContent, hospitalFooter: hospitalFooter});
            this.forceUpdate();
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }
     
    render(){
        console.log("Current hospital selected: "+this.state.hospitalSelected);
        hospitalContent = this.state.hospitalContent;
        return (
            <View style={ styles.mainContainer}>
            {hospitalContent}
            {this.state.hospitalFooter}
            </View>
                
        );
    }
    gotoSelection (){
        //console.log("Screen to:" + this.state.slug);
        var Analytics = require('../Data/Analytics').default;
        Analytics.hitEvent('MaternityUnit','exploring','');
        const {push} =  this.props.navigation;
        push("DefaultContent", {replacementTitle: "Hospital maternity units" , slug:"hospital-maternity-units"})
    }
    async resetHospital(){
        
        try {
            const {navigation} = this.props;
            const pageSlug = navigation.getParam('slug', 'NO-ID');
            var Analytics = require('../Data/Analytics').default;
            Analytics.hitEvent('MaternityUnit','changing from',global.myhospitalSlug);
            global.myhospitalSlug = null;
            //await AsyncStorage.setItem('@MyHospital:key', null);
            await AsyncStorage.removeItem('@MyHospital:key');
            console.log("save hospital selection");
            const {push} =  this.props.navigation;
            var {navigate} =  this.props.navigation;
            push("MaternityUnitsScreen");
          } catch (error) {
            // Error saving data
          }
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
/*export default createStackNavigator({
    Main:{screen:MaternityUnitsScreen},
    HospitalPage:{screen:HospitalPageScreen},
    DefaultContent:{screen:DefaultContent},
},
{
    headerMode: 'float',
  /* The header config from HomeScreen is now here */
 /* navigationOptions: ({navigation, screenProps }) => ({
    headerStyle: {
      backgroundColor: '#FA7E5B',
    },
    headerBackTitle: null,
    headerTintColor: '#fff',
    drawerLabel: 'Maternity units',
    headerMode: 'screen',
    headerTitleStyle: {
        fontFamily: 'Lato-Regular',
    }
  })
});*/
      