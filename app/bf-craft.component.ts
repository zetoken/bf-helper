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
    public synthesisRecipes: any = {};
    public spheresRecipes: any = {};
    public materials: any = [];
    public sortCriteria = 'material';
    public sortAscendant = true;

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
        this.updateSortingCriteria('material');
        let direction = this.sortAscendant ? 1 : -1;
        this.materials = this.materials.sort((l: any, r: any) => this.compare(l.$key, r.$key) * direction);
    }

    /**
     * Order materials first by use count then by craft name
     * @param event
     */
    public onSortByUseCount(event: Event) {
        event.preventDefault();
        this.updateSortingCriteria('useCount');
        let direction = this.sortAscendant ? 1 : -1;
        this.materials = this.materials.sort((l: any, r: any) => this.compareByCraftName(l, r) * direction);
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

    private updateSortingCriteria(criteria: string) {
        if (this.sortCriteria == criteria) {
            this.sortAscendant = !this.sortAscendant;
        } else {
            this.sortCriteria = criteria;
        }
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

        var synthesisObservable = loadJson('json/bf-synthesis-recipes.json', 'bf-synthesis-recipes');
        var spheresObservable = loadJson('json/bf-spheres-recipes.json', 'bf-spheres-recipes');

        Observable.forkJoin([synthesisObservable, spheresObservable])
            .subscribe((data: any) => {
                this.synthesisRecipes = data[0];
                this.spheresRecipes = data[1];
                BfCraft.setTranslation({});
                BfCraft.setSynthesisRecipes(this.synthesisRecipes);
                BfCraft.setSphereRecipes(this.spheresRecipes);
                this.materials = this.objectToArray(BfCraft.getMaterials(BfCraft.getAllSimplifiedRecipes()));
                console.log(this.materials);
            });
    }
}
