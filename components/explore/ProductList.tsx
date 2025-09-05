import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the type for a single product
export interface Product {
  id: string;
  title: string;
  date: string;
  participants: string;
  location: string;
  guide: string;
  rating: string;
  imageUrl: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const renderItem = ({ item }: { item: Product }) => (
    <Link href={{
      pathname: "/explore/[id]",
      params: {
        id: item.id
      }
    }} asChild>
      <TouchableOpacity
      style={styles.productItem}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productDetails}>{item.date}</Text>
          <Text style={styles.productDetails}>{item.participants}      {item.location}</Text>
          <Text style={styles.productDetails}>{item.guide}        {item.rating}</Text>
        </View>
        <Ionicons name="heart-outline" size={24} color="#999" style={styles.wishIcon} />
      </TouchableOpacity>
    </Link>
    
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.productList}
    />
  );
};

const styles = StyleSheet.create({
  productList: {
    // 상품 리스트 스타일
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 20,
    color: '#000',
  },
  wishIcon: {
    marginLeft: 10,
  },
});

export default ProductList;
