import * as ImagePicker from 'expo-image-picker';
import React, { ReactNode, useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

interface MultipleImagePickerProps {
  onImagesSelected: (uris: string[]) => void;
  children: ReactNode;
}

export default function MultipleImagePicker({
  onImagesSelected,
  children,
}: MultipleImagePickerProps) {
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

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true, // 다중 선택 허용
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      onImagesSelected(uris);
    } else {
      onImagesSelected([]); // 취소 시 빈 배열 전달
    }
  };

  return (
    <TouchableOpacity onPress={pickImages}>
      {children}
    </TouchableOpacity>
  );
}
