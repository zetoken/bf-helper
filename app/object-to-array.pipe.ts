import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'objectToArray'
})

export class ObjectToArrayPipe implements PipeTransform {
    transform(value: any, args?: any[]): any[] {
        return Object.keys(value)
            .map((key: string) => {
                return {'$key': key, '$value': value[key]};
            });
    }
}