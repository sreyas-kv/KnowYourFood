const FOOD_SEARCH_URL = "https://api.nal.usda.gov/ndb/search/";
const FOOD_NUTRIENTS_URL = "https://api.nal.usda.gov/ndb/reports/";


function getDataFromApi(searchTerm, callBack){
  const query = {
    api_key: 'qUEjQjoKNtP38ydPdg5ErAZDtkh1y4QJcJrJ0OaI',
     q:`${searchTerm}`,
    // q:'butter',
    format: 'JSON',
    max: 1,
    sort: 'n',
    offset: 0
  }
   $.getJSON(FOOD_SEARCH_URL, query, callBack);
}

function renderResults(result){
  let resultRecieved = result.name;

 //display the product name
 
  const htmlName = `
  <div class="col-2">
  <p>${resultRecieved}</p>
  </div>`
const outputElem = $('.product-name');
outputElem.prop('hidden', false).html(htmlName);

}

function getNutrients(ndbNo, callBack){
  const query = {
    api_key: 'qUEjQjoKNtP38ydPdg5ErAZDtkh1y4QJcJrJ0OaI',
    ndbno: ndbNo,
    format: 'JSON',
    type: 'b'
  }
  $.getJSON(FOOD_NUTRIENTS_URL, query, callBack);
}

function displayFoodSearchResults(data){
  if(data.errors){
    alert('No Results found');
  }
  else {
  const results = data.list.item.map((item, index) => {
    let ndbNo = item.ndbno;
    getNutrients(ndbNo, renderNutrients);    
    renderResults(item);

  }); 
  $(".para-1").hide();
  // $('.search-results').html(results);
}}

function renderNutrients(result){
  //display the ingredients
 const foodIngredients = result.report.food.ing.desc;
 const htmlIngredients = `
 <div class="col-3">
 <p>${foodIngredients}</p> `; 
const outputElem = $('.ingredients');
outputElem.prop('hidden', false).html(htmlIngredients);
  searchForToxins(foodIngredients);
}

function searchForToxins(result){
  const SearchResultingredients =  result.split(",");
  const compare = SearchResultingredients;
  let found = '';
  let finalResult = [];
 for(let i=0;i<SearchResultingredients.length;i++){
   found = TOXINS.find(function(element) {
      return element == SearchResultingredients[i].trim();
    });
   if(found){
      finalResult.push(found);
   }
}
  if(finalResult.length != 0){
const htmlFound = `
<div class="col-4">
<p><span class="toxin-result">${finalResult }</span> is a toxin known to the state of California to cause cancer</p>
</div> `;
const outputElem3 = $('.toxin-check');
outputElem3.prop('hidden', false).html(htmlFound);
}
else {
  const htmlFound = `
<div class="col-4">
<p><span class="non-toxin">No toxins found</span> </p>
</div> `;
const outputElem3 = $('.toxin-check');
outputElem3.prop('hidden', false).html(htmlFound);
}
}

function textContentClear(){
  $('.input-food').click(function(){
    $('.input-food').val("");
  });
  watchSubmit();
}

function watchSubmit(){
  $('.js-search-form').submit(event =>{
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.input-food');
    const query = queryTarget.val();
    queryTarget.val("");
    getDataFromApi(query, displayFoodSearchResults);
  });
}


$(textContentClear);

