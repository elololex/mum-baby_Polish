import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
//const util = require('util');

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import SubMenuItem from '../Components/SubMenuItem';
import GoToLink from './GoToLink';
import RelatedLinks from './RelatedLinks';
import { Video } from 'expo';
import VideoPlayer from './VideoPlayer';
import MainMenuButton from './MainMenuButton';
import MainIntro from './MainIntro';
import { Item, CheckBox, Content, ListItem, Body, Left, Right, Radio, Footer, FooterTab, Button, List } from 'native-base';
import Checkboxes from './Checkboxes';
import QuestionGenerator from './QuestionGenerator';
import BulletPoints from './BulletPoints';
import ImageLoader from './ImageLoader';
import WelcomeCarousel from './WelcomeCarousel';
//const util = require('util');
class CreateContent extends React.Component {
    getNewIndex(){
   	 	this.state.newIndex = this.state.newIndex + 1;
   	 	//console.log("new index:", this.state.newIndex);
    	return(
    		this.state.newIndex
    	);
		}
		getNewQuestionIndex(){
			
			//console.log("new index:", this.state.newIndex);
			this.state.questionIndex = this.state.questionIndex + 1;
			return(
				this.state.questionIndex
			);
			
		}
    constructor(props){
				super(props);
				
        this.state ={ isLoading: true, txt: null, tableHead: ['Head', 'Head2'],
						tableData: [],
						slug: this.props.slug,
						title: "",
						newIndex: 200,
						questionIndex: -1,
						scrollable: true,
						questionsFunction: this.props.questionsFunction,
						answers: this.props.answers,
						}
				if(this.props.scrollable !== undefined){
					this.state.scrollable = this.props.scrollable;
				}
				this.getContent(this.state.slug);		


		}
    componentDidMount(){
        //this.navigationOptions.title = "test";
        this.newIndex = 0;
        this.getNewIndex = this.getNewIndex.bind(this); //add this line
        this.chooseScreen = this.chooseScreen.bind(this);
        this.renderNode = this.renderNode.bind(this);
        var user:User = require('../Data/User').default;
        
				
        return
            //this.render();
    }
    async getContent(currentPage) {
        try {
        	//console.log("try get key");
						const value = await AsyncStorage.getItem('@'+currentPage+':key');
						this.setState({txt: value, dataSource: JSON.parse(value), isLoading:false});
						const updateDataSource = JSON.parse(value);
            this.state.title = updateDataSource[0].title.rendered;
						this.state.firstpart = (this.processHTML(this.state.dataSource[0].content.rendered));
						 const {setParams} = this.props.navigation;
						 this.render();
    		setParams({ title: 'titleText' })
             //this.props.navigation.navigate('ScreenRegister', {title: 'WHATEVER'})
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }
    render() {
				const state = this.state;
				let tempColor = "#FA7E5B"
				if(global.useThemeColor == true){
					global.useThemeColor = false;
					tempColor = global.themeColor;
				}
				if(this.state.isLoading){
					return(
					<View style={[styles.container, styles.horizontal]}>
							<ActivityIndicator size="large" color= {tempColor}/>
					</View>
					);
			}
			else if(!this.state.scrollable){
				return (
				<View style={{flex: 1}}>
								{this.state.homepart}
								{this.state.firstpart}
								{this.state.secondpart}
								</View>	
				);
			}
			else{
        return (
					
            <KeyboardAwareScrollView style={{flex: 1}}>
								{this.state.homepart}
								{this.state.firstpart}
								{this.state.secondpart}
								</KeyboardAwareScrollView>	
				);
				}
    }
    processHTML(postContent){
		//	console.log("render HTML!!!" + postContent);
			const temphtml = postContent.replace(/(\r\n|\n|\r)/gm, "");
			temphtml.replace(new RegExp('<p>', 'g'), '<span>')
			.replace(new RegExp('</p>', 'g'), '</span>');

        return (
					
         <View style={{backgroundColor: '#FFFFFF', paddingLeft: 20, paddingRight: 20, paddingBottom:10}}>
					 <HTMLView  	
					 					addLineBreaks={false} 
									 value={temphtml}
									 renderNode={this.renderNode}
									 textComponentProps={{ style: htmlStyles.textComponent }}
    							stylesheet={htmlStyles}
                  />
   				</View>
        );
    }
    
    renderNode(node, index, siblings, parent, defaultRenderer) {
    var tempIndex:int = this.getNewIndex();
    //console.log("what is the index:", index);
    //console.log("what is the tempindex:", this.newIndex);
  	if(node.name == 'ul' || node.name == 'ol'){
			return(<BulletPoints key={this.getNewIndex()} linkNode = {node} index = {index} defaultRenderer = {defaultRenderer}/>);		
		}
	if (node.name == 'h4') {
			return(
				<View key={this.getNewIndex()} style={{backgroundColor:global.themeColor}}>{defaultRenderer(node.children, node)}</View>
			);
			
		}
  	if (node.name == 'img') {
			return(
				<ImageLoader key={this.getNewIndex()}node = {node}/>
			);
			
		}
  		
		if(node.name == 'div'){
			const a = node.attribs;
			if (a['data-cat'] == 'welcomeintro') {
				const dimensions = Dimensions.get('window');
				const imageHeight = Math.round((dimensions.width) * 274 / 346);
				const imageWidth = dimensions.width;
				this.state.homepart = (
					<Image
						key={this.getNewIndex()}				
						source={require('../assets/images/logo_and_text.png')}
                                        style={{ flex:1,width:imageWidth, height:imageHeight, marginTop:40, backgroundColor:"#fff"}}
                                />
					
				);
				this.forceUpdate();
				return null;
				/*if(this.state.homepart !== null){
					let pages = []
					for(var i =0; i<node.children.length; i++){
						//	console.log("div child:"+ node.children[i].name);
							if(node.children[i].name == "div"){
								const newpage = new Object();
								//console.log("add content for welcome");
								newpage.content = defaultRenderer(node.children[i].children, node.children[i]);
								pages.push(newpage);
							}
						}
						const dimensions = Dimensions.get('window');
					var imageHeight = Math.round((dimensions.width) * 274 / 346);
					var imageWidth = dimensions.width;
						this.state.homepart = (
							<View style = {{flexGrow:1}}>
							{/*<Image
										source={require('../assets/images/logo_and_text.png')}
										style={{width:imageWidth, height:imageHeight, marginTop:20, backgroundColor:"#fcb"}}
							/>*/
						/*}
							<View style = {{flex:1}}>
							<WelcomeCarousel style = {{flex:0.5}}entries = {pages}/>
							</View>
							</View>);
						this.forceUpdate();
					}
					
					return null;*/
				}
			if (a['data-cat'] == 'mainintro') {
				
				if(this.state.homepart !== null){
					const dimensions = Dimensions.get('window');
					var imageHeight = Math.round((dimensions.width) * 274 / 346);
					var imageWidth = dimensions.width;
						this.state.homepart = (<Image
							source={require('../assets/images/logo_and_text.png')}
							style={{width:imageWidth, height:imageHeight}}
					/>);
						this.forceUpdate();
					}
					let nohospital;
					let hospitalselected;
					//console.log("trying to find hospital divs");
					for(var i =0; i<node.children.length; i++){
					//	console.log("div child:"+ node.children[i].name);
						if(node.children[i].name == "div" && node.children[i].attribs['data-cat']=='nohospital'){
					//		console.log("found nohospital");
							nohospital = defaultRenderer(node.children[i].children, node.children[i]);
							//console.log("hosp log: "+nohospital);
						}
						else if(node.children[i].name == "div" && node.children[i].attribs['data-cat']=='hospitalselected'){
						//	console.log("found hospitalselected");
							//nohospital = defaultRenderer(node.children[i].children, node.children[i]);

							hospitalselected = defaultRenderer(node.children[i].children, node.children[i]);
						}
					}
					return (
						<MainIntro key={this.getNewIndex()} hospitalSelected={hospitalselected} nohospital={nohospital}/>
						
					);
				}
			if (a['data-cat'] == 'video') {
				const a = node.children[1].attribs;
				return (
					<VideoPlayer key={this.getNewIndex()} style={{padding: 15}}attribs = {a} videotitle = {node.children[0].data}/>
					
				);
				}
			if (a['data-cat'] == 'goto') {
			  const specialSyle = node.attribs.style;
				var linkNode;
				var gotoLinks = []; 
			  for(var i =0; i<node.children.length; i++){
					if(node.children[i].name == "a"){

						linkNode = node.children[i];
						gotoLinks.push(<GoToLink key={this.getNewIndex()} linkNode = {linkNode}/>);
					}
				}
			  //console.log("goto children length: ",node.children.length);
		  
			  return (
					<View key={this.getNewIndex()}>
					{gotoLinks}
					</View>
			  )
			}
			if (a['data-cat'] == 'mainbut') {
			  const specialSyle = node.attribs.style;
				var linkNode;
				var menuLinks = [];
				
			  for(var i =0; i<node.children.length; i++){
					if(node.children[i].name == "a"){
						linkNode = node.children[i];
						
					//	console.log("goto children length: ",node.children.length);
						menuLinks.push(
							<MainMenuButton key={tempIndex} linkNode = {linkNode}/>
						);
						tempIndex = this.getNewIndex();
					}
				}
			  tempIndex = this.getNewIndex();
			  return (
					<View key={tempIndex} style = {{
						flexDirection: 'row',
						justifyContent: 'center',
        		alignItems: 'center',
					}}>{menuLinks}</View>
			  )
			}
			if (a['data-cat'] == 'relatedlinks') {	
				/*for(var i:int =0; i<node.children.length; i++){
					console.log("show name before: " + node.children[i].name);
				}*/
				if(this.state.secondpart !== null){
					this.state.secondpart = (<RelatedLinks key={this.getNewIndex()} style={{position: 'absolute', left: 0, right: 0, bottom: 0}} relatedNodes = {node.children} />);
					this.forceUpdate();
				}
				return null;
			}
			if(a['data-cat'] =='submenu'){
			const specialSyle = node.attribs.style;
		  
			  var hyperLinks:Array = [];
			  for(var i:int =0; i<node.children.length; i++){
					if(node.children[i].name == "a"){
						var linkNode = node.children[i];
						const linkRef =  linkNode.attribs.href
						var chooseFunction = () => this.chooseScreen(linkRef);
						var splitArray = linkRef.split("/")
						var pageName = splitArray[splitArray.length-2];
						if(a['data-hospitals'] =='true'){
							hyperLinks.push(
								<SubMenuItem  key={this.getNewIndex()} slug = {pageName} parentTitle = {this.state.title} htmlTitle = {linkNode.children[0].data} hospitalpage = {true} hospitalID = {linkNode.attribs['data-hospitalid']}/>
							);
						}
						else{
							hyperLinks.push(
								<SubMenuItem  key={this.getNewIndex()} slug = {pageName} parentTitle = {this.state.title} htmlTitle = {linkNode.children[0].data}/>
							);
						}
					}
			  }
			  return (
				<List style={htmlStyles.subMenu} key={this.getNewIndex()}>
					{hyperLinks}
				</List>
			
			  )
			}
			if(a['data-cat'] =='question'){
				const specialSyle = node.attribs.style;
				const questionIndex = this.getNewQuestionIndex();
				//let answer = null;
				let answer = new Object();
        answer.questionIndex = questionIndex;
        answer.textResponse = "";
        answer.checkBoxesResponse = [];
				if(this.state.answers !== null){
					if(this.state.answers.length>questionIndex){
						answer = this.state.answers[questionIndex];
					}

					
				}
				console.log("answer: "+ answer);
				return(
					<QuestionGenerator key={index+"Q"+questionIndex} node = {node} defaultRenderer = {defaultRenderer} answer = {answer} questionIndex = {questionIndex} questionsFunction = {this.state.questionsFunction.bind(this)}/>
				);
				
			}
		}
		
		
	}
	onNavigationStateChange(){

	}
  async getImageURL(pageName){
		try {
			//console.log("get image url for "+pageName);
			const retrievedItem = await AsyncStorage.getItem('@'+pageName+':key');
			//console.log("json string "+retrievedItem);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log("get Image url ERROR "+error.message);
    }
    return
				
		}
    chooseScreen (str){
    		//console.log("choose screen triggered");
        var user:User = require('../Data/User').default;
        //console.log("Screen to:" + str);
				var splitArray = str.split("/")
				var pageName:String = splitArray[splitArray.length-2];
				console.log("Screen to 2:" + pageName);
        user.setCurrentPage(pageName);
        var {push} =  this.props.navigation;
        push("DefaultContent", {title:"temp title", desc: "description text to show what could be shown", image:"test"})


    }
}
const styles = StyleSheet.create({
	homeImage: {
		height:346,
		width:331,
	},
	default: {
		color: '#FA7E5B',
		fontFamily: 'Lato-Light',
		fontSize: 10,
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
		flex: 1,
		justifyContent: 'center',
		backgroundColor:'#fff',
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
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
		borderTopColor: '#FA7E5B',
    borderTopWidth: 1,
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
		fontFamily: 'Lato-Bold',
		fontSize: 18,
		textAlign: 'left',
		paddingTop: 10,
		color: '#644D45',
		paddingBottom:10,
	},
	h3: {
		fontFamily: 'Lato-Regular',
		fontSize: 16,
		textAlign: 'left',
		color: '#000000',
		paddingBottom:15,
	},
	h4: {
		fontFamily: 'Lato-Bold',
		fontSize: 18,
		textAlign: 'left',
		paddingTop: 10,
		paddingLeft: 10,
		color: '#ffffff',
		paddingBottom:10,
	},
	i: {
		fontFamily: 'Lato-Italic',
		fontSize: 16,
	},
	p: {
        fontFamily: 'Lato-Light',
				fontSize: 16,
		},
		
    a: {
        color: '#2CC4A7', // pink links
        fontFamily: 'Lato-Bold',
    },
    ol:{
        color: '#FA7E5B',
        fontFamily: 'Lato-Regular',

    },
    b:{
			fontFamily: 'Lato-Semibold',
			color: '#644D45',
		},
    ul: {
        color: '#FA7E5B',
        fontFamily: 'Lato-Light',
    },
    li: {
			color: '#000000',
			fontFamily: 'Lato-Light',
			fontSize: 16,
			padding:0,
			margin:0,
			paddingTop: 0,
			lineHeight: 25,
    },
    
})

export default withNavigation(CreateContent);
