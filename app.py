from flask import Flask, request
import requests
import bs4
from bs4 import BeautifulSoup

app = Flask(__name__)



@app.route("/")
def index():
    return app.send_static_file("index.html")



# -------------------------------- API ROUTES ----------------------------------


@app.route("/api/scrape", methods=["POST"])
def signup():
    #print(request.data)
    body = request.get_json()
    #print(body)

    country = body["country"]
    base_url = "https://top10.netflix.com/"
    final_url = base_url + country
    source_code = requests.get(final_url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text, "html.parser")
    body = soup.find("tbody")
    rows = body.findAll("tr")
    ten = []
    for row in rows:
        ten.append(row.findAll("td")[1].get_text())

    tv_url = base_url + country + "/tv"
    source_code_tv = requests.get(tv_url)
    plain_text_tv = source_code_tv.text
    soup_tv = BeautifulSoup(plain_text_tv, "html.parser")
    body_tv = soup_tv.find("tbody")
    rows_tv = body_tv.findAll("tr")
    ten_tv = []
    for row in rows_tv:
        ten_tv.append(row.findAll("td")[1].get_text())

    try:
        return {"results": ten, "tv_results": ten_tv}
    except Exception as e:
        print(e)


def get_trailer_url(year, film):
    trailer_url = "https://youtube.com/results?search_query="
    trailer = film +  year + " Netflix trailer"
    #print('film/tvshow name', trailer)
    trailer_url = trailer_url + trailer
    #print('youtube search url', trailer_url)
    source_code = requests.get(trailer_url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text, "html.parser")
    scripts = soup.find_all("body")[0].find_all("script")
    vid_url = scripts[13].text.split("/watch?v=")[1].split('"')[0]
    #print(vid_url)
    vid_url = "https://www.youtube.com/embed/" + vid_url
    return vid_url




@app.route("/api/film_details", methods=["GET"])
def get_details():

    base_url = "http://www.omdbapi.com/?apikey=d470d3d4&t="
    film = request.args.get("title")

    search_url = "http://www.omdbapi.com/?apikey=d470d3d4&s="
    
    #film = film.split(": Season")[0]
    search = base_url + film
    try:
        response = requests.get(search)
        response.raise_for_status()
        response = response.json()
        if "Error" not in response:
            metacritic = response["Metascore"]
            imdb = response["imdbRating"]
            plot = response["Plot"]
            year = response['Year']
            print(1, film)
            vid_url = get_trailer_url(year, film)
            return {
                "metacritic": metacritic,
                "imdb": imdb,
                "plot": plot,
                "trailer_url": vid_url,
            }
        else:
            #print("HERE")
            film_cleaned = film.split(":")[0]
            response = requests.get(search_url + film_cleaned)
            response = response.json()
            if "Error" not in response:
                title = response["Search"][0]["Title"]
                new = requests.get(base_url + title)
                new = new.json()
                metacritic = new["Metascore"]
                imdb = new["imdbRating"]
                plot = new["Plot"]
                year = new['Year']
                print(2, film)
                vid_url = get_trailer_url(year, film)
                return {
                    "metacritic": metacritic,
                    "imdb": imdb,
                    "plot": plot,
                    "trailer_url": vid_url,
                }

            else:
                print(film, "MOVIE NOT FOUND")
                vid_url = get_trailer_url("", film)
                return {"error": "Movie not found", "trailer_url": vid_url}

    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)