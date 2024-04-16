sub Init()
  m.top.functionName = "CheckDeviceAuthenticated"
end sub

sub CheckDeviceAuthenticated()

  ' options = { polling_timeout: 200}
  ' options = { authenticate_url: "www.differenturl.com/authenticate", polling_timeout: 4000}
  ' options = { authenticate_url: "www.differenturl.com/authenticate", enable_polling: false}
  ' options = { enable_polling: false }
  options = {}
  result = openpass_openpassrokusdk_DeviceToken(m.top.clientId, m.top.deviceCode, options)

  ' The response will look like this
  '{
  '  access_token: "SOME_LONG_STRING_WITH_AUTH_TOKEN"
  '  expires_in: 86400
  '  id_token: "SOME_LONG_STRING_WITH_ID_TOKEN"
  '  id_token_expires_in: 2592000
  '  refresh_token: "SOME_LONG_STRING_WITH_REFRESH_TOKEN"
  '  refresh_token_expires_in: 15552000
  '  token_type: "Bearer"
  '}
  m.top.authUser = result
end sub
