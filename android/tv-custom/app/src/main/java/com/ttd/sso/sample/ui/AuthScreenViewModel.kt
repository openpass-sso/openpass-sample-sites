package com.ttd.sso.sample.ui

import android.content.Context
import android.util.Log
import androidx.activity.result.ActivityResultRegistry
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.myopenpass.auth.OpenPassManager
import com.myopenpass.auth.OpenPassManagerState
import com.myopenpass.auth.tv.flow.TvSignInFlowClient
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

/**
 * The main View Model for authenticating the user via OpenPass' TvSignInFlowClient.
 *
 * We create a single instance of the TvSignInFlowClient which will be re-used across all attempts. This is
 * required because the ActivityResultRegistry must be used *before* the LifecycleOwner has been created.
 */
class AuthScreenViewModel(
    registry: ActivityResultRegistry,
    owner: LifecycleOwner,
    private val manager: OpenPassManager = OpenPassManager.getInstance(),
    private val client: TvSignInFlowClient = TvSignInFlowClient(CLIENT_ID, manager, registry, owner),
) : BasicViewModel<AuthScreenState>(Loading) {

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
        client.launchSignIn(context)
    }

    fun signOut() {
        Log.d(TAG, "Signing Out")
        client.cancel()
        manager.signOut()
        _viewState.tryEmit(SignedOutState)
    }

    private companion object {
        const val TAG = "AuthScreenViewModel"
        const val CLIENT_ID = "70ababb7f47d43b7ac61a866c9c50e3c"
    }
}

class AuthScreenViewModelFactory(
    private val registry: ActivityResultRegistry,
    private val owner: LifecycleOwner,
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return AuthScreenViewModel(
            registry,
            owner,
        ) as T
    }
}
