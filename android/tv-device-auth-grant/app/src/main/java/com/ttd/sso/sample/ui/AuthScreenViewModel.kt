package com.ttd.sso.sample.ui

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.myopenpass.auth.OpenPassManager
import com.myopenpass.auth.OpenPassManagerState
import com.myopenpass.auth.flow.DeviceAuthorizationFlowClient
import com.myopenpass.auth.flow.DeviceAuthorizationFlowState.Complete
import com.myopenpass.auth.flow.DeviceAuthorizationFlowState.DeviceCodeAvailable
import com.myopenpass.auth.flow.DeviceAuthorizationFlowState.DeviceCodeExpired
import com.myopenpass.auth.flow.DeviceAuthorizationFlowState.Error
import com.myopenpass.auth.flow.DeviceAuthorizationFlowState.Initialized
import com.ttd.sso.sample.ui.AuthScreenState.ErrorState
import com.ttd.sso.sample.ui.AuthScreenState.Loading
import com.ttd.sso.sample.ui.AuthScreenState.SignedInState
import com.ttd.sso.sample.ui.AuthScreenState.SignedOutState
import com.ttd.sso.sample.ui.AuthScreenState.UserCodeAvailableState
import com.ttd.sso.sample.ui.AuthScreenState.UserCodeExpiredState
import java.net.URI
import kotlinx.coroutines.launch

sealed interface AuthScreenState : ViewState {
    data object Loading : AuthScreenState
    data class SignedInState(val email: String) : AuthScreenState
    data object SignedOutState : AuthScreenState

    data class UserCodeAvailableState(
        val userCode: String,
        val verificationUri: String,
        val verificationUriComplete: String,
        val userVerificationUri: String,
        val expiresEpochMs: Long,
    ) : AuthScreenState

    data object UserCodeExpiredState : AuthScreenState

    data class ErrorState(val error: Throwable) : AuthScreenState
}

/**
 * The main View Model for authenticating the user via OpenPass' DeviceAuthorizationFlowClient.
 */
class AuthScreenViewModel(
    private val manager: OpenPassManager = OpenPassManager.getInstance(),
) : BasicViewModel<AuthScreenState>(Loading) {

    private var client: DeviceAuthorizationFlowClient? = null

    init {
        // Observe the state of the OpenPassManager and translate those into our own ViewState.
        viewModelScope.launch {
            manager.state.collect { state ->
                Log.d(TAG, "State Update: $state")

                when (state) {
                    is OpenPassManagerState.Loading -> _viewState.emit(Loading)
                    is OpenPassManagerState.SignedOut -> _viewState.emit(SignedOutState)
                    is OpenPassManagerState.SignedIn -> state.tokens.idToken?.email?.let { _viewState.emit(SignedInState(it)) }
                    is OpenPassManagerState.Error -> {
                        _viewState.emit(ErrorState(state.error))
                    }
                }
            }
        }
    }

    fun signIn() {
        Log.d(TAG, "Signing In")
        cancel()

        viewModelScope.launch {
            client = DeviceAuthorizationFlowClient(CLIENT_ID, manager)
            client?.let { newClient ->

                // Request that a new Device Code is requested.
                newClient.fetchDeviceCode()

                // Observe changes to the Client and communicate this via our ViewState.
                newClient.state.collect { state ->
                    Log.d(TAG, "Flow: $state")

                    when (state) {
                        is Initialized -> Unit

                        is DeviceCodeAvailable -> _viewState.emit(
                            UserCodeAvailableState(
                                state.deviceCode.userCode,
                                state.deviceCode.verificationUri,
                                state.deviceCode.verificationUriComplete ?: state.deviceCode.verificationUri,
                                state.deviceCode.verificationUri.let { it.removePrefix(URI(it).scheme + "://") },
                                state.deviceCode.expiresTimeMs,
                            ),
                        )

                        DeviceCodeExpired -> _viewState.emit(UserCodeExpiredState)

                        is Error -> _viewState.emit(ErrorState(state.error))

                        is Complete -> Unit
                    }
                }
            }
        }
    }

    fun signOut() {
        Log.d(TAG, "Signing Out")
        cancel()

        manager.signOut()
        _viewState.tryEmit(SignedOutState)
    }

    override fun onCleared() = cancel()

    private fun cancel() {
        // Make sure we cancel/stop any in-progress sign in attempt.
        client?.cancel()
        client = null
    }

    private companion object {
        const val TAG = "AuthScreenViewModel"
        const val CLIENT_ID = "70ababb7f47d43b7ac61a866c9c50e3c"
    }
}

class AuthScreenViewModelFactory: ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return AuthScreenViewModel() as T
    }
}
