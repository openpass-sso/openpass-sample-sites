sub Init()
  m.top.backgroundColor = "0xFFFFFF"
  m.top.backgroundUri = ""
  m.loadingIndicator = m.top.FindNode("loadingIndicator")

  InitScreenStack()
  DeviceAuthorization()
end sub


function OnKeyEvent(key as string, press as boolean) as boolean
  result = false

  if press
    if key = "options"
      SignOut()
      result = true
    end if

  end if
  return result
end function