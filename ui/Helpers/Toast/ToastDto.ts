import { ToastShowParams } from "react-native-toast-message";

export type ToastShowParamsCustomType = ToastShowParams & {
  onOkPress: () => void     // burayı ben ekledim 
  onCancelPress: () => void   // burayı ben ekledim
  okButtonText: string
  cancelButtonText: string
};