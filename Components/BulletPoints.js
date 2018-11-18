import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import RelatedLinkItem from './RelatedLinkItem';
import { Item, CheckBox, Content, ListItem, Body, Left, Right, Radio, Container } from 'native-base';
//const util = require('util');
export default class BulletPoints extends React.Component {
    getNewIndex(){
        this.state.newIndex = this.state.newIndex + 1;
        //console.log("new index:", this.state.newIndex);
    return(
        this.state.newIndex
    );
    }
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        linkNode: this.props.linkNode,
                        defaultRenderer: this.props.defaultRenderer,
                        index:this.props.index,
                        newIndex: 600,
                        }
    }
    componentDidMount(){
        //this.state.checkBoxesUpdate(this.state.answers);
    }
    
    render(){
            var bulletPoints = [];
            let count = 0;
            const node = this.state.linkNode;
            let defaultRenderer = this.state.defaultRenderer;
			for(var i =0; i<node.children.length; i++){
				
				if(node.children[i].name == "li"){
					count++;
					var linkNode = node.children[i];
					//<View style={htmlStyles.circle} />
					let bulletOrNumber = (<View style={htmlStyles.bulletCircleContainer}>
						
						<Text style={htmlStyles.circle}>•</Text>
					</View>);
					if(node.name == 'ol'){
						bulletOrNumber = (
							<View style={htmlStyles.bulletNumberContainer}>
								<Text style={htmlStyles.numberContainer}>{count}</Text>
							</View>
						);
					}
					//{defaultRenderer(linkNode.children, linkNode)}
					bulletPoints.push(
						<View key={this.state.index+"_"+this.getNewIndex()} style={htmlStyles.bulletContainer}>
							{bulletOrNumber}
							<View style={htmlStyles.bulletTextContainer}>
								{defaultRenderer(linkNode.children, linkNode)}
							</View>
						</View>
					);
				}
			}
			return (
				<View key={this.state.index+"_"+this.getNewIndex()} style={{paddingBottom: 10}}>
						{bulletPoints}
			   </View>
			);
    }
}

const htmlStyles = StyleSheet.create({
	bulletContainer:{
		flex: 1, 
		flexDirection: 'row',
		alignItems: 'stretch',
		padding:5,
		paddingBottom: 5
	
		
	},
	bulletCircleContainer:{
		flex: 1,
		flexDirection: 'row',
		paddingTop: 0,
		paddingLeft: 10,
	},
	
	circle: {
		color: '#FA7E5B',
		fontFamily: 'Lato-Bold',
		fontSize: 20,
		lineHeight: 25,
		
	},
	bulletNumberContainer:{
		flex: 1,
		paddingTop: 5,
		paddingLeft: 10
	},
	numberContainer:{
		color: '#FA7E5B',
		fontFamily: 'Lato-Bold',
	},
	bulletTextContainer:{
		flex: 10,
		flexDirection: 'row',
	},
	bulletText:{
		color: '#000000',
		fontFamily: 'Lato-Light',
		fontSize: 16
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