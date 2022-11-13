function getDetails(){
  const country = document.getElementById("country").value;
  fetch("/api/scrape", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({country: country})
  }).then(response => response.json())
  .then(function(data){
    const results = data['results']
    const tv_results = data['tv_results']
    const country_name = country.charAt(0).toUpperCase() + country.slice(1);
    document.getElementById('list_title').innerHTML = 'Top 10 Films for ' + country_name
    document.getElementById('list_title_tv').innerHTML = 'Top 10 TV Shows for ' + country_name
    const list_number = ['1','2','3','4','5','6','7','8','9','10']
    list_number.forEach(function(i){
      var films = document.getElementById(`result-film-${i}-div`)
      var tv = document.getElementById(`result-tv-${i}-div`)
      console.log('removing')
      films.innerHTML = ''
      tv.innerHTML = ''
    });
    

    var number = 0 
    var movies = {}
    results.forEach(function(element){
      
      number+=1
      movies[element]={
        "rank":number}
      fetch("/api/film_details?title="+element)
        .then(response => response.json())
        .then(function(data){
          if (!("error" in data)){
            
            var film_rank =  movies[element]['rank'].toString()
            console.log('film ok', element, film_rank)
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

                }
          else{
            console.log('film not ok', element)
            var film_rank =  movies[element]['rank'].toString()
            output = document.getElementById(`result-film-${film_rank}-div`)
            var p = document.createElement("P");
            p.setAttribute('id', 'title')
            p.innerHTML = film_rank + ". " + element;
            output.appendChild(p);
            var a = document.createElement("P");
            a.innerHTML = 'Movie not found in database';
            a.setAttribute('id', 'plot')
            output.appendChild(a)
            var trailer = document.createElement("iframe");
            trailer.src = data['trailer_url'];
            trailer.setAttribute('id', 'trailer')
            output.appendChild(trailer);
          }
        })
      //return movies
      })
      //return movies     

    var tv_number = 0 
    shows = {}
    tv_results.forEach(function(element){
      tv_number+=1
      shows[element]={
        "rank":tv_number}

      fetch("/api/film_details?title="+element)
        .then(response => response.json())
        .then(function(data){
          if (!("error" in data)){
            var tv_rank =  shows[element]['rank'].toString()
            //console.log(element, tv_rank, "TV RANK!!!!")
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

  })
}



