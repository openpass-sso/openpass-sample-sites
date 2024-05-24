import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "./LocalStorage.hook";
import { AUTH_SESSION_KEY } from "@/constants/auth.constants";

export const UseStorageSession = () => {
  const { GetFromKey, SetFromKey } = useLocalStorage();
  const [storageSession, setStorageSession] = useState<Record<
    string,
    any
  > | null>(null);

  useEffect(() => {
    const currentData = GetFromKey(AUTH_SESSION_KEY);
    if (currentData) {
      setStorageSession(currentData);
    }
  }, [GetFromKey]);

  const SetSession = useCallback(
    (session: Record<string, any>) => {
      SetFromKey(AUTH_SESSION_KEY, session);
      setStorageSession(session);
    },
    [SetFromKey]
  );

  return {
    storageSession,
    SetSession,
  };
};
