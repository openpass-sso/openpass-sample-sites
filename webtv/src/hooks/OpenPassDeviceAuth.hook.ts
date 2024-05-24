import { OpenPassClient } from "@openpass/openpass-js-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UseStorageSession } from "./UseStorageSession";

type UseOpenPassDeviceAuthProps = {
  onError: () => void;
  onAuth: () => void;
};

enum STATUSES {
  OK = "ok",
  PENDING = "authorization_pending",
  SLOW_DOWN = "slow_down",
  ERROR = "error",
}

const ALLOWED_STATUSES: string[] = [STATUSES.PENDING, STATUSES.OK];

export const UseOpenPassDeviceAuth = ({
  onError,
  onAuth,
}: UseOpenPassDeviceAuthProps) => {
  const AuthorizeDeviceOptions = useMemo(() => {
    return {};
  }, []);
  const [deviceAuth, setDeviceAuth] = useState<any>(null);
  const [pollingEnabled, setPollingEnabled] = useState<boolean>(false);
  const [deviceAuthenticated, setDeviceAuthenticated] =
    useState<boolean>(false);

  const { SetSession } = UseStorageSession();
  const timerIdRef = useRef<any>(null);

  const openPassClient = useMemo(() => {
    return new OpenPassClient({
      clientId: process.env.NEXT_PUBLIC_OPEN_PASS_CLIENT_ID || "",
      baseUrl: "https://auth.myopenpass.com/",
    });
  }, []);

  const _errorHandler = useCallback(() => {
    if (onError) {
      onError();
    }
    setDeviceAuthenticated(false);
    setPollingEnabled(false);
  }, [onError]);

  // Get Device Auth Information
  const fetchDeviceToken = useCallback(async () => {
    try {
      const authorizeDeviceDataResponse = await openPassClient.authorizeDevice(
        AuthorizeDeviceOptions
      );
      setDeviceAuth(authorizeDeviceDataResponse);
      setPollingEnabled(true);
    } catch (error) {
      _errorHandler();
    }
  }, [
    AuthorizeDeviceOptions,
    openPassClient,
    setPollingEnabled,
    _errorHandler,
  ]);

  // Exchange device token for an Aut Token
  const fetchIsAuthenticated = useCallback(async () => {
    try {
      const tokenResponse = await openPassClient.deviceToken({
        deviceCode: deviceAuth.deviceCode,
      });

      if (tokenResponse?.status === STATUSES.OK) {
        const data = tokenResponse?.tokens || {};
        SetSession(data);
        setDeviceAuthenticated(true);
        onAuth();
      }

      if (!ALLOWED_STATUSES.includes(tokenResponse?.status)) {
        _errorHandler();
      }
    } catch (error) {
      _errorHandler();
    }
  }, [openPassClient, deviceAuth, SetSession, _errorHandler, onAuth]);

  useEffect(() => {
    if (!deviceAuth) {
      fetchDeviceToken();
    }
  }, [deviceAuth, fetchDeviceToken]);

  useEffect(() => {
    const pollingCallback = () => {
      fetchIsAuthenticated();
    };

    const startPolling = () => {
      // Polling every X seconds the System tell us
      const timeInMs = deviceAuth?.interval * 1000;
      timerIdRef.current = setInterval(pollingCallback, timeInMs);
    };
    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (deviceAuth?.interval && pollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [deviceAuth, fetchIsAuthenticated, pollingEnabled]);

  return {
    deviceAuth,
    deviceAuthenticated,
  };
};
