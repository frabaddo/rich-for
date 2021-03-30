import {
    Directive,
    Input,
    ViewContainerRef,
    TemplateRef,
    DoCheck
} from "@angular/core";

@Directive({
    selector: "[richFor][richForOf]"
})
export class RichForDirective implements DoCheck {
    _previous = [];
    _richForOf = [];
    _richForSortFnc;
    _richForFilterFnc;
    _richForTrackBy = (el, i) => el;
    _defaultTrackBy = (el, i) => el;
    changeDetected = false;

    @Input() set richForOf(collection) {
        this._richForOf = collection;
        this.changeDetected = true;
    }

    @Input() set richForSortFnc(func) {
        this._richForSortFnc = func;
        this.changeDetected = true;
    }

    @Input() set richForFilterFnc(func) {
        this._richForFilterFnc = func;
        this.changeDetected = true;
    }

    @Input() set richForTrackBy(fn) {
        if (fn != null && typeof fn === "function") this._richForTrackBy = fn;
        else this._richForTrackBy = this._defaultTrackBy;
        this.changeDetected = true;
    }

    private get collectionIsDirty() {
        return (
            this._richForTrackBy &&
            this._richForOf.some(
                (el, i) =>
                    this._richForTrackBy(el, i) !=
                    this._richForTrackBy(
                        this._previous[i] && this._previous[i].element,
                        i
                    )
            )
        );
    }

    constructor(
        private view: ViewContainerRef,
        private template: TemplateRef<any>
    ) { }

    ngDoCheck() {
        if (this.changeDetected || this.collectionIsDirty) {
            this.changeDetected = false;
            this.paintList(this._richForOf);
        }
    }

    private enrichCollection(collection) {
        let richCollection = collection.map((el, i) => {
            return {
                element: el,
                realindex: i
            };
        });

        if (this._richForSortFnc)
            richCollection.sort((a, b) => {
                return this._richForSortFnc(a.element, b.element);
            });
        return richCollection.map((el, i) => {
            el.index = i;
            return el;
        });
    }

    private isElementToUpdate(item, i) {
        return (
            !this._previous[i] ||
            !(
                this._richForTrackBy(
                    this._previous[i].element,
                    this._previous[i].realindex
                ) === this._richForTrackBy(item.element, item.realindex)
            ) ||
            this._previous[i].realindex != item.realindex
        );
    }

    private paintList(collection, sortFunc = undefined) {
        if (!this._previous) this.view.clear();

        let richCollection = this.enrichCollection(collection);

        if (this._richForFilterFnc)
            richCollection = richCollection.filter(el =>
                this._richForFilterFnc(el.element)
            );

        richCollection.forEach((item, i) => {
            if (this.isElementToUpdate(item, i)) {
                if (this._previous[i]) this.view.remove(i);
                this.view.createEmbeddedView(
                    this.template,
                    {
                        $implicit: item.element,
                        index: i,
                        realindex: item.realindex,
                        first: i == 0,
                        last: i == richCollection.length - 1,
                        even: i % 2 == 0,
                        odd: i % 2 != 0
                    },
                    i
                );
            }
        });
        this._previous = richCollection;
    }
}
