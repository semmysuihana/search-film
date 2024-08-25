$('#loading-spinner').hide();

function searchMovie() {
  $('.card-content').html('');
  $('#loading-spinner').show();
  var $result = $('#search-input').val();
  
  $.ajax({
    url: 'https://omdbapi.com',
    type: 'get',
    dataType: 'json',
    data: {
      'apikey': 'dd8d4a34',
      's': $result
    },
    success: function(hasil) {
      if (hasil.Response == "True") {
        let movies = hasil.Search;
        
        $('.card-content').append(`
          <h2 class="result">Search Results from "<span id="result">` + $result + `</span>"</h2>
          <div class="row row-cols-1 row-cols-md-3 g-4" id="content-card">
          `
        );
        
        $.each(movies, function(i, data) {
          let posterUrl = data.Poster !== 'N/A' ? data.Poster : 'img/not-found.png';
          $('#content-card').append(`
            <div class="col">
              <div class="card p-3">
                <img src="` + posterUrl + `" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">` + data.Title + `</h5>
                  <p class="card-text">` + data.Type + `</p>
                  <p class="card-text">` + data.Year + `</p>
                  <a href="#" id="see-detail" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="` + data.imdbID + `" style="text-decoration:none">See Detail</a>
                </div>
              </div>
            </div>
          `);
        });
        
        $('#search-input').val('');
      } else {
        $('.card-content').html(`
          <div class="not-found d-flex justify-content-center align-items-center">
            <p>Oops! film yang Anda cari tidak ditemukan.</p>
          </div>
        `);
        
        $('#search-input').val('');
      }
      
      $('html, body').animate({
        scrollTop: $('.card-content').offset().top
      }, 0);
      
      $('#loading-spinner').hide();
    }
  });
}

$('#search-button').on('click', function() {
  searchMovie();
});

$('#search-input').on('keyup', function(e) {
  if (e.keyCode === 13) {
    searchMovie();
  }
});

$('.card-content').on('click', '#see-detail', function() {
  $.ajax({
    url: 'https://omdbapi.com',
    type: 'get',
    dataType: 'json',
    data: {
      'apikey': 'dd8d4a34',
      'i': $(this).data('id')
    },
    success: function(m) {
      if (m.Response === 'True') {
        let posterUrl = m.Poster !== 'N/A' ? m.Poster : 'img/not-found.png';
        let rating = m.imdbRating/2;
        let star = 5;
// Membuat variabel untuk menyimpan elemen ikon bintang
let starIcons = '';

// Loop untuk menentukan kelas ikon bintang berdasarkan nilai rating
for (let i = 1; i <= star; i++) {
  if (i <= rating) {
    starIcons += '<i class="fa fa-star star full-star"></i>';
  } else if (i - rating <= 0.5) {
    starIcons += '<i class="fa fa-star-half star half-star"></i>';
  } else {
    starIcons += '<i class="fa fa-star star empty-star"></i>';
  }
}

$('.modal-body').html(`
<div class="container-fluid">
  <div class="row">
    <div class="col-md-4">
      <img src="` + posterUrl + `" class="img-fluid">
    </div>
    <div class="col-md-8">
      <ul class="list-group">
        <li class="list-group-item"><h3>` + m.Title + `</h3></li>
        <li class="list-group-item">Tahun Rilis : ` + m.Released + `</li>
        <li class="list-group-item">Genre : ` + m.Genre + `</li>
        <li class="list-group-item">Direktor : ` + m.Director + `</li>
        <li class="list-group-item">Aktor : ` + m.Actors + `</li>
        <li class="list-group-item">Plot : ` + m.Plot + `</li>
        <div class="row d-flex justify-content-between align-items-center">
          <div class="ratings m-4">
            ` + starIcons +`<span>  `+rating+`/5</span>
          </div>
          <h5 class="review-count">`+m.imdbVotes+` Votes</h5>
        </div>
      </ul>
    </div>
  </div>
</div>
        `);
      }
      $('.modal-loading').hide();
    }
  });
});
