import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { LoginJwtTokenEnum } from "../Enums/JwtTokenEnum";
import { getEnvironmentAndBaseUrl } from "../env";

interface ErrorResponse {
    message?: string; // `message` opsiyonel olabilir
    [key: string]: any; // Diğer alanlar varsa dinamik tanımlama
}

export const ErrorResponseToast = (error: any) => {
    if (axios.isAxiosError(error)) // AxiosError mı kontrol ediliyor
    {
        const axiosError = error as AxiosError<ErrorResponse>;
        Toast.show({
            type: 'error',
            text1: 'Giriş başarısız!',
            position: "top",
            text2: axiosError.response?.data?.message || axiosError.message || 'Bilinmeyen bir hata oluştu!',
            text1Style: { backgroundColor: '#B4E6AC' },
        });
    } else {
        Toast.show({
            type: 'error',
            text1: 'Hata!',
            position: "top",
            text2: 'Beklenmeyen bir hata oluştu.',
            text1Style: { backgroundColor: '#B4E6AC' },
        });
    }
}

export const privateToCamelCase = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj; // Primitif değerleri aynen döndür
    }

    if (Array.isArray(obj)) {
        return obj.map(item => privateToCamelCase(item)); // Dizi elemanlarını dönüştür
    }

    return Object.keys(obj).reduce((acc: any, key: string) => {
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1); // İlk harfi küçük yap
        acc[camelKey] = privateToCamelCase(obj[key]); // Değeri de dönüştür
        return acc;
    }, {});
}

export const getApiUrl = async () => {
   
    let {env,url}= await getEnvironmentAndBaseUrl()

    let token = await AsyncStorage.getItem(LoginJwtTokenEnum.key);
    const axiosInstance = axios.create({
        baseURL: url+"/api/",
        timeout: 4000,
        // withCredentials: false, // Çerez veya kimlik doğrulama bilgisi gönderme
        headers: { Authorization: `${token}` }
    });

    return { axiosInstance }
};

