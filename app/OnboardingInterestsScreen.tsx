import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OnboardingInterestsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>좋아하는 컨텐츠</Text>
      <Text style={styles.subtitle}>또는 분위기를 선택해 주세요.</Text>

      <View style={styles.interestButtonsContainer}>
        <TouchableOpacity style={styles.interestButton}>
          <Text style={styles.interestButtonText}>문화</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interestButton}>
          <Text style={styles.interestButtonText}>자연</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interestButton}>
          <Text style={styles.interestButtonText}>음식</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interestButton}>
          <Text style={styles.interestButtonText}>조용</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interestButton}>
          <Text style={styles.interestButtonText}>시끌벅적</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interestButton}>
          <Text style={styles.interestButtonText}>호캉스</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  interestButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 40,
  },
  interestButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
    margin: 5,
  },
  interestButtonText: {
    fontSize: 20,
    color: '#8130FF',
  },
  startButton: {
    width: '90%',
    height: 52,
    backgroundColor: '#8130FF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OnboardingInterestsScreen;
