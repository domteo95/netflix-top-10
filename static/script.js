// page loads



//window.localStorage.setItem("username", "");
//window.localStorage.setItem("session_token", "");
//window.localStorage.setItem('from_chat', "");
// update();

function getDetails(){
  const country = document.getElementById("country").value;
  fetch("/api/scrape", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({country: country})
  }).then(response => response.json())
  .then(function(data){
    console.log(data['results'], data['tv_results'])
    const results = data['results']
    const tv_results = data['tv_results']
    const country_name = country.charAt(0).toUpperCase() + country.slice(1);
    // think about using a for loop to populate the results instead
    document.getElementById('list_title').innerHTML = 'Top 10 Films for ' + country_name
    document.getElementById('list_title_tv').innerHTML = 'Top 10 TV Shows for ' + country_name
    const list_number = ['1','2','3','4','5','6','7','8','9','10']
    list_number.forEach(function(i){
      //console.log('TESTING', i)
      var films = document.getElementById(`result-film-${i}-div`)
      var tv = document.getElementById(`result-tv-${i}-div`)
      while (films.lastChild) {
        console.log('REMOVING FILM')
        films.removeChild(films.lastChild);}
      while (tv.lastChild) {
        tv.removeChild(tv.lastChild)}
    });
    

    var number = 0 
    var movies = {}
    async function getFilmDetails(){
      await results.forEach(function(element){
      
      number+=1
      movies[element]={
        "rank":number}
      fetch("/api/film_details?title="+element)
        .then(response => response.json())
        .then(function(data){
          //console.log('individual film',data)
          //console.log(result, data['imdb'], data['plot'], data['trailer_url']);
          if (!("error" in data)){
            var film_rank =  movies[element]['rank'].toString()
            output = document.getElementById(`result-film-${film_rank}-div`)
            var a = document.createElement("P");
            a.innerHTML = data['plot'];
            a.setAttribute('id', 'plot')
            var p = document.createElement("P");
            p.setAttribute('id', 'title')
            p.innerHTML = film_rank + ". " + element;
            output.appendChild(p);
            const imdb = data['imdb']
            var yellow = parseInt(imdb)
            var white = 10 - yellow;
            
            for ( ; yellow >= 1; yellow--){
                var star = document.createElement("i");
                star.className = "fa fa-star text-yellow";
                star.setAttribute('id', 'yellow-star');
                output.appendChild(star);}
            for ( ; white >= 1; white--){
              var star = document.createElement("i");
              star.className = "fa fa-star-o text-yellow";
              star.setAttribute('id', 'white-star');
              output.appendChild(star);
            }
            output.appendChild(a);
            var trailer = document.createElement("iframe");
            trailer.src = data['trailer_url'];
            trailer.setAttribute('id', 'trailer')
            output.appendChild(trailer);
            
            //films.append(output);
                  //movies[element]['rank']=number
                  //console.log('MOVIES', movies) 
                }
        })
      //return movies
      })
      //return movies     
      }
    getFilmDetails();

    var tv_number = 0 
    shows = {}
    async function getTVDetails(){
      tv_results.forEach(function(element){
      tv_number+=1
      shows[element]={
        "rank":tv_number}

      fetch("/api/film_details?title="+element)
        .then(response => response.json())
        .then(function(data){
          if (!("error" in data)){
            var tv_rank =  shows[element]['rank'].toString()
            output = document.getElementById(`result-tv-${tv_rank}-div`)
            var a = document.createElement("P");
            a.innerHTML = data['plot'];
            a.setAttribute('id', 'plot')
            var p = document.createElement("P");
            p.setAttribute('id', 'title')
            p.innerHTML = tv_rank + ". " + element;
            output.appendChild(p);
            const imdb = data['imdb']
            var yellow = parseInt(imdb)
            var white = 10 - yellow;
            
            for ( ; yellow >= 1; yellow--){
                var star = document.createElement("i");
                star.className = "fa fa-star text-yellow";
                star.setAttribute('id', 'yellow-star');
                output.appendChild(star);}
            for ( ; white >= 1; white--){
              var star = document.createElement("i");
              star.className = "fa fa-star-o text-yellow";
              star.setAttribute('id', 'white-star');
              output.appendChild(star);
            }
            output.appendChild(a);
            var trailer = document.createElement("iframe");
            trailer.src = data['trailer_url'];
            trailer.setAttribute('id', 'trailer')
            output.appendChild(trailer);
            
            //films.append(output);
                  //movies[element]['rank']=number
                  //console.log('MOVIES', movies) 
                }
          else{
            var tv_rank =  shows[element]['rank'].toString()
            output = document.getElementById(`result-tv-${tv_rank}-div`)
            var p = document.createElement("P");
            p.setAttribute('id', 'title')
            p.innerHTML = tv_rank + ". " + element;
            output.appendChild(p);
            var a = document.createElement("P");
            a.innerHTML = 'TV Show not found in database';
            a.setAttribute('id', 'plot')
            output.appendChild(a)
            var trailer = document.createElement("iframe");
            trailer.src = data['trailer_url'];
            trailer.setAttribute('id', 'trailer')
            output.appendChild(trailer);
          }
        })
    } )
  
  }
  getTVDetails();


  })
}



// if the navigation bar is just "/"
//   hide the chat block
//   show the splash screen block
//   return
//
// else if the navigtion bar contains a magic link
//   hide the splash screen block
//   show the chat block
//
//   if we already have a session_token for this chat in local storage:
//     take the magic_key out of the url
//     start polling for messages
//     return
//
//   else (we don't have a session_token for this chat in local storage):
//     use the authenticate endpoint to try to exchange the magic key for a session_token
//
//     if you get a token back
//       put it in local storage
//       take the magic_key out of the url
//       start polling for messages
//       return
//
//     else (you didn't get a valid token back)
//       hide the chat screen
//       change url to "/"
//       show the splash screen
//       return
//
// else if the navigtion bar contains "/chat/<chat_id>"
//   hide the splash screen block
//   show the chat block
//
//   if we have session_token for this chat in local storage:
//     start polling for messages
//     return
//
//   else (no session token)
//     hide the chat screen
//     change url to "/"
//     show the splash screen
//     return
