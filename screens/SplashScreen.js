import React from 'react';
import {Text, View, AsyncStorage, Dimensions, Image,ImageStore, Alert, StyleSheet, ActivityIndicator,NetInfo, Platform, Modal} from 'react-native';
import {StackNavigator} from "react-navigation";
import { Container, Header, Left, Body, Right, Button, Icon, Title, Footer, FooterTab } from 'native-base';
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import { AppLoading, Asset, Font } from 'expo';
import { FileSystem } from "expo";
import SHA1 from "crypto-js/sha1";
import {CacheManager} from "react-native-expo-image-cache";
import {TimeStamp} from '../assets/json/PreloadTimeStamp'

import CodeInput from 'react-native-confirmation-code-input';

const pretty = require('prettysize');


function cacheImages(images) {
    console.log("cacheImages");
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        //console.log("cacheImages test result");
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }


export default class SplashScreen extends React.Component {
	static contentLoaded = 0;
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Splash',
        header: null,
    });
    constructor(props){
        super(props);
        this.loadWelcomeScreen = this.loadWelcomeScreen.bind(this);
        this.getMyHospital = this.getMyHospital.bind(this);
        this.getMyDueDate = this.getMyDueDate.bind(this);
        this.isFirstLoad = this.isFirstLoad.bind(this);
        this.getConnectionInfo = this.getConnectionInfo.bind(this);
        this.cacheURLs = this.cacheURLs.bind(this);
        this.getMainData = this.getMainData.bind(this);
        this.getUpdateFromURI = this.getUpdateFromURI.bind(this);
        this.state ={ 
                    isLoading: false,
                    fontsLoaded:false,
                    dataLoaded:false,
                    baseDate: TimeStamp,
                    isFirstLoad: true,
                    DateLastStored: "",
                    needToCheckDate: false,
                    TodayDate:"",
                    loadingLargeImages: false,
                    skipLoading: false,
                    totalImages:0,
                    loadedImages:0,
                    totalThumbs:0,
                    loadedThumbs:0,
                    imagesLoading:false,
                    imagesToLoad:[],
                    totalimageLoad:0,
                    imagesLoaded:0,
                    searchSlugs:[],
                    connectionType:'none',
                    connectionChecked:false,
                    updatesFromURI:0,

                    showPincode : false,
                    pincode :  null,
                    hasCode : false,
                    firstCode:'',
                    secondCode:'',
                    isConfirm : false,
                    pincodeMsg:''
                    }
        const now = new Date();
        const month = (parseInt(now.getMonth()+1)>9) ? parseInt(now.getMonth()+1) : "0"+parseInt(now.getMonth()+1);
        const date = (now.getDate()>9) ? now.getDate() : "0"+now.getDate();
        const hour = (now.getUTCHours()>9) ? now.getUTCHours() : "0"+now.getUTCHours();
        const minute = (now.getUTCMinutes()>9) ? now.getUTCMinutes() : "0"+now.getUTCMinutes();
        const second = (now.getUTCSeconds()>9) ? now.getUTCSeconds() : "0"+now.getUTCSeconds();
        const storedDate = now.getFullYear()+"-"+month+"-"+date+"T"+hour+":"+minute+":"+second;
        this.state.TodayDate = storedDate;  
        console.log('Base date'+TimeStamp);
        console.log('Date: '+storedDate);
   
    }
    async componentDidMount(){
        
        try{
            // await AsyncStorage.setItem("@PINCODE",'0000')
            // await AsyncStorage.removeItem("@PINCODE")

            var pincode = await AsyncStorage.getItem("@PINCODE")
            if(pincode){
                this.setState({pincode:pincode,hasCode:true,pincodeMsg:'Please enter your pincode.'});
                
            }else{
                this.setState({hasCode:false, pincodeMsg:'Please create a new pincode.'})
            }


        }catch(err){
            console.log(err)
        }
        await Font.loadAsync({
            'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
            'Lato-Italic': require('../assets/fonts/Lato-LightItalic.ttf'),
            'Lato-Medium': require('../assets/fonts/Lato-Medium.ttf'),
            'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf'),
            'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
            'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
            
            'Merriweather-Regular': require('../assets/fonts/Merriweather-Regular.ttf'),
          });
          
        global.catCount = 0;
        global.currentLoad = "Loading all data";
        

        this.setState({fontsLoaded:true});

        this.getConnectionInfo();

    }
    _login = async(code)=>{
        try{
            await AsyncStorage.setItem("@PINCODE",code)
            this.setState({pincode:code,showPincode:false})
            if(this.state.isReady == true){

                this.loadWelcomeScreen();
            }
        }catch(err){
            console.log(err)
        }

    }
    async getConnectionInfo () {
        
        if (Platform.OS === 'ios') {
          return new Promise((resolve, reject) => {
            const connectionHandler = connectionInfo => {
              NetInfo.removeEventListener('connectionChange', connectionHandler)
                console.log("net connection: "+connectionInfo.type);
                this.state.connectionType = connectionInfo.type;
                this.isFirstLoad();
                resolve(connectionInfo)
            }
      
            NetInfo.addEventListener('connectionChange', connectionHandler)
          })
        }
        else{
            const connection = await NetInfo.getConnectionInfo()

            //if(connection.type =='wifi'||connection.type =='cellular'){
            this.state.connectionType = connection.type;
            console.log("net connection: "+connection.type);
            
            //}
        }
        this.isFirstLoad();
        return true;
      }
      async isFirstLoad() {
        try {
        	
			const value = await AsyncStorage.getItem('@DateLastStored:key');
            const DateLastStored = value;
            console.log("try get is first load "+ DateLastStored);
            if(DateLastStored !== null){
                console.log("IS NOT first load");
                this.state.DateLastStored = DateLastStored;
                this.state.isFirstLoad = false;
            }
            else{
                console.log("IS first load");
                this.state.DateLastStored = this.state.baseDate;
                this.state.isFirstLoad = true;
            }
            this.state.needToCheckDate = true;
            this.state.fontsLoaded = true;
            this._loadAssetsAsync();
            
        } catch (error) {
            console.log("Error retrieving data" + error);
            this.state.DateLastStored = this.state.baseDate;
            this.state.isFirstLoad = true;
            this.state.needToCheckDate = true;
            this._loadAssetsAsync();
            }
        return true;
    }
    async _loadAssetsAsync() {
        
            console.log("load assets async!!!");
            
        
        await Promise.all([this.getSearchSlugs(),this.getMyHospital(), this.getMyDueDate()]).then( async results => {
            // do something with results.
            console.log("PROMISE FINISHED recieved basic setup" + results.length);
        })
        /*for (var c in Answers) {
            console.log("number of preload images:"+Answers[c]);
           // Asset.fromModule(Answers[c]).downloadAsync();

        }*/
        //await this.getSettings();

        await this.getMainData();
      }
      async getSettings(){
      //http://mumandbaby.imagineear.com/wp-json/wp/v2/posts/3612
      }
      async getMainData(){
        const localURLs = [this.cacheLocalFile([require('../assets/json/json_2_page_1.json'),false]),
        this.cacheLocalFile([require('../assets/json/json_44_page_1.json'),true]),
        this.cacheLocalFile([require('../assets/json/json_44_page_2.json'),true]),
        this.cacheLocalFile([require('../assets/json/json_67_page_1.json'),true]),
        this.cacheLocalFile([require('../assets/json/json_79_page_1.json'),true]),
        ];
        
        global.totalSize = 0; 
        await Promise.all([...localURLs]).then( async results => {
            console.log("GOT LOCAL PROMISE FINISHED" + results.length);
                let CompleteSlugKeys = [];
                for(let i = 0; i<results.length; i++){
                    const tempObj = results[i];
                    if(tempObj !== undefined){
                        if(tempObj.slugKey !== undefined){
                            CompleteSlugKeys = CompleteSlugKeys.concat(tempObj.slugKey);
                        }
                    }
                }
                for(let s = 0; s<CompleteSlugKeys.length; s++){
                    const tempSlug = CompleteSlugKeys[s];
                    if(this.state.searchSlugs.indexOf(tempSlug)<0){
                        this.state.searchSlugs.push(tempSlug);
                    }
                    
                }
                console.log("CompleteSlugKeys: "+ this.state.searchSlugs.length);
    
                await AsyncStorage.setItem('@SEARCH_KEYS',JSON.stringify(this.state.searchSlugs));
        });
        const urlAssets = [this.cacheURLs(['2',false]), 
            this.cacheURLs(['44',true]),
            this.cacheURLs(['67',true]),
            this.cacheURLs(['79',true])];
        
        const imageAssets = cacheImages([
                require('../assets/images/afterbirth_but.png'),
                require('../assets/images/afterbirth_topicon.png'),
                require('../assets/images/appointments_but.png'),
                require('../assets/images/baby_icon.png'),
                require('../assets/images/beforebirth_but.png'),
                require('../assets/images/beforebirth_topicon.png'),
                require('../assets/images/birth_but.png'),
                require('../assets/images/birth_icon.png'),
                require('../assets/images/birth_topicon.png'),
                require('../assets/images/calendar_icon.png'),
                require('../assets/images/careplan_but.png'),
                require('../assets/images/hospital_icon.png'),
                require('../assets/images/identy_icon.png'),
                require('../assets/images/logo_and_text.png'),
                require('../assets/images/maternity_but.png'),
                require('../assets/images/menu_logo.png'),
                require('../assets/images/nct_link.png'),
                require('../assets/images/nhs_link.png'),
                require('../assets/images/preg_icon.png'),
                require('../assets/images/white_arrow.png'),
                require('../assets/images/www_link.png'),
                require('../assets/images/welcome_explore.jpg'),   
            ]);
        await Promise.all([...urlAssets, ...imageAssets]).then( async results => {
                // do something with results.
                console.log("GOT URL PROMISE FINISHED" + results.length);
                let CompleteSlugKeys = [];
                let CompleteLargeImages = [];
                let CompleteThumbImages = [];
                let totalSize = 0;
                for(let i = 0; i<results.length; i++){
                    const tempObj = results[i];
                    if(tempObj !== undefined){
                        if(tempObj.slugKey !== undefined){
                            
                            CompleteSlugKeys = CompleteSlugKeys.concat(tempObj.slugKey);
                            //console.log("tempObj.slugKey: "+tempObj.slugKey.length)
                        }
                    }
                }
                for(let s = 0; s<CompleteSlugKeys.length; s++){
                    const tempSlug = CompleteSlugKeys[s];
                    if(this.state.searchSlugs.indexOf(tempSlug)<0){
                        this.state.searchSlugs.push(tempSlug);
                    }
                    
                }
                console.log("CompleteSlugKeys: "+ this.state.searchSlugs.length);
    
                await AsyncStorage.setItem('@SEARCH_KEYS',JSON.stringify(this.state.searchSlugs));
                
                for(let i = 0; i<results.length; i++){
                    const tempObj = results[i];
                    if(tempObj !== undefined){
                        if(tempObj.thumbs !== undefined){
                            //console.log(tempObj.images);
                            CompleteThumbImages = CompleteThumbImages.concat(tempObj.thumbs);
                        }
                        if(tempObj.images !== undefined){
                            CompleteLargeImages = CompleteLargeImages.concat(tempObj.images);
                        }
    
                    }
                    
                    
                }
                console.log("total large images:"+ CompleteThumbImages.length)
                this.state.totalThumbs = CompleteThumbImages.length;
                for(let i = 0; i<CompleteThumbImages.length; i++){
                    
                        const uri = CompleteThumbImages[i];
                        if (uri != null) {
                        console.log("cache Images: "+ uri);
                        const ext = uri.substring(uri.lastIndexOf("."), uri.indexOf("?") === -1 ? undefined : uri.indexOf("?"));
                        const path = FileSystem.documentDirectory + SHA1(uri) + ext;
                        const info = await FileSystem.getInfoAsync(path);
                            if (!info.exists || !this.state.isFirstLoad) {
                                global.totalSize = global.totalSize + Number(info.size);
                                totalSize = totalSize + Number(info.size);
                                console.log("have to download image"+pretty(totalSize));
                                await FileSystem.downloadAsync(uri, path);
                            }
                        }
    
                    this.setState.loadedThumbs = this.state.loadedThumbs+1;
                }
                
                this.state.totalImages = CompleteLargeImages.length;
                for(let i = 0; i<CompleteLargeImages.length; i++){
                    //const tempObj = CompleteLargeImages[i];
                    if(!this.state.skipLoading){
                        const uri = CompleteLargeImages[i];
                        console.log("cache Images: "+ uri);
                        const ext = uri.substring(uri.lastIndexOf("."), uri.indexOf("?") === -1 ? undefined : uri.indexOf("?"));
                        const path = FileSystem.documentDirectory + SHA1(uri) + ext;
                        const info = await FileSystem.getInfoAsync(path);
                        //console.log("have to download image"+info.exists);
                        if (!info.exists || !this.state.isFirstLoad) {
                            global.totalSize = global.totalSize + Number(info.size);
                            totalSize = totalSize + Number(info.size);
                            console.log("have to download image"+pretty(totalSize));
                            await FileSystem.downloadAsync(uri, path);
                        }
    
                        //await Image.prefetch(path);
                    }
                    this.state.imagesLoaded =  this.state.imagesLoaded+1;
                }
                if(this.state.updatesFromURI >=5){
                    console.log('Update DateLastStored value');
                    await AsyncStorage.setItem('@DateLastStored:key', this.state.TodayDate);
                }
                
                if(!this.state.showPincode){
                    this.loadWelcomeScreen();
                }
                else{
                    this.setState({isReady: true, loadingLargeImages: true });
                }
                
                
            });
      }
      async cacheLocalFile(json) {
        let slugKeysArray = [];
            if(this.state.isFirstLoad == true){
                
                console.log("cacheLocalFile");
                
                    //console.log("what is data",jsonData[0]);
                    const data =  json[0];
                    const searchEnable = json[1];

                    for(var i in data)
                    {
                            if(data[i].slug != undefined){

                                let slugKey = '@'+data[i].slug+':key';
                                console.log('add local key:'+slugKey);
                                await AsyncStorage.setItem(slugKey, "["+JSON.stringify(data[i])+"]");
                                if(searchEnable == true){
                                    slugKeysArray.push(slugKey);
                                }
                                
                            }
                    }
                
                
            }
            return {
                thumbs:[],
                images:[],
                slugKey:slugKeysArray
            }
        
        
  }   

    async cacheURLs(url) {
            console.log('trying to get url with connection: '+ this.state.connectionType)
            let imageThumbURLArray = [];
            let imageURLArray = [];
            let slugKeysArray = [];
            if(this.state.connectionType == 'wifi' || this.state.connectionType == 'cellular'){

                const categoryName = url[0];
                const searchEnable = url[1];
                const catURL = "http://mumandbaby.imagineear.com/wp-json/wp/v2/categories?include="+categoryName;
                const catResponse = await fetch(catURL);
                //console.log("recieved category: "+ catURL);
                const catData =  await catResponse.json();
                // console.log("number of cats: "+ catData[0].count);
                const requestNumber = Math.ceil(Number(catData[0].count)/100);
                //console.log("number of cat pges: "+ requestNumber);
                
                for(var k = 0; k<requestNumber; k++){
                    
                    const pageNumber = k+1;
                    console.log("get page "+ pageNumber + "for cat: "+ categoryName);
                    let checkingDate = "";
                    //if(this.state.needToCheckDate == true){
                        checkingDate = "after="+this.state.DateLastStored+"&date_query_column=post_modified_gmt&";
                        console.log("need to check date:" + checkingDate);
                    //}
                    let urlString;
                    urlString = 'http://mumandbaby.imagineear.com/wp-json/wp/v2/posts?'+checkingDate+'per_page=100&page='+pageNumber+'&categories='+categoryName;

                    console.log("load category: "+ urlString);
                    let data = [];
                    try{
                        data = await this.getUpdateFromURI(urlString);
                        
                    }
                    catch(error){
                        console.log('error get url:'+ error)
                    }
    
                        for(var i in data)
                        {
                                if(data[i].slug != undefined){

                                    let slugKey = '@'+data[i].slug+':key';
                                    await AsyncStorage.setItem(slugKey, "["+JSON.stringify(data[i])+"]");
                                    if(searchEnable == true){
                                        slugKeysArray.push(slugKey);
                                    }
                                    if(data[i].better_featured_image !== null){
                                        try{
                                            // add the thumbnail to loader
                                            const imageURL = data[i].better_featured_image.media_details.sizes.thumbnail.source_url;
                                            imageThumbURLArray.push(imageURL); 
                                            //try and find images on the page
                                            const htmlString = String(data[i].content.rendered);
                                            const imgStart = htmlString.indexOf('img src="');
                                            const imgEnd = htmlString.indexOf('"',imgStart+9);
                                            if(imgStart>=0){
                                                const imgURL = htmlString.substring(imgStart+9,imgEnd);
                                                //console.log("img url:"+imgURL)
                                                imageURLArray.push(imgURL); 
                                            }

                                            
                                            
                                        }
                                        catch(error){
                                            console.log("prefetch error: "+error);
                                        }
                                    }
                                }
                        }
                    
                }
            }
            return {
                thumbs:imageThumbURLArray,
                images:imageURLArray,
                slugKey:slugKeysArray
            }
            
      } 
      async getUpdateFromURI(uri) {
        
          try {
            let response = await fetch(uri);
            let responseJson = await response.json();
            this.state.updatesFromURI ++;
            return responseJson;
          } catch (error) {
            console.error(error);
            return [];
          }
      }
      async getSearchSlugs() {
        try {
        	
			const value = await AsyncStorage.getItem('@SEARCH_KEYS');
            if(value !== null){
                console.log("IS NOT first load");
                //this.state.searchSlugs = JSON.parse(value);
                this.state.searchSlugs = JSON.parse(value);
                return true
            }
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
    }  
    
    
    
    async getMyDueDate(){
        const value = await AsyncStorage.getItem('@MyDueDate:key');
        global.duedate = value;
        console.log("Duedate: "+ global.duedate);
        return true;
    }
    async getMyHospital() {
        try {
        	console.log("try get hospital slug");
			const value = await AsyncStorage.getItem('@MyHospital:key');
            const pageSlug = value;
            let hospitalContent;
            if(pageSlug !== null){
                global.myhospitalSlug = pageSlug;
                try {
                    console.log("try get hospital title");
                    const value = await AsyncStorage.getItem('@'+pageSlug+':key');
                    const updateDataSource = JSON.parse(value);
                    global.myhospitalTitle = updateDataSource[0].title.rendered;
                    
                } catch (error) {
                    console.log("Error retrieving data" + error);

                        }
            }
            else{
                global.catCount ++;
                global.myhospitalSlug = null;
            }
            return true;
            
        } catch (error) {
            console.log("Error retrieving data" + error);
            return true;
				}
        return true;		
    }

    async removeInitialDate(){
        await AsyncStorage.removeItem('@DateLastStored:key');
    }
    async loadWelcomeScreen(){
		try {
				
				const value = await AsyncStorage.getItem('@Welcome:key');
				//console.log("gettin");
				var {navigate} =  this.props.navigation;
				if (value !== null) {
				  // We have data!!
				  //console.log(value);
                  console.log("Goto home screen") 
                  //navigate("Welcome", {title:"temp title", desc: "description text to show what could be shown", image:"test"})
                  
                  //////////////RESET NEXT FOR LAUNCH//////////////
                  navigate("Home", {title:"temp title", desc: "description text to show what could be shown", image:"test"})
				}
				else{
					try {
				await AsyncStorage.setItem('@Welcome:key', 'set');
				  } catch (error) {
					// Error saving data
				  }
                  console.log("Goto welcome screen")  
                  navigate("Welcome", {title:"temp title", desc: "description text to show what could be shown", image:"test"})
				}
				 //this.props.navigation.navigate('ScreenRegister', {title: 'WHATEVER'})
			} catch (error) {
				console.log("Error retrieving data" + error);
			}
    	
    	

    }
    render(){
        const dimensions = Dimensions.get('window');
        let imageHeight = (Math.round(dimensions.width)) * (191/750);
        if(!this.state.showPincode){
            imageHeight = (Math.round(dimensions.width)) * (586/750);
        }
        const imageWidth = dimensions.width;
        
        if(!this.state.fontsLoaded){
            return(
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white'
                  }}>
                        <ActivityIndicator size="large" color="#2CC4AA" />
                                </View>
            );
        }
        
        else if(!this.state.showPincode){
            return(
                <View style={{
                    flex: 1,
                    backgroundColor: 'white'
                  }}>
            <View>
            <Image
                                        source={require('../assets/images/logo_and_text.png')}
                                        style={{ width:imageWidth, height:imageHeight, marginTop:60,marginBottom:60, backgroundColor:"#fff"}}
                                />
            <View style={{flex:1, width: Dimensions.get('window')-40, padding:20}}>
                            <View style={{flex:2}}/>
                            <View style={{flex:4,alignItems: 'center', justifyContent:'center',}}>
                            
                                <View style={{height:60, width:'100%', padding:0,
                                        borderRadius: 5,backgroundColor:'#2CC4AA', alignItems: 'center',
                                        justifyContent:'center',flexDirection: 'row',}}>
                                <ActivityIndicator style={{flex:1, padding:0}}size="large" color="#fff" />
                                <Text style={{flex:2, fontFamily: 'Lato-Bold',color:'#fff',fontSize:18}}>Checking for updates</Text>
                                </View>
                                
                            </View>
                            
                            <View style={{flex:2}}/>
            </View> 
            </View>
            </View>
            
            )



        }
        else{
            return(
            <View style={{
                flex: 1,
                backgroundColor: 'white'
              }}>
            <Image
                source={require('../assets/images/welcome_logo.png')}
                style={{ width:imageWidth, height:imageHeight, marginTop:60,marginBottom:60, backgroundColor:"#fff"}}
            />
            
          <View>
          
          
            <View style={{justifyContent: 'center',alignItems:'center'}}>
            
                <Text style={{fontFamily: 'Lato-Light',fontSize:16,}}>{this.state.pincodeMsg}</Text>
            </View>
            
            <View style={{justifyContent:'flex-start',alignItems:'center', height:200,width:'100%',backgroundColor:'transparent'}}>
                        <CodeInput
                            ref="codeInputRef"
                            secureTextEntry
                            // compareWithCode='1234'
                            activeColor='#555'
                            inactiveColor='rgba(49, 180, 4, 1.3)'
                            autoFocus={true}
                            ignoreCase={true}
                            inputPosition='center'
                            size={50}
                            codeLength={4}
                            keyboardType="numeric"
                            borderType='underline'
                            onFulfill={(code) => {
                                console.log(code)
                                console.log(this.state.pincode)
                                console.log(this.state.hasCode)
                                this.refs.codeInputRef.clear();

                                if(this.state.hasCode){
                                    //login
                                    if(this.state.pincode == code){
                                        console.log("loggin", this.state.isReady);
                                        if(this.state.isReady == true){

                                            this.loadWelcomeScreen();
                                        }
                                        else{
                                            this.setState({showPincode:false})
                                        }
                                    }else{
                                        console.log("wrong code");
                                        alert('Wrong pincode, Please try again!');

                                    }
                                }else{

                                    if(!this.state.isConfirm){
                                        console.log('first')
                                        this.setState({firstCode:code,isConfirm:true, pincodeMsg:'Please confirm your pincode.'})
                                    }else{
                                        console.log('second')
                                        //Please confirm your pincode
                                        this.setState({secondCode:code})
                                        
                                        if(this.state.firstCode != code){
                                            this.setState({isConfirm:false,pincodeMsg:'Please create a new pincode.'})
                                            alert('Pincode does not match, Try again!');
                                        }else{
                                            this._login(code);
                                        }
                                    }
                                    //register
                                }
                            }}
                            containerStyle={{ position: 'absolute',}}
                            codeInputStyle={{ borderWidth: 0, borderBottomWidth: 3, borderColor: '#2CC4AA'}}
                            />
                        </View>
                        </View>
                        </View>
            )
        }

        
        }
        
    }

const styles = StyleSheet.create({
    footerbutton: {
        backgroundColor:'#2CC4AA',
        width:'100%',
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
      textStyle:{
        fontFamily: 'Lato-Regular',
          color: '#fff',
          fontSize:16,

        },
	homeImage: {
		height:346,
		width:331,
	},
	default: {
		color: '#FA7E5B',
		fontFamily: 'Lato-Light',
		fontSize: 14,
	},
	
	backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
relatedLinksBar: {
    backgroundColor:'#2CC4AA',
    flexGrow:1,
    height:null,
    width:null,
    alignItems: 'center',
    justifyContent:'center',
  },
  subitem: {
    backgroundColor:'#ffffff',
    flex: 1, 
    flexDirection: 'row',
    height:120,
    width:null,
   borderTopColor: '#FA7E5B',
    borderTopWidth: 1,
  },
  subitemText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Lato-Light',
    textAlign: 'left',
  },
  relatedbutton: {
    backgroundColor:'#ECFAF7',
    flexGrow:1,
    height:80,
    width:null,
    alignItems: 'center',
    justifyContent:'center',
  },
  relatedbuttonText: {
    color: '#808080',
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    height:30,
    textAlign: 'left',
  },
  internalLink: {
    backgroundColor:'#FA7E5B',
    flexGrow:1,
    height:null,
    width:null,
    alignItems: 'center',
    justifyContent:'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    height:30,
    textAlign: 'left',
	},
	container: {
		flex: 0.5,
		justifyContent: 'center',
		backgroundColor:'#fff',
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	},
});

