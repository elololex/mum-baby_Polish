import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import RelatedLinkItem from './RelatedLinkItem';
import { Item, CheckBox, Content, ListItem, Body, Left, Right, Radio, Container } from 'native-base';
//const util = require('util');
export default class Checkboxes extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        linkNode: this.props.linkNode,
                        itemSelected: 'null',
                        checkBoxesUpdate: this.props.checkBoxesUpdate,
                        checkBoxCount: 0,
                        answers:this.props.answers,
                        checkBoxesText:[]
                        }
        /*if(this.state.answer == null){
                this.state.answers = [];
        }*/
    }
    componentDidMount(){
        this.state.checkBoxesUpdate(this.state.answers, this.state.checkBoxesText);
    }
    itemTapped(itemIndex){
        console.log("item selected:"+itemIndex + this.state.answers[itemIndex]);
        for(var i = 0; i<this.state.checkBoxCount; i++){
            if(i == itemIndex){
                if(this.state.answers[i] == false || this.state.answers[i] == undefined){
                    this.state.answers[i] = true; 
                }
                else{
                    this.state.answers[i] = false;
                }
            }
            
        }
        this.state.checkBoxesUpdate(this.state.answers, this.state.checkBoxesText, true);
        this.setState({itemSelected: itemIndex});
    }
    render(){
        const state = this.state;
        var listItems = Array();
        let boxesText = [];
		for(var i = 0; i<this.state.linkNode.children.length; i++){
            //console.log("show name: "+this.state.content[i].name);
            var childNode = this.state.linkNode.children[i];
				if(childNode.name == "li"){
					let listIndex = listItems.length;
                    this.state.checkBoxCount = listIndex+1;
                    let isSelected = false;
                    if(this.state.answers !== null || this.state.answers !== undefined ){
                        if(this.state.answers.length >listIndex){
                            isSelected = this.state.answers[listIndex];
                        }
                        else{
                            isSelected = false;
                            this.state.answers[listIndex] = false;
                        }
                    }
                    if(this.state.checkBoxesText.indexOf(childNode.children[0].data)<0){
                        //console.log("PUSH ANSWER"+ childNode.children[0].data);
                        this.state.checkBoxesText.push(childNode.children[0].data);
                        this.state.checkBoxesUpdate(this.state.answers, this.state.checkBoxesText, false);
                    }
                    
                    listItems.push(
                        <ListItem style = {{paddingBottom:5}} key = {listIndex} onPress={() => this.itemTapped(listIndex)}>
                        <CheckBox onPress={() => this.itemTapped(listIndex)} checked={isSelected} color={global.themeColor}/>
                        <Body>
                        <Text style = {styles.itemText} >
                            {childNode.children[0].data}
                        </Text>
                        </Body>
                        </ListItem>
					);
				}
        }
        
        
        /*if(this.state.answers.length == 0){
            this.state.answers = Array(this.state.checkBoxCount).fill(false);
        }*/
        return (
            
        <View style = {{paddingBottom:20, marginRight:10}}>
                {listItems}
        </View>
          
        );
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
      itemText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Lato-Light',
        textAlign: 'left',
        paddingLeft:10,
        paddingBottom:5,
      },
    });

// withNavigation(Checkboxes);