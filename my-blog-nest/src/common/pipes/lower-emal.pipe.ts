import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LowerEmailPipe implements PipeTransform {
  transform(author: any, _metadata: ArgumentMetadata) {
    author.email = author.email.toLowerCase();
    return author;
  }
}
