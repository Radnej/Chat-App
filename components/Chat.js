// import Gifted Chat library
import { GiftedChat, Bubble } from "react-native-gifted-chat";
//fixing keyboard for android
import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import React, { Component } from "react";

//import AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

//import Netinfo to know if user is offline or online
import NetInfo from "@react-native-community/netinfo";

//Firestore Database
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
    };

    // web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBx6N6ee_bH10UDFWIEzg_It2GUcBJcfzI",
      authDomain: "chatapp-7ba3d.firebaseapp.com",
      projectId: "chatapp-7ba3d",
      storageBucket: "chatapp-7ba3d.appspot.com",
      messagingSenderId: "251371325020",
      appId: "1:251371325020:web:428cc68e56dbae5d9c0899",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  //allowing store data to be rendered in view
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentsSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  // save messages to local storage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // saving messages without blocking the app
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  //delete messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    //loads the messages from asyncStorage
    this.getMessages();
    //title Chat name
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Reference to load messages via Firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // Check if user is offline or online using NetInfo
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
      } else
        this.setState({
          isConnected: false,
        });
    });

    // Authenticate user anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }
  //delete a original listener
  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  // function which be called when user sends a message
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // store messages
        this.saveMessages();
        // Call addMessage with last message in message state
        this.addMessages(this.state.messages[0]);
      }
    );
  }

  // store messages on Firestore
  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#fff",
          },
          right: {
            backgroundColor: "blue",
          },
        }}
      />
    );
  }

  // When user is offline disable sending new messages
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    const { color } = this.props.route.params;

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderUsernameOnMessage={true}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: this.state.user._id, name: this.state.user.name }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
