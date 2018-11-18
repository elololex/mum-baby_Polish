import React, {Component} from 'react';
import { StyleSheet, Text, View ,SafeAreaView, ScrollView, Image,FlatList,TouchableOpacity} from 'react-native';
import {createStackNavigator,createDrawerNavigator,createSwitchNavigator , DrawerItems} from 'react-navigation';
import {Header, Item, Icon, Input, InputGroup,List, ListItem,Left,Right,Button} from 'native-base'
//Screen
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from './screens/HomeScreen';
import MaternityUnitsScreen from './screens/MaternityUnitsScreen';
import HospitalPageScreen from './screens/HospitalPageScreen';
import DefaultContent from './screens/DefaultContentScreen';
import SecondScreen from './screens/SecondScreen';
import ThirdScreen from "./screens/ThirdScreen";
import DefaultContentScreen from "./screens/DefaultContentScreen";
// import AppointmentsScreen from './screens/AppointmentsScreen';
import BackupScreen from './screens/BackupScreen';
import PersonalCarePlanScreen from './screens/PersonalCarePlanScreen';
import YourPregnancyScreen from './screens/YourPregnancyScreen';
import BirthScreen from './screens/BirthScreen';
import AfterYourBabyIsBornScreen from './screens/AfterYourBabyIsBornScreen';
import AboutTheAppScreen from './screens/AboutTheAppScreen';
import GetInvolvedScreen from './screens/GetInvolvedScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import DonationScreen from './screens/DonationScreen';

//header 
import MainMenuHeader from './Components/HeaderMenu';
//search
import SearchResultsScreen from './screens/SearchResultsScreen';
import SearchBrokerScreen from './screens/searchStack/SearchBroker';
//screen
import AppointmentScreen from './screens/AppointmentsScreen';
import AddAppointmentScreen from './screens/appointment_stack/AddAppointment';
import ViewAppointmentScreen from './screens/appointment_stack/ViewAppointments';
import EditAppointmentScreen from './screens/appointment_stack/EditAppointment';
import SearchBrookerScreen from './screens/searchStack/SearchBroker';

//Menu
const mainColor =  '#f98267';
  const CustomContentComponent = (props)=>{
    return (
      <View style={{flex:1}}>
      <View style={{height:150,  backgroundColor:'#f98267', alignItems:'center',
        justifyContent:'center',}} searchBar rounded>
      <View style={{flex:1,alignItems:'center', justifyContent:'flex-end'}}>
      <Image
                source={require('./assets/images/menu_logo.png')}
                style={styles.logoImage}
            />
      </View>
      <View style={{flex:1}}>
      <InputGroup rounded style={{backgroundColor:'rgba(255, 255, 255, 0.4)', width:200, height:30,margin:20}}>
            <Icon name='search' style={{color:'#fff',fontSize:14}}/>
            <Input onChange={(va)=>{}} returnKeyType='search'   onSubmitEditing={()=>{

              console.log('submitting ...')
      }}
 placeholder='Search...' placeholderTextColor="#fff" style={{color:'#fff',fontSize:14} }/>
            <TouchableOpacity onPress={()=>{}}>
            <Icon name='close-circle' style={{color:'#fff',fontSize:14}}/>
            </TouchableOpacity>
          </InputGroup>
      </View>
        </View>
      <ScrollView>
        <DrawerItems {...props}
        
        getLabel = {(scene) => (
          <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems:'center', paddingLeft:20}}>
            {/* <Icon style={{color:mainColor}}  name='bicycle'/> */}
            <Text style={{ color:mainColor, fontSize:14} }>{props.getLabel(scene)}</Text>
          </View>
        )}
        />
      </ScrollView>
      </View>
    )
  }

  //Update menu icons
  const styles = StyleSheet.create(
    {
      logoImage: {
        height:33,
        width:162,
      },
    });

    //Appointment Stackl
const AppointmentStack = createStackNavigator({
  AppointmentScreen : {
    screen:AppointmentScreen,
    navigationOptions : ({navigation})=>({
      title: 'Appointments',
      drawerLabel: 'Home',
      headerTitleStyle: {
        fontFamily: 'Lato-Regular',
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
      drawerIcon: ({ tintColor }) => (
        <Icon
          name=''
        />
      ),
      headerLeft: (
          <Button transparent
          onPress={() => navigation.openDrawer()}>
            <Icon ios='ios-menu' android="md-menu" style={{fontSize: 30, color: 'white'}}/>
          </Button>
      )
    }),
  },
  AddAppointmentScreen : {screen:AddAppointmentScreen},
  ViewAppointmentScreen : {screen:ViewAppointmentScreen},
  EditAppointmentScreen : {screen:EditAppointmentScreen}
},{
      headerMode: 'float',
    navigationOptions: ({navigation, screenProps }) => ({
      headerStyle: {
        backgroundColor: '#FA7E5B',
      },
      headerBackTitle: null,
      headerTintColor: '#fff',
      headerMode: 'screen',
      headerTitleStyle: {
        fontFamily: 'Lato-Regular',
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
    })
  });

  const MaternityUnitsStack = createStackNavigator({
    MaternityUnitsScreen : {
      screen:MaternityUnitsScreen,
      navigationOptions : ({navigation})=>({
        title: 'Maternity units',
        headerTitleStyle: {
          fontFamily: 'Lato-Regular',
          textAlign: 'center',
          flexGrow:1,
          alignSelf:'center',
      },
        drawerLabel: 'Home',
        drawerIcon: ({ tintColor }) => (
          <Icon
            name=''
          />
        ),
        headerLeft: (
            <Button transparent
            onPress={() => navigation.openDrawer()}>
              <Icon ios='ios-menu' android="md-menu" style={{fontSize: 30, color: 'white'}}/>
            </Button>
        )
      }),
    },
    HospitalPage:{screen:HospitalPageScreen},
    DefaultContent:{screen:DefaultContent},
  },{
        headerMode: 'float',
      navigationOptions: ({navigation, screenProps }) => ({
        headerStyle: {
          backgroundColor: '#FA7E5B',
        },
        headerBackTitle: null,
        headerTintColor: '#fff',
        headerMode: 'screen',
        headerTitleStyle: {
          fontFamily: 'Lato-Regular',
          textAlign: 'center',
          flexGrow:1,
          alignSelf:'center',
      },
      })
    });





const MainMenuNavigation = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: ()=>{
        return (
          <Text style={{height:10}}> Home</Text>
        )
      },
      drawerIcon: () => (
        <Icon  name='home' style={{color :mainColor}}
        />
      )
    }
  },
  SearchScreen : createSwitchNavigator({
    SearchBrokerScreen:{
    screen : SearchBrokerScreen},
    SearchResultsScreen : {
      screen: SearchResultsScreen
    }
  }),
  MaternityUnitsMenu:{screen:MaternityUnitsStack,
    navigationOptions: {
      drawerLabel: 'Maternity units',
      drawerIcon: () => (
        <Image
                source={require('./assets/images/hospital_icon.png')}
                style={{height:20, width:25}}
            />
      )
    }},
  PersonalCarePlan:{screen:PersonalCarePlanScreen, Title: "Personal Care Plan",  navigationOptions: {
    drawerLabel: 'Personal care plans ',
    drawerIcon: () => (
      
      <Image
                source={require('./assets/images/identy_icon.png')}
                style={{height:16, width:23}}
            />
    )
  }},
  AppointmentsMenu:{screen:AppointmentStack,  navigationOptions: {
    drawerLabel: 'Appointments',
    drawerIcon: () => (
      <Image
                source={require('./assets/images/calendar_icon.png')}
                style={{height:24, width:23}}
            />
    )
  }},
  YourPregnancy: {screen:YourPregnancyScreen,  navigationOptions: {
    drawerLabel: 'Your pregnancy ',
    drawerIcon: () => (
      <Image
                source={require('./assets/images/preg_icon.png')}
                style={{height:31, width:18}}
            />
    )
  }},
  LabourAndBirth: {screen:BirthScreen,  navigationOptions: {
    drawerLabel: 'Labour and birth ',
    drawerIcon: () => (
      
      <Image
                source={require('./assets/images/birth_icon.png')}
                style={{height:26, width:21}}
            />
    )
  }},
  AfterYourBabyIsBorn: {screen:AfterYourBabyIsBornScreen,  navigationOptions: {
    drawerLabel: 'After your baby is born ',
    drawerIcon: () => (
      <Image
                source={require('./assets/images/baby_icon.png')}
                style={{height:27, width:21}}
            />
    )
  }},
  Backup:{ screen : BackupScreen,navigationOptions: {
      drawerLabel: ()=>{
        return(
          <Text style={{color:'#999999'}}>Backup </Text>
        )
      }
  }},
  AboutTheApp:{screen:AboutTheAppScreen,  navigationOptions: {
    drawerLabel: 
    ()=>{
      return(
        <Text style={{color:'#999999'}}>About this app </Text>
      )
    }
  }},
  GetInvolved:{screen:GetInvolvedScreen,  navigationOptions: {
      drawerLabel: 
      ()=>{
        return(
          <Text style={{color:'#999999'}}>Get involved </Text>
        )
      },
    }},
  Feedback:{screen:FeedbackScreen,  navigationOptions: {
    drawerLabel: 
    ()=>{
      return(
        <Text style={{color:'#999999'}}>Feedback </Text>
      )
    },
  }},
  Donation:{screen:DonationScreen,  navigationOptions: {
    drawerLabel: 
    ()=>{
      return(
        <Text style={{color:'#999999'}}>Donations </Text>
      )
    },
  }},
 },{
  initialRouteName: 
  'Home',
  contentComponent : (props) => <MainMenuHeader {...props} />
  // contentComponent : props => <CustomContentComponent {...props} />
});

const MainSwitchNavigator = createSwitchNavigator({
  Splash:{screen:SplashScreen},
  Welcome:{screen: WelcomeScreen},
  MainApp :{screen: MainMenuNavigation}
})





  export default class HomePage extends Component{
    constructor(props){
      super(props)
      this.state ={
        searchVal : '---------'
      }
    }
    render(){
      return(
        <MainSwitchNavigator />
      )
    }
  };
