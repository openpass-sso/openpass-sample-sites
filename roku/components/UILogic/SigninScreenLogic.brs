sub DeviceAuthorization()
  m.authTask = CreateObject("roSGNode", "AuthorizeDeviceTask")
  m.authTask.ObserveField("authDevice", "OnAuthDeviceCompleted")
  m.authTask.ObserveField("authorizedDevice", "OnAuthenticateTaskCompleted")
  m.authTask.ObserveField("signedOut", "OnSignedOutComplete")

  m.authTask.control = "run"

  ShowSigningScreen()
end sub

sub ShowSigningScreen()
  m.SigningScreen = CreateObject("roSGNode", "SignInScreen")
  ShowScreen(m.SigningScreen)
end sub

' Get device token
sub OnAuthDeviceCompleted()
  print "authorize device"
  print m.authTask.authDevice
  m.SigningScreen.authDevice = m.authTask.authDevice
end sub

' Get Authorized information
sub OnAuthenticateTaskCompleted()
  print "authorized"
  print m.authTask.authorizedDevice
  m.SigningScreen.authorizedDevice = m.authTask.authorizedDevice
  ' Do what you need with the response
end sub

sub OnSignedOutComplete()
  print "signedOut"
  ShowSigningScreen()
  ' Do what you need with the response
end sub

sub SignOut()
  'TODO do sign out
end sub