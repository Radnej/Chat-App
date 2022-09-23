import React from "react";
// import Gifted Chat library
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
//fixing keyboard for android
import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

//import AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

//import Netinfo to know if user is offline or online
import NetInfo from "@react-native-community/netinfo";

import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

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
        avatar: "",
      },
      isConnected: false,
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
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentsSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || "",
        },
        image: data.image || null,
        location: data.location || null,
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
    //title Chat name
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Check if user is offline or online using NetInfo
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });

        //empty the asyncStorage from messages if there is connection
        this.deleteMessages();

        // Reference to load messages via Firebase
        this.referenceChatMessages = firebase
          .firestore()
          .collection("messages");
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
      //loads the messages from asyncStorage
      else {
        this.getMessages();
        this.setState({
          isConnected: false,
        });
      }
    });
  }
  //delete a original listener
  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
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
      image: message.image || null,
      location: message.location || null,
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

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    const { color } = this.props.route.params;

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          //this build action button
          renderActions={this.renderCustomActions.bind(this)}
          renderUsernameOnMessage={true}
          renderBubble={this.renderBubble.bind(this)}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: this.state.user._id, name: this.state.user.name }}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
