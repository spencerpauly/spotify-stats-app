function TopChart(type, duration) {
    var self = this;
    this.type = type;
    this.duration = duration;
    this.cache;

    this.update = function() {
        if (isAuthenticated) {
            if (this.cache === null) {
                $.ajax({
                    url: 'https://api.spotify.com/v1/me/top/' + this.type + '?' + 'time_range=' + this.duration + '&limit=50',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                        self.cache = response.items;
                        console.log(this.cache);
                    }
                });
            }
            
          } else {
            authenticate();
            self.update();
          }
    };

    this.display = function() {
        if (self.cache !== null) {
            console.log(self.cache);
            if (type == "tracks") {
                self.displayTracks();
            } else {
                self.displayArtists();
            }
        } else {
            //this.update();
            //this.display();
        }
    };

    this.displayTracks = function() {
        var currentChart = $("#track-chart");
        currentChart.empty();
  
        var index = 0;
        (self.cache).map( function(song) {
            index++;
            var tableRow = $("<tr></tr>");
            
            
            var number = $("<td></td>");
            number.text(index);
            tableRow.append(number);
            
            var track = $("<td></td>");
            track.text(song.name);
            tableRow.append(track);
  
            var artist = $("<td></td>");
            artist.text(song.artists[0].name);
            tableRow.append(artist);
  
            currentChart.append(tableRow);
        });
    };

    this.displayArtists = function() {
        var currentChart = $("#artist-chart");
        currentChart.empty();
  
        var index = 0;
        self.cache.map( function(artist) {
            index++;
            var tableRow = $("<tr></tr>");
            var number = $("<td></td>");
            var track = $("<td></td>");
  
            number.text(index);
            tableRow.append(number);
  
            track.text(artist.name);
            tableRow.append(track);
  
            currentChart.append(tableRow);
        });
    }
}