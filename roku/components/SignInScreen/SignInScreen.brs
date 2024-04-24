sub Init()
  m.titleLabel = m.top.FindNode("titleLabel")
  m.titleLabel.text = "Open Pass SDK Sample"
  m.titleLabel.font.size = "35"
  m.titleLabel.font.font = "MediumBoldSystemFont"
  m.titleLabel.color = "0x000000"
  m.descriptionLabel = m.top.FindNode("descriptionLabel")
  m.descriptionLabel.text = "This example channel is designed to use the Open Pass SDK, the basic usage can be found in the README file from this sample or the Project itself"
  m.descriptionLabel.font.font = "SmallestBoldSystemFont"
  m.descriptionLabel.color = "0x000000"

end sub


sub OnAuthDeviceSet(value)
  data = m.top.authDevice
  if data <> invalid
    SetCode(data.user_code)
  end if
end sub

sub OnAuthorizedSet(value)
  print value.getData()
  m.descriptionLabel.text = "Welcome"
end sub


sub OnQRCodeSet(value)
  code = value.getData()
  if code <> invalid
    SetCode(code)
  end if
end sub

function SetCode(code as string)
  m.poster = m.top.FindNode("poster")
  path = "https://myopenpass.com/code?user_code=" + code
  m.poster.uri = "https://quickchart.io/qr?text=" + path + "&margin=1"
  m.qrLabel = m.top.FindNode("qrLabel")
  m.qrLabel.text = code
  m.qrLabel.color = "0x000000"

end function
