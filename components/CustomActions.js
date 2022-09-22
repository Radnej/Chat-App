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