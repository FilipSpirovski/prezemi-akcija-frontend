import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDescription',
})
export class ShortDescriptionPipe implements PipeTransform {
  transform(value: string): string {
    return value.split('.').slice(0, 10).join('.');
  }
}
