import React, { Component } from 'react';
import { StyleSheet, View,Text ,AsyncStorage, Share,Dimensions,Platform,ActivityIndicator} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import Pdf from 'react-native-pdf';
import Expo, { Constants } from 'expo';
import {Form, Label,Input, Item,Icon} from 'native-base';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import htmlFormRender from '../Data/htmlFormRender';
import { Footer, FooterTab, Button } from 'native-base';
import AndroidShare from 'react-native-share';


export default class PDFScreen extends Component {

static navigationOptions = ({navigation}) => {
    return {
        title: 'PDF Viewer',
        headerTitleStyle: {
          fontFamily: 'Lato-Regular',
          textAlign: 'center',
          flexGrow:1,
          alignSelf:'center',
      },
        headerRight: (
            
            <View></View>
        ),
        
    };
};
  constructor(props) {
    super(props);
    const key = props.navigation.getParam('pagekey');
    this.state = {
        pdfPath : '',
        pdfBase64 : '',
        pagekey : key,
        isReady : false
    };
    
  }

  _pringPDF = async()=>{
    try{
      console.log('url for print:', this.state.pdfPath);
       //const results = await Expo.Print.printAsync({uri:this.state.pdfPath})
       let results = await Expo.Print.printAsync({uri:this.state.pdfPath, width:595, height:842 });

    }catch(err){
        console.log(err)
    }
  }

  _generatePDF = async()=>{
    try{
      const aboutme = await AsyncStorage.getItem('@about-me:key');
      const value = await AsyncStorage.getItem('@'+this.state.pagekey+':key');
      var json = JSON.parse(value);
      var aboutmeJson = JSON.parse(aboutme);
        const htmlGenerator = new htmlFormRender(this.state.pagekey,json[0].content.rendered);
        const abouthtmlGenerator = new htmlFormRender('about-me',aboutmeJson[0].content.rendered,15);
        const mainFormTitle = await htmlGenerator.getTitle();
        mainFormTitle = `<h1 style="background-color:#FA7E5B; font-size: 28px;">mum and baby</h1>`+ mainFormTitle;
        const mainFormHTML = await htmlGenerator.generateHTML();
        const aboutFormHTML = await abouthtmlGenerator.generateHTML();
        
        var htmlStyles = require('../Data/htmlStyle').default;
        
        var html = `<html"><style>@page{margin:25px;}${htmlStyles.getHTMLStyle()}</style><body>${mainFormTitle}<div class="aboutme">${aboutFormHTML}</div>${mainFormHTML}<p style"page-break-inside: avoid;"> </p></body></html>` ;
        console.log("html geneator: "+ html);

        
        // console.log(file.filePath);
        
        // const file = await RNHTMLtoPDF.convert(options);
        // const file = await Expo.Print.printToFileAsync({html:html,base64:false});
        // const base = file.base64;
        // const re = await Expo.FileSystem.getInfoAsync(file.uri)
        if(Platform.OS == 'ios'){
          let options = {
            html: html,
            fileName: this.state.pagekey,
            directory: 'Documents',
            padding:30,
            height:842,
            width:595
          };
          let file = await RNHTMLtoPDF.convert(options)
          this.setState({pdfPath:file.filePath,isReady:true});
        }
        else{
          let width = Number(595);
          let height = Number(842);
          //const file = await Expo.Print.printToFileAsync({html:html,base64:false, width:width, height:height});
          const file = await Expo.Print.printToFileAsync({html:html,base64:true});
          const base = file.base64;
          this.setState({pdfPath:file.uri,isReady:true,pdfBase64:`data:application/pdf;base64,${base}`});
        }
        
    }catch(err){
        console.log(err)
    }
  }
  _share = async()=>{
    console.log(this.state.pdfPath);
    try{
      if(Platform.OS =='ios'){
        console.log('url for share:', this.state.pdfPath);
        const results = await Share.share({
          url: this.state.pdfPath,
          title: 'Share or Download PDF',         
      });
      }else{
        const shareOptions = {
          title: 'Share your personal care plan',
          url: this.state.pdfPath,
          // social: AndroidShare.Social.WHATSAPP
        };
       await AndroidShare.open(shareOptions);
      }

    }catch(err){
      console.log(err);
    }
  }

 componentDidMount(){
      this._generatePDF();
      this.props.navigation.setParams({ share: this._share });
  }

  render() {
      let butColor = '#2CC4AA';
      if(global.themeColor!=undefined){
        butColor  = global.themeColor;
      }
      let footerButtons = (<FooterTab style={{backgroundColor:butColor}}>
              <Button onPress={() => this._pringPDF()} transparent style = {{}}>
              <View style={styles.footerbuttonLine}>
                  
                      <View style={styles.footerTextContainer}>
                          <Text style = {styles.textStyle}>PRINT</Text>
                      </View>
                      
              </View>
              </Button>
              <Button onPress={() => this._share()} transparent style = {{}}>
              <View style={styles.footerbuttonLine}>
                  
                      <View style={styles.footerTextContainer}>
                          <Text style = {styles.textStyle}>SHARE</Text>
                      </View>
                      
              </View>
              </Button>
              </FooterTab>);
      if(Platform.OS == 'ios')
      {
        footerButtons = (
          <FooterTab style={{backgroundColor:butColor}}>
          
              <Button onPress={() => this._share()} transparent style = {{}}>
              <View style={styles.footerbuttonLine}>
                  
                      <View style={styles.footerTextContainer}>
                          <Text style = {styles.textStyle}>PRINT / SHARE</Text>
                      </View>
                      
              </View>
              </Button>
                                    </FooterTab>);
      } 
     if(this.state.isReady){
        return (
            <View style={styles.container}>
            
            <Pdf
              source={{uri:Platform.OS == 'ios'? this.state.pdfPath:this.state.pdfBase64}}
              onLoadComplete={(numberOfPages,filePath)=>{
                  console.log(`number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page,numberOfPages)=>{
                  console.log(`current page: ${page}`);
              }}
              onError={(error)=>{
                  console.log(error);
              }}
              style={styles.pdf}/> 
            {/* <View style={{position:'absolute',right:20,bottom:20, backgroundColor:'#FA7E5B',width:60,height:60,borderRadius:50, justifyContent:"center",alignItems:'center'}}>
              <Icon name='print' style={{color:'#fff', padding:10}} onPress={async()=>{
                try{
                  let results = await Expo.Print.printAsync({uri:this.state.pdfPath});

                }catch(err){
                  console.log(err);
                }

              }} />
            </View> */}
            <Footer style={{backgroundColor:butColor}}>
                                {footerButtons}
                            </Footer>
          </View>
        );
      }else{
        return (
            <View style={styles.container}>
              <View style={{flex:1,justifyContent: 'center',alignContent:'center'}}>
              <ActivityIndicator size="large" color="#FA7E5B" />

              </View>

          </View>
        );
      }

  }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#ffffff',
    },
    pdf: {
      flex:1,
      width:Dimensions.get('window').width,
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


  });