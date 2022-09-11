import React, { Component } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";

// import Gifted Chat library
import { GiftedChat } from "react-native-gifted-chat";

export default class Chat extends Component {
  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    const { color } = this.props.route.params;

    return (
      <ScrollView style={{ backgroundColor: color }}>
        <View style={styles.container}>
          <Text style={styles.text}>Let's Chat :)</Text>
        </View>
      </ScrollView>
    );
  }
}

//stayling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "80%",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
  },
});
