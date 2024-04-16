sub DeviceAuthorization()
  m.authTask = CreateObject("roSGNode", "AuthorizeDeviceTask")
  m.authTask.ObserveField("authDevice", "OnAuthDeviceCompleted")
  m.authTask.control = "run"

  ShowSigningScreen()
end sub
 
sub ShowSigningScreen()
  m.SigningScreen = CreateObject("roSGNode", "SignInScreen")
  ShowScreen(m.SigningScreen)
end sub

sub OnAuthDeviceCompleted()
  m.SigningScreen.authDevice = m.authTask.authDevice

  ' After we get the device authorization, we can start doing the polling
  CheckAuthToken()
end sub

sub CheckAuthToken()
  m.authenticateDeviceTask = CreateObject("roSGNode", "AuthenticateDeviceTask")
  ' attach device code to task
  m.authenticateDeviceTask.addFields({
    deviceCode: m.authTask.authDevice.device_code,
    clientId: m.authTask.authDevice.client_id
  })
  m.authenticateDeviceTask.ObserveField("authUser", "OnAuthenticateTaskCompleted")
  m.authenticateDeviceTask.control = "run"
end sub

sub OnAuthenticateTaskCompleted()
  ' Do what you need with the response
end sub