sub Init()
  m.top.functionName = "AuthorizeDevice"
end sub


sub AuthorizeDevice()
  ' Your client Id
  clientId = "YOUR_CLIENT_ID"
  m.op = openpass_openpassrokusdk_OpenPassManager()

  ' Init client
  ' optionalParams = { polling_timeout: 200}
  ' optionalParams = { openpass_base_url: "www.differenturl.com", polling_timeout: 4000}
  ' optionalParams = { openpass_base_url: "www.differenturl.com"}
  optionalParams = { enable_logging: true }

  m.op.Init(clientId, AuthCallback, optionalParams)

  ' Start sign in process
  m.op.SignIn()

  ' m.op.SignOut()
end sub

sub AuthCallback(state, data)

  print state
  _states = {
    "SignedIn": 0,
    "SignedOut": 1,
    "Error": 2,
    "Loading": 3,
    "Polling": 4,
    "Refreshable": 5 ' Signed In but needs to refresh
  }

  if state = _states.SignedIn
    HandleSignedIn(data)
  else if state = _states.Polling
    HandlePolling(data)
  else if state = _states.Error
    print("Callback error")
    print(data.error_message)
    openpass_openpassrokusdk_PrintFileLog()
    ' else if state = _states.Error
    '   HandleSignOut()
  end if

end sub

sub HandleSignedIn(data)
  authorizedDevice = CreateObject("roSGNode", "ContentNode")
  authorizedDevice.addFields(data["device_token_success"])
  m.top.authorizedDevice = authorizedDevice
end sub

sub HandlePolling(data)
  authDevice = CreateObject("roSGNode", "ContentNode")
  authDevice.addFields(data["authorize_device_success"])
  m.top.authDevice =authDevice
end sub
