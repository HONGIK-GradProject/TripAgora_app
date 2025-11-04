import { WishlistAddResponse, WishlistDeleteResponse, WishlistGetResponse } from "@/types/wishlist";
import apiClient from "./client";

const getWishlist = async (): Promise<WishlistGetResponse> => {
  const response = await apiClient.get<WishlistGetResponse>('/wishlist');
  return response.data;
};

const addWishlist = async (id: number): Promise<WishlistAddResponse> => {
  const response = await apiClient.post<WishlistAddResponse>(`/wishlist/${id}`);
  return response.data;
};

const deleteWishlist = async (id: number): Promise<WishlistDeleteResponse> => {
  const response = await apiClient.delete<WishlistDeleteResponse>(`/wishlist/${id}`);
  return response.data;
};

export const wishlistApi = {
  getWishlist,
  addWishlist,
  deleteWishlist,
};