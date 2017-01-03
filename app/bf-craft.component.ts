import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/forkJoin';

// Javascript object loaded in index.html
declare var BfCraft: any;

@Component({
    selector: 'bf-craft',
    templateUrl: 'bf-craft.html'
})

export class BfCraftComponent {
    private http: Http;
    public crafts: any = {};
    public materials: any = [];
    public sortCriteria = 'material';
    public sortAscendant = false;

    constructor(http: Http) {
        this.http = http;
        this.refresh();
    }

    public refreshClicked() {
        this.refresh(true);
    }

    /**
     * Order materials by craft name
     * @param event
     */
    public onSortByMaterial(event: Event) {
        event.preventDefault();
        this.sortByMaterial();
    }

    /**
     * Order materials first by use count then by craft name
     * @param event
     */
    public onSortByUseCount(event: Event) {
        event.preventDefault();
        this.sortByUseCount();
    }

    private compare(l: any, r: any) {
        if (l > r) {
            return 1;
        }
        if (l < r) {
            return -1;
        }
        return 0;
    }

    private compareByCraftName(l: any, r: any) {
        let byUseCount = this.compare(l.$value.materialOf.length, r.$value.materialOf.length);
        if (byUseCount != 0) {
            return byUseCount;
        }
        return this.compare(l.$key, r.$key);
    }

    private objectToArray(value: any) {
        return Object.keys(value)
            .map((key: string) => {
                return {'$key': key, '$value': value[key]};
            });
    }

    private refresh(forceRefresh?: boolean) {
        if (typeof(forceRefresh) == 'undefined') {
            forceRefresh = false;
        }

        var loadJson = (url: string, key: string): Observable => {
            return Observable.create((observer: Observer) => {
                var json: any = null;
                if (!forceRefresh) {
                    // Loading from localStorage
                    json = localStorage.getItem(key);
                    if (json != null) {
                        observer.next(JSON.parse(json));
                        observer.complete();
                    }
                }
                if (forceRefresh || (json == null)) {
                    // Refreshing from server
                    // Add a random number to file request to help prevent some browser cache overrides
                    url = [url, '?', Math.random()].join('');
                    this.http.get(url, {cache: false})
                        .map((res: Response) => res.json())
                        .catch((reason: any) => {
                            console.log(reason);
                            Observable.throw(reason);
                        })
                        .subscribe((data: any) => {
                            localStorage.setItem(key, JSON.stringify(data));
                            observer.next(data);
                            observer.complete();
                        });
                }
            });
        };

        loadJson('http://touchandswipe.github.io/bravefrontier_data/eu/items.json', 'bf-items')
            .subscribe((data: any) => {
                let crafts = {};
                this.objectToArray(data)
                    .filter((o: any) => o.$value.hasOwnProperty('recipe'))
                    .forEach((o: any) => {
                        let components = {};
                        o.$value.recipe.materials.forEach((m: any) => {
                            // Some id may not be defined in items list...
                            let name = m.id;
                            if (data.hasOwnProperty(m.id)) {
                                name = data[m.id].name
                            }
                            components[name] = m.count;
                        });
                        crafts[o.$value.name] = components;
                    });
                console.log(crafts);
                this.crafts = crafts;
                BfCraft.setTranslation({});
                BfCraft.setSynthesisRecipes(crafts);
                this.materials = this.objectToArray(BfCraft.getMaterials(BfCraft.getAllRecipes()));
                this.sortByMaterial();
            });
    }

    private sortByMaterial() {
        this.updateSortingCriteria('material');
        let direction = this.sortAscendant ? 1 : -1;
        this.materials = this.materials.sort((l: any, r: any) => this.compare(l.$key, r.$key) * direction);
    }

    private sortByUseCount() {
        this.updateSortingCriteria('useCount');
        let direction = this.sortAscendant ? 1 : -1;
        this.materials = this.materials.sort((l: any, r: any) => this.compareByCraftName(l, r) * direction);
    }

    private updateSortingCriteria(criteria: string) {
        if (this.sortCriteria == criteria) {
            this.sortAscendant = !this.sortAscendant;
        } else {
            this.sortCriteria = criteria;
        }
    }
}
