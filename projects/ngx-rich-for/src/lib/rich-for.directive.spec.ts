import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RichForDirective } from './rich-for.directive';

@Component({
    styles:[
        "p { margin : 4px; margin-bottom:0px}"
    ],
    template: `
        <div style="display:none">
            <div id="testlength">
                <p *richFor="let el of testArray; 
                let i = index;
                let first = first;
                let last = last;
                let odd = odd;
                let even = even;
                let realindex = realindex;
                ">{{el.a}}</p>
            </div>
    
            <div id="testlengthfiltered">
                <p *richFor="let el of testArray; 
                let i = index;
                let first = first;
                let last = last;
                let odd = odd;
                let even = even;
                let realindex = realindex;
                filterFnc: filter
                ">{{el.a}}</p>
            </div>
    
            <div id="testlengthsorted">
                <p *richFor="let el of testArray; 
                let i = index;
                let first = first;
                let last = last;
                let odd = odd;
                let even = even;
                let realindex = realindex;
                sortFnc: sort"
                >{{el.a}}</p>
            </div>
    
            <div id="testlengthsortedindex">
                <p *richFor="let el of testArray; 
                let i = index;
                let first = first;
                let last = last;
                let odd = odd;
                let even = even;
                let ri = realindex;
                sortFnc: sort"
                >{{el.a}}{{i}}{{ri}}</p>
            </div>
        </div>
    `
})
class TestComponent { 

    testArray = [
        { a:1 },
        { a:2 },
        { a:3 }
    ];

    filter = (el)=>{
        return el.a>=2
    };

    sort = (a,b)=>{
        return b.a - a.a
    };
}

describe('RichForDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    
    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [ TestComponent, RichForDirective ],
            schemas:      [ NO_ERRORS_SCHEMA ]
        })
        .createComponent(TestComponent);
        fixture.detectChanges(); // initial binding
    });
    
    it('normal should have length 3', () => {
        const array: HTMLElement = fixture.nativeElement.querySelector('#testlength');
        const childCount = array.childElementCount;
        expect(childCount).toBe(3);
    });
    it('filtered should have length 2', () => {
        const array: HTMLElement = fixture.nativeElement.querySelector('#testlengthfiltered');
        const childCount = array.childElementCount;
        expect(childCount).toBe(2);
    });
    it('sorted should have this order [3,2,1]', () => {
        const array: HTMLElement = fixture.nativeElement.querySelector('#testlengthsorted');
        const childList : Array<Element> = Array.from(array.children);
        let result = childList.reduce((sum,el)=>sum=sum+""+el.innerHTML,"");
        expect(result).toBe("321")
    });
    it('sorted should have this realindex order [3,2,1] and this index order [1,2,3]', () => {
        const array: HTMLElement = fixture.nativeElement.querySelector('#testlengthsortedindex');
        const childList : Array<Element> = Array.from(array.children);
        let result = childList.reduce((sum,el)=>sum=sum+""+el.innerHTML,"");
        expect(result).toBe("302211120")
    });
});