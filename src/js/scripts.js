var repository= (function() {

  var list= []

  var modalContainer = $('#modal-container');

  function add(movies) {
    list.push(movies);
  }

  function loadList() {
    return $.ajax('https://ghibliapi.herokuapp.com/films', { dataType: 'json'}).then(function (responseJSON) {
      $.each(responseJSON, function(i, item) {
        var movies = {
          title: item.title,
          director: item.director,
          release_date: item.release_date,
          description: item.description
        };
        add(movies);
      });
    })
  }

  function getAll() {
    return list;
  }

  function closeModal() {
    modalContainer.removeClass('is-visible');
  }

  $('#modal-container').on('click', function() {
    closeModal();
  })

  $(document).keydown(function(event) {
    if(event.key === 'Escape') {
      closeModal();
    }
  });

  function showDetails(item) {
    $('.modal-header').empty();
    $('.modal-body').empty();
    $('.modal-header').append('<h5 class="modal-title"> ' + item.title + ' </h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>');
    $('.modal-body').append( '<p> Director: ' + item.director + ' </p> <p> Released: ' + item.release_date + '</p> <p>' + item.description + '</p>')
    var prevButton = $('.carousel-control-prev');
    var nextButton = $('.carousel-control-next');
    prevButton.on('click', function() {
      var lastItemIndex = list.indexOf(item) - 1;
      var lastItem = list[ lastItemIndex ];
      if(lastItemIndex > -1) {
        showDetails(lastItem);
      }
    })
    nextButton.on('click', function() {
      var nextItemIndex = list.indexOf(item) + 1;
      var nextItem = list[ nextItemIndex ];
      if(nextItemIndex < list.length) {
        showDetails(nextItem);
      }
    })
  }

  function addListItem(movies) {
    var movieList = $('#movie-list');
    var listItem = $('<li class="list-group-item"> </li>');
    var button = $('<button type = "button" class="btn btn-light btn-lg btn-block" data-toggle="modal" data-target="#modal-container">' + movies.title + '</button>');
    button.on('click', function() {
      showDetails(movies);
    });
    listItem.append(button);
    movieList.append(listItem);
  }

  return {
    add: add,
    loadList: loadList,
    getAll: getAll,
    closeModal: closeModal,
    showDetails: showDetails,
    addListItem: addListItem
  }
})();

repository.loadList().then(function() {
  repository.getAll().forEach(repository.addListItem)
});



$(document).ready(function(){
     $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
        $('#back-to-top').click(function () {
            $('#back-to-top').tooltip('hide');
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });

        $('#back-to-top').tooltip('show');

});

$(document).ready(function(){
  $('#search-input').on('keyup', function() {
    var value = $(this).val().toLowerCase();
    $('li').filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
