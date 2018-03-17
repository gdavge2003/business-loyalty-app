function deleteItem(id, url){
	console.log(url + id);
	$.ajax({
		url: url + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};