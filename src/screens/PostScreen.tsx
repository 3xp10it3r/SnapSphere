import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, PermissionsAndroid, Platform} from 'react-native';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Box, Image, Textarea, TextareaInput} from '@gluestack-ui/themed';
import {BottomTabNavigationEnum} from '../navigations/HomeTabs';
import uuid from 'react-native-uuid';
import CustomPaginationDots from '../components/common/CustomPaginationDots';
import Carousel from '../components/common/Carousel';
import {COLORS} from '../utils/theme/Theme';
import Button from '../components/common/Button';
import {usePostContext} from '../context/PostContext';
import {useAuth} from '../context/AuthContext';

export const defaultImage = require('../../assets/welcome-image.png');

const PostScreen = () => {
  const navigation = useNavigation<any>();
  const [imagesToUpload, setImagesToUpload] = useState<any>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [description, setDescription] = useState('');
  const flatListRef = useRef<FlatList | null>(null);
  const {addPost} = usePostContext();
  const {userData} = useAuth();

  const openCamera = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          const result: ImagePickerResponse = await launchCamera({
            saveToPhotos: true,
            mediaType: 'photo',
          });
          if (result.assets && result.assets.length > 0) {
            setImagesToUpload(result.assets);
          }
        } catch (error) {
          console.error('Error opening camera:', error);
        }
      }
    } else {
      try {
        const result: ImagePickerResponse = await launchCamera({
          saveToPhotos: true,
          mediaType: 'photo',
        });
        if (result.assets && result.assets.length > 0) {
          setImagesToUpload(result.assets);
        }
      } catch (error) {
        console.error('Error opening camera:', error);
      }
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo', // Set mediaType to 'photo' to allow selecting photos
      selectionLimit: 3, // Set selection to 'multiple' to allow selecting multiple photos
    });
    if (result.assets && result.assets.length > 0) {
      setImagesToUpload(result.assets);
    }
  };

  const uploadImage = async () => {
    addPost({
      id: uuid.v4() as string,
      images: imagesToUpload?.map((image: {uri: any}) => image.uri),
      publishDate: '8 feb',
      title: 'Make design systems people want to use.',
      description: description,
      author: userData?.name || 'Digvijay Gupta',
      username: userData?.username || '_digvijayg',
      likes: '14',
      comments: '6.5k',
    });
    setImagesToUpload([]);
    setDescription('');
    navigation.navigate(BottomTabNavigationEnum.HOME);
  };

  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const renderItem = ({item}: {item: {uri: string; fileName: string}}) => (
    <Image
      size="md"
      w="100%"
      alt="lifestyleBee"
      source={item.uri}
      sx={{width: screenWidth, height: screenHeight / 2}}
    />
  );

  return (
    <KeyboardAwareScrollView>
      <Box h="$full" bg="$white">
        {imagesToUpload.length === 0 ? (
          <Image
            size="md"
            alt="lifestyleBee"
            source={defaultImage}
            sx={{
              width: screenWidth,
              height: screenHeight / 2,
            }}
          />
        ) : (
          <Box position="relative">
            <Carousel
              flatListRef={flatListRef}
              data={imagesToUpload}
              renderItem={renderItem}
              setActiveIndex={setActiveIndex}
            />
            {imagesToUpload.length > 1 && (
              <CustomPaginationDots
                length={imagesToUpload.length}
                selectedIndex={activeIndex}
              />
            )}
          </Box>
        )}

        <Box
          display="flex"
          flexDirection="row"
          gap="$4"
          py={'$5'}
          justifyContent="space-between"
          mx={25}>
          <Button title="Click Photo" onPress={openCamera} />
          <Button onPress={openGallery} title="Choose from Gallery" />
        </Box>
        <Textarea
          size="md"
          rounded={'$2xl'}
          borderWidth={0}
          isReadOnly={false}
          isInvalid={false}
          isDisabled={false}
          w={screenWidth - 50}
          alignSelf="center"
          bg={COLORS.InputGray}>
          <TextareaInput
            rounded={'$full'}
            bg={COLORS.InputGray}
            placeholder="Please add a caption..."
            value={description}
            onChangeText={setDescription}
          />
        </Textarea>

        <Box mt="$5" w={screenWidth - 50} alignSelf="center">
          <Button
            title="Upload Post"
            onPress={uploadImage}
            disabled={imagesToUpload.length === 0}
          />
        </Box>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default PostScreen;
