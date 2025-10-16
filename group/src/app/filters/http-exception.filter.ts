import { ExceptionFilter , Catch , ArgumentsHost , HttpException , HttpStatus } from "@nestjs/common";
import { Request , Response  } from 'express'

@Catch()
export class AllExceptionFilter implements ExceptionFilter{
    catch(exception : unknown , host : ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>()

        const isHttpException = exception instanceof HttpException
        const status = isHttpException  ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        const message = isHttpException ? exception.getResponse() : "Internal Server Error"
        
        const errorResponse = {
            status : false,
            message : typeof message === 'string' ? message : (message as any)?.message || "Error",
            timeStamp : new Date().toISOString(),
            path : request.url
        }

        response.status(status).json(errorResponse)
    }
}