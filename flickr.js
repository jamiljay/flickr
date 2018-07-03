/*
 * Project Flickr Search 
 * 
 * 	Uses Flickr's API to search for photos by hash tag
 *	
 *
 *	Dependents:
 *		JQuery - used for dom minipulation and ajax requests
 *		Font-Awesome - used for icons
 */
(function () {

	var key = "5989abfda3d883ea75c68938b419a113";

	//var secret = "c20486d6f64a892e";

	var flickrURL = "https://api.flickr.com/services/rest/?";

	var methods = {
		"search": "method=flickr.photos.search",
		"getPhoto": "method=flickr.photos.getInfo"
	};
	
	var requiredParams = "&api_key=" + key + "&format=json&nojsoncallback=1";


	var $searchBar = $( "#search-bar" );
	var $searchButton = $( "#submit-search" );

	var $pageBack = $( "#page-back" );
	var $pageCount = $( "#page-count" );
	var $pageForward = $( "#page-forward" );

	var $resultsBody = $( "#search-results tbody" );

	var currentPage = 0;





	/********** AJAX Functions **********/

	function searchFlickr ( tag, page ) {

		var settings = {
			"method": "GET",
			"url": "",
			"dataType": "json"
		};

		var url = flickrURL + methods.search + requiredParams + "&tags=" + tag;


		if ( page ) {

			url += "&page=" + page;
		}

		settings.url = url;


		return $.ajax( settings ).always( renderResults );
	}

	function getPhoto( photoId ) {

		var settings = {
			"method": "GET",
			"url": "",
			"dataType": "json"
		};

		var url = flickrURL + methods.getPhoto + requiredParams + "&photo_id=" + photoId;

		settings.url = url;

		$resultsBody.find( ".highlight-row" ).removeClass( "highlight-row" );
		this.addClass( "highlight-row" );

		return $.ajax( settings ).always( renderPhoto );
	}





	/********** Render Functions **********/


	function renderPhoto ( response ) {
		
		var photoURL = response.photo.urls.url[0]._content;

		//TODO: handle/disple photo info

		window.open( photoURL, "_blank" );

		return
	}


	function renderResults ( response ) {

		var pages =  response.photos.page + " of " + response.photos.pages;

		$resultsBody.html( "" );

		$pageCount.html( pages );

		currentPage = response.photos.page;


		for ( var index in response.photos.photo ) {

			var object = response.photos.photo[ index ];

			var $tr = $( "<tr>" );

			var $tdTitle = $( "<td>" );
			var $tdPic = $( "<td>" );
			var $tdId = $( "<td>" );
			var $tdServer = $( "<td>" );

			var $image = $( "<img>" );

			var photoURL = getPhotoLink( object );

			$image.attr( "src", photoURL );
			$image.attr( "alt", object.title );


			$image.css( "height", "150px" );
			$image.css( "width", "150px" );


			$tdTitle.text( object.title );
			$tdPic.append( $image );
			//$tdId.text( object.id );
			//$tdServer.text( object.server );

			$tdTitle.css( "width", "430px" );
			$tdPic.css( "width", "150px" );

			$tr.append( $tdTitle );
			$tr.append( $tdPic );
			//$tr.append( $tdId );
			//$tr.append( $tdServer );

			$resultsBody.append( $tr );


			$tr.on( "click", getPhoto.bind( $tr, object.id ) );
		}

		return;
	}


	function getPhotoLink ( photo, size ) {

		var size = size || "q";

		var link = "https://farm" + photo.farm + 
				   ".staticflickr.com/" + photo.server + 
				   "/" + photo.id + 
				   "_" + photo.secret + 
				   "_" + size + ".jpg";


		return link;
	}


	function addEventListners () {

		$searchBar.on( "keyup", function ( e ) {

			searchFlickr( this.value );

		});

		$searchButton.on( "click", function ( e ) {

			searchFlickr( $searchBar.val() );

		});



		$pageBack.on( "click", function ( e ) {

			searchFlickr( $searchBar.val(), currentPage - 1 );

		});

		$pageForward.on( "click", function ( e ) {

			searchFlickr( $searchBar.val(), currentPage + 1 );

		});

		return;
	}



	/********** Starts Project  **********/

	addEventListners();


})();