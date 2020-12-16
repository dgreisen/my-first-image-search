$(document).ready(function(){
  var thumbWidth=474;
  var largeWidth=1500;
  
  //insert HTML into page
  $("#toc").after('<div style="border:solid 2px black"><br><form><label for="searchTerm">What do you want the search term to be?</label><input type="text" id="searchTerm" name="searchTerm"></form><br><p>The blue image will be the primary image; it is the first image in the list and the one that is shown while the word is being typed. The green images will be shown, in a random order, after the word is entered.</p><p>Double-click inside the border to make a picture the primary image. Single click inside the border to toggle an image between red and green.</p><br><button id="selectAll">Select All</button><button id="unSelectAll">Unselect All (except blue)</button><br><br><button id="parse">Parse</button><br><br><form><label for="outputText">Text to add to images.js:</label><br><textarea rows="10" cols="200" id="outputText" name="outputText"></textarea></form><br><button id="copy" name="copy">Copy text to clipboard</button><br><p>the above text needs to be pasted into your images.js file. Like so:</p><samp>window._images = [<br><i>  PASTE HERE</i><br>]</samp></div>');


  $("ul li.gallerybox").css({"color": "green", "border": "2px solid green"});
  $("ul li.gallerybox").addClass("keep");
  $("ul li.gallerybox:eq(0)").css({"color": "blue", "border": "2px solid blue"});
  $("ul li.gallerybox:eq(0)").removeClass("keep"); 
  $("ul li.gallerybox:eq(0)").addClass("first");  
  $("#searchTerm").val($("#firstHeading").text());

  $("#copy").click(function(){
	$("#outputText").select();
    document.execCommand("copy");
  });
  
  function makeURL(rawThumbURL,width){
    var leftURL="";
    var rightURL="";
    var newURL="";
    
    //slice it up. leftURL is everything to the left of the /XXXpx, rightURL is from px to the right (inclusive)
    leftURL = rawThumbURL.slice(0,rawThumbURL.indexOf("px-"));
    rightURL = rawThumbURL.slice(rawThumbURL.indexOf("px-"));
    leftURL = leftURL.slice(0,leftURL.lastIndexOf("/"));
    
    //put together the URL with the correct image size
    newURL = leftURL + "/" + width + rightURL;
    
    return newURL;
  }
  
  $("#parse").click(function(){
    var output="";
    var sourceURL="";
    var rawThumbURL="";
    var thumbURL="";
    var largeURL="";
    var keepOrder = _.shuffle(_.range($(".keep").length));
    var i=0;
    
    output = '{"query": "' + $("#searchTerm").val() + '",\r\n  "results": [\r\n'
    //do the first picture
      sourceURL = "https://commons.wikimedia.org/" + $("ul li.first:eq(0)").find("a").attr("href");
      rawThumbURL = $("ul li.first:eq(0)").find("img").attr("src");
      thumbURL = makeURL(rawThumbURL,thumbWidth);
      largeURL = makeURL(rawThumbURL,largeWidth);
      output += '    {"source": "' + sourceURL + '", "thumbnail": "' + thumbURL + '", "image": "' + largeURL + '"},\r\n';    
    //now do the rest of the keep pictures
    for (i = 0; i < $(".keep").length; i++) {
      sourceURL = "https://commons.wikimedia.org/" + $("ul li.keep:eq(" + keepOrder[i] + ")").find("a").attr("href");
      rawThumbURL = $("ul li.keep:eq(" + keepOrder[i] + ")").find("img").attr("src");
      thumbURL = makeURL(rawThumbURL,thumbWidth);
      largeURL = makeURL(rawThumbURL,largeWidth);     
      output += '    {"source": "' + sourceURL + '", "thumbnail": "' + thumbURL + '", "image": "' + largeURL + '"},\r\n';
    }
	output = output.slice(0,-3);	//remove final comma
    output += "\r\n  ]\r\n  }"
    $("#outputText").val(output);
  });
  
  $("#selectAll").click(function(){
    $("ul li.skip").css({"color": "green", "border": "2px solid green"});
    $("ul li.skip").addClass("keep");
    $("ul li.skip").removeClass("skip");
  });
  
  $("#unSelectAll").click(function(){
    $("ul li.keep").css({"color": "red", "border": "2px solid red"});
    $("ul li.keep").addClass("skip");
    $("ul li.keep").removeClass("keep");
  });
  
  $("li").click(function(){
    if($(this).is(".first")){  
    }
    else if($(this).is(".skip")){
      $(this).css({"color": "green", "border": "2px solid green"});
      $(this).removeClass("skip");
      $(this).addClass("keep");
    }
    else {
      $(this).css({"color": "red", "border": "2px solid red"});
      $(this).removeClass("keep");
      $(this).addClass("skip");
    }
  });

  $("li").dblclick(function(){
    if($(this).is(".first")){
    }
    else {
      $("ul li.first").css({"color": "green", "border": "2px solid green"});
      $("ul li.first").addClass("keep"); 
      $("ul li.first").removeClass("first"); 
      $(this).css({"color": "blue", "border": "2px solid blue"});
      $(this).removeClass("skip");
      $(this).removeClass("keep");
      $(this).addClass("first");
    }
  });
  


});