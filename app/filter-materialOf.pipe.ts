import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterMaterialOf'
})

export class FilterMaterialOfPipe implements PipeTransform {
    transform(value: any, args?: any): any[] {
        if (typeof(args) == 'undefined' || args == '') {
            return value;
        }

        let filter = args;

        return value
            .filter((pair: any) => pair.$value.materialOf.some((mo: any) => mo.toLowerCase().indexOf(filter) != -1));
    }
}