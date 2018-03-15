var giphyProject = {
	topicList: ["Mario Kart", "Legend of Zelda", "Overwatch", "Solid Metal Gear", "Hearthstone", "The Sims", "Crash Bandicoot", "StarCraft", "Guild Wars", "Super Smash Brothers", "Tetris"],
	favoritesList: [],
	offsetCount: 0, //for loading additional gifs on a topic
	currentTopic: undefined, //checks what the current topic is
	URL: "https://api.giphy.com/v1/gifs/search?limit=10&api_key=e2neKmC9nvNkJMrwCtJCpDsniTSy3HFz&q=",
	//Dynamically loads topic buttons
	loadButtons: function(){
		$("#buttons").empty();
		for(var i = 0; i < giphyProject.topicList.length; i++){
			var element = $("<button>");
			element.addClass("btn btn-primary")
				   .attr("topic", giphyProject.topicList[i])
				   .text(giphyProject.topicList[i]);
			$("#buttons").append(element);
		}		
	},
	//Adds new topic to topic list and reloads buttons
	newTopic: function(){
		if($("#topic").val().trim() === ""){
			alert("Type in a New Topic First")
		} else {
			var doesExist = false;
			for(var i = 0; i < giphyProject.topicList.length; i++){
				if(giphyProject.topicList[i] === $("#topic").val().trim()){
					doesExist = true;
				}
			}
			if(doesExist !== true) {
				var toAdd = $("#topic").val().trim()
				giphyProject.topicList.push(toAdd)
				giphyProject.loadButtons();
			} else {
				alert("Topic Already Exists")
			}
		}
	},
	//Gets 10 gifs based on topic button chosen
	getGifs: function(){
		$("#gifs").empty();
		queryURL = giphyProject.URL + $(this).attr("topic");
		giphyProject.offsetCount = 0; //resets offset
		giphyProject.currentTopic = $(this).attr("topic"); //sets current Topic
		$.ajax({
	        url: queryURL,
	        method: "GET"
	     }).then(function(response){
	     	var results = response.data;
	     	for(var i = 0; i < results.length; i++){
	     		var title = $("<h2>" + results[i].title + "</h2>");
	     		var rating = $("<p>Rating: " + results[i].rating + " </p>")
	     		var glyphicon = $("<span class='glyphicon glyphicon-save' aria-hidden='true'></span>")
	     		var downloader = $("<a download>")
	     		var addFav = $("<span class='glyphicon glyphicon-heart' aria-hidden='true'></span>")
	     		$(addFav).attr("id", results[i].id)
	     		$(downloader).attr("href", results[i].images.fixed_width.url)
	     		$(downloader).html(glyphicon)
	     		$(rating).append(downloader)
	     				 .append(addFav)
	     		var img = $("<img>")
	     		$(img).attr("src", results[i].images.fixed_width_still.url)
	     			  .attr("data-still", results[i].images.fixed_width_still.url)
	     			  .attr("data-animate", results[i].images.fixed_width.url)
	     			  .attr("data-state", "still")
	     			  .addClass("gif")
	     		var gifDiv = $("<div>")
	     		$(gifDiv).addClass("gifContainer")
	     				 .append(title)
	     				 .append(img)
	     				 .append(rating)
	     		$("#gifs").append(gifDiv)
	     	}
	     })
	},
	//Loads an additional 10 gifs based on topic
	loadTenMore: function(){
		if(giphyProject.currentTopic === undefined){
			alert("Pick a Topic First");
		} else {
			giphyProject.offsetCount += 10;
			var queryURL = giphyProject.URL + giphyProject.currentTopic + "&offset=" + giphyProject.offsetCount;
			$.ajax({
		        url: queryURL,
		        method: "GET"
		     }).then(function(response){
		     	var results = response.data;
		     	for(var i = 0; i < results.length; i++){
		     		var title = $("<h2>" + results[i].title + "</h2>");
		     		var rating = $("<p>Rating: " + results[i].rating + " </p>")
		     		var glyphicon = $("<span class='glyphicon glyphicon-save' aria-hidden='true'></span>")
		     		var downloader = $("<a download>")
		     		var addFav = $("<span class='glyphicon glyphicon-heart' aria-hidden='true'></span>")
		     		$(addFav).attr("id", results[i].id)
		     		$(downloader).attr("href", results[i].images.fixed_width.url)
		     		$(downloader).html(glyphicon)
		     		$(rating).append(downloader)
		     				 .append(addFav)
		     		var img = $("<img>")
		     		$(img).attr("src", results[i].images.fixed_width_still.url)
		     			  .attr("data-still", results[i].images.fixed_width_still.url)
		     			  .attr("data-animate", results[i].images.fixed_width.url)
		     			  .attr("data-state", "still")
		     			  .addClass("gif")
		     		var gifDiv = $("<div>")
		     		$(gifDiv).addClass("gifContainer")
		     				 .append(title)
		     				 .append(img)
		     				 .append(rating)
		     		$("#gifs").prepend(gifDiv)
		     	}
		     })
		 }
	},
	//Starts or stops an animation
	playStop: function(){
		var state = $(this).attr("data-state")
		if(state === "still"){
			$(this).attr("src", $(this).attr("data-animate"));
        	$(this).attr("data-state", "animate");
		} else {
			$(this).attr("src", $(this).attr("data-still"));
        	$(this).attr("data-state", "still");
		}
	},
	//function for adding or removing gifs from favorites
	addRemoveFavorite: function(){
		if($(this).hasClass("glyphicon-heart")){
			var id = $(this).attr("id");
			giphyProject.favoritesList.push(id);
			//Stores to Local Storage
			localStorage.clear();
			localStorage.setItem("favorites", JSON.stringify(giphyProject.favoritesList));

			$(this).closest(".gifContainer").remove();
			var urlByID = "https://api.giphy.com/v1/gifs/" + giphyProject.favoritesList[giphyProject.favoritesList.length-1] + "?api_key=e2neKmC9nvNkJMrwCtJCpDsniTSy3HFz&";
			$.ajax({
	        	url: urlByID,
	        	method: "GET"
	     	}).then(function(response){
	     		var results = response.data;
	     		var title = $("<h2>" + results.title + "</h2>");
	     		var rating = $("<p>Rating: " + results.rating + " </p>")
	     		var glyphicon = $("<span class='glyphicon glyphicon-save' aria-hidden='true'></span>")
	     		var downloader = $("<a download>")
	     		var removeFav = $("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>")
	     		$(removeFav).attr("id", giphyProject.favoritesList[giphyProject.favoritesList.length-1])
	     		$(downloader).attr("href", results.images.fixed_width.url)
	     		$(downloader).html(glyphicon)
	     		$(rating).append(downloader)
	     				 .append(removeFav)
	     		var img = $("<img>")
	     		$(img).attr("src", results.images.fixed_width_still.url)
	     			  .attr("data-still", results.images.fixed_width_still.url)
	     			  .attr("data-animate", results.images.fixed_width.url)
	     			  .attr("data-state", "still")
	     			  .addClass("gif")
	     		var gifDiv = $("<div>")
	     		$(gifDiv).addClass("gifContainer")
	     				 .append(title)
	     				 .append(img)
	     				 .append(rating)
	     		$("#favorites").append(gifDiv)

	     	})
		} else {
			var id = $(this).attr("id")
			for(var i = 0; i < giphyProject.favoritesList.length; i++){
				if(id === giphyProject.favoritesList[i]){
					giphyProject.favoritesList.splice(i,1)
				}
			}
			localStorage.clear();
			localStorage.setItem("favorites", JSON.stringify(giphyProject.favoritesList));
			$(this).closest(".gifContainer").remove();
		}
	},
	//Loads favorites from Local Storage
	loadFavorites: function(){
		var storedFavs = JSON.parse(localStorage.getItem("favorites"));
		if (!Array.isArray(storedFavs)) {
        	storedFavs = [];
      	}
      	for(var i = 0; i < storedFavs.length; i++){
      		var urlByID = "https://api.giphy.com/v1/gifs/" + storedFavs[i] + "?api_key=e2neKmC9nvNkJMrwCtJCpDsniTSy3HFz&";
			$.ajax({
	        	url: urlByID,
	        	method: "GET"
	     	}).then(function(response){
	     		var results = response.data;
	     		var title = $("<h2>" + results.title + "</h2>");
	     		var rating = $("<p>Rating: " + results.rating + " </p>")
	     		var glyphicon = $("<span class='glyphicon glyphicon-save' aria-hidden='true'></span>")
	     		var downloader = $("<a download>")
	     		var removeFav = $("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>")
	     		$(removeFav).attr("id", giphyProject.favoritesList[giphyProject.favoritesList.length-1])
	     		$(downloader).attr("href", results.images.fixed_width.url)
	     		$(downloader).html(glyphicon)
	     		$(rating).append(downloader)
	     				 .append(removeFav)
	     		var img = $("<img>")
	     		$(img).attr("src", results.images.fixed_width_still.url)
	     			  .attr("data-still", results.images.fixed_width_still.url)
	     			  .attr("data-animate", results.images.fixed_width.url)
	     			  .attr("data-state", "still")
	     			  .addClass("gif")
	     		var gifDiv = $("<div>")
	     		$(gifDiv).addClass("gifContainer")
	     				 .append(title)
	     				 .append(img)
	     				 .append(rating)
	     		$("#favorites").append(gifDiv)
      	})
      }
	},
	//App Initialization
	initalize: function(){
		giphyProject.loadButtons()
		giphyProject.loadFavorites()
		
		$("#buttons").on("click", "button", giphyProject.getGifs)
		$(document).on("click", ".gif", giphyProject.playStop)
		$("#gifs").on("click", ".glyphicon-heart", giphyProject.addRemoveFavorite)
		$("#favorites").on("click", ".glyphicon-remove", giphyProject.addRemoveFavorite)
		$("#addTopic").on("click", giphyProject.newTopic)
		$("#tenMore").on("click", giphyProject.loadTenMore)
	},
}

giphyProject.initalize()

 