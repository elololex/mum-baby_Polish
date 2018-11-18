import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet, Image} from 'react-native';
import { Container,Content, Header, Left, Body, Right, Icon, Title ,Button, List, ListItem, Item} from 'native-base';
import moment from 'moment';
import {NavigationEvents} from 'react-navigation';


const _format = 'YYYY-MM-DD, h:mm:ss'
const _formatNew = 'DD/MM/YYYY, h:mm:ss'
const APPOINTMENT_DATABASE = '@APPOINTMENT_DATABASE';
const { Permissions } = Expo;




export default class ViewAppointments extends Component {

  
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'View Appointments',
        headerTitleStyle: {
          fontFamily: 'Lato-Regular',
          textAlign: 'center',
          flexGrow:1,
          alignSelf:'center',
      },
        headerRight: (
            
          <Image
                source={require('../../assets/images/appointments_topicon.png')}
                style={{height:50, width:50}}
            />
      ),
    });

  constructor(props) {
    super(props);
    this.state = {
      searchStatus : 'Searching for appointments'
    };
    var Analytics = require('../../Data/Analytics').default;
		    Analytics.hitPage('Appointments view');
  }

  InitializeCalendar = async ()=>{
    console.log('reload')
    try{
        const { status } = await Permissions.askAsync(Permissions.CALENDAR);
        if(status === 'granted'){
            const localCalendars = await AsyncStorage.getItem(APPOINTMENT_DATABASE);
            console.log(localCalendars)



            const localCalendarsObjects = JSON.parse(localCalendars)

            if(!localCalendarsObjects || localCalendarsObjects.length==0){
                this.setState({searchStatus:'No appointments found.'});
                // return;
            }
            
            var numOfAppoinments = Object.keys(localCalendarsObjects).length;
            
            let  newDaysObject = {};

            var validCalendarEvents = [];

            const compareEvents = localCalendarsObjects.map(async el =>{
                try{
                    const deviceEvent = await Expo.Calendar.getEventAsync(el.id);
                    if(deviceEvent){
                      validCalendarEvents.push(deviceEvent)
                    }else{
                        console.log('no appointments')
                    }
                    return deviceEvent;
                }catch(err){
                    console.log(err);               

                }
            })

            const loadEvents = await Promise.all(compareEvents);
            if(!validCalendarEvents){
              this.setState({searchStatus:'No appointments found.'});
            }
            this.setState({calendarEvents : validCalendarEvents});
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
    const { navigation } = this.props;
    const fileList = this.state.calendarEvents;
    
    if(fileList && fileList.length > 0){
      return (
        <View style={{flex:1,backgroundColor:'#fff'}}>
                  <List dataArray={fileList}
                    renderRow={(item) =>
                      <ListItem button onPress={()=>{
                        this.props.navigation.navigate('EditAppointmentScreen',{eventObject:item})

                        console.log('testing')
                      }} style={{height:100, borderColor:'#f98267'}}>
                      
                        <Left style={{
                          flex:2, 
                          flexDirection:'column'
                          }}>
                        <Text numberOfLines={1} style={styles.labelTitle}>{item.title}</Text>  
                        <Text style={styles.labelText}>
                        {moment(item.startDate).format(_formatNew)}
                        
                        </Text>
                        </Left>
                        <Right style={{
                          flex:1
                          }}>
                        <Icon name='arrow-forward' style={{paddingLeft:10, paddingRight:10, color:'#f98267'}}/>
                        </Right>
                      </ListItem>
                    }>
                  </List>
          </View>
    );
    }else{
      return (
        <View style={{flex:1, justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
          <Text style={{fontSize:20,color:'#888889'}}>{this.state.searchStatus}</Text>
        </View>
      )
    }

  }
}
const styles = StyleSheet.create({
  labelTitle: {
      color: 'black',
      fontSize: 18,
      fontFamily: 'Lato-Regular',
      textAlign: 'left',
      fontSize:20,paddingBottom: 10
      },
  labelText: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'Lato-Light',
        textAlign: 'left',
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
})