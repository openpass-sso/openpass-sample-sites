package com.ttd.sso.sample

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.tv.material3.Button
import androidx.tv.material3.ExperimentalTvMaterial3Api
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.ttd.sso.sample.ui.AuthScreenState.ErrorState
import com.ttd.sso.sample.ui.AuthScreenState.Loading
import com.ttd.sso.sample.ui.AuthScreenState.SignedInState
import com.ttd.sso.sample.ui.AuthScreenState.SignedOutState
import com.ttd.sso.sample.ui.AuthScreenViewModel
import com.ttd.sso.sample.ui.AuthScreenViewModelFactory

@OptIn(ExperimentalTvMaterial3Api::class)
class MainActivity : ComponentActivity() {

    private val viewModel: AuthScreenViewModel by viewModels {
        AuthScreenViewModelFactory(
            activityResultRegistry,
            this,
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // Ensure that the ViewModel is created *before* onCreate. This allows the ActivityResultRegistry
        // to have launchers registered at the appropriate time.
        viewModel.let { model ->
            super.onCreate(savedInstanceState)
            setContent {
                MaterialTheme {
                    AuthScreen(viewModel = model)
                }
            }
        }
    }
}

@OptIn(ExperimentalTvMaterial3Api::class)
@Composable
fun AuthScreen(viewModel: AuthScreenViewModel, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val viewState by viewModel.viewState.collectAsState()

    val focusRequester = remember { FocusRequester() }

    Column(
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier.fillMaxSize(),
    ) {
        Text(
            text = stringResource(R.string.welcome),
            style = MaterialTheme.typography.headlineLarge,
        )

        Spacer(Modifier.height(16.dp))

        Text(
            text = stringResource(R.string.welcome_description),
            style = MaterialTheme.typography.bodyLarge,
        )

        Spacer(Modifier.height(32.dp))

        when (viewState) {
            is Loading, is SignedOutState, is ErrorState -> {
                Button(
                    onClick = { viewModel.signIn(context) },
                    modifier = Modifier
                        .focusRequester(focusRequester)
                        .sizeIn(minWidth = 240.dp, minHeight = 40.dp),
                ) {
                    Text(text = stringResource(R.string.action_sign_in))
                }
            }

            is SignedInState -> {
                Button(
                    onClick = viewModel::signOut,
                    modifier = Modifier
                        .focusRequester(focusRequester)
                        .sizeIn(minWidth = 240.dp, minHeight = 40.dp),
                ) {
                    Text(text = stringResource(R.string.action_sign_out))
                }
            }
        }


        Spacer(Modifier.height(16.dp))

        when (val state = viewState) {
            is Loading -> Unit
            is SignedOutState -> Text(text = stringResource(R.string.state_signed_out))
            is SignedInState -> Text(text = stringResource(R.string.state_signed_in, state.email))
            is ErrorState -> Text(text = stringResource(R.string.state_error, state.error))
        }
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }
}