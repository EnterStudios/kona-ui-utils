### cool sortable table

#### for examples, see "quick-search" project

#### to use:

1. include angular , jquery , quick-table (s3)

2. inject quickTable module

3. scope needs a queries {} , see example below.

4. ng-include src="'lib/quick_table/table.html'" with id=
   current query in queries. example: queries["phrases"]=... then id="phrases"

5. to show table do: $scope.query.dataArray = $scope.query.root(data); 

```
query["phrases"] = {
	title: 'phrases',
	dataArray: [],
	cells: [{id: 'w', title: 'phrase', search: true},
	        {id: 'uniq', title: 'unique'},
	        {id: 'count', title: 'count'}
	        ], 

	root: function(data){return data.phrases.results},
	loading: false,   

	//optional
	crud: true, //display new+edit+delete buttons
	order: 'count', 
	reverse: true 
}
```
