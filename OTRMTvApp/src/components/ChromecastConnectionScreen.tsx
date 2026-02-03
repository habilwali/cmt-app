/**
 * Chromecast Connection Screen
 * Displays instructions for connecting to In-Room Chromecast
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import DeviceInfo from 'react-native-device-info';
import castingIcon from '../assets/casting.png';
import wirelessIcon from '../assets/wireless-512.png';

const { width, height } = Dimensions.get('window');

interface ChromecastConnectionScreenProps {
  // No static props needed - all data comes from API
}

const ChromecastConnectionScreen: React.FC<ChromecastConnectionScreenProps> = () => {
  const [deviceName, setDeviceName] = useState<string>('');
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [apiData, setApiData] = useState<{
    room?: string;
    ssid?: string;
    password?: string;
    pairingUrl?: string;
    qrConfig?: string;
  } | null>(null);

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        setLoading(true);
        // Get device name
        let device_name = '';
        try {
          device_name = await DeviceInfo.getDeviceName();
          // If device name is empty or invalid, use a fallback
          if (!device_name || device_name.trim() === '') {
            device_name = await DeviceInfo.getUniqueId();
          }
        } catch (error) {
          // If device name access fails, use unique ID as fallback
          device_name = await DeviceInfo.getUniqueId();
        }
        
        // Clean device name (preserve hyphens for room numbers like "room-1003")
        // Remove colons and spaces, but keep hyphens, make lowercase
        const cleanDeviceName = device_name.replace(/[: ]/g, '').toLowerCase();
        setDeviceName(cleanDeviceName);
        
        // Fetch WiFi QR code data from API
        try {
          const apiResponse = await getWiFiQRCodeFromAPI(cleanDeviceName);
          if (apiResponse && apiResponse.data) {
            // Set QR code data from API response
            const qrConfig = apiResponse.data.qr_config;
            if (qrConfig) {
              setQrData(qrConfig);
            } else {
              throw new Error('QR config not found in API response');
            }
            
            // Store all API data
            setApiData({
              room: apiResponse.data.room,
              ssid: apiResponse.data.ssid,
              password: apiResponse.data.password,
              pairingUrl: apiResponse.data.pairing_url || apiResponse.data.pairingUrl,
              qrConfig: qrConfig,
            });
          } else {
            throw new Error('Invalid API response format');
          }
        } catch (apiError) {
          console.error('Error fetching WiFi QR code from API:', apiError);
          // Don't set fallback - show error state instead
          setQrData('');
          setApiData(null);
        }
      } catch (error) {
        console.error('Error getting device info:', error);
        setDeviceName('device');
        setQrData('');
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    getDeviceInfo();
  }, []);

  // API call to get WiFi QR code data
  const getWiFiQRCodeFromAPI = async (device_name: string) => {
    try {
      // Construct API URL with device_name as query parameter
      const apiUrl = `https://cmt-technologies.net/casting/get_wifi.php?device_name=${encodeURIComponent(device_name)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        console.log('WiFi QR code data fetched successfully:', data);
        return data;
      } else {
        throw new Error('API returned unsuccessful status');
      }
    } catch (error) {
      console.error('Error fetching WiFi QR code from API:', error);
      throw error;
    }
  };

  const pairingUrl = apiData?.pairingUrl || '';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>How to connect to your In-Room Chromecast</Text>
        <Text style={styles.logoText}></Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Title */}
        {/* <Text style={styles.title}></Text> */}

        {/* Three Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Connect Card - First */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connect</Text>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Image source={wirelessIcon} style={styles.wirelessIcon} resizeMode="contain" />
              </View>
              <Text style={styles.cardText}>
                Connect your device by scanning the QR code
              </Text>
            </View>
          </View>

          {/* QR Code Card - Middle */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>QR Code</Text>
            <View style={styles.cardContent}>
              {loading ? (
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>⏳</Text>
                </View>
              ) : qrData ? (
                <View style={styles.qrContainer}>
                  <QRCode
                    value={qrData}
                    size={120}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                  />
                </View>
              ) : (
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📱</Text>
                </View>
              )}
              <Text style={styles.cardText}>
                Scan the above QR code to connect the Wi-Fi.
              </Text>
            </View>
          </View>

          {/* Cast Card - Last */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cast</Text>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Image source={castingIcon} style={styles.castingIcon} resizeMode="contain" />
              </View>
              <Text style={styles.cardText}>
                Open your cast-enabled app (YouTube, Netflix, Amazon Prime) and tap the cast icon, then select:
              </Text>
              {apiData?.room ? (
                <Text style={styles.roomText}>
                  {apiData.room.replace('room-', 'Room ').replace('-', ' ')}
                </Text>
              ) : (
                <Text style={styles.roomText}>Room information loading...</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303884', // Dark blue/black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 10,
    paddingBottom: 20,
    height: 80,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 36,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1,
    gap: 30,
  },
  card: {
    backgroundColor: '#191e47',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: width / 3.5,
    minHeight: 320,
    maxHeight:380
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  cardContent: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 85,
  },
  castingIcon: {
    width: 140,
    height: 140,
  },
  wirelessIcon: {
    width: 140,
    height: 140,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  cardSubtext: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 24,
  },
  roomText: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ChromecastConnectionScreen;
