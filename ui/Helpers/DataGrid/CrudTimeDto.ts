export interface CrudTimeDto {
    createTime?: string | null;
    deleteTime?: string | null;
    updateTime?: string | null;
}
export interface DateRangeDto {
    startDate: string | null;
    endDate: string | null;
}
export interface TimeDto {
    startDate: string | null   // seçilen zanaman
    endDate: string | null  // seçilen zanaman
}
export const initialTimeDto: TimeDto = {
    startDate: null,
    endDate: null
}