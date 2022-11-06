# netflix-top-10

# Netflix Top 10 - Choosing What To Watch Next (2022)

Built using: Python - Flask and BeautifulSoup, Javascript and HTML


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<p class="view"><a href="https://github.com/domteo95/ios-app-nba-players"><i class="fa fa-github" style="font-size:24px"></i>  View the Project on GitHub</a></p>

**Background**

Recently, Netflix began publicizing its global <a href="https://top10.netflix.com/united-states"> top 10 </a> most watched films or TV shows. This provides a list of content for people to watch yet besides the title, Netflix's website does not provide any more information on these films/shows that will help people decide if these films/shows are for them. 

This website/program helps scrapes the top 10 lists from Netflix's website for the following countries:

| Countries covered in this program      | 
| ----------- | 
| Australia   |
| Brazil   |
| France   |
| Hong Kong   |
| India   | 
| Japan   |
| Singapore   |
| Taiwan   |
| United States      | 
| United Kingdom   |

Users can either select the country in the drop-down list or access the results directly via URL. There are 2 aspects to this program:
1. Web Scraping Netflix Top 10 data from Netflix's website.
2. Using the Netflix Top 10 data as input for the <a href="https://www.omdbapi.com"> OMDb API </a> to access the film/show's details as well as YouTube trailer. 

The OMDb API and YouTube trailer will then be shown. 

<img src="/assets/img/netflix-top-10.gif">

## Web Scraping the Netflix Top 10 data from Netflix's website

- I've created a Flask API that utilises BeautifulSoup to scrape Netflix's Top 10 <a href="https://top10.netflix.com/united-states"> website </a> to return the Top 10 shows and films for the country selected.

## Utilising OMDb API to get film/show's info and web scraping the YouTube trailer

- Loop through the web scrapped list of top 10 films and tv shows as input for a Flask API that utilises the OMDb API to return the show/film's IMDB rating (out of 10) and a short description of the film. <br><br>
- There will be cases where the film/show title does not match the OMDb API database and will hence return no results. I've tried to mitigate this through the following steps:
1. Oftentimes the title scrapped is too long (for titles with ":" e.g. 13 Hours: The Secret Soldiers of Benghazi) and the title in the OMDb database is its simplified version (e.g. 13 Hours) hence I will try to split the scrapped title on ":" and will use the first part of the title as input for the OMDb API again. 
2. For TV shows, just search using the title without the season number. 
- Then the Flask API will use the film title to web scrape the URL for the film trailer on YouTube which will then embedd it. 

- Note: on Javascript, accessing the Flask API that loops through the web scrapped list means that it will return the results not in the Top 10 order but in the order in which the results are returned. Hence it's necessary to use the async function

- After storing the returned info in a dictionary, I will then loop through the dictionary to populate the page. This is still within the  async function. This is done for films and then tv shows.

```
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

```

