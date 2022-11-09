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
    const films = document.getElementById('listFilm');
    const tv = document.getElementById("listTv");
    while (films.lastChild.id !== 'list_title') {
      films.removeChild(films.lastChild);
    }
    while (tv.lastChild.id !== 'list_title_tv') {
      tv.removeChild(tv.lastChild);
    }

    var number = 0 
    movies = {}
    results.forEach(function(element){
      number+=1
      movies[element]={
        "rank":number,
        "imdb": 'Movie Not Found in OMDBDatabase',
        "plot": "Movie Not Found in OMDBDatabase!",
        "trailer_url": "Movie Not Found in OMDBDatabase"}
    } )

    var tv_number = 0 
    shows = {}
    tv_results.forEach(function(element){
      tv_number+=1
      shows[element]={
        "rank":tv_number,
        "imdb": 'Show Not Found in OMDBDatabase',
        "plot": "Show Not Found in OMDBDatabase!",
        "trailer_url": "Show Not Found in OMDBDatabase"}
    } )

    async function asyncPromFilms(){
      await Promise.all(results.map(result =>
        fetch("/api/film_details?title="+result)
        .then(response => response.json())
        .then(function(data){
          //console.log(result, data['imdb'], data['plot'], data['trailer_url']);
          movies[result]['trailer_url'] = data['trailer_url'] 
          if (!("error" in data)){
            movies[result]['plot'] = data['plot']
            movies[result]['imdb'] = data['imdb']}
         
        })));
        for (const [key, value] of Object.entries(movies)) {
          var output = document.createElement("div");
          output.setAttribute('id', 'result-div');
          var a = document.createElement("P");
          a.innerHTML = value['plot'];
          a.setAttribute('id', 'plot')
          var p = document.createElement("P");
          p.setAttribute('id', 'title')
          p.innerHTML = value['rank'] + ". " + key;
          output.appendChild(p);
          const imdb = value['imdb']
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
          trailer.src = value['trailer_url'];
          trailer.setAttribute('id', 'trailer')
          output.appendChild(trailer);
          
          films.append(output);
         }
    }
    asyncPromFilms();

    async function asyncPromTV(){
      await Promise.all(tv_results.map(tv_result =>
        fetch("/api/film_details?title="+tv_result)
        .then(response => response.json())
        .then(function(data){
          //console.log(tv_result, data);
          shows[tv_result]['trailer_url'] = data['trailer_url']   
          if (!("error" in data)){
            shows[tv_result]['plot'] = data['plot']
            shows[tv_result]['imdb'] = data['imdb']
                    }
         
        })));
        for (const [key, value] of Object.entries(shows)) {
          var tv_output = document.createElement("div");
          tv_output.setAttribute('id', 'result-div');
          var tv_a = document.createElement("P");
          tv_a.innerHTML = value['plot'];
          //tv_a.setAttribute('id', 'plot')
          var tv_p = document.createElement("P");
          tv_p.setAttribute('id', 'title')
          tv_p.innerHTML = value['rank'] + ". " + key;
          tv_output.appendChild(tv_p);
          const tv_imdb = value['imdb']
          var yellow = parseInt(tv_imdb)
          var white = 10 - yellow;
          
          for ( ; yellow >= 1; yellow--){
              var star = document.createElement("i");
              star.className = "fa fa-star text-yellow";
              star.setAttribute('id', 'yellow-star');
              tv_output.appendChild(star);}
          for ( ; white >= 1; white--){
            var star = document.createElement("i");
            star.className = "fa fa-star-o text-yellow";
            star.setAttribute('id', 'white-star');
            tv_output.appendChild(star);
          }
          tv_output.appendChild(tv_a);
          var tv_trailer = document.createElement("iframe");
          tv_trailer.src = value['trailer_url'];
          tv_trailer.setAttribute('id', 'trailer')
          tv_output.appendChild(tv_trailer);
          tv.append(tv_output);
         }
    }
    asyncPromTV();

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
