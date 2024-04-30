import OpenPass
import SwiftUI

@MainActor
final class Model: ObservableObject {
    @Published
    private(set) var state = ViewState.loading

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
        signInTask?.cancel()
        signInTask = Task<Void, Never> {
            do {
                _ = try await openPassManager.beginSignInUXFlow()
                updateTokenState()
            } catch {
                state = .error(error)
            }
        }
    }

    func signOut() {
        _ = openPassManager.signOut()
        updateTokenState()
    }
}

extension Model {
    enum ViewState {
        case loading
        case signedIn(email: String)
        case signedOut
        case error(Error)
    }
}

struct ContentView: View {

    @ObservedObject
    private var model = Model()

    var body: some View {
        VStack(spacing: 16) {
            Text("Welcome")
                .font(.largeTitle)
            Text("What would you like to do?")

            Spacer()
                .frame(height: 16)

            switch model.state {
            case .loading:
                ProgressView()
            case .signedIn(email: let email):
                Button("Sign Out") {
                    model.signOut()
                }
                Text("Signed In: \(email)")
            case .signedOut:
                Button("Sign In") {
                    model.signIn()
                }
                Text("Signed Out")
            case .error(let error):
                Button("Sign In") {
                    model.signIn()
                }
                Text("Error: \(error.localizedDescription)")
            }
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
        default:
            return String(describing: self)
        }
    }
}
