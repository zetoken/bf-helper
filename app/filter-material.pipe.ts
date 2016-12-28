import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterMaterial'
})

export class FilterMaterialPipe implements PipeTransform {
    transform(value: any, args?: any): any[] {
        if (typeof(args) == 'undefined' || args == '') {
            return value;
        }

        let filter = args;

        return value
            .filter((pair: any) => pair.$key.toLowerCase().indexOf(filter) != -1);
    }
}