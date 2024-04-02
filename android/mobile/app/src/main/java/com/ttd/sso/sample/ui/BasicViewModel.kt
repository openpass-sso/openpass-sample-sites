package com.ttd.sso.sample.ui

import androidx.lifecycle.ViewModel
import com.ttd.sso.sample.ui.AuthScreenState.Loading
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * The state represented by the ViewModel.
 */
interface ViewState

/**
 * A simple base class for ViewModels that provide a single Flow of state that represents the user interface.
 */
abstract class BasicViewModel<VIEWSTATE : ViewState>(initialState: VIEWSTATE) : ViewModel() {

    protected val _viewState = MutableStateFlow(initialState)

    /**
     * A flow of ViewState that represents the state of the ViewModel.
     */
    val viewState: StateFlow<VIEWSTATE> = _viewState.asStateFlow()
}
