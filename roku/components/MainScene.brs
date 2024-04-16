sub Init()
  m.top.backgroundColor = "0xFFFFFF"
  m.top.backgroundUri = ""
  m.loadingIndicator = m.top.FindNode("loadingIndicator")

  InitScreenStack()
  DeviceAuthorization()
end sub
