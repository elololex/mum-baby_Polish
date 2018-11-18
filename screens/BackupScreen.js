import React, { Component } from 'react';
import {Alert, SafeAreaView, StyleSheet, View, Text, Image, AsyncStorage ,  Modal,
  ActivityIndicator,Platform
} from 'react-native';
import { Container,Content, Header, Left, Body, Right, Icon, Title ,Button, List, ListItem} from 'native-base';
import { Footer, FooterTab } from 'native-base';
import Expo from "expo"
import {createStackNavigator} from 'react-navigation'
import moment from 'moment' 
import axios from 'axios'

const url = 'https://www.googleapis.com/drive/v3'
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3'
const boundaryString = 'foo_bar_baz'
const __androidClientId = "145027294735-9ap91gcto3k9lh05khn9s2he5h9q53ma.apps.googleusercontent.com";
// const __androidClientId = "471068649632-tnh026g4p2l93if9g7p3vp5la0ujjbai.apps.googleusercontent.com";
const __iosClientId = "145027294735-6g2076uorogpth72aones7ajsre6b0es.apps.googleusercontent.com";
// const __iosClientId = "471068649632-mb8od6d5hdan2nbu3da9fp3030uc28v7.apps.googleusercontent.com";
const __webClientId = "145027294735-2ba1sj5kmhhgpif1agpk43mj7rkbhg97.apps.googleusercontent.com";
// const __webClientId = "471068649632-ntlr8otf08vdi1fgdgnv1lbftopsfrbe.apps.googleusercontent.com";
const BACKUP_FILE_ID = 'mumandbabyfileid0009';

const REFRESH_TOKEN = '@REFRESH_TOKEN';

//Storage keys
const backupKeys =
["@MyHospital:key",
"@MyDueDate:key",
"@about-me:key",
"@about-me_answers:key",
"@birth-reflections:key",
"@birth-reflections_answers:key",
"@after-your-baby-is-born-plan:key",
"@after-your-baby-is-born-plan_answers:key",
"@personalised-birth-preferences:key",
"@personalised-birth-preferences_answers:key",
"@health-and-wellbeing-in-pregnancy:key",
"@health-and-wellbeing-in-pregnancy_answers:key","@APPOINTMENT_DATABASE"];

import RestoreScreen from './backup_stack/RestoreScreen';
import CreateContent from '../Components/CreateContent';
const colors  = {
    main : '#f98267'
}
 class BackupScreen extends Component {
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Backup',
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
        ),
        headerRight: (
            
          <View></View>
      ),
    });
  constructor(props) {
    super(props);
    this.state = {accessToken : '',  refreshToken : '',loading:false,signedIn: false, name: "", photoUrl: "",backupData: 
      {
        appointment : "new appointment",
        aboutme: "About me",
        hospitalSelection : 0,
      },
      allData : [],
      modalVisible : false,
      butColor:'#2CC4AA',
    
    }
    var Analytics = require('../Data/Analytics').default;
		    Analytics.hitPage('Backup');
  }

  getAuthorization = async ()=>{
    const _refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
    console.log('--> ',_refreshToken);
    const __client_id = Platform.OS === 'ios'?__iosClientId : __androidClientId;
      if(_refreshToken){
        const _body = {
          client_id : __client_id,
          refresh_token:_refreshToken,        
          grant_type:'refresh_token'
         }
        let response = await axios.post('https://www.googleapis.com/oauth2/v4/token',_body)
        if(response){
          // console.log(response);
          const newAcessToken = response.data.access_token;
          this.setState({
            accessToken : newAcessToken
          })
        }
      }else{
        await this.signIn();
      }
  }

  signIn = async () => {
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        androidStandaloneAppClientId: __androidClientId,
        iosStandaloneAppClientId: __iosClientId,
        webClientId: __webClientId,
        scopes: ["profile","email", "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.appdata"]
      })

      if (result.type === "success") {
        console.log(result)
        this.setState({
          accessToken : result.accessToken,
          refreshToken : result.refreshToken,
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        })
        // console.log(result.refreshToken)
        await AsyncStorage.setItem(REFRESH_TOKEN,result.refreshToken);
      } else {
        console.log("cancelled")
      }
  }


  uploadBackup = async ()=>{


    const localData = {}
    const data = []
    var results = backupKeys.map(async(key)=>{
      var content = await AsyncStorage.getItem(key);
      if(content){
        // var json = JSON.stringify(content);
        localData[key] = content;
      }
    })
    var compileResults = await Promise.all(results);
    console.log('--> backup',localData["@MyHospital:key"]);
    this.setState({backupData:localData});

    let response = await fetch(`${url}/files?spaces=appDataFolder`, this.configureGetOptions());
    let resjson = await response.json();
    // console.log(resjson);
    const _backupFile = resjson.files[0];
      let updateFIleCallback = await this.updateFile(localData,_backupFile?_backupFile.id:null)
      Alert.alert(
        'Backup System',
        'Successfully updated backup system',
        [
        {text: 'OK'},
        ],
        { cancelable: false }
        ) 
  }


 parseAndHandleErrors = (response)=> {
    if (response.ok) {
      return response.json()
    }
    return response.json()
      .then((error) => {
        throw new Error(JSON.stringify(error))
      })
  }
  
  configureGetOptions = ()=> {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.state.accessToken}`)
    return {
      method: 'GET',
      headers,
    }
  }
  
  configurePostOptions = (bodyLength, isUpdate = false) => {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.state.accessToken}`)
    headers.append('Content-Type', `multipart/related; boundary=${boundaryString}`)
    headers.append('Content-Length', bodyLength)
    return {
      method: isUpdate ? 'PATCH' : 'POST',
      headers,
    }
  }
  
 createMultipartBody  = (body, isUpdate = false) =>{
    // https://developers.google.com/drive/v3/web/multipart-upload defines the structure
    // name:`MB_${moment().format('YYYY_MM_DD_hh_mm_sss')}.json`,

    const metaData = {
        name:`MB_BACKUP_FILE.json`,
        description: 'Backup data for my app',
        mimeType: 'application/json',
    }
    // if it already exists, specifying parents again throws an error
    if (!isUpdate) metaData.parents = ['appDataFolder']
  
    // request body
    const multipartBody = `\r\n--${boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`
    + `${JSON.stringify(metaData)}\r\n`
    + `--${boundaryString}\r\nContent-Type: application/json\r\n\r\n`
    + `${JSON.stringify(body)}\r\n`
    + `--${boundaryString}--`
  
    return multipartBody
  }
  
  // uploads a file with its contents and its meta data (name, description, type, location)
   uploadFile = (content, existingFileId) =>{
    const body = this.createMultipartBody(content, !!existingFileId)
    const options = this.configurePostOptions(body.length, !!existingFileId)
    return fetch(`${uploadUrl}/files${existingFileId ? `/${existingFileId}` : ''}?uploadType=multipart`, {
      ...options,
      body,
    }).then(this.parseAndHandleErrors)
  }

  // Updates a file with its contents and its meta data (name, description, type, location)
  updateFile = (content, existingFileId) =>{
    console.log('esting -> ',!!existingFileId)
    console.log('esting id -> ',existingFileId)
    const body = this.createMultipartBody(content, !!existingFileId)
    const options = this.configurePostOptions(body.length, !!existingFileId)
    return fetch(`${uploadUrl}/files${existingFileId ? `/${existingFileId}` : ''}?uploadType=multipart`, {
      ...options,
      body,
    }).then(this.parseAndHandleErrors)
  }  
  // Looks for files with the specified file name in your app Data folder only (appDataFolder is a magic keyword)
  queryParams = () => {
    return encodeURIComponent("name = 'mumandbaby_backup.json' and 'appDataFolder' in parents")
  }
  

  restoreUserData = async ()=>{
    const options = this.configureGetOptions()

    const getBackup = await fetch(`${url}/files?spaces=appDataFolder`, options)
    const backupFIlejson = await getBackup.json();
    this.setState({allData : backupFIlejson.files})

    let backupFile = backupFIlejson && backupFIlejson.files && backupFIlejson.files.length > 0 ? backupFIlejson.files[0] : null;
    if(backupFile){
      const fieldId = backupFile.id;
      const fileContent = await fetch(`${url}/files/${fieldId}?alt=media`, options)
      const files = await fileContent.json();
      for (var key in files) {
        // skip loop if the property is from prototype
        if (!files.hasOwnProperty(key)) continue;

        await AsyncStorage.setItem(key,files[key]);
        console.log(key);
      }
      Alert.alert(
        'Restore complete',
        'Following data was restored (Appointments, Personal care plan, Hospital selections)',
        [
        {text: 'OK'},
        ],
        { cancelable: false }
        ) 
    }else{
      Alert.alert(
        'Restore System',
        'Could not find a restore file.',
        [
        {text: 'OK'},
        ],
        { cancelable: false }
        ) 
    }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _handerBackupErrorAlert = ()=>{

  }
  async createBackup(){
    var Analytics = require('../Data/Analytics').default;
    Analytics.hitEvent('Backup','create','');
    this.setState({loading:true})
                      try{
                        await this.getAuthorization();
                        await this.uploadBackup();
                      }catch(err){
                        console.log(err);
                        Alert.alert(
                          'ERROR',
                          `An error occured while backing up your data. Please sign in with your google account to backup your data`,                          [
                          {text: 'OK'},
                          ],
                          { cancelable: false }
                          ) 
                      }
                       this.setState({loading:false})
  }
  async restoreBackup(){
    var Analytics = require('../Data/Analytics').default;
    Analytics.hitEvent('Backup','restore','');
    this.setState({loading:true})
                      try{
                        await this.getAuthorization();
                        await this.restoreUserData();
                      }catch(err){
                        console.log(err);
                        Alert.alert(
                          'ERROR',
                          `An error occured while restoring your data. Please  sign in with your google account to restore your backup data`,
                          [
                          {text: 'OK'},
                          ],
                          { cancelable: false }
                          ) 
                      }
                      this.setState({loading:false})
  }
  //Render
  render() {

    return (
        <View style={styles.container}>
            <View style={{flex:1, backgroundColor:"#fff"}}>
            <CreateContent slug = {"back-up"}/>
      
            </View>
              
          {this.state.loading &&
          <View style={{position:'absolute',top:0,right:0,left:0,bottom:0, flex:1, justifyContent:'center',alignItems: 'center',backgroundColor:'rgba(255,255,255,0.5)',    }}>
          <View style={{paddingLeft:50,paddingRight:50,paddingTop:20,paddingBottom:20 ,backgroundColor:'#fff',
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 1}}> 
          <ActivityIndicator size="large" color="#FA7E5B" />
            <Text style={{fontSize:18,color:"#FA7E5B", marginTop:10}}>Processing Request...</Text>
            </View> 

          </View>
      }
        {/* </Modal> */}
        <Footer style={{backgroundColor:this.state.butColor}}>
                                <FooterTab style={{backgroundColor:this.state.butColor}}>
                                    <Button onPress={() => this.restoreBackup()} transparent style = {{}}>
                                    <View style={styles.footerbuttonLine}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>RESTORE</Text>
                                            </View>
                                            
                                    </View>
                                    </Button>
                                    <Button onPress={() => this.createBackup()} transparent>
                                    <View style={styles.footerbutton}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>BACKUP</Text>
                                            </View>
                                            
                                    </View>
                                    </Button>
                                </FooterTab>
                            </Footer>
        </View>

    );
  }
}

export default createStackNavigator({
    BackupScreen:{screen:BackupScreen},
    RestoreScreen:{screen:RestoreScreen},
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



const styles = StyleSheet.create({
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
    },
    container: {
        flex: 1,
        backgroundColor:"#fff",
      },
  header: {
    fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
  });


  