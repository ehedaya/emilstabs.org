/**
 * Does a simple client side filtering of elements based on a
 * text value. To implement, add a text box with an ID of "filter",
 * add the class "searchable" to the table to be searched, and add
 * data attribute of "data-search" to the table's rows to serve as
 * a search index. Make sure the data is lower case so we can do a
 * case-insensitve comparison.
 */
$(document).ready(function()
{
	// Create a style element where we'll input the CSS needed
	// to filter the table
	var searchStyle = $('<style/>');
	$('body').append(searchStyle);
	
	// Watch the filter input on keyup and then filter the results
	$('#filter').bind('keyup', function()
	{
		// Text box blank? Reset table to show all results
		if ( ! this.value)
		{
			searchStyle.html('');
			return;
		}
		
		// Data is indexed via a data attribute, create a CSS
		// selector to filter the table
		searchStyle.html('.searchable tr:not([data-search*="' + this.value.toLowerCase() + '"]) { display: none; }');
	});
});
