package com.otrmtvapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.net.NetworkInterface
import java.util.*

class EthernetMacModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "EthernetMacModule"
    }

    @ReactMethod
    fun getEthernetMacAddress(promise: Promise) {
        try {
            // Try to get MAC from eth0 interface (most common for Ethernet)
            val eth0Mac = getMacAddressFromInterface("eth0")
            if (eth0Mac != null && eth0Mac.isNotEmpty() && eth0Mac != "02:00:00:00:00:00") {
                promise.resolve(eth0Mac)
                return
            }

            // Try other common Ethernet interface names
            val ethernetInterfaces = listOf("eth1", "eth2", "eth3", "enp0s3", "enp0s8", "enp1s0")
            for (interfaceName in ethernetInterfaces) {
                val mac = getMacAddressFromInterface(interfaceName)
                if (mac != null && mac.isNotEmpty() && mac != "02:00:00:00:00:00") {
                    promise.resolve(mac)
                    return
                }
            }

            // If specific interfaces don't work, iterate through all network interfaces
            val interfaces = Collections.list(NetworkInterface.getNetworkInterfaces())
            for (networkInterface in interfaces) {
                val name = networkInterface.name.lowercase()
                // Skip loopback, WiFi (wlan), and virtual interfaces
                if (name.contains("lo") || name.contains("wlan") || name.contains("wifi") || 
                    name.contains("tun") || name.contains("vpn") || name.contains("docker")) {
                    continue
                }
                
                // Check if it's an Ethernet interface
                if (name.startsWith("eth") || name.startsWith("enp") || name.startsWith("enx") || 
                    name.startsWith("usb") || name.contains("ethernet")) {
                    val macAddress = getMacAddressFromInterface(name)
                    if (macAddress != null && macAddress.isNotEmpty() && macAddress != "02:00:00:00:00:00") {
                        promise.resolve(macAddress)
                        return
                    }
                }
            }

            // If nothing found, try reading from sys/class/net
            val eth0SysMac = readMacFromSysFile("eth0")
            if (eth0SysMac != null && eth0SysMac.isNotEmpty()) {
                promise.resolve(eth0SysMac)
                return
            }

            promise.reject("NO_ETHERNET_MAC", "Could not find Ethernet MAC address")
        } catch (e: Exception) {
            promise.reject("ERROR", "Error getting Ethernet MAC: ${e.message}", e)
        }
    }

    private fun getMacAddressFromInterface(interfaceName: String): String? {
        return try {
            val networkInterface = NetworkInterface.getByName(interfaceName)
            if (networkInterface != null) {
                val macBytes = networkInterface.hardwareAddress
                if (macBytes != null && macBytes.isNotEmpty()) {
                    formatMacAddress(macBytes)
                } else {
                    null
                }
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }

    private fun readMacFromSysFile(interfaceName: String): String? {
        return try {
            val file = java.io.File("/sys/class/net/$interfaceName/address")
            if (file.exists() && file.canRead()) {
                file.readText().trim()
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }

    private fun formatMacAddress(bytes: ByteArray): String {
        val sb = StringBuilder()
        for (i in bytes.indices) {
            sb.append(String.format("%02X", bytes[i]))
            if (i < bytes.size - 1) {
                sb.append(":")
            }
        }
        return sb.toString()
    }
}

