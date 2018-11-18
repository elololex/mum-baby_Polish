import React from 'react';
import {Text, View, Button} from 'react-native';
//const util = require('util');
import User from "../Data/User";

export default class ThirdScreen extends React.Component {
    static navigationOptions = {
        title: 'Third screen'
    };
    render() {
        return (
            <View>
                <Text>Choose Hospital</Text>
                <Button
                    onPress = {
                        () => this.chooseHospital("hello-world")

                    }
                    title = "Go to Hospital1"
                />
                <Button
                    onPress = {
                        () => this.chooseHospital("hospital-2")

                    }
                    title = "Go to Hospital2"
                />
                <Button
                    onPress = {
                        () => this.chooseHospital("hospital-3")

                    }
                    title = "Go to Hospital3"
                />
            </View>
        );
    }
    chooseHospital (str){
        var user:User = require('../Data/User').default;
        var {navigate} =  this.props.navigation;
        user.setCurrentUser(str);
        navigate("Home", {title:"temp title", desc: "description text to show what could be shown", image:"test"})

    }
}