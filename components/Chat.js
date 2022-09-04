import React, { Component } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";

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
