package com.ttd.sso.sample

import android.graphics.Bitmap
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.tv.material3.Button
import androidx.tv.material3.ExperimentalTvMaterial3Api
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.google.zxing.BarcodeFormat.QR_CODE
import com.google.zxing.qrcode.QRCodeWriter
import com.ttd.sso.sample.ui.AuthScreenState.ErrorState
import com.ttd.sso.sample.ui.AuthScreenState.SignedInState
import com.ttd.sso.sample.ui.AuthScreenState.SignedOutState
import com.ttd.sso.sample.ui.AuthScreenState.UserCodeAvailableState
import com.ttd.sso.sample.ui.AuthScreenState.UserCodeExpiredState
import com.ttd.sso.sample.ui.AuthScreenViewModel
import com.ttd.sso.sample.ui.AuthScreenViewModelFactory

@OptIn(ExperimentalTvMaterial3Api::class)
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
}

@OptIn(ExperimentalTvMaterial3Api::class)
@Composable
fun AuthScreen(viewModel: AuthScreenViewModel, modifier: Modifier = Modifier) {
    val viewState by viewModel.viewState.collectAsState()

    val focusRequester = remember { FocusRequester() }

    Column(
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
            .fillMaxSize()
            .padding(top = 32.dp),
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

            else -> {
                Button(
                    onClick = viewModel::signIn,
                    modifier = Modifier
                        .focusRequester(focusRequester)
                        .sizeIn(minWidth = 240.dp, minHeight = 40.dp),
                ) {
                    Text(text = stringResource(R.string.action_sign_in))
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        when (val state = viewState) {
            is SignedOutState -> Text(text = stringResource(R.string.state_signed_out))
            is SignedInState -> Text(text = stringResource(R.string.state_signed_in, state.email))
            is ErrorState -> Text(text = stringResource(R.string.state_error, state.error))
            else -> Unit
        }

        Spacer(Modifier.height(16.dp))

        when (val state = viewState) {
            is UserCodeAvailableState -> {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(text = stringResource(R.string.code, state.userCode))
                    Text(text = stringResource(R.string.url, state.verificationUriComplete))

                    Spacer(Modifier.height(16.dp))

                    Image(
                        modifier = Modifier.size(180.dp),
                        bitmap = remember(state.verificationUriComplete) { getQrCode(state.verificationUriComplete) },
                        contentDescription = null,
                    )
                }
            }

            is UserCodeExpiredState -> {
                Text(text = stringResource(R.string.code_expired))
            }

            else -> Unit
        }
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }
}

private const val QrCodeSize = 512
private fun getQrCode(uri: String): ImageBitmap {
    val bits = QRCodeWriter().encode(uri, QR_CODE, QrCodeSize, QrCodeSize)
    return Bitmap.createBitmap(QrCodeSize, QrCodeSize, Bitmap.Config.RGB_565).also {
        for (x in 0 until QrCodeSize) {
            for (y in 0 until QrCodeSize) {
                it.setPixel(x, y, if (bits[x, y]) android.graphics.Color.BLACK else android.graphics.Color.WHITE)
            }
        }
    }.asImageBitmap()
}