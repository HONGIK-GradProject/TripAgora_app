import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const OnboardingProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>환영합니다!</Text>
      <Text style={styles.subtitle}>당신에 대해 알려주세요.</Text>

      <View style={styles.profileImageContainer}>
        <Image source={{ uri: 'https://via.placeholder.com/133' }} style={styles.profileImage} />
        <Text style={styles.profileImagePlaceholder}>(프사)</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임을 입력하세요"
        />
      </View>

      <View style={styles.roleSelectionContainer}>
        <TouchableOpacity style={[styles.roleButton, styles.roleButtonActive]}>
          <Text style={styles.roleButtonTextActive}>여행자</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton}>
          <Text style={styles.roleButtonText}>가이드</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.languageSelectionContainer}>
        <Text style={styles.label}>가능한 언어</Text>
        <View style={styles.languageButtons}>
          <TouchableOpacity style={[styles.languageButton, styles.languageButtonActive]}>
            <Text style={styles.languageButtonTextActive}>한국어</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageButtonText}>영어</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageButtonText}>일본어</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageButtonText}>중국어</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageButtonText}>더보기..</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>다음으로</Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 133,
    height: 133,
    borderRadius: 66.5,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 66.5,
    position: 'absolute',
  },
  profileImagePlaceholder: {
    fontSize: 24,
    color: '#000',
  },
  inputGroup: {
    width: '80%',
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
  },
  roleButtonActive: {
    backgroundColor: '#8130FF',
    borderColor: '#8130FF',
  },
  roleButtonText: {
    fontSize: 20,
    color: '#8130FF',
  },
  roleButtonTextActive: {
    fontSize: 20,
    color: '#fff',
  },
  languageSelectionContainer: {
    width: '80%',
    marginBottom: 40,
  },
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  languageButtonActive: {
    backgroundColor: '#8130FF',
    borderColor: '#8130FF',
  },
  languageButtonText: {
    fontSize: 20,
    color: '#8130FF',
  },
  languageButtonTextActive: {
    fontSize: 20,
    color: '#fff',
  },
  nextButton: {
    width: '90%',
    height: 52,
    backgroundColor: '#8130FF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OnboardingProfileScreen;
