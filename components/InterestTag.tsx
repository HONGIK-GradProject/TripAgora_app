import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface InterestTagProps {
  tag: string;
}

const InterestTag: React.FC<InterestTagProps> = ({ tag }) => {
  return (
    <TouchableOpacity className="px-5 py-2 rounded-full border border-primary m-1">
      <Text className="text-xl text-primary">{tag}</Text>
    </TouchableOpacity>
  );
};

export default InterestTag;
