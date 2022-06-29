import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, key: string | null): any[] {
    if (!items || !searchTerm) {
      return items;
    }

    if (key) {
      return items.filter((item) =>
        item[key].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
