import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connectActionSheet } from "@expo/react-native-action-sheet";

//let user to select photo from their library or take a new photo
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
//let user to send a location
import * as Location from "expo-location";




class CustomActions extends React.Component {
    // let user to choose an existing image from their device’s media library
    pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      try {
        if (status === "granted") {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          }).catch((error) => console.log(error));
  
          if (!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // let user to take a picture with their device's camera
  takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // let user to send their locations
  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status === "granted") {
        let result = await Location.getCurrentPositionAsync({});
        // const longitude = JSON.stringify(result.coords.longitude);
        // const latitude = JSON.stringify(result.coords.latitude);

        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // ACTION SHEET 
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            this.pickImage();
            break;
          case 1:
            console.log("user wants to take a photo");
            this.takePhoto();
            break;
          case 2:
            console.log("user wants to get their location");
            this.getLocation();
          default:
            break;
        }
      }
    );
  };


  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

//StyleSheet
  const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: "#b2b2b2",
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: "#b2b2b2",
      fontWeight: "bold",
      fontSize: 16,
      backgroundColor: "transparent",
      textAlign: "center",
    },
  });