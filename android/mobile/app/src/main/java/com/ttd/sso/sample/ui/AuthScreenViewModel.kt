package com.ttd.sso.sample.ui

import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.myopenpass.auth.OpenPassManager
import com.myopenpass.auth.OpenPassManagerState
import com.myopenpass.auth.flow.WebSignInFlowClient
import com.myopenpass.auth.flow.WebSignInFlowState
import com.ttd.sso.sample.ui.AuthScreenState.ErrorState
import com.ttd.sso.sample.ui.AuthScreenState.Loading
import com.ttd.sso.sample.ui.AuthScreenState.SignedInState
import com.ttd.sso.sample.ui.AuthScreenState.SignedOutState
import kotlinx.coroutines.launch

sealed interface AuthScreenState : ViewState {
    data object Loading : AuthScreenState
    data class SignedInState(val email: String) : AuthScreenState
    data object SignedOutState : AuthScreenState
    data class ErrorState(val error: Throwable) : AuthScreenState
}

class AuthScreenViewModel(
    private val manager: OpenPassManager = OpenPassManager.getInstance(),
) : BasicViewModel<AuthScreenState>(Loading) {

    private var client: WebSignInFlowClient? = null

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

    fun signIn(context: Context) {
        Log.d(TAG, "Signing In")

        viewModelScope.launch {
            client = WebSignInFlowClient(CLIENT_ID, manager)
            client?.let { newClient ->
                // ... Configure any theming

                // Launch the sign in flow.
                newClient.launchSignIn(context)

                // Observe the results of the flow, handling them accordingly.
                newClient.state.collect { state ->
                    when (state) {
                        is WebSignInFlowState.Error -> _viewState.emit(ErrorState(state.error))
                        is WebSignInFlowState.Complete -> {
                            val tokens = manager.currentTokens
                            if (tokens != null) {
                                // Email Available
                                tokens.idToken?.email?.let {
                                    _viewState.emit(SignedInState(it))
                                }
                            } else {
                                // Tokens Not Available
                                _viewState.emit(SignedOutState)
                            }
                        }
                        is WebSignInFlowState.Launched -> Unit
                    }
                }
            }
        }
    }

    fun checkSignIn(intent: Intent) {
        Log.d(TAG, "Checking Intent")
        client?.checkSignIn(intent)
    }

    fun signOut() {
        Log.d(TAG, "Signing Out")

        client?.cancel()
        client = null
        manager.signOut()
        _viewState.tryEmit(SignedOutState)
    }

    private companion object {
        const val TAG = "AuthScreenViewModel"
        const val CLIENT_ID = "d12d2cde12db4747ba7b555a8eb9defb"
    }
}

class AuthScreenViewModelFactory(
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return AuthScreenViewModel() as T
    }
}
