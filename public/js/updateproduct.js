function updateProduct(id){
	$.ajax({
		urL: '/view_products/' + id,
		type: 'PUT',
		data: $('#updateproduct').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};