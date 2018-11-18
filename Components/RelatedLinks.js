import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import RelatedLinkItem from './RelatedLinkItem';
//const util = require('util');
class RelatedLinks extends React.Component {
    getNewIndex(){
            this.state.newIndex = this.state.newIndex + 1;
            console.log("new index:", this.state.newIndex);
        return(
            this.state.newIndex
        );
    }
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        relatedNodes: this.props.relatedNodes,
                        newIndex: 400,
                        }
    }
    componentDidMount(){

    }
    render(){
        const state = this.state;
        var relatedLinks = [];
		for(var i =0; i<this.state.relatedNodes.length; i++){
            console.log("show name: "+this.state.relatedNodes[i].name);
				if(this.state.relatedNodes[i].name == "a"){
					var linkNode = this.state.relatedNodes[i];
                    const linkRef =  linkNode.attribs.href
                    const linkType = linkNode.attribs.type;
                    let linkTitle = "undefined title"
                    if(linkNode.children[0].data !=undefined){
                        linkTitle = linkNode.children[0].data;
                    }
					relatedLinks.push(
                        <RelatedLinkItem key={this.getNewIndex()}link = {linkRef} linkTitle = {linkTitle} type = {linkType}/>
					);
				}
			  }
        return (
            <View style={styles.relatedLinksContainer}>
            <View style={styles.relatedLinksBar}>
                      <Text style={styles.buttonText}>
                        Related links
                      </Text>
              </View>
              {relatedLinks}
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
    });

export default withNavigation(RelatedLinks);