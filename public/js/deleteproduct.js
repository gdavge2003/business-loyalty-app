function deletePerson(id){
	$.ajax({
		url: '/view_products/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};