
import { getTemplateList } from "@/services/templates";
import { TemplateInfo } from "@/types/templates";
import { useEffect, useState } from "react";

export const useTemplateList = () => {
  const [products, setProducts] = useState<TemplateInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTemplateList = async () => {
      setIsLoading(true);
      try {
        const response = await getTemplateList(1);

        if (response) {
          setProducts(products.concat(response.templates));
        } 
        
      } catch (error) {
        setError(error as Error);
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchTemplateList();
  }, []);

  return { products, isLoading, error };
}