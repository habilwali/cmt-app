package com.otrmtvapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import java.io.IOException

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    val hasBundledJs =
      try {
        assets.open("index.android.bundle").use { }
        true
      } catch (e: IOException) {
        false
      }

    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          add(EthernetMacPackage())
        },
      jsBundleAssetPath = "index.android.bundle",
      useDevSupport = !hasBundledJs && BuildConfig.DEBUG,
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
