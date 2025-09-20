import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WishListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('product');

  return (
    <View className="flex-1 bg-white pt-12">
      <View className="flex-row items-center justify-center px-5 pb-2.5 mb-5">
        <Text className="text-4xl font-bold">찜 목록</Text>
      </View>

      <View className="flex-row border-b border-gray-400 mx-5 mb-5">
        <TouchableOpacity 
          className={`flex-1 items-center py-2.5 border-b ${activeTab === 'product' ? 'border-primary' : 'border-transparent'}`}
          onPress={() => setActiveTab('product')}
        >
          <Text className={`text-xl ${activeTab === 'product' ? 'font-bold text-primary' : 'text-gray-400'}`}>상품</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 items-center py-2.5 border-b ${activeTab === 'guide' ? 'border-primary' : 'border-transparent'}`}
          onPress={() => setActiveTab('guide')}
        >
          <Text className={`text-xl ${activeTab === 'guide' ? 'font-bold text-primary' : 'text-gray-400'}`}>가이드</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-24">
        <View>
          {/* 찜 목록 상품 리스트 (임시) */}
          <View className="flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center">
            <Image source={{ uri: 'https://via.placeholder.com/90' }} className="w-24 h-24 rounded-xl mr-4" />
            <View className="flex-1">
              <Text className="text-2xl font-bold mb-1">모히또 관광</Text>
              <Text className="text-xl text-black">2025.07.28 - 08.01</Text>
              <Text className="text-xl text-black">4/6명      몰디브</Text>
              <Text className="text-xl text-black">-              투어리즘</Text>
            </View>
            <Ionicons name="heart" size={24} color="#8130FF" className="ml-2.5" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WishListScreen;