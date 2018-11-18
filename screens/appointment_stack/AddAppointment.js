import React, { Component } from 'react';
import { Alert, View, Text,ScrollView, AsyncStorage ,KeyboardAvoidingView, StyleSheet, Image} from 'react-native';
import { Container,Content, Header, Left, Body, Right, Icon, Title, List, ListItem} from 'native-base';
import {Form, Label,Input, Item,Button} from 'native-base';
import Expo from 'expo';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Footer, FooterTab } from 'native-base';

const APPOINTMENT_DATABASE = '@APPOINTMENT_DATABASE';
const _format = 'YYYY-MM-DD'
const _formatNew = 'DD/MM/YYYY'


export default class AddAppointment extends Component {
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Add Appointment',
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
    const selectedDay = navigation.state.params.day;

    const newFormatted = moment(selectedDay).format(_formatNew);
    this.state = {
        validForm : false,
        appointmentType : '',
        // appointmentDate : moment(selectedDay).format('ll'),
        appointmentDate : newFormatted,
        appointmentTime :moment().format("hh:mm:ss"),
        gestation : '',
        location : '',
        notes : '',
        calendarEvents : [],
        butColor:'#2CC4AA',
    };
    var Analytics = require('../../Data/Analytics').default;
		    Analytics.hitPage('Appointments edit');
  }

  saveInDatabase = async (item) =>{
    try {
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


  componentDidMount(){
    this._calculateGestation();
  }

  saveAppointment = async()=>{
        try{
            const { Permissions } = Expo;
            const { status } = await Permissions.getAsync(Permissions.CALENDAR);
            if (status !== 'granted') {
                alert('Calender permissions was not granted. Please enable calendar permission to use this feature!')
            }else{
                console.log('nonformatted -> ',this.state.appointmentDate)
                const formattedDate = this.state.appointmentDate;//moment(new Date(this.state.appointmentDate)).format(_format);
                console.log('formated -> ',formattedDate);
            
                const validDate = moment( formattedDate + ' ' + this.state.appointmentTime,'DD/MM/YYYY HH:mm');
                console.log('valid data -> ',validDate);
                // return;

                const eventObject = {
                    title : this.state.appointmentType,
                    startDate : validDate ,
                    endDate : validDate,
                    location : this.state.location,
                    notes: this.state.notes,
                    timeZone: 'GMT'
                }
                try{
                    const results = await Expo.Calendar.createEventAsync(Expo.Calendar.DEFAULT, eventObject)
                    var localDatabaseEvent = eventObject;
                    localDatabaseEvent.id = results.toString();
                    this.saveInDatabase(localDatabaseEvent)
                    //alert(`Appointment "${this.state.appointmentType}" has been added to your Calendar!`);
                    Alert.alert(
                        'Appointment saved',
                        `Appointment "${this.state.appointmentType}" has been added to your Calendar!`,
                        [
                        {text: 'OK'},
                        ],
                        { cancelable: false }
                    ) 
                    // this.props.navigation.state.params.triggerReload();
                    this.props.navigation.goBack()
                }catch(err){
                    console.log(err);
                }
            }
        }catch(err){
            console.log(err)
        }
      }
  render() {
    const {navigation} =this.props;
    // let gestationPeriod = "";
    // if(global.duedate !== NaN && global.duedate !== null && global.duedate !== undefined && global.duedate !== ""  ){
    //     var date1 = new Date(global.duedate);
    //     var date2 = new Date(this.state.appointmentDate);
    //     var timeDiff = date1.getTime() - date2.getTime();
    //     if(timeDiff>0){
    //         var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    //         gestationPeriod = String((40-Math.round(diffDays/7))+" week(s)");
    //         console.log("gestationPeriod: "+ gestationPeriod);
    //     }
    // }
    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>
      <View style={{flex:4, borderBottomWidth:1, borderColor:'#d9d5dc',paddingLeft:10}}>

      <KeyboardAwareScrollView>
        {/* <ScrollView> */}

        {/* <Form> */}
            <Item stackedLabel>
              {/* <Label>Type of Appointment</Label> */}
              <Input style={[styles.labelText]} placeholder={'Type of Appointment'} onChangeText={(value) => this.setState({appointmentType: value})}
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
                    // console.log(date);
                    // this._calculateGestation();
                }}
            />
            
            </Item>
            <Item stackedLabel>
              {/* <Label>Time of Appointment</Label> */}
              <DatePicker
                style={{width: '100%'}}
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
              <Input style={[styles.labelText]} value ={this.state.gestation} placeholder={'Gestation'} onChangeText={(value) => this.setState({gestation: value})}/>

            </Item>
            <Item stackedLabel >
              {/* <Label>Location</Label> */}
              <Input style={[styles.labelText]} placeholder={'Location'} onChangeText={(value) => this.setState({location: value})}/>
            </Item>
            <Item  stackedLabel style={{borderColor:'transparent',flexGrow: 1,}}>

              {/* <Label>Things to ask at my next appointment</Label> */}
              {/* <Input multiline placeholder={'Things to ask at my next appointment'}  onChangeText={(value) => this.setState({notes: value})}/> */}
               <AutoGrowingTextInput  style={{
                fontSize: 17,
                fontFamily: 'Lato-Light',
                paddingBottom:20,
                width:'100%'
                }} 
                minHeight={150}

                placeholder={'Things to ask at my next appointment'} onChangeText={(value) => this.setState({notes: value})}
                />

            </Item>
          {/* </Form> */}

        {/* </ScrollView> */}
        </KeyboardAwareScrollView>
        </View>
        <View style={{flex:1 ,flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
            {/*<Button style={{padding:50,alignSelf:'center',backgroundColor : '#f98267'}} onPress={()=>{
                this.props.navigation.goBack();
            }}>
                <Text style={{color:'white'}}>CANCEL</Text>
            </Button>
            <Button style={{padding:50, alignSelf:'center', backgroundColor : '#f98267'}} onPress={()=>{

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
                    this.saveAppointment();
                }
            }}>
                <Text style={{color:'white'}}>SAVE</Text>
        </Button>*/}
            
        </View>
        <Footer style={{backgroundColor:this.state.butColor}}>
                                <FooterTab style={{backgroundColor:this.state.butColor}}>
                                    <Button onPress={() => this.props.navigation.goBack()} transparent style = {{}}>
                                    <View style={styles.footerbuttonLine}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>CANCEL</Text>
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
                                            this.saveAppointment();
                                        }
                                        }} transparent>
                                    <View style={styles.footerbutton}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>SAVE</Text>
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
