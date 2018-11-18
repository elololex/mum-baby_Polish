import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Alert} from 'react-native';
//const util = require('util');
import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native';
import User from "../Data/User";
import CreateContent from '../Components/CreateContent';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions, StackActions, NavigationActions} from 'react-navigation';
import { Footer, FooterTab, Button } from 'native-base';


export default class HospitalPageScreen extends React.Component {
    
    static navigationOptions =({navigation, screenProps }) => ( {
        title: navigation.getParam('replacementTitle',''),
        headerTitleStyle: {
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
        headerRight: (
            
            <Image
                  source={require('../assets/images/hospital_topicon.png')}
                  style={{height:50, width:50}}
              />
        ),
    });
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        HospitalTitle: "Temp",
                        }
    }
    componentDidMount(){
        const {navigation} = this.props;
        this.confirmHospital = this.confirmHospital.bind(this);
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        //if(this.props.navigation.getParam('findTitle',false) == true){
            this.getTitle(pageSlug);
        //}
        
        //this.props.navigation.setParams({replacementTitle: jsonData.title.rendered});
    }
    async getTitle(currentPage) {
        try {
        	console.log("try get title");
			const value = await AsyncStorage.getItem('@'+currentPage+':key');
            const updateDataSource = JSON.parse(value);
            this.state.HospitalTitle = updateDataSource[0].title.rendered
            var Analytics = require('../Data/Analytics').default;
		    Analytics.hitPage('this.state.HospitalTitle');
            //this.props.navigation.setParams({HospitalTitle: updateDataSource[0].title.rendered});
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }
    render() {
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        return (
            <View style={{
				flex: 1,
				backgroundColor: 'white'
			  }}>
                <CreateContent slug = {pageSlug}/>
                <Footer style = {{backgroundColor:'#2CC4AA'}}>
                        <FooterTab style = {{backgroundColor:'#2CC4AA'}}>
                            <Button onPress={() => this.selectHospital()} transparent >
                                <View style={styles.footerbutton}>
                                    <View style={styles.footerImageContainer}>
                                    </View>
                                    <View style={styles.footerTextContainer}>
                                        <Text style = {styles.textStyle}>I'M BOOKED AT THIS UNIT</Text>
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
    selectHospital(){
        const {navigation} = this.props;
        global.myhospitalTitle = this.state.HospitalTitle;
        Alert.alert(
            'Hospital Booked',
            'You can always change this selection if you book with a different hospital',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this.confirmHospital()},
            ],
            { cancelable: true }
          )
    }
    async confirmHospital(){
       
        try {
            const {navigation} = this.props;
            const pageSlug = navigation.getParam('slug', 'NO-ID');
            global.myhospitalSlug = pageSlug;
            
            await AsyncStorage.setItem('@MyHospital:key', pageSlug);
            var Analytics = require('../Data/Analytics').default;
            Analytics.hitEvent('MaternityUnit','chosen',pageSlug);
            console.log("save hospital selection");
            const { navigate } = this.props.navigation
            
                //console.log("Maternity key:", this.props.navigation.); 
            /*const resetAction = NavigationActions.navigate({
                index: 0,
                    key: null,
                    routeName: 'MaternityUnitsScreen',
                actions: NavigationActions.navigate({
                    index: 0,
                    key: null,
                    routeName: 'Home',

                }),
                })*/
               /* var {navigate} =  this.props.navigation;
                console.log(navigate.);
               const resetAction = StackActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({ 
                        routeName: "MaternityUnitsScreen", 
                    }),
                    ]
                })*/
                //this.props.navigation.goBack(null)
            //this.props.navigation.dispatch(resetAction)
            //this.props.navigation.popToTop();
           const resetAction = StackActions.reset({
                index: 0,
                key:null,
                actions: [
                    //this.props.navigation.popToTop(),
                    this.props.navigation.popToTop(),
                    navigate('Home'),
                ],
              });
            //navigate('Home');
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

