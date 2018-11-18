import React from 'react';
import {Text,TouchableOpacity, View, AsyncStorage, StyleSheet, ActivityIndicator} from 'react-native';
import { Container,Content, Header, Left, Body, Right, Icon, Title ,Button, List, ListItem, Item} from 'native-base';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import CreateContent from '../Components/CreateContent';
import DefaultContent from './DefaultContentScreen';
import MaternityUnitsScreen from './MaternityUnitsScreen';
import HospitalPageScreen from './HospitalPageScreen';
import FormScreen from './FormScreen';
// import AppointmentsScreen from './AppointmentsScreen';
// var stringSimilarity = require('string-similarity');
// const didYouMean = require('didyoumean2')
import didYouMean from 'didyoumean2';
import { withNavigationFocus } from 'react-navigation';


//const util = require('util');

//screen
import AppointmentScreen from './AppointmentsScreen';
import AddAppointmentScreen from './appointment_stack/AddAppointment';
import ViewAppointmentScreen from './appointment_stack/ViewAppointments';
import EditAppointmentScreen from './appointment_stack/EditAppointment';
import SubMenuItem from '../Components/SubMenuItem';

const mainColor =  '#f98267';

class SearchResultsScreen extends React.Component {
	
  static navigationOptions =({navigation, screenProps }) => ( {
      title: 'Search Results',
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
      )
      
  });
  constructor(props) {
      super(props);
      this.state = {
          searchEntry : '',
          searchResults : [],
          hasLoaded: false,
      };        }
  
  _generateSearch = async()=>{
      var matches = []
      var contentMatches = []
      try{
          const word = await AsyncStorage.getItem('@SEARCH_WORD');
          var Analytics = require('../Data/Analytics').default;
          Analytics.hitEvent('Search','word_search',word);
          this.setState({searchEntry:word})
          const searchKeys = await AsyncStorage.getItem('@SEARCH_KEYS');
          
          var titles = JSON.parse(searchKeys).map( async (key,index) => {
              var element = await AsyncStorage.getItem(key).then(data=>{
                var obj = JSON.parse(data)[0];

                  // let score = leven(word, obj.title.rendered);
                  // console.log(score);
                  // var content = obj.content.rendered
                //   var content = obj.content.rendered.split(' ');
                  var title = obj.title.rendered.replace(/[^\w\s]/gi, '').split(' ');
                  let foundInTitle = false;
                //   console.log(title)
                  if(word){
                    let isMatch = false;
                //Might be a better options. needs testing
                //    let score = title.map(el=>{
                //        var _int = stringSimilarity.compareTwoStrings(word, el) > 0.4
                //        if(_int==1){
                //            isMatch = true;
                //        }
                //     })

                //Place holder
                ////// There was an issue with the below code if I search for 'travel' it does not pick up 'travelling'. So I also allowed it to check the whole title if there 
                ////// is a direct match
                let lowercaseTitle = obj.title.rendered.toLowerCase();
                const lowercaseWord = word.toLowerCase();
                    var result = didYouMean(word, title,{thresholdType :'similarity', threshold:0.8,});
                    if((result || lowercaseTitle.indexOf(lowercaseWord)>=0) && obj){
                      matches.push(obj);
                        foundInTitle = true;
                    }
                    var content = obj.content.rendered.toLowerCase();
                    if(content.indexOf(lowercaseWord)>=0 && foundInTitle == false && obj){
                      console.log("add to contentMatches");
                      contentMatches.push(obj);
                      //console.log("contentMatches"+contentMatches.length);
                    }
                    // console.log(result);
                    // if(isMatch){
                    //     if(obj){
                    //         matches.push(obj);
                    //     }
                    // }
                    // var score = stringSimilarity.compareTwoStrings(word, obj.title.rendered);
                    //console.log('length -> ', title.length, ' score -> ', score);
                  }
                  
                  // console.log('word --> '+key +' ',obj.title.rendered);
                //   if(index==0){
                //       console.log(obj)
                //   }
                
              }).catch(err=>{
                  console.log(err)
              });
              });
               
          await Promise.all(titles).then(()=>{
              // console.log(matches);
              console.log("contentMatches"+contentMatches.length);
              matches = matches.concat(contentMatches);  
              this.setState({searchResults:matches,hasLoaded:true});

          });


      }catch(err){
          console.log(err);
      }
  }
  componentWillReceiveProps(nextProps) {
      // do your on view will appear logic here
  }

  componentDidMount(){
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        this._generateSearch();
      }),
      this.props.navigation.addListener('willBlur', () => console.log('will blur')),
      this.props.navigation.addListener('didFocus', () => console.log('did focus')),
      this.props.navigation.addListener('didBlur', () => console.log('did blur')),
    ];
    var Analytics = require('../Data/Analytics').default;
		Analytics.hitPage('SearchResults');
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => {
      sub.remove();
    });
    
  }
  
  render(){
      const word =this.props.navigation
      // console.log('-search-',word);
      if(this.state.hasLoaded && this.state.searchResults.length == 0){
        return(
          <View style={{
          flex: 1,
          backgroundColor: 'white'
          }}>
                  <CreateContent  slug = {"no-search-results"}/> 
                
              </View>
          );
      }
      else if(this.state.hasLoaded){
        return(
          <View style={{
            flex: 1,
            backgroundColor: 'white'
            }}>
                    {/* <CreateContent  slug = {"personal-care-welcome-page"}/>     */}
                    {/* <CreateContent  slug = {""}/>     */}
                    <List dataArray={this.state.searchResults}
                        
                        renderRow={(item) =>
                          <SubMenuItem slug = {item.slug} parentTitle = {'"'+this.state.searchEntry+'"'} htmlTitle = {item.title.rendered}/>
                          
                        }>
                      </List>
                </View>
          );
          
        }
        else{
          let tempColor = "#FA7E5B";
          return(
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color= {tempColor}/>
            </View>
            );
        }
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
        },
        container: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor:'#fff',
        },
        horizontal: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10
        },
    });
export default createStackNavigator({
    Main:{screen:SearchResultsScreen},
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
      
