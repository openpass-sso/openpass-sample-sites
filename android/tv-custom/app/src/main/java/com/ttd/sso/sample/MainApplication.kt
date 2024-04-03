package com.ttd.sso.sample

import android.app.Application
import com.myopenpass.auth.OpenPassManager

class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // Initialise the OpenPassManager. We will use its DefaultNetworkSession rather than providing our own
        // custom implementation (for example, one that wraps OkHttp).
        OpenPassManager.init(this)
    }
}