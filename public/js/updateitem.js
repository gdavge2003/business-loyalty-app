function updateItem(id, url){
	$.ajax({
		urL: url + id,
		type: 'PUT',
		data: $('#updateitem').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};