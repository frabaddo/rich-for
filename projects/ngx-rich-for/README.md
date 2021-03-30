# RichFor

Rich ngFor with sort and filter support

## example

```html
<div>
	<p *richFor="let element of array; 
		let i = index;
		let ri = realindex;
		let first = first;
		let last = last;
		let odd = odd;
		let even = even;
		sortFnc: sortFunction;
		filterFnc: filterFunction;
		trackBy: trackByFunction"
	>	{{element}}	{{i}}	{{ri}}	</p>
</div>
```