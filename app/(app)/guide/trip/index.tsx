import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

const GuideTripListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('ongoing');

  return (
    <View className="flex-1 bg-white pt-12">
      <View className="flex-row items-center justify-center px-5 pb-2.5 mb-5">
        <Text className="text-4xl font-bold">나의 여행 목록</Text>
      </View>

      <View className="flex-row border-b border-gray-400 mx-5 mb-5">
        <TouchableOpacity 
          className={`flex-1 items-center py-2.5 border-b ${activeTab === 'ongoing' ? 'border-primary' : 'border-transparent'}`}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text className={`text-xl ${activeTab === 'ongoing' ? 'font-bold text-primary' : 'text-gray-400'}`}>예정 / 진행 중</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 items-center py-2.5 border-b ${activeTab === 'completed' ? 'border-primary' : 'border-transparent'}`}
          onPress={() => setActiveTab('completed')}
        >
          <Text className={`text-xl ${activeTab === 'completed' ? 'font-bold text-primary' : 'text-gray-400'}`}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-24">
        <View>
          {/* 예정 / 진행 중인 여행 리스트 (임시) */}
          <View className="flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center">
            <Image source={{ uri: 'https://via.placeholder.com/90' }} className="w-24 h-24 rounded-xl mr-4" />
            <View className="flex-1">
              <Text className="text-2xl font-bold mb-1">홍대 1박2일 모임</Text>
              <Text className="text-xl text-black">2025.03.31 - 04.01</Text>
              <Text className="text-xl text-black">4명          홍대</Text>
            </View>
          </View>

          <View className="flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center">
            <Image source={{ uri: 'https://via.placeholder.com/90' }} className="w-24 h-24 rounded-xl mr-4" />
            <View className="flex-1">
              <Text className="text-2xl font-bold mb-1">후쿠오카 놀러가실분</Text>
              <Text className="text-xl text-black">2025.05.16 - 05.21</Text>
              <Text className="text-xl text-black">4명          후쿠오카</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuideTripListScreen;