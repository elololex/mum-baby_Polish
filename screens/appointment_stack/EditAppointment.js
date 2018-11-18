import React, { Component } from 'react';
import { View, Alert, Text,ScrollView, AsyncStorage, StyleSheet, Image } from 'react-native';
import {Form, Label,Input, Item,Button} from 'native-base';
import { Container,Content, Header, Left, Body, Right, Icon, Title , List, ListItem} from 'native-base';
import { Footer, FooterTab } from 'native-base';
import Expo from 'expo';
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

const APPOINTMENT_DATABASE = '@APPOINTMENT_DATABASE';
const _format = 'YYYY-MM-DD'
const _formatNew = 'DD/MM/YYYY'

const { Permissions } = Expo;

export default class AddAppointment extends Component {
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Update Appointment',
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
    const {navigation} = props;
    const calendarObject = navigation.state.params.eventObject;
    const selectedDay = moment(calendarObject.startDate).format(_formatNew);
    console.log('--->',selectedDay)

    const selectedTime = moment(calendarObject.startDate).format("hh:mm");
    const today = new Date();
    // const time = moment(selectedDay).format("hh:mm:ss")
    //today.toLocaleTimeString('en-US', { hour12: false });
    this.state = {
        eventId : calendarObject.id,
        validForm : true,
        appointmentType : calendarObject.title,
        appointmentDate : selectedDay,
        appointmentTime : selectedTime,
        gestation : '',
        location : calendarObject.location,
        notes : calendarObject.notes,
        calendarEvents : [],
        butColor:'#2CC4AA',
    };
    var Analytics = require('../../Data/Analytics').default;
		    Analytics.hitPage('Appointments edit');
  }

  saveInDatabase = async (item) =>{
    try {
        // await AsyncStorage.getItem(APPOINTMENT_DATABASE).then(;
        // await AsyncStorage.setItem(APPOINTMENT_DATABASE,JSON.stringify(item));
     await AsyncStorage.getItem(APPOINTMENT_DATABASE)
        .then((_eventObj) => {
            const calEvents = _eventObj ? JSON.parse([_eventObj]) : [];
            calEvents.push(item);
            AsyncStorage.setItem(APPOINTMENT_DATABASE, JSON.stringify(calEvents));
        });
    } catch (error) {
        console.log(error);
    }
  }

  deleteAppointment = async()=>{
    try{
        const { status } = await Permissions.getAsync(Permissions.CALENDAR);
        if (status !== 'granted') {
            alert('Calender permissions was not granted. Please enable calendar permission to use this feature!')
        }else{
            console.log('deleting.....');
            console.log(this.state.eventId);

            const calEvents = []
            await Expo.Calendar.deleteEventAsync(this.state.eventId);
            await AsyncStorage.getItem(APPOINTMENT_DATABASE)
            .then((_eventObj) => {
                console.log('......')
                var _parsed = JSON.parse([_eventObj]);

                calEvents = _eventObj ? _parsed.filter(( obj)=> {
                    return obj.id !== this.state.eventId;
                  }) : [];


                alert(`Appointment "${this.state.appointmentType}" has been deleted!`);
            }).catch(err=>{
                console.log(err);
            });
           await AsyncStorage.setItem(APPOINTMENT_DATABASE, JSON.stringify(calEvents));
           this.props.navigation.goBack();
        }
    }catch(err){
        console.log(err)
        this.props.navigation.goBack();
    }
  }
  updateAppointment = async()=>{
        try{
            const { status } = await Permissions.getAsync(Permissions.CALENDAR);
            if (status !== 'granted') {
                alert('Calender permissions was not granted. Please enable calendar permission to use this feature!')
            }else{
                // const formattedDate = moment(new Date(this.state.appointmentDate)).format(_format);
                const formattedDate = this.state.appointmentDate;
                // const validDate = moment( formattedDate + ' ' + this.state.appointmentTime,'YYYY-MM-DD HH:mm');
                const validDate = moment( formattedDate + ' ' + this.state.appointmentTime,'DD/MM/YYYY HH:mm');

                //const validDate = moment(this.state.appointmentDate + ' ' + this.state.appointmentTime);
                 //new Date(this.state.appointmentDate + 'T' + this.state.appointmentTime);
                console.log(validDate);
                const eventObject = {
                    title : this.state.appointmentType,
                    startDate : validDate ,
                    endDate : validDate,
                    location : this.state.location,
                    notes: this.state.notes,
                    timeZone: 'GMT'
                }
                try{
                    const results = await Expo.Calendar.updateEventAsync(this.state.eventId, eventObject)
                    // var localDatabaseEvent = eventObject;
                    // localDatabaseEvent.id = results;
                    // this.saveInDatabase(localDatabaseEvent)
                    // this.props.navigation.state.params.triggerReload();
                    // this.props.navigation.state.params.reload();
                    this.props.navigation.goBack()
                }catch(err){
                    console.log(err);
                }
            }
        }catch(err){
            console.log(err)

        }
  }

  componentDidMount(){
      this._calculateGestation();
  }
  _calculateGestation = ()=>{
    if(global.duedate){
        var toDate = moment(global.duedate ,'DD/MM/YYYY').subtract(40,'weeks');
        var fromDate = moment(this.state.appointmentDate, 'DD/MM/YYYY');
        console.log(this.state.appointmentDate);

        var timeDiff = fromDate.diff(toDate,'days');
        console.log(timeDiff);
        // var diff = moment.duration(timeDiff);
        if(timeDiff > 0){
            let w = parseInt(timeDiff/7);
            let d = timeDiff%7 ;
            let weeks = w > 0? w +' week':'' ;
            weeks = w > 1? weeks+'s':weeks;
            let days = d > 0 ? d + ' day' : '' ;
            days = d > 1? days+'s':days;
            let split = w>0 && d>0 ? ', ':'';

            console.log(weeks)
            console.log(days)
            this.setState({gestation : 'Gestation: '+`${weeks}${split}${days}`})
        }
        else{
            this.setState({gestation : ''})
        }
      }
  }

  render() {
    const {navigation} =this.props;
    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>
      <View style={{flex:4, borderBottomWidth:1, borderColor:'#d9d5dc',paddingLeft:10}}>
        <KeyboardAwareScrollView>

        {/* <Form> */}
            <Item stackedLabel>
              {/* <Label>Type of Appointment</Label> */}
              <Input style={[styles.labelText]} value = {this.state.appointmentType} placeholder={this.state.appointmentType} onChangeText={(value) => this.setState({appointmentType: value})}
/>
            </Item>
            <Item stackedLabel>
              {/* <Label>Date of Appointment</Label> */}
              {/* <Input onChangeText={(value) => this.setState({appointmentDate: value})}>{this.props.navigation.state.params.day}</Input> */}
              <DatePicker
                style={{width: '100%'}}
                date={this.state.appointmentDate}
                mode="date"
                // placeholder="select date"
                format={_formatNew}
                // minDate="2016-05-01"
                // maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon= {false}
                customStyles={{
                dateInput: {
                    marginLeft: 0,
                    borderWidth: 0,
                    alignItems: 'flex-start',
                    
                },
                dateText:{
                    fontSize: 17,
                fontFamily: 'Lato-Light',textAlign: 'left',
                }
                // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {
                    this.setState({appointmentDate: date},()=>this._calculateGestation())
                    console.log(date);
                    console.log(this.state.appointmentDate);
                }}
            />
            
            </Item>
            <Item stackedLabel>
              {/* <Label>Time of Appointment</Label> */}
              <DatePicker
                style={{width:'100%'}}
                date={this.state.appointmentTime}
                mode="time"
                // placeholder="select date"
                format="HH:mm"
                // minDate="2016-05-01"
                // maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon= {false}
                customStyles={{
                    dateInput: {
                        marginLeft: 0,
                        borderWidth : 0,
                        alignItems: 'flex-start',
                        
                    },
                    dateText:{
                        fontSize: 17,
                fontFamily: 'Lato-Light',textAlign: 'left',
                    }
                // ... You can check the source to find the other keys.
                }}
                onDateChange={(time) => { console.log(time); this.setState({appointmentTime: time})}}
            />
            </Item>
            <Item stackedLabel >
              {/* <Label>Gestation</Label> */}
              <Input style={[styles.labelText]} value = {this.state.gestation} placeholder="Gestation" onChangeText={(value) => this.setState({gestation: value})}/>
            </Item>
            <Item stackedLabel >
              {/* <Label>Location</Label> */}
              <Input style={[styles.labelText]} value = {this.state.location} placeholder="Location" onChangeText={(value) => this.setState({location: value})}/>
            </Item>
            <Item stackedLabel style={{borderColor:'transparent',flexGrow: 1,}}>
              {/* <Label>Things to ask at my next appointment</Label> */}
              {/* <Input placeholder={this.state.notes} onChangeText={(value) => this.setState({notes: value})}/> */}
              <AutoGrowingTextInput  style={{
                fontSize: 17,
                fontFamily: 'Lato-Light',
                paddingBottom:20,
                width:'100%'
                }} 
                minHeight={150}
                value = {this.state.notes}
                placeholder={'Things to ask at my next appointment'} onChangeText={(value) => this.setState({notes: value})}
                />
            </Item>
          {/* </Form> */}
          </KeyboardAwareScrollView>
        </View>
        <View style={{flex:1 ,flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
            {/*<Button style={{padding:50,alignSelf:'center',backgroundColor : '#f98267'}} onPress={()=>{
                this.deleteAppointment()
                // this.props.navigation.state.params.reload();
            }}>
                <Text style={{color:'white'}}>Delete</Text>
            </Button>
            <Button style={{padding:50,alignSelf:'center', backgroundColor : '#f98267'}} onPress={()=>{
                                                

                if(!this.state.appointmentType || !this.state.location){
                    Alert.alert(
                        'Empty Fields',
                        'Fields cannot be empty. Please enter details.',
                        [
                        {text: 'OK'},
                        ],
                        { cancelable: false }
                    ) 
                }else{
                    this.updateAppointment();
                }
            }}>
                <Text style={{color:'white'}}>Update</Text>
            </Button>*/}
            
        </View>
        <Footer style={{backgroundColor:this.state.butColor}}>
                                <FooterTab style={{backgroundColor:this.state.butColor}}>
                                    <Button onPress={() => this.deleteAppointment()} transparent style = {{}}>
                                    <View style={styles.footerbuttonLine}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>DELETE</Text>
                                            </View>
                                            
                                    </View>
                                    </Button>
                                    <Button onPress={() => {
                                            if(!this.state.appointmentType){
                                                Alert.alert(
                                                    'Empty Fields',
                                                    'Fields cannot be empty. Please enter details.',
                                                    [
                                                    {text: 'OK'},
                                                    ],
                                                    { cancelable: false }
                                                ) 
                                            }else{
                                                this.updateAppointment();
                                            }}} transparent>
                                    <View style={styles.footerbutton}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>UPDATE</Text>
                                             </View>
                                            
                                    </View>
                                    </Button>
                                </FooterTab>
                            </Footer>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
