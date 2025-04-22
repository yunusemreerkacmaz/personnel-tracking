import Constants from 'expo-constants';
import * as Device from 'expo-device';

export const getEnvironmentAndBaseUrl = async () => {
    let env: Environment = "development";
    let url = ""

    const environmentConfig = {
        emulator: "http://10.0.2.2:5023",
        production: "https://www.modalifebys.com",
        development: "http://192.168.1.203:5023",
        // test: "http://192.168.1.203:5023",
    };

    if (__DEV__) {
        if (Device.isDevice) {
            env = "development"; // Gerçek cihaz (Wi-Fi)
        }
        else {
            env = "emulator"; // Android emülatör
        }
    }
    else {
        env = "production"; // Production
    }
    type Environment = keyof typeof environmentConfig;
    const typedEnv = env as Environment;
    url = environmentConfig[typedEnv]
    return { env, url }
};
