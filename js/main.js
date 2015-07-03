function check_task(str){
	var flag = false;
	for (var i = 0; i < str.length; i++){
		if (str[i] !== " "){
			flag = true;
		}
	};
	return flag;
};

function addTask(text, mark, mode){
		if (check_task(text)){	
			var row = $("<div>").addClass("pure-g task_list task");
			var row_chk = $("<div>").addClass("pure-u-1-24");
			
			row_chk.append($("<input type=\"checkbox\">").addClass("items").prop("checked", mark));			
			row.append(row_chk);
			var tag = $("<div class = \"pure-u-23-24\" contenteditable = \"true\">" + text + "</div>");
			if (mark) tag.css("text-decoration", "line-through");
			row.append(tag);
			
			$('#task_div').append(row);
			$('#task_field').val("");
			
			//saving to local storage
			if (mode){
				localStorage[task_count] = text;
				localStorage[task_count + ".mark"] = mark;
				localStorage["task_count"] = task_count + 1;
				$("#multi_chk").prop("checked", false);
				localStorage["multi_chk"] = false;
			};
			
			if (task_count == 0){	// adding panel
				var row = $("<div id = \"panel_row\">").addClass("pure-g task_list task");
				var row_chk = $("<div>").addClass("pure-u-1-24");
				row_chk.append($("<input id = \"multi_chk\" type=\"checkbox\">"));
				row.append(row_chk);
				row.append("<div id = \"counter\" class = \"pure-u-19-24\"> </div>");
				$('#panel').append(row);
				$("#counter").text("1 task left");
			}
			else{
				$("#counter").text((task_count+1) + " tasks left");
			};
			task_count++;
		}
		else{
			$("#task_field").val("The task is empty! Please, try again!").css("color", "red").css("text-align", "center").attr('disabled','disabled');
			$("#submit_button").addClass("pure-button-disabled").attr('disabled','disabled');
			setTimeout(function (){
				$("#task_field").val("").css("color", "black").css("text-align", "left").removeAttr('disabled');
				$("#submit_button").removeClass("pure-button-disabled").removeAttr('disabled');	
			}, 1500);
		};
};

function supportsLocalStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};

function loadTasks(){
	if (!supportsLocalStorage()) { return false; }
	
	for (var i = 0; i < parseInt(localStorage["task_count"]); i++){
		addTask(localStorage[i], localStorage[i+".mark"] == "true" ? true : false, false);
	}
	
	$("#multi_chk").prop("checked", localStorage["multi_chk"] == "true" ? true : false);
	
	return true;
};

$(document).ready(function () {
	task_count = 0;
	loadTasks();
	
	$('#task_form').submit( function(){
		var text = $('#task_field').val();
		addTask(text, false, true);
		return false;
	}).keypress(function( event ){
		if (event.which == 13){
			var text = $('#task_field').val();
			addTask(text, false, true);
			return false;	
		};
		
	});
	
	$("#delete_button").click(function(){
		var list = $('.items:checked');
		for (var i = 0; i < list.length; i++){
			$(list[i]).parent().parent().remove();
		};
		$("#multi_chk").prop("checked", false);
		
		var prev_task_count = task_count;
		
		task_count = task_count - list.length;
		if (task_count == 1){
				$("#counter").text("1 task left");
			}
		else{
				$("#counter").text(task_count + " tasks left");
		};
		if (task_count == 0){
			$("#panel_row").remove();
		}
		
		list = $(".items");
		for (var i = 0; i < list.length; i++){
			localStorage[i+".mark"] = $(list[i]).prop("checked");
			localStorage[i] = $($(list[i]).parent().siblings()[0]).text();
		}
		
		for (var i = list.length; i < prev_task_count; i++){
			localStorage.removeItem(i);
			localStorage.removeItem(i+".mark");
		}
			localStorage["task_count"] = task_count;
		
		return false;
	});
	
	$(document).on("change", ".items", function(){
		var tag = $(this).parent().siblings()[0];
		var flag = false;
		if ($(this).is(':checked')) {
			$(tag).css('text-decoration', 'line-through');
			flag = true;
		}
		else{
			$(tag).css('text-decoration', 'none');
		};
		
		for (var i = 0; i < task_count; i++){
			var list = $(".items");
			if ($(list[i]).parent().siblings()[0] == tag){
				localStorage[i+".mark"] = flag;
			};
		};
		
		return false;
	});
	
	$(document).on('change', '#multi_chk', function() {
		var list = $(".items");
		if ($(this).is(':checked')) {
			$(".items").prop("checked", true);
			localStorage["multi_chk"] = true;
			for (var i = 0; i < list.length; i++){
					$($(list[i]).parent().siblings()[0]).css("text-decoration", "line-through");
					localStorage[i+".mark"] = true;
			};
		} else {
			$(".items").prop("checked", false);
			localStorage["multi_chk"] = false;
			for (var i = 0; i < list.length; i++){
					$($(list[i]).parent().siblings()[0]).css("text-decoration", "none");
					localStorage[i+".mark"] = false;
			};
		};
		return false;
	});
});