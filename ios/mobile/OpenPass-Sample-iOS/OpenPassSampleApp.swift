import SwiftUI

@main
struct OpenPassSampleApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .buttonStyle(.signIn)
        }
    }
}

private struct SignInButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .frame(width: 240, height: 40)
            .background(Color.accentColor)
            .foregroundColor(.white)
            .cornerRadius(20)
            .clipped()
    }
}
extension ButtonStyle where Self == SignInButtonStyle {
    static var signIn: SignInButtonStyle {
        SignInButtonStyle()
    }
}
