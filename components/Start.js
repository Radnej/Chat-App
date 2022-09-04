import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  Button,
} from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      color: "#333139",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box1}>
          <TextInput
            style={[styles.inputBox, styles.smallText]}
            placeholder="Your Name"
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this.props.navigation.navigate("Chat", {
                name: this.state.name,
                color: this.state.color,
              })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
