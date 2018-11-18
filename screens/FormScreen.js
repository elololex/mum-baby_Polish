import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, KeyboardAvoidingView, ActivityIndicator,Alert} from 'react-native';
//const util = require('util');
import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native';
import User from "../Data/User";
import CreateContent from '../Components/CreateContent';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions,HeaderBackButton} from 'react-navigation';
import { Footer, FooterTab, Button } from 'native-base';


export default class FormScreen extends React.Component {
    
    static navigationOptions =({navigation }) => {
        
        return{
        title: navigation.getParam('replacementTitle',''),
        headerTitleStyle: {
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
        headerRight: (
            
            <Image
                  source={require('../assets/images/forms_topicon.png')}
                  style={{height:50, width:50}}
              />
        ),
            headerLeft:  (<HeaderBackButton
        onPress={() => {
            console.log('TRYING TO BACK CLICK')
            const goBack = navigation.getParam('onGoBack',null);
            //let goBack = navigation.goBack;
            //if (navigation.state.params.onGoBack) {
            //goBack = navigation.state.params.onGoBack;
            //}
            if(goBack != null){
                goBack();
            }
            
        }}
        tintColor = '#ffffff'
        />),
        }
    };
    goBack(){
        console.log('BACK CLICK')
        if(this.state.userEdited){
            console.log('Provide option to save');
            Alert.alert(
                'Unsaved changes',
                'Its appears that you have made changes to the form without saving, would you like to save them now?',
                [
                    {text: 'No', onPress: () => {
                        const {navigation} = this.props;
                        this.props.navigation.goBack();
                      }},
                  {text: 'Yes', onPress: async () => {
                    const {navigation} = this.props;
                    const pageSlug = navigation.getParam('slug', 'NO-ID');
                    var Analytics = require('../Data/Analytics').default;
                    Analytics.hitEvent('Form','savedOnBack',pageSlug);
                    console.log("save form for: "+pageSlug);
                    const answersJSON = JSON.stringify(this.state.answers)
                    console.log("Answers: "+ answersJSON);
                    await AsyncStorage.setItem('@'+pageSlug+'_answers:key', answersJSON);
                    this.props.navigation.goBack();

                  }},
                  
                ],
                { cancelable: false }
              )
        }
        else{
            const {navigation} = this.props;
            this.props.navigation.goBack();
        }
    }
    componentDidMount(){
        const {navigation} = this.props;
        //this.updateQuestion = this.updateQuestion.bind(this);
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        if(this.props.navigation.getParam('findTitle',false) == true){
            this.getTitle(pageSlug);
        }
        var Analytics = require('../Data/Analytics').default;
        Analytics.hitPage('Form'+pageSlug);
        this.props.navigation.setParams({onGoBack: ()=> this.goBack()});
    }
    constructor(props){
        super(props);
        this.goBack = this.goBack.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.printForm = this.printForm.bind(this);
        this.state ={ isLoading: true, 
                        answers:null,
                        butColor:'#2CC4AA',
                        userEdited: false,
                    }
       
        if(global.themeColor!=undefined){
            this.state.butColor  = global.themeColor;
        }
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        this.getAnswers(pageSlug);
     }
     async getAnswers(currentPage) {
        try {
        	console.log("try get title");
			const value = await AsyncStorage.getItem('@'+currentPage+'_answers:key');
            console.log("RESPONSE:"+value);
            let answers = JSON.parse(value);
            if(answers == null || answers == undefined){
                answers = [];
            }
            this.setState({answers: answers, isLoading:false});
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }
    async getTitle(currentPage) {
        try {
        	console.log("try get title");
			const value = await AsyncStorage.getItem('@'+currentPage+':key');
            const updateDataSource = JSON.parse(value);
            this.props.navigation.setParams({replacementTitle: updateDataSource[0].title.rendered});
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }
    updateQuestion(answer, userUpdate) {
        console.log("question updated: ", userUpdate);

        if(userUpdate == true){
            this.state.userEdited = true;
            console.log("userUpdate");
        }
        const answers = this.state.answers;
        const questionIndex = answer[0];
        const textResponse = answer[1];
        const checkBoxesResponse = answer[2];
        const checkBoxesText = answer[3];
        const questionTitle = answer[4];
        const questionDescription = answer[5];
        const questionHint = answer[6];
        let answerObject = new Object();
        answerObject.questionIndex = questionIndex;
        answerObject.textResponse = textResponse;
        answerObject.checkBoxesResponse = checkBoxesResponse;
        answerObject.checkBoxesText = checkBoxesText;
        answerObject.questionTitle = questionTitle;
        answerObject.questionDescription = questionDescription;
        answerObject.questionHint = questionHint;
        answers[questionIndex] = answerObject;
        console.log("questionDescription:"+ questionDescription);
        this.state.answers = answers;
      }
    render() {
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        if(this.state.isLoading){
            return(
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#FA7E5B" />
            </View>
            );
        }
        else{
            if(pageSlug !== "about-me"){
                return (
                    <KeyboardAvoidingView behavior="padding" style={{
                        flex: 1,
                        backgroundColor: 'white'
                      }}>
                        
                        <CreateContent slug = {pageSlug} answers = {this.state.answers} questionsFunction = {this.updateQuestion.bind(this)}/>
                        <Footer style={{backgroundColor:this.state.butColor}}>
                                <FooterTab style={{backgroundColor:this.state.butColor}}>
                                    <Button onPress={() => this.saveForm()} transparent style = {{}}>
                                    <View style={styles.footerbuttonLine}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>SAVE</Text>
                                            </View>
                                            
                                    </View>
                                    </Button>
                                    <Button onPress={() => this.printForm()} transparent>
                                    <View style={styles.footerbutton}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>DOWNLOAD</Text>
                                            </View>
                                            
                                    </View>
                                    </Button>
                                </FooterTab>
                            </Footer>
                    </KeyboardAvoidingView>
                );
            }
            else{
                return (
                    <KeyboardAvoidingView behavior="padding" style={{
                        flex: 1,
                        backgroundColor: 'white'
                      }}>
                        
                        <CreateContent slug = {pageSlug} answers = {this.state.answers} questionsFunction = {this.updateQuestion.bind(this)}/>
                        <Footer style={{backgroundColor:this.state.butColor}}>
                                <FooterTab>
                                    <Button onPress={() => this.saveForm()} style={{backgroundColor:this.state.butColor}}>
                                    <View style={styles.footerbutton}>
                                        
                                            <View style={styles.footerTextContainer}>
                                                <Text style = {styles.textStyle}>SAVE</Text>
                                            </View>
                                            
                                    </View>
                                    </Button>
                                </FooterTab>
                            </Footer>
                    </KeyboardAvoidingView>
                );
            }
            }
    }
    async printForm(){
        
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        console.log("save form for: "+pageSlug);
        var Analytics = require('../Data/Analytics').default;
        Analytics.hitEvent('Form','download',pageSlug);
        const answersJSON = JSON.stringify(this.state.answers)
        console.log("Answers: "+ answersJSON);
        await AsyncStorage.setItem('@'+pageSlug+'_answers:key', answersJSON);
        const aboutme = await AsyncStorage.getItem('@about-me_answers:key');
        //if(aboutme!=undefined){
            this.props.navigation.navigate('PDFScreen',{pagekey : pageSlug})
            console.log("printable pdf");
        /*}
        else{
            Alert.alert(
                'About me information missing',
                `To create a pdf version, please fill in you personal details within the 'About me' section first`,
                [
                {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'ok'},
                ],
                { cancelable: true }
            )
        }*/
    }
    async saveForm(){
       
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        var Analytics = require('../Data/Analytics').default;
        Analytics.hitEvent('Form','save',pageSlug);
        console.log("save form for: "+pageSlug);
        const answersJSON = JSON.stringify(this.state.answers)
        console.log("Answers: "+ answersJSON);
        await AsyncStorage.setItem('@'+pageSlug+'_answers:key', answersJSON);
        if(pageSlug == "about-me"){
            Alert.alert(
                'Form saved within app',
                'Remember that when you set an appointment your gestation period will automatically be calcuated using your due date',
                [
                {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'ok'},
                ],
                { cancelable: true }
            )
        }
        else{
            console.log("save "+this.state.answers.length+" questions for "+pageSlug);
            Alert.alert(
                'Form saved within app',
                "If you would like to save a remote backup, please following the 'backup' link on the main menu",
                [
                {text: 'Ok', onPress: () => console.log('OK Pressed'), style: 'ok'},
                
                ],
                { cancelable: true }
            )
        }
    }

    
}
const styles = StyleSheet.create({
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
