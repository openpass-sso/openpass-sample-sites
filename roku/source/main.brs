sub Main()
  ShowMainEntryPointScreen()
end sub

sub ShowMainEntryPointScreen()
  'The roSGSCreen object is a SceneGraph canvas that displays
  'the content of a Scene node instance
  screen = CreateObject("roSGScreen")
  ' message port is the place where events are sent
  m.port = CreateObject("roMessagePort")
  ' sets the message port which will be used for events from the screen
  screen.setMessagePort(m.port)

  ' every screen object must have a Scene node, or a node that derives from the Scene node
  scene = screen.CreateScene("MainScene")
  screen.show()

  while(true)
    msg = wait(0, m.port)
    msgType = type(msg)
    if msgType = "roSGScreenEvent"
      if msg.isScreenClosed() then return
    end if
  end while
end sub