import { wishlistApi } from "@/api/wishlist";

export const getWishlist = async () => {
  try {
    const response = await wishlistApi.getWishlist();

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('위시리스트 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

export const addWishlist = async (id: number) => {
  try {
    const response = await wishlistApi.addWishlist(id);

    if (response && response.code === 200) {
      return true;
    }

    throw new Error('위시리스트 추가 에러');
  } catch (error) {
    console.error(error);
  }
}

export const deleteWishlist = async (id: number) => {
  try {
    const response = await wishlistApi.deleteWishlist(id);

    if (response && response.code === 200) {
      return true;
    }

    throw new Error('위시리스트 삭제 에러');
  } catch (error) {
    console.error(error);
  }
}