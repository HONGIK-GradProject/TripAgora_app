import axios from "axios";

export const fetchKakaoPlaceSearch = async (searchTerm: string) => {
  const params = new URLSearchParams();
  params.append('query', searchTerm);

  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?${params.toString()}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    console.log(`KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`);

    const globalData = await response.data;

    if (globalData && globalData.documents?.length > 0) {
      return globalData;
    }
    
  } catch (error) {
    throw error;
  }
}