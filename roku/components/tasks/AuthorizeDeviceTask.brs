sub Init()
  m.top.functionName = "AuthorizeDevice"
end sub


sub AuthorizeDevice()
  ' Your client Id
  clientId = "YOUR_CLIENT_ID"

  ' Init client
  m.op = openpass_openpassrokusdk_OpenPass()
  m.op.Init(clientId, AuthCallback)

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
  ' else if state = _states.Error
  '   HandleSignOut()
  end if

end sub

sub HandleSignedIn(data)
  authorizedDevice = CreateObject("roSGNode", "ContentNode")
  authorizedDevice.addFields(data)
  m.top.authorizedDevice = authorizedDevice
end sub

sub HandlePolling(data)
  m.top.authDevice = data["authorize_device"]
end sub
