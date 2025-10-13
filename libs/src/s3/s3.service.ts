import { Injectable, Put } from "@nestjs/common";
import { S3Client , PutObjectCommand , PutObjectCommandInput } from '@aws-sdk/client-s3';

import { Readable } from "stream";

@Injectable()
export class S3Service {
    private readonly s3: S3Client;

    constructor(){
        this.s3 = new S3Client({
            region : 'us-east-1',
            endpoint : "http://localhost:4566",
            forcePathStyle : true,
            credentials : {
                accessKeyId : "test",
                secretAccessKey : "test"
            }
        })
    }
    async uploadFile(bucket : string ,key : string ,body : Buffer | Readable,ContentType : string) : Promise<string> {
        const input : PutObjectCommandInput = {
            Bucket : bucket,
            Key : key,
            Body : body,
            ContentType : ContentType
        }    
        await this.s3.send(new PutObjectCommand(input));
        return `http://localhost:4566/${bucket}/${key}`
    }
}
