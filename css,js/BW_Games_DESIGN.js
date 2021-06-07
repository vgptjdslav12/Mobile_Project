$(document).ready(function()
{
	var db;
	var table = "Main_Table";
	try{
		db=openDatabase("DB", "1.0", "Test DB", 2 * 1024 * 1024);
	} catch(arr) {
		document.write("브라우저가 WEB SQL을 지원하지 않습니다.");
	}
	db.transaction(function(tx){
		var table = "Main_Table";
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + table + " (name unique)");
		var table = "Highlight_Table";
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + table + " (number unique, name, link)");
		var table = "Sale_Table";
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + table + " (number unique, name, link)");
		var table = "Intel_Table";
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + table + " (number unique, name, link)");
		var table = "Update_Table";
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + table + " (number unique, name, link)");
	});
	console.log("on Ready")
});
function highlight_add()
{
	$("highlight_input").visibility = "visible"; 
	console.log("highlight_add");
}