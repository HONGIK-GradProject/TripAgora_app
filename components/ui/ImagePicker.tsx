
import * as ImagePicker from 'expo-image-picker';
import React, { ReactNode, useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

interface ImagePickerProps {
  onImageSelected: (uri: string | null) => void;
  children: ReactNode;
  aspect?: [number, number];
}

export default function CustomImagePicker({
  onImageSelected,
  children,
  aspect = [4, 3],
}: ImagePickerProps) {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      onImageSelected(uri);
    } else {
      onImageSelected(null);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      {children}
    </TouchableOpacity>
  );
}
