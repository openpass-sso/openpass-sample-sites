sub Init()
  m.top.functionName = "AuthorizeDevice"
end sub


sub AuthorizeDevice()
  ' Your client Id
  clientId = "YOUR_CLIENT_ID"

  ' Attach Device response from SDK, returning an object node that looks like:
  '{
  '  device_code: "SOME_CODE_STRING"
  '  expires_in: 500 'Expiration time in seconds
  '  interval: 5 ' Polling interval in seconds
  '  user_code: "SOME_CODE_STRING"
  '  verification_uri: "https://myopenpass.com/code"
  '  verification_uri_complete: "https://myopenpass.com/code?user_code=WI9BFFAY"
  '}
  m.top.authDevice = openpass_openpassrokusdk_AuthorizeDevice(clientId)
end sub
