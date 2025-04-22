import { createSlice, PayloadAction, } from "@reduxjs/toolkit"
import { ForgottenPasswordDto } from "../Admin/AddUser/Dtos/userDto"

interface forgottenPassword extends ForgottenPasswordDto {
    visible: 'Email' | 'EmailConfirm' | 'NewRegister'

}
const intitalForgottenPassword: forgottenPassword = {
    visible: "Email",
    email: "",
    emailConfirmNumber: "",
    userName: "",
    password: ""
}
export const forgottenPasswordSlice = createSlice({
    name: 'login',
    initialState: intitalForgottenPassword,
    reducers: {
        pageReset(state) {
            state = intitalForgottenPassword
        },
        setVisiblePage(state, action: PayloadAction<forgottenPassword>) {
            state.visible = action.payload.visible
            state.email = action.payload.email
            state.emailConfirmNumber = action.payload.emailConfirmNumber
            state.password = action.payload.password
            state.userName = action.payload.userName
        }
    }
})
export default forgottenPasswordSlice