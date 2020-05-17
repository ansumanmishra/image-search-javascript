const API_KEY = '16580982-7c36966d80d6c17534a760e75';
const searchForm = document.querySelector('form');
const autocompleteBlock = document.querySelector('#autocomplete');
const previewImageBlock = document.querySelector('.preview-image-block');
const URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;

export default function autocomplete() {
  document
    .querySelector('#recording')
    .addEventListener('click', startRecording);

  // Triggering Autocomplete
  searchForm.onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const keyword = formData.get('search');
    loadImages(keyword);
  };
}

async function loadImages(keyword) {
  autocompleteBlock.innerHTML = 'Loading...';
  autocompleteBlock.style.display = 'block';

  if (keyword.length < 3) {
    autocompleteBlock.style.display = 'none';
    return;
  }
  const getAllImages = await fetch(
    `${URL}${keyword}&image_type=photo&orientation=horizontal&per_page=49` // &page=count for pagination
  );
  const images = await getAllImages.json();
  if (images && images.hits.length > 0) {
    const imagesHTML = images.hits.reduce((acc, cur) => {
      const imageSource = cur.previewURL; //previewURL, webformatURL, largeImageURL
      return (acc += `<img src="${imageSource}" data-large="${cur.largeImageURL}"/>`);
    }, []);
    autocompleteBlock.innerHTML = imagesHTML;
    autocompleteBlock.style.display = 'block';

    // Image click handler
    const allImages = autocompleteBlock.querySelectorAll('img');
    allImages.forEach(image =>
      image.addEventListener('click', e => {
        const bigImageUrl = e.target && e.target.dataset.large;
        const bigImage = new Image();
        bigImage.src = bigImageUrl;
        previewImageBlock.innerHTML = '';
        previewImageBlock.append(bigImage);
      })
    );

    // Close the preview on click on body
    previewImageBlock.addEventListener(
      'click',
      () => (previewImageBlock.innerHTML = '')
    );
  } else {
    autocompleteBlock.innerHTML = `No Image(s) found`;
  }
}

function startRecording() {
  if (window.hasOwnProperty('webkitSpeechRecognition')) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(e) {
      const transcript = e.results[0][0].transcript;
      document.querySelector('#search-image').value = transcript;
      recognition.stop();
      loadImages(transcript);
    };

    recognition.onerror = function(e) {
      recognition.stop();
    };
  }
}
