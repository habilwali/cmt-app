package com.otrmtvapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        Log.d("BootReceiver", "Received action: $action")
        
        if (action == Intent.ACTION_BOOT_COMPLETED || 
            action == "android.intent.action.QUICKBOOT_POWERON") {
            
            // Add a small delay to ensure system is fully ready
            Handler(Looper.getMainLooper()).postDelayed({
                try {
                    // Launch the app when device boots
                    val launchIntent = Intent(context, MainActivity::class.java).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK)
                        addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                    }
                    context.startActivity(launchIntent)
                    Log.d("BootReceiver", "CMT App launched successfully on boot")
                } catch (e: Exception) {
                    Log.e("BootReceiver", "Failed to launch app on boot: ${e.message}")
                }
            }, 3000) // 3 second delay to ensure system is ready
        }
    }
}

