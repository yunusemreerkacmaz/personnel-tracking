import { CrudTimeDto } from "../../Helpers/DataGrid/CrudTimeDto";

export interface NotificationDto {
    id: number;
    readStatus: boolean;
    messageDto: MessageDto;
    userId: number;
    roleId: number;
    firstName: string;
    lastName: string;
    userName: string;
    roleName: string;
    updateStatus: boolean;
}

export interface MessageDto {
    header: string;
    body: string;
    footer: string;
}

export interface NotificationCrudStatusAndDataDto {
    crudStatus: string;
    notifications: NotificationDto[];
}

export const initialMessageDto:MessageDto={
    header: "",
    body: "",
    footer: ""
}

export const initialNotificationDto:NotificationDto={
    id: 0,
    readStatus: false,
    messageDto: initialMessageDto,
    userId: 0,
    roleId: 0,
    firstName: "",
    lastName: "",
    userName: "",
    roleName: "",
    updateStatus: false,
}

export interface Absentees extends CrudTimeDto {
    id: number;
    userName: string;
    lastName: string;
    userId: number;
    roleId: number;
    roleName: string;
    firstName: string;
    gender: string;
    email: string;
    password:string
}