////////////////////////////////////////////////////////////////////////////////////////
var map;
function initMap(){
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat:-35, lng: 150},
		zoom: 8
	});
	var request = {
		location:map.getCenter(),
		radius: '500',
		query:'#pr2__question'
	};
}
///////////////////////////////////////////////////////////////////////////////////////

	


$("#pr3__clear").click(function(){
	CorrectOne.remove();

	var table1 = document.getElementById("MyTable");
			for(var i = 0; i < table1.rows.length+10000; i++){
				table1.deleteRow(4);
			};
	});

/////////////////////////////////////////////////////////////////////////////////////////////////
var config = {
            apiKey: "AIzaSyAASjhRRI53l3o_ISLla_VkPXp8SVExWsg",
		    authDomain: "project3-611e0.firebaseapp.com",
		    databaseURL: "https://project3-611e0.firebaseio.com",
		    projectId: "project3-611e0",
		    storageBucket: "project3-611e0.appspot.com",
		    messagingSenderId: "665279631687"
      	     };
      	     
      firebase.initializeApp(config);
////////////////////////////////////////////////////////////////////////////////////////////////
var getData;
var SaveCountry;
var SaveCapital;
var CorrectAnswer = 0;
var test = 0;
var testing = 0;
var pairs = [];
var CorrectOne = firebase.database().ref('pairs');
/////////////////////////////////////////////////////////////////////////////////////////////
$.ajax({
        'url' : 'https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv',
        'type' : 'GET',
         async: false,	
        success : function(data){
          	getPairs(data);
        }
    });
	
function getPairs(data){
	var getline = data.split(/\r\n|\n/);
	for(var i = 1; i < getline.length; i++){
		var temp = getline[i].split(',');
		pairs.push({"country": temp[0], "capital": temp[1]});
	}	
}
	

/////////////////////////////////////////////////////////////////////////////////////////////

		var capitalArray = [];
		 for (var i = 0; i < Math.floor(pairs.length); i++){
			capitalArray[i] = pairs[i].capital;
		}

		var TotalArray = [];
/////////////////////////////////////////////////////////////////////////////////////////////////
$( document ).ready(function()  {
		getData = getCountry();
		SaveCountry = getData.country;
		SaveCapital = getData.capital;

			CorrectOne.on("child_added",function(snapshot){
				var solution = snapshot.val();    // solution.country or solution.capital  
				var key = snapshot.key;          //  item id 
				var TrueOrFalse = true;
				 	var table = document.getElementById("MyTable");
				    	    var row = table.insertRow(4);
						    var cell1 = row.insertCell(0);
						    var cell2 = row.insertCell(1);
						    var cell3 = row.insertCell(2);
						    
						    
						    if(solution.x == 1){
						    	row.className = 'TableCorrect';
								cell1.innerHTML = solution.country.fontcolor("blue");
								cell2.innerHTML = solution.capital.fontcolor("blue");
								cell3.innerHTML = ("&#10004 <button id = '"+key+"' onclick=DeleteRow('"+key+"') >Delete</button>").fontcolor("blue");

							}else{
								row.className = 'TableWrong';
								cell1.innerHTML = solution.country.fontcolor("red");
								cell2.innerHTML = solution.capital.fontcolor("red").strike();		
								cell3.innerHTML = (solution.correct + "<button id = '"+key+"' onclick=DeleteRow('"+key+"')> Delete </button> ").fontcolor("red");

							}	
							cell1.addEventListener("click",function(){
								map_loc.src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDKTGDw4MYmzGx8p0RWhqcCMtI1pXq1G3k&q=' + solution.country + '&maptype=satellite'
							});
			});

			var map_loc = document.getElementById('map');
  map_loc.src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDKTGDw4MYmzGx8p0RWhqcCMtI1pXq1G3k&q=' + SaveCountry + '&maptype=satellite'


			$( "#pr2__answer" ).autocomplete({
                          minLength: 2,
                          source: capitalArray,
                          select: function(event,ui){
                          recordData(ui.item.value);
					      getData = getCountry();
		        	      SaveCountry = getData.country;
       			         SaveCapital = getData.capital;
				 document.getElementById('pr2__question').innerHTML = SaveCountry;

                                  this.value = "";
                                  return false;
                          }

                        });
			document.getElementById("pr2__answer").focus();
			document.getElementById('pr2__question').innerHTML = SaveCountry;
			

	$('#pr2__submit').click(function(){	
			var x = document.getElementById("pr2__answer").value;
	 		recordData(x);

		    getData = getCountry();
            SaveCountry = getData.country;
            SaveCapital = getData.capital;

		document.getElementById('pr2__question').innerHTML = SaveCountry;
		document.getElementById("pr2__answer").value = "";
  map_loc.src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDKTGDw4MYmzGx8p0RWhqcCMtI1pXq1G3k&q=' + SaveCountry + '&maptype=satellite'
	});
	
});


///////////////////////////////////////////////////////////////////////////////////////////////////
$("#pr2__answer").on('keypress',function(e){
                if(e.keyCode == 13) {
			 var x = document.getElementById("pr2__answer").value;
                recordData(x);
                  getData = getCountry();
                SaveCountry = getData.country;
                SaveCapital = getData.capital;

                document.getElementById('pr2__question').innerHTML = SaveCountry;
		document.getElementById("pr2__answer").value = "";
		}
        });

// this is picking random  data
function getCountry(){

	var country_capital_pairs = pairs;
        var Random_Pick = Math.floor(Math.random()*country_capital_pairs.length);
	return  country_capital_pairs[Random_Pick];
}
///////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////






function recordData(value) {
	
		var x = value;

		if(SaveCapital == x){
			
			var newCorrect = CorrectOne.push();

			newCorrect.update({country: getData.country,
							   capital: getData.capital,
							   correct: SaveCapital,
							    x: 1
							   });
			TrueOrFalse = true;
		}else{
			
			var newCorrect = CorrectOne.push();
			
			newCorrect.update({country: getData.country,
							   capital: x,
							   correct: SaveCapital,
							   y: 0
							  });
			TrueOrFalse = false;
		}


		if(TrueOrFalse == true){
			if(document.getElementById("optionWrongOnly").checked){
		 	   document.getElementById("optionAll").checked = true;
				
			var elements1 = document.getElementsByClassName('TableCorrect');
       		 		Array.prototype.forEach.call(elements1, function(element){
                        	element.style.display = "";
        			});
        
			var elements2 = document.getElementsByClassName('TableWrong');
        			Array.prototype.forEach.call(elements2, function(element){
                        	element.style.display = "";

					});
		       }
		}

		if(TrueOrFalse == false){
			if(document.getElementById("optionCorrectOnly").checked){
                           document.getElementById("optionAll").checked = true;
                                 
                        var elements1 = document.getElementsByClassName('TableCorrect');
                                Array.prototype.forEach.call(elements1, function(element){
                                element.style.display = "";
                                });

                        var elements2 = document.getElementsByClassName('TableWrong');
                                Array.prototype.forEach.call(elements2, function(element){
                                element.style.display = "";

                        });
                        }

		}
}
function DeleteRow(test){
	var row = document.getElementById(test)	;
	var row = row.parentNode.parentNode.parentNode;
	row.parentNode.removeChild(row);
    CorrectOne.child(test).remove();
}



function RadioCheck(choice){
if(choice == "all"){
		var elements1 = document.getElementsByClassName('TableCorrect');
		Array.prototype.forEach.call(elements1, function(element){
				element.style.display = "";
		});
		var elements2 = document.getElementsByClassName('TableWrong');
		Array.prototype.forEach.call(elements2, function(element){
			        element.style.display = "";
		});
} else if(choice == "Wrong"){
	var elements1 = document.getElementsByClassName('TableCorrect');
        Array.prototype.forEach.call(elements1, function(element){
                        element.style.display = "none";
        });
        var elements2 = document.getElementsByClassName('TableWrong');
        Array.prototype.forEach.call(elements2, function(element){
                        element.style.display = "";
        });
} else if(choice == "Correct"){
        var elements1 = document.getElementsByClassName('TableCorrect');
        Array.prototype.forEach.call(elements1, function(element){
                        element.style.display = "";
        });
        var elements2 = document.getElementsByClassName('TableWrong');
        Array.prototype.forEach.call(elements2, function(element){
                        element.style.display = "none";
        });
}
}
 

