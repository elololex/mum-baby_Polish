import React from 'react';
import {Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button} from 'react-native';
import User from "../Data/User";
import HTMLView from 'react-native-htmlview';
import {StackNavigator} from "react-navigation";
import ThirdScreen from "./ThirdScreen";
//const util = require('util');


export default class SecondScreen extends React.Component {
    static navigationOptions = {
        title: 'Second screen'
    };
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
    }
    componentDidMount(){
        return fetch('http://www.davidhoskins.co.uk/appdata/wp-json/mylistingplugin/v1/author/1.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                }, function(){

                });

            })
            .catch((error) =>{
                console.error(error);
            });
    }
    convertHtml(stg:String){
        console.log("responseJson = " + stg);
        let newStg:String = stg.replace("Welcome to WordPress.", "Hello to WordPress.")
        //let string:String =  as String;
        return (
            //<HTMLView  value=newStg
            //           stylesheet=styles2/>
            <View>

                {newStg.indexOf("GOTO1") >= 0 ? this.createButtons("GOTO1") : null}
                <HTMLView  value={newStg.replace("GOTO1","")}
                          stylesheet={styles2}/>
            </View>

            );

    }
    createButtons(stg:String){

        return( <View><Button
            onPress = {
                () => this.chooseScreen(stg)

            }
            title = {stg}
        /></View>
        )


    }
    chooseScreen (str){
        var {navigate} =  this.props.navigation;

       if(str=="GOTO1"){
            navigate("First", {title:"temp title", desc: "description text to show what could be shown", image:"test"})
       }
       /* else if(str==2){
            navigate("Third", {})
        }*/
    }
    render() {
        console.log("this.props.navigation.state = " + util.inspect(this.props.navigation.state, false, null));
        let pic = {
            uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
        };
        var {params} = this.props.navigation.state;
        var user:User = require('../Data/User').default;

        const titleMessage = <Text> {user.getCurrentUser()}</Text>;
        const descMessage = <Text> {params.desc}</Text>;
        const imageMessage = <Image source={pic} style={{width: 193, height: 110}}/>;
        user.setCurrentUser("hjkjhk");
        const htmlContent = `
            <ul>
              <li style =><span>Coffee</span></li>
              <li><span>Tea</span></li>
              <li><span>Milk</span></li>
            </ul>
        `;
        return (

            <View>
<ScrollView>
    <HTMLView   value={this.state.dataSource}
                stylesheet={styles2}/>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item}) => this.convertHtml(item.post_content)
                    }
                    keyExtractor={(item, index) => index}
                />
</ScrollView>
                {params.title != "" ? titleMessage : null}
                {user.getCurrentUser() != "" ? descMessage : null}
                {params.image != "" ? imageMessage : null}
            </View>
        );

    }
    }
const styles2 = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // pink links
    },
    ul: {
        fontWeight: '600',
        color: '#CC00FF',

    },
    li: {
        fontWeight: '600',
        color: '#000000',

    },
    span: {
        color: '#000000'
    }
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 20,
        fontSize: 30,
        height: 60
    },
})
