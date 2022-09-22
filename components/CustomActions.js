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