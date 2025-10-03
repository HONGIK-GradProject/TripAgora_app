import { TemplateItinerary } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, FlatListProps, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';

export type TemplateItineraryWithId = TemplateItinerary & { clientId: number };

// Omit<FlatListProps...>, 'data' | 'renderItem'> 를 상속받아
// data와 renderItem을 제외한 FlatList의 모든 props(예: ListHeaderComponent)를 받을 수 있도록 확장합니다.
interface GuideItineraryListProps extends Omit<FlatListProps<TemplateItineraryWithId>, 'data' | 'renderItem'> {
  itineraries: TemplateItineraryWithId[];
  onUpdate: (item: TemplateItineraryWithId) => void;
  onDelete: (clientId: number) => void;
}

const GuideItineraryList: React.FC<GuideItineraryListProps> = ({ itineraries, onUpdate, onDelete, ...rest }) => {

  const renderItem: ListRenderItem<TemplateItineraryWithId> = ({ item }) => (
    // 리스트 아이템 좌우에 마진을 주어 헤더와 구분되도록 합니다.
    <View className='bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm mx-4'>
      <View className='flex-row justify-between items-start mb-2'>
        <View className='flex-1'>
          <Text className='text-lg font-bold text-blue-600'>Day {item.day}</Text>
          <Text className='text-base text-gray-500'>{item.startTime.substring(0, 5)}</Text>
        </View>
        <View className='flex-row'>
          <TouchableOpacity onPress={() => onUpdate(item)} className='p-2 active:opacity-50'>
            <Ionicons name='pencil' size={22} color={'#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.clientId)} className='p-2 active:opacity-50'>
            <Ionicons name='trash-outline' size={22} color={'#EF4444'} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text className='text-xl font-semibold text-gray-800 mb-1'>{item.title}</Text>
        <Text className='text-base text-gray-600'>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={itineraries}
      renderItem={renderItem}
      keyExtractor={(item) => item.clientId.toString()}
      showsVerticalScrollIndicator={false}
      // contentContainerStyle에 있던 수평 패딩을 제거하고, 아이템 자체에 마진을 주었습니다.
      contentContainerStyle={{ paddingVertical: 20 }}
      {...rest} // ListHeaderComponent 등 나머지 props를 여기서 전달합니다.
    />
  );
};

export default GuideItineraryList;