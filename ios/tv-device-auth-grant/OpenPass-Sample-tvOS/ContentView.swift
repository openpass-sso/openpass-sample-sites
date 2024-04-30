import CoreImage.CIFilterBuiltins
import Foundation
import OpenPass
import SwiftUI

@MainActor
final class Model: ObservableObject {
    @Published
    private(set) var state = ViewState.loading {
        didSet {
            if case .deviceCodeAvailable(let deviceCode) = state {
                verificationUriCompleteImage = deviceCode.verificationUriComplete.flatMap(UIImage.qrCode(url: ))
            } else {
                verificationUriCompleteImage = nil
            }
        }
    }

    /// A QR Code representation of `deviceCode.verificationUriComplete`, if available
    @Published 
    private(set) var verificationUriCompleteImage: UIImage?

    private let openPassManager = OpenPassManager.shared

    private var signInTask: Task<Void, Never>?

    init() {
        updateTokenState()
    }

    private func updateTokenState() {
        let tokens = openPassManager.openPassTokens
        if let email = tokens?.idToken?.email {
            state = .signedIn(email: email)
        } else {
            state = .signedOut
        }
    }

    func signIn() {
        cancelSignIn()
        state = .loading

        signInTask = Task {
            let flow = openPassManager.deviceAuthorizationFlow

            do {
                // Request a Device Code
                let deviceCode = try await flow.fetchDeviceCode()
                state = .deviceCodeAvailable(deviceCode)

                // Poll for authorization
                _ = try await flow.fetchAccessToken(deviceCode: deviceCode)
                updateTokenState()
            } catch {
                state = .error(error)
            }
        }
    }

    func cancelSignIn() {
        signInTask?.cancel()
        signInTask = nil
    }

    func signOut() {
        _ = openPassManager.signOut()
        updateTokenState()
    }
}

extension Model {
    enum ViewState {
        case loading
        case deviceCodeAvailable(DeviceCode)
        case signedIn(email: String)
        case signedOut
        case error(Error)
    }
}

struct ContentView: View {

    @ObservedObject
    private var model = Model()

    var body: some View {
        VStack(alignment: .center, spacing: 16) {
            Text("Welcome")
                .font(.largeTitle)
            Text("What would you like to do?")

            Spacer()
                .frame(height: 32)

            switch model.state {
            case .signedIn:
                Button("Sign Out") {
                    model.signOut()
                }
            case .loading, .deviceCodeAvailable:
                Button("Cancel") {
                    model.cancelSignIn()
                }
            case .signedOut, .error:
                Button("Sign In") {
                    model.signIn()
                }
            }

            Spacer()
                .frame(height: 16)

            switch model.state {
            case .loading:
                ProgressView()
            case .deviceCodeAvailable(let deviceCode):
                Text("Code: \(deviceCode.userCode)")
                Text("URL: \(deviceCode.verificationUriComplete ?? deviceCode.verificationUri) ")

                if let verificationUriCompleteImage = model.verificationUriCompleteImage {
                    Image(uiImage: verificationUriCompleteImage)
                        .resizable()
                        .frame(width: 300, height: 300)
                }
            case .signedIn(email: let email):
                Text("Signed In: \(email)")
            case .signedOut:
                Text("Signed Out")
            case .error(let error):
                Text("Error: \(error.localizedDescription)")
            }

            Spacer()
        }
        .padding()
    }
}

#Preview {
    ContentView()
}

extension OpenPassError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .authorizationCancelled:
            return "User cancelled"
        case .tokenExpired:
            return "Token expired. Please restart the Sign In flow"
        default:
            return String(describing: self)
        }
    }
}
