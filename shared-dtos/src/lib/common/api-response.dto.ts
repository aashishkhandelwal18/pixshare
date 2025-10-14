export class ApiResponse<T>{
    status : boolean;
    
    message : string;
    data: T;
}