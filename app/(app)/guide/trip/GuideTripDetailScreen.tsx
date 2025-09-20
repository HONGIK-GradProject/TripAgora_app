import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const GuideTripDetailScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-12 pb-2.5 border-b border-gray-200">
        <TouchableOpacity className="mr-2.5">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">홍대 1박2일 모임</Text>
        <TouchableOpacity className="ml-2.5">
          <Ionicons name="notifications-outline" size={24} color="#8130FF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-24">
        <View className="flex-row bg-gray-200 rounded-2xl p-4 mt-5 items-center">
          <MaterialCommunityIcons name="calendar-clock" size={48} color="rgba(129, 48, 255, 0.59)" />
          <View className="ml-4">
            <Text className="text-2xl font-bold mb-1">17:00</Text>
            <Text className="text-xl text-black">
              자유시간 후 18:30까지 숙..
            </Text>
          </View>
        </View>

        <View className="w-full h-80 bg-gray-300 justify-center items-center my-5">
          <Image source={{ uri: 'https://via.placeholder.com/428x326' }} className="w-full h-full" />
          {/* 지도 위에 표시될 마커 등은 추후 구현 */}
        </View>

        <View className="flex-row justify-around flex-wrap">
          <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-400 rounded-3xl py-2.5 px-4 mb-2.5">
            <MaterialCommunityIcons name="map-marker-radius" size={24} color="#8130FF" />
            <Text className="text-xl text-primary ml-2.5">일행 위치 확인</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-400 rounded-3xl py-2.5 px-4 mb-2.5">
            <MaterialCommunityIcons name="bullhorn" size={24} color="#FF8330" />
            <Text className="text-xl text-primary ml-2.5">공지하기</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-400 rounded-3xl py-2.5 px-4 mb-2.5">
            <MaterialCommunityIcons name="pencil" size={24} color="#8130FF" />
            <Text className="text-xl text-primary ml-2.5">일정 편집하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuideTripDetailScreen;