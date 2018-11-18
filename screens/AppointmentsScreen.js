import React, { Component } from 'react';
import {SafeAreaView, StyleSheet, View, Text, AsyncStorage, Image } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import { Footer, FooterTab } from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {createStackNavigator,NavigationEvents} from 'react-navigation';
import Expo, {SQLite} from 'expo';
import moment from 'moment' 


//screen
// import AppointmentScreen from './screens/AppointmentsScreen';
// import AddAppointmentScreen from './screens/appointment_stack/AddAppointment';
// import ViewAppointmentScreen from './screens/appointment_stack/ViewAppointments';
// import EditAppointmentScreen from './screens/appointment_stack/EditAppointment';

//
const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const MB_DATABASE = 'mumandbaby_db.db'
const db = SQLite.openDatabase(MB_DATABASE);
const colors  = {
    main : '#f98267'
}
const APPOINTMENT_DATABASE = '@APPOINTMENT_DATABASE';
const { Permissions } = Expo;




export default class AppointmentScreen extends Component {
static navigationOptions =({navigation, screenProps }) => ( {
    title: 'Appointments',
    headerTitleStyle: {
        fontFamily: 'Lato-Regular',
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
    headerRight: (
            
        <Image
              source={require('../assets/images/appointments_topicon.png')}
              style={{height:50, width:50}}
          />
    ),
    // drawerLabel: 'Home',
    // drawerIcon: ({ tintColor }) => (
    //   <Icon
    //     name=''
    //   />
    // ),
    // headerLeft: (
    //     <Button transparent
    //     onPress={() => navigation.openDrawer()}>
    //       <Icon ios='ios-menu' android="md-menu" style={{fontSize: 30, color: 'white'}}/>
    //     </Button>
    // ),
});



initialState = {
    [_today]: {selected: true,selectedColor:colors.main}
}
  constructor(props) {
    super(props);


    this.state = {
        _currentSelectedDate:_today,
        _userSelectedDate : this.initialState,
        _todayMarked : this.initialState,
        _markedDates :this.initialState,
        calendarEvents :[],
        butColor:'#2CC4AA',
    };
    this.onDaySelect = this.onDaySelect.bind(this);

    console.log('init', this.state._markedDates);
    var Analytics = require('../Data/Analytics').default;
		    Analytics.hitPage('Appointments Home screen');
  }

  onDaySelect = (day) => {
    //   return;
    const _selectedDay = moment(day.dateString).format(_format);
    
    var currentDates = {
        ...this.state._markedDates
    }
    Object.keys(currentDates).forEach(function(key) {
        currentDates[key] = {
            selected : false,
            selectedColor : colors.main,
            marked : currentDates[key].marked
        }  
    });

    if(currentDates.hasOwnProperty(_selectedDay)){
        currentDates[_selectedDay] = {
            selected : true,
            selectedColor : colors.main,
            marked : currentDates[_selectedDay].marked
        }  
    }else{
        currentDates = {
            ...currentDates,
            [_selectedDay]:{
                selectedColor : colors.main,
                selected:true
            }
        }
    }
    this.setState({ _markedDates: currentDates });
    this.setState({_currentSelectedDate : _selectedDay})
}


InitializeCalendar = async ()=>{
    try{
        const { status } = await Permissions.askAsync(Permissions.CALENDAR);
        if(status === 'granted'){
            const localCalendars = await AsyncStorage.getItem(APPOINTMENT_DATABASE);
            console.log('--->', localCalendars)

            const localCalendarsObjects = JSON.parse(localCalendars)
            console.log(localCalendars);
            let  newDaysObject = {
                ...this.initialState
            };
            var validCalendarEvents = []
            const compareEvents = localCalendarsObjects.map(async el =>{
                try{
                    const deviceEvent = await Expo.Calendar.getEventAsync(el.id);
                    if(deviceEvent){
                        validCalendarEvents.push(deviceEvent)
                        var deviceEventStartDate = moment(deviceEvent.startDate).format(_format);
                        newDaysObject = {
                            ...newDaysObject,
                            [deviceEventStartDate]: {
                              selected: deviceEventStartDate == _today,
                              selectedColor:colors.main,
                              marked: true
                            }
                        };
                    }else{
                        console.log('no appointments, creating')
                    }
                    return deviceEvent;
                }catch(err){
                    const eventObject = {
                        title : el.id,
                        startDate : el.startDate ,
                        endDate : el.endDate,
                        location : el.location,
                        notes: el.notes,
                        timeZone: 'GMT'
                    }
                    // try{
                    //     const deviceEvent = await Expo.Calendar.createEventAsync(Expo.Calendar.DEFAULT, eventObject)
                    //     console.log('creating event in calendar');               
                    //     if(deviceEvent){
                    //         validCalendarEvents.push(deviceEvent)
                    //         var deviceEventStartDate = moment(deviceEvent.startDate).format(_format);
                    //         newDaysObject = {
                    //             ...newDaysObject,
                    //             [deviceEventStartDate]: {
                    //               selected: deviceEventStartDate == _today,
                    //               selectedColor:colors.main,
                    //               marked: true
                    //             }
                    //         };
                    //     }
                    //     return deviceEvent;
                    // }catch(err){
                    //     console.log(err);
                    // }
                }
            })
            const loadEvents = await Promise.all(compareEvents);
            this.setState({_markedDates:newDaysObject})
            this.setState({calendarEvents : validCalendarEvents});
            await AsyncStorage.setItem(APPOINTMENT_DATABASE, JSON.stringify(validCalendarEvents));
        }else{
            alert('Calender permissions was not granted. Please enable calendar permission to use this feature!')
        }
    }catch(err){
       console.log(err)
    }
}

componentDidMount(){
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        this.InitializeCalendar();
      }),
      // this.props.navigation.addListener('willBlur', () => console.log('will blur')),
      // this.props.navigation.addListener('didFocus', () => console.log('did focus')),
      // this.props.navigation.addListener('didBlur', () => console.log('did blur')),
    ];
  }
  
  componentWillUnmount() {
    this.subs.forEach((sub) => {
      sub.remove();
    });
  }

  render() {      
    return (
        <View style={styles.container}>
        {/*<SafeAreaView>*/}
        <CalendarList 
        style={{marginTop:25}}
        current ={this.state._currentSelectedDate}
        horizontal ={true} 
        onDayPress={this.onDaySelect}
        markedDates={
            this.state._markedDates
        }
        theme={{
            dotColor: '#f98267',
            selectedDotColor: '#fff',
            arrowColor: '#f98267',
            selectedColor: '#f98267',
            todayTextColor:'#f98267'
        }}
        pagingEnabled={true} hideArrows ={false}
        />
        <View>
            {/*<Button full light style={{margin:15, backgroundColor:colors.main}} onPress={()=>{
                this.props.navigation.navigate('AddAppointmentScreen',{day:this.state._currentSelectedDate})
            }}>
            <Text style={{color: '#fff'}}>Add Appointment</Text>
            <Icon name="add-circle" style={{color: '#fff'}}></Icon>
            </Button>
            <Button full light style={{margin:15, backgroundColor:colors.main}} onPress={()=>{
                this.props.navigation.navigate('ViewAppointmentScreen',{day:this.state._currentSelectedDate, fileList:this.state.calendarEvents})
            }}>
            <Text style={{color: '#fff'}}>View Appointments</Text>
            <Icon name="search" style={{color: '#fff'}}></Icon>
        </Button>*/}

            
        </View>
        
       {/*</SafeAreaView>*/}
        <Footer style={{backgroundColor:this.state.butColor}}>
                                <FooterTab style={{backgroundColor:this.state.butColor}}>
                                    <Button onPress={() => this.props.navigation.navigate('AddAppointmentScreen',{day:this.state._currentSelectedDate})} transparent style = {{}}>
                                    <View style={styles.footerbuttonLine}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Icon name="add-circle" style={{color: '#fff'}}></Icon>
                                                <Text style = {styles.textStyle}>ADD</Text>
                                            </View>
                                            
                                    </View>
                                    </Button>
                                    <Button onPress={() => this.props.navigation.navigate('ViewAppointmentScreen',{day:this.state._currentSelectedDate, fileList:this.state.calendarEvents})} transparent>
                                    <View style={styles.footerbutton}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Icon name="search" style={{color: '#fff'}}></Icon>
                                                <Text style = {styles.textStyle}>VIEW</Text>
                                             </View>
                                            
                                    </View>
                                    </Button>
                                </FooterTab>
                            </Footer>
        </View>
    );
  }
}

// export default createStackNavigator({
//     AppointmentScreen : {screen:AppointmentScreen},
//     AddAppointmentScreen : {screen:AddAppointmentScreen},
//     ViewAppointmentScreen : {screen:ViewAppointmentScreen},
//     EditAppointmentScreen : {screen:EditAppointmentScreen}
// },
// {
//     headerMode: 'float',
//   navigationOptions: ({navigation, screenProps }) => ({
//     headerStyle: {
//       backgroundColor: '#FA7E5B',
//     },
//     headerBackTitle: null,
//     headerTintColor: '#fff',
//     headerMode: 'screen',
//     headerTitleStyle: {
//         fontFamily: 'Lato-Regular',
//     }
//   })
// }
// );

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerbutton: {
        backgroundColor: global.themeColor,
        flexGrow:1,
        flexDirection: 'row',
        width:null,
        alignItems: 'center',
        
      },
    footerbuttonLine: {
        backgroundColor: global.themeColor,
        flexGrow:1,
        flexDirection: 'row',
        width:null,
        alignItems: 'center',
        borderRightColor: '#ECFAF7',
        borderRightWidth: 0.5,
        
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
        flexDirection: 'row',
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
    textStyle:{
        fontFamily: 'Lato-Regular',
          color: '#fff',
          fontSize:16
        }
  });