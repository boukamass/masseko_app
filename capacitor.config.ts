import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.masseko.app',
  appName: 'Masseko',
  webDir: 'masseko',
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
