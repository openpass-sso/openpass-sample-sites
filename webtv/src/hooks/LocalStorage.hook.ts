import { useCallback } from "react";

export const useLocalStorage = () => {
  const GetFromKey = useCallback((key: string) => {
    const currentData = localStorage.getItem(key) || "";

    if (!currentData) {
      return null;
    }

    try {
      const parsedData = JSON.parse(currentData);
      return parsedData;
    } catch (error) {
      return currentData;
    }
  }, []);

  const SetFromKey = useCallback((key: string, data: Record<string, any>) => {
    localStorage.setItem(key, JSON.stringify(data));
  }, []);

  return {
    GetFromKey,
    SetFromKey
  };
};
