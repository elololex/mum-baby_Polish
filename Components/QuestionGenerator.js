import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, KeyboardAvoidingView} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import RelatedLinkItem from './RelatedLinkItem';
import { Item, CheckBox, Content, ListItem, Body, Left, Right, Radio, Container, Label,Textarea, Form, Input } from 'native-base';
import DatePicker from 'react-native-datepicker';
import Checkboxes from './Checkboxes';
import HTMLView from 'react-native-htmlview';
import { TextInput } from 'react-native-gesture-handler';
import BulletPoints from './BulletPoints';
import moment from 'moment';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
// const _format = 'YYYY-MM-DD'
const _format = 'DD/MM/YYYY'
const Entities = require('html-entities').XmlEntities;


export default class QuestionGenerator extends React.Component {
  getNewIndex(){
      this.state.newIndex = this.state.newIndex + 1;
    return(
      this.state.newIndex
    );
  }
    constructor(props){
        super(props);
        this.checkBoxesUpdate = this.checkBoxesUpdate.bind(this);
        this.state ={   isLoading: true,
                        content: this.props.content,
                        node: this.props.node,
                        defaultRenderer:this.props.defaultRenderer,
                        newValue: '',
                        date: '',
                        storeDateAsDue: false,
                        answer: this.props.answer,
                        question: '',
                        description: '',
                        hint: '',
                        questionIndex: this.props.questionIndex,
                        questionsFunction: this.props.questionsFunction,
                        text:"",
                        checkboxes:[],
                        checkboxesText:[],
                        newIndex: 600,
                        height: 160
                        }
        if(this.props.answer !== null){
          
          if(this.state.answer.textResponse !== null){
            this.state.text = this.props.answer.textResponse;
          }
          if(this.state.answer.checkBoxesResponse !== null){
            this.state.checkboxes = this.state.answer.checkBoxesResponse;
          }
          
        }
    }
    componentDidMount(){
      //this.checkBoxesUpdate = this.checkBoxesUpdate.bind(this);
    }
    updateSize = (height) => {
      this.state.questionsFunction([this.state.questionIndex,this.state.text,this.state.checkboxes,this.state.checkboxesText,this.state.question, this.state.description, this.state.hint],false);
      this.setState({
        height
      });
    }
    updateText = async(text) =>{
      console.log("trying to update", text);
      // this.state.text = text;
      
      if(this.state.storeDateAsDue){
        global.duedate = text;
        var Analytics = require('../Data/Analytics').default;
        Analytics.hitEvent('User','DueDate',global.duedate);
        await AsyncStorage.setItem('@MyDueDate:key', text);
        // AsyncStorage.removeItem('@MyDueDate:key');
        console.log("global duedate update: "+ global.duedate);
      }
      this.state.questionsFunction([this.state.questionIndex,text,this.state.checkboxes,this.state.checkboxesText,this.state.question, this.state.description, this.state.hint], true);
      this.setState({text});
    }
    checkBoxesUpdate(answers, textBoxText, userinput = false){
        this.state.checkboxes = answers;
        this.state.checkboxesText = textBoxText;
        this.state.questionsFunction([this.state.questionIndex,this.state.text,this.state.checkboxes, this.state.checkboxesText,this.state.question, this.state.description, this.state.hint], userinput);
    }
    render(){
      
      let {newValue, height} = this.state;
      if(height<160){
        height = 160;
      }
      let newStyle = {
        height
      }
      let tempCheckboxes;
      let question;
      let bulletPointList;
      let prompt;
      let textBox;
      let dateSelect;
      let singleTextBox;
      node = this.state.node;

      let preloadText = ""
      if(this.state.text !== null){
          preloadText = this.state.text;
        }
      defaultRenderer = this.state.defaultRenderer;

      for(var i =0; i<node.children.length; i++){

        if(node.children[i].name == "h3"){
            var linkNode = node.children[i];
            question = (defaultRenderer(linkNode.children, linkNode));
            this.state.question = linkNode.children[0].data;
            
        }
        if(node.children[i].name == "p"){
          var linkNode = node.children[i];
          question = (defaultRenderer(linkNode.children, linkNode));
          this.state.question = linkNode.children[0].data;
          //this.state.question = question;
          
        }
        if(node.children[i].name == "ul"){
          var linkNode = node.children[i];
          const a = linkNode.attribs;
			    if (a['data-cat'] == 'bulletPoint') {
              bulletPointList = (<BulletPoints key={this.state.questionIndex+"b"+this.getNewIndex()} linkNode = {linkNode} index = {this.getNewIndex()} defaultRenderer = {defaultRenderer}/>)
          }
          else{
            if(this.state.answer !== null){
              if(this.state.answer.checkBoxesResponse !== null){
                tempCheckboxes = (<Checkboxes linkNode = {linkNode} answers = {this.state.answer.checkBoxesResponse} checkBoxesUpdate = {this.checkBoxesUpdate.bind(this)}/>)
              }
             }
            else{
              tempCheckboxes = (<Checkboxes linkNode = {linkNode} checkBoxesUpdate = {this.checkBoxesUpdate.bind(this)}/>)
            }
            
          }
          
          
        }
        if(node.children[i].name == "i"){
          var linkNode = node.children[i];
          prompt = (defaultRenderer(linkNode.children, linkNode));
          this.state.description = linkNode.children[0].data;
        }
        if(node.children[i].name == "span"){
          var linkNode = node.children[i];
          prompt = (defaultRenderer(linkNode.children, linkNode));
          this.state.description = linkNode.children[0].data;
        }
        
        if(node.children[i].name == "div"){
          var linkNode = node.children[i];
          const a = linkNode.attribs;
          
          if (a['data-cat'] == "text-input") {
            let hintText;
            for(var l =0; l<linkNode.children.length; l++){
              var childNode = linkNode.children[l];
              if(childNode.name == "i"){
                //console.log("i found in text hint"+ childNode.children[0].data)
                hintText = childNode.children[0].data;
                const entities = new Entities();
                hintText = entities.decode(hintText);
                this.state.hint = hintText;
              }
            }
            
            console.log("found text-input in question: "+this.state.text);
            textBox = (<Item> 
              <View style={{borderColor:'#ddd', borderRadius:10, borderWidth:1, flex:1, }}>
                {/*<Textarea  style={{ 
                    fontFamily: 'Lato-Light',
                    fontSize: 17,margin:10,width: '90%', height: height, borderColor: '#979797'}}
                    rowSpan={5} 
                    placeholder={hintText} 
                    multiline={true}
                    onChangeText={(text) => this.setState({text})}
                    value= {this.state.text}
                    onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                />*/}
              
                <AutoGrowingTextInput  style={{
                  fontFamily: 'Lato-Light',
                fontSize: 17,
                padding:5,
                width:'100%',
                 borderColor: '#979797',
                 textAlignVertical: "top",
                }} 
                underlineColorAndroid={'transparent'}
                InputProps={{ disableUnderline: true }}
                minHeight={height}
                placeholder={hintText} 
                value= {this.state.text}
                onChangeText={(value) => this.updateText(value)}
                />
                </View>
              </Item>);
          }
          if (a['data-cat'] == "single-text") {
            var linkNode = node.children[i];
            let questionTitle;
            if(linkNode.children.length > 0){
                //console.log("i found in text hint"+ childNode.children[0].data)
                questionTitle = linkNode.children[0].data;
                this.state.question = questionTitle;
              }
            if(a['data-my-hospital'] == 'true' && global.myhospitalTitle != null){
              const entities = new Entities();
              this.state.text = entities.decode(global.myhospitalTitle);
            }
            console.log("question title: ", questionTitle);
            
              
         
            textBox = (
            <Item stackedLabel last>
              <Label style={{
                  fontFamily: 'Lato-Regular',
                fontSize: 17,}}>{questionTitle}</Label>
              <Input value={this.state.text} onChangeText={(value) => this.updateText(value)} style={{ 
              fontFamily: 'Lato-Light',
              fontSize: 17}}/>
            </Item>
            );
          }
          if (a['data-cat'] == "multi-text") {
            var linkNode = node.children[i];
            let questionTitle;
            if(linkNode.children.length > 0){
                //console.log("i found in text hint"+ childNode.children[0].data)
                questionTitle = linkNode.children[0].data;
                this.state.question = questionTitle;
              }
            if(a['data-my-hospital'] == 'true' && global.myhospitalTitle != null){
              const entities = new Entities();
              this.state.text = entities.decode(global.myhospitalTitle);
            }
            console.log("question title: ", questionTitle);
            /*<Item stackedLabel last>
              <Label>{questionTitle}</Label>
              <Input value={this.state.text} onChangeText={(value) => this.updateText(value)}/>
            </Item>*/
            textBox = (
             
            <Item  stackedLabel style={{borderColor:'transparent',flexGrow: 1,}}>
            <Label style={{
                  fontFamily: 'Lato-Regular',
                fontSize: 17,}}>{questionTitle}</Label>
                <AutoGrowingTextInput  style={{
                  fontFamily: 'Lato-Light',
                fontSize: 17,
                paddingBottom:20,
                width:'100%',
                textAlignVertical: "top",
                }} 
                underlineColorAndroid={'transparent'}
                InputProps={{ disableUnderline: true }}
                minHeight={100}
                placeholder={''} 
                value= {this.state.text}
                onChangeText={(value) => this.updateText(value)}
                />
              </Item>
            );
          }
          if (a['data-cat'] == "date-select") {
            var linkNode = node.children[i];
            let questionTitle;
            if(linkNode.children.length > 0){
                //console.log("i found in text hint"+ childNode.children[0].data)
                questionTitle = linkNode.children[0].data;
                this.state.question = questionTitle;
              }
            if(a['data-due-date'] == 'true'){
              this.state.storeDateAsDue = true;
              if(this.state.text === null || this.state.text === ""){
                console.log("global.duedate: " + global.duedate);
                let tempDate = '';
                if(global.duedate == null){
                  //tempDate = moment().format(_format);
                  tempDate = '';
                }
                else{
                  //tempDate = moment(global.duedate).format(_format);
                  tempDate = global.duedate;
                }
                this.state.text = tempDate;
              }
            }
            console.log(a['data-due-date'])
            console.log("date title: ", questionTitle);
            // console.log("date initial set: ", moment(this.state.text).format(_format));
            console.log("date initial set: ", this.state.text);
            // const recordedDate = moment(this.state.text).format(_format);
            textBox = (
            <Item stackedLabel style={{
              flex:1}}>
              <Label style={{
                  fontFamily: 'Lato-Regular',
                fontSize: 17,}}>{questionTitle}</Label>
              {/* <Input onChangeText={(value) => this.setState({appointmentDate: value})}>{this.props.navigation.state.params.day}</Input> */}
              <DatePicker
                style={{width: '100%'}}
                date={this.state.text}
                // defaultDate={new Date(this.state.text)}
                mode="date"
                placeholder="select date"
                format={_format}
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
                  fontFamily: 'Lato-Light',
                  fontSize: 17,
                }
                // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {
                  console.log("date set: pre -> "+ date);
                  //this.updateText(new Date(date));
                  // let formattedDate = moment(new Date(date)).format(_format);
                  // console.log("date set: post ->"+ formattedDate);

                  this.updateText(date);
                }}
            />
            </Item>);
          }
        }
        
      }
      if(this.state.isLoading){
          this.state.isLoading = false;
          this.state.questionsFunction([this.state.questionIndex,this.state.text,this.state.checkboxes, this.state.checkboxesText,this.state.question, this.state.description, this.state.hint], false);
         
      }
        return (
        <View style={htmlStyles.subMenu}>
        {question}
        {bulletPointList}
        {tempCheckboxes}
        {prompt}
        {textBox}
        </View>
      
        )
    }
}

const styles = StyleSheet.create({
    relatedLinksContainer: {
        paddingTop:10,
        backgroundColor:'#ffffff',
      },
    relatedLinksBar: {
        backgroundColor:'#2CC4AA',
        flexGrow:1,
        height:40,
        width:null,
        alignItems: 'flex-start',
        justifyContent:'center',
        paddingLeft: 20,
      },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Lato-Bold',
        height:30,
        textAlign: 'left',
      },
    });
    const htmlStyles = StyleSheet.create({
      bulletContainer:{
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'stretch',
        padding:5,
        paddingBottom: 10
      },
      subMenu:{
        paddingTop: 0,
        paddingBottom: 20,
      },
      textComponent:{
        color: '#000000',
        fontFamily: 'Lato-Light',
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        lineHeight: 25,
      },
      span: {
        color: '#000000',
        fontFamily: 'Lato-Light',
        fontSize: 16,
        padding:0,
        margin:0,
        paddingTop: 0,
        marginBottom: 15,
        lineHeight: 25,
      },
      img: {
        paddingBottom:15,
      },
      h1: {
        fontFamily: 'Merriweather-Regular',
        fontSize: 24,
        textAlign: 'left',
        color: '#000000',
        paddingTop:15,
        paddingBottom:15,
        lineHeight: 30,
      },
      h2: {
        fontFamily: 'Lato-Medium',
        fontSize: 18,
        textAlign: 'left',
        color: '#644D45',
        paddingBottom:15,
      },
      
      p: {
            fontFamily: 'Lato-Light',
            fontSize: 5,
        },
        
        a: {
            color: '#2CC4A7', // pink links
            fontFamily: 'Lato-Light',
        },
        ol:{
            color: '#FA7E5B',
            fontFamily: 'Lato-Regular',
    
        },
        b:{
          fontFamily: 'Lato-Bold',
        },
        ul: {
            color: '#FA7E5B',
            fontFamily: 'Lato-Light',
        },
        li: {
            color: '#000000',
            fontFamily: 'Lato-Light',
        },
        
    })
// withNavigation(Checkboxes);