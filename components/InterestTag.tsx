import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface InterestTagProps {
  tag: string;
  isSelected: boolean;
  onPress: () => void;
}

const InterestTag: React.FC<InterestTagProps> = ({
  tag,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={`px-5 py-2 rounded-full border border-primary m-1 ${
        isSelected ? 'bg-primary' : 'bg-white'
      }`}
      onPress={onPress}
    >
      <Text className={`text-xl ${isSelected ? 'text-white' : 'text-primary'}`}>
        {tag}
      </Text>
    </TouchableOpacity>
  );
};

export default InterestTag;
