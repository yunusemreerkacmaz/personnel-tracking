export enum ResponseStatus {
    IsSuccess = 1,
    IsError = 2,
    IsWarning=3,  
    IsDublicateValue = 4
  }
export interface ServiceResult<T>{
    result:T
    results:T[] ,
    responseStatus:ResponseStatus 
    responseMessage:string 
}

export interface ServiceResults {
  responseStatus: ResponseStatus;
  responseMessage: string;
}
