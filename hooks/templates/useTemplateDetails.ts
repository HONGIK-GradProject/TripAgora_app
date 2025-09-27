import { getTemplateDetails } from "@/services/templates";
import { TemplateItinerary } from "@/types/templates";
import { useEffect, useState } from "react";

export const useTemplateDetails = (id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [regionNames, setRegionNames] = useState<string[]>([]);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<TemplateItinerary[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingContent, setIsEditingContent] = useState<boolean>(false);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getTemplateDetails(id);

        if (response) {
          setTitle(response.title);
          setContent(response.content);
          setRegionNames(response.regionNames);
          setTagNames(response.tagNames);
          setImageUrls(response.imageUrls);
        } 
        
      } catch (error) {
        console.log(error);
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchTemplateDetails();
  }, []);

  return { title, content, regionNames, tagNames, imageUrls, isLoading, isEditingContent, isEditingTitle, itineraries,
    setIsEditingTitle, setIsEditingContent, setContent, setTitle, setRegionNames, setItineraries };
}