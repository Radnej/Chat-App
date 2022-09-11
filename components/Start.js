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
      color: "#090C08",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/Background-Image.png")}
          style={styles.backgroundImage}
        >
          <Text style={styles.titleBox}>Chat App</Text>
          <View style={styles.box1}>
            <TextInput
              style={[styles.inputBox, styles.smallText]}
              placeholder="Your Name"
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
            />
            <View style={styles.colorWrapper}>
              <Text style={[styles.smallText, styles.label]}>
                Choose Background Color:
              </Text>
              <View style={styles.colors}>
                <TouchableOpacity
                  style={[styles.color, styles.color1]}
                  onPress={() => this.setState({ color: "#090C08" })}
                />
                <TouchableOpacity
                  style={[styles.color, styles.color2]}
                  onPress={() => this.setState({ color: "#474056" })}
                />
                <TouchableOpacity
                  style={[styles.color, styles.color3]}
                  onPress={() => this.setState({ color: "#8A95A5" })}
                />
                <TouchableOpacity
                  style={[styles.color, styles.color4]}
                  onPress={() => this.setState({ color: "#B9C6AE" })}
                />
              </View>
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
        </ImageBackground>
      </View>
    );
  }
}

//styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleBox: {
    flex: 1,
    paddingTop: "30%",
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  box1: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    alignItems: "center",
    width: "88%",
    height: "40%",
    marginBottom: "5%",
    paddingTop: "5%",
    paddingBottom: "5%",
  },
  inputBox: {
    width: "88%",
    padding: "2%",
    height: 50,
    borderColor: "#b2afba",
    borderWidth: 1.5,
    borderRadius: 4,
  },
  colorWrapper: {
    width: "88%",
    height: "60%",
    justifyContent: "center",
    marginLeft: "2%",
  },
  label: {
    marginBottom: "5%",
  },
  colors: {
    flexDirection: "row",
    marginBottom: "5%",
  },
  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 42,
  },
  color1: {
    backgroundColor: "#090C08",
  },
  color2: {
    backgroundColor: "#474056",
  },
  color3: {
    backgroundColor: "#8A95A5",
  },
  color4: {
    backgroundColor: "#B9C6AE",
  },
  buttonWrapper: {
    width: "88%",
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    height: 50,
    width: "100%",
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  smallText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
  },
});
