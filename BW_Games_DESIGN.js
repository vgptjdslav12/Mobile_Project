//db open
var arr = ["https://www.youtube.com/embed/IF66juAdJRc","https://www.youtube.com/embed/XuKTvveiJEE",
   "https://www.youtube.com/embed/WaDTyZMNNNw","https://www.youtube.com/embed/F90ZVxHh-Is"];
var narr = ["롤 하이라이트","롤하이","ASL 결승전","오버워치 결승"];
var uarr = ["https://www.youtube.com/embed/jqsDcCQKJRg","https://www.youtube.com/embed/fg5eSralpD8",
	"https://www.youtube.com/embed/CM6aWs6X04M"];
var unarr = ["레인보우식스 Extraction 티저","6월 신작 게임", "귀멸의 칼날 히노카미 혈풍담"]
var db;
try{
	db=openDatabase("DB", "1.0", "Main DB", 2 * 1024 * 1024);
	} catch(arr) {
	document.write("브라우저가 WEB SQL을 지원하지 않습니다.");
	}

$(document).ready(function()
{
	print_main();
})
function print_main()
{
	var temp = "<table border='1px'><thead><tr><th colspan='2'>제목</th><th>가격</th><th>할인율</th></thead><tbody>";
	var settings = {
	"url": "https://www.cheapshark.com/api/1.0/deals?storeID=1&lowwerPrice=0",
  	"method": "GET",
  	"timeout": 0,
	};

	$.ajax(settings).done(function (response) {
		var title,salePrice,dealRating,normalPrice,thumb,dealID,link;
		//main 화면에 적용
		for(i=0;i<25;i++)
		{
			if(response[i] == undefined) break;
  			title = response[i].title;
  			salePrice = response[i].salePrice;
  			dealRating = response[i].dealRating * 10;
  			normalPrice = response[i].normalPrice;
  			thumb = response[i].thumb;
  			dealID = response[i].dealID;
  			//link(API 저작권을 위해 cheapshark 링크를 사용)
  			link = "https://www.cheapshark.com/redirect?dealID="+dealID;
  			//layout
			temp += "<tr><td width='20%'><a href='"+link+"'><img src='"+thumb+"'/></a></td><td width='45%'><a href='" + link+"'>"+title+"</a></td><td width='25%' align='center'> Price : <del>"+normalPrice+"</del> <strong>"+salePrice+"$</strong></td><td width='10%'><strong>"+dealRating+"</strong>%</td></tr>"
  		}
  		temp += "</tbody></table>";
  		document.querySelector("#main_sale").innerHTML = temp;

		db.transaction(function(tx){
			var table = "Highlight_Table";
			tx.executeSql("SELECT * FROM "+table,[],function(tx,results){
				document.querySelector("#main_highlight").innerHTML += '<iframe class="main_frame" data-role="content" src="'+results.rows.item(0).link+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></article>'
			});
		});
		db.transaction(function(tx){
			var table = "Update_Table";
			tx.executeSql("SELECT * FROM "+table,[],function(tx,results){
				document.querySelector("#main_update").innerHTML += '<iframe class="main_frame" data-role="content" src="'+results.rows.item(0).link+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></article>'
			});
		});
	});
}
//light page wirte
$("#page_highlight").ready(function()
{
	db.transaction(function(tx){
		var table = "Highlight_Table";
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + table + " (link,name unique)");
		for(i=0; i<4;i++){
			tx.executeSql("INSERT INTO "+table+" (link,name) VALUES (?,?)",[arr[i],narr[i]]);
		}
	});
	print_highlight();
});
function print_highlight()
{
	var table = "Highlight_Table";
	var temp = "";
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM "+table,[],function(tx,results){
			var len = results.rows.length, i;
			//main 화면에 적용
			for(i=0; i<len;i++)
			{
				//layout
				temp += '<header role="banner" class="header1 ui-bar-a ui-header" data-backbtn="false"><h3 class="ui-title" tabindex="0" role="heading" aria-level="1">'+results.rows.item(i).name+'</h3></header><article class="highlight"><iframe class="highlight_frame" src="'+results.rows.item(i).link+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></article><br>'
			}
			document.querySelector("#highlight_content").innerHTML = temp;
		});
	});
}

//highlight add to table
function highlight_add()
{
	var table = "Highlight_Table";
	db.transaction(function(tx)
		{
			tx.executeSql("INSERT INTO "+table+" (link,name) VALUES (?,?)",[
				document.querySelector(".highlight_input_link").value,
				document.querySelector(".highlight_input_name").value]);
	});
	print_highlight();
}
//highlight delete ot table(rowid)
function highlight_delete()
{
	var table = "Highlight_Table";
	db.transaction(function(tx)
	{
		tx.executeSql("DELETE FROM "+table+" WHERE name = ?", document.querySelector(".highlight_delete").value);
	});
	print_highlight();
}
$("#page_update").ready(function()
{
	db.transaction(function(tx){
		var table = "Update_Table";
		tx.executeSql('CREATE TABLE IF NOT EXISTS '+table+' (link,name unique)');
		for(i=0; i<3;i++){
			tx.executeSql("INSERT INTO "+table+" (link,name) VALUES (?,?)",[uarr[i],unarr[i]]);
		}
	});
	print_update();
})
function print_update()
{
	var table = "Update_Table";
	var temp = "";
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM "+table,[],function(tx,results){
			var len = results.rows.length, i;
			for(i=0; i<len;i++)
			{
				//layout
				temp += '<header role="banner" class="header1 ui-bar-a ui-header" data-backbtn="false"><h3 class="ui-title" tabindex="0" role="heading" aria-level="1">'+results.rows.item(i).name+'</h3></header><article class="update"><iframe class="update_frame" src="'+results.rows.item(i).link+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></article><br/>'
			}
			document.querySelector("#update_content").innerHTML = temp;
		});
	});
}
function update_add()
{
	var table = "Update_Table";
	db.transaction(function(tx)
		{
			tx.executeSql("INSERT INTO "+table+" (link,name) VALUES (?,?)",[
				document.querySelector(".update_input_link").value,
				document.querySelector(".update_input_name").value]);
	});
	print_update();
}
//highlight delete ot table(rowid)
function update_delete()
{
	var table = "Update_Table";
	db.transaction(function(tx)
	{
		tx.executeSql("DELETE FROM "+table+" WHERE name = ?", document.querySelector(".update_delete").value);
	});
	print_update();
}
//sale page ready
$("#page_sale").ready(function()
{

  	var temp = "<table border='1px'><thead><tr><th colspan='2'>제목</th><th>가격</th><th>할인율</th></thead><tbody>";
	var settings = {
	"url": "https://www.cheapshark.com/api/1.0/deals?storeID=1&lowwerPrice=0",
  	"method": "GET",
  	"timeout": 0,
	};
	$.ajax(settings).done(function (response) {
		var title,salePrice,dealRating,normalPrice,thumb,dealID,link;
  		for(i=0;i<200;i++)
  		{
  			//response 의 끝에 닿을 경우 break
  			if(response[i] == undefined) break;
  			title = response[i].title;
  			salePrice = response[i].salePrice;
  			dealRating = response[i].dealRating * 10;
  			normalPrice = response[i].normalPrice;
  			thumb = response[i].thumb;
  			dealID = response[i].dealID;
  			//link(API 저작권을 위해 cheapshark 링크를 사용)
  			link = "https://www.cheapshark.com/redirect?dealID="+dealID;
  			//layout
			temp += "<tr><td width='20%'><a href='"+link+"'><img src='"+thumb+"'/></a></td><td width='45%'><a href='" +link+"'>"+title+"</a></td><td width='25%' align='center'> Price : <del>"+normalPrice+"</del> <strong>"+salePrice+"$</strong></td><td width='10%'><strong>"+dealRating+"</strong>%</td></tr>"
  		}
  		temp += "</tbody></table>";
		document.querySelector(".sale_content").innerHTML = temp;
	});
});