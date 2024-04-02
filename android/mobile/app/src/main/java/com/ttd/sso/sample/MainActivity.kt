package com.ttd.sso.sample

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.ttd.sso.sample.ui.AuthScreenState.ErrorState
import com.ttd.sso.sample.ui.AuthScreenState.Loading
import com.ttd.sso.sample.ui.AuthScreenState.SignedInState
import com.ttd.sso.sample.ui.AuthScreenState.SignedOutState
import com.ttd.sso.sample.ui.AuthScreenViewModel
import com.ttd.sso.sample.ui.AuthScreenViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: AuthScreenViewModel by viewModels {
        AuthScreenViewModelFactory()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                AuthScreen(viewModel = viewModel)
            }
        }
    }

    override fun onPostCreate(savedInstanceState: Bundle?) {
        super.onPostCreate(savedInstanceState)
        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent) {
        viewModel.checkSignIn(intent)
    }
}

@Composable
fun AuthScreen(viewModel: AuthScreenViewModel, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val viewState by viewModel.viewState.collectAsState()

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
            is Loading -> Unit

            is SignedOutState, is ErrorState -> {
                Button(
                    onClick = { viewModel.signIn(context) },
                    modifier = Modifier.sizeIn(minWidth = 240.dp, minHeight = 40.dp),
                ) {
                    Text(text = stringResource(R.string.action_sign_in))
                }
            }

            is SignedInState -> {
                Button(
                    onClick = viewModel::signOut,
                    modifier = Modifier.sizeIn(minWidth = 240.dp, minHeight = 40.dp),
                ) {
                    Text(text = stringResource(R.string.action_sign_out))
                }
            }
        }


        Spacer(Modifier.height(16.dp))

        when (val state = viewState) {
            is Loading -> CircularProgressIndicator(modifier = Modifier.size(32.dp))
            is SignedOutState -> Text(text = stringResource(R.string.state_signed_out))
            is SignedInState -> Text(text = stringResource(R.string.state_signed_in, state.email))
            is ErrorState -> Text(text = stringResource(R.string.state_error, state.error))
        }
    }
}