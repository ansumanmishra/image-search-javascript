export default function autocomplete() {
  const API_KEY = '16580982-7c36966d80d6c17534a760e75';
  const searchBox = document.querySelector('#search-image');
  const autocompleteBlock = document.querySelector('#autocomplete');
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
  // Triggering Autocomplete
  searchBox.addEventListener('keyup', async e => {
    autocompleteBlock.innerHTML = 'Loading...';
    autocompleteBlock.style.display = 'block';
    const keyword = e.target.value;

    if (keyword.length < 3) {
      autocompleteBlock.style.display = 'none';
      return;
    }
    const getAllImages = await fetch(
      `${URL}${keyword}&image_type=photo&orientation=horizontal&per_page=50` // &page=count for pagination
    );
    const images = await getAllImages.json();
    if (images && images.hits.length > 0) {
      const imagesHTML = images.hits.reduce((acc, cur) => {
        const imageSource = cur.previewURL; //previewURL, webformatURL
        return (acc += `<img src="${imageSource}" />`);
      }, []);
      autocompleteBlock.innerHTML = imagesHTML;
    } else {
      autocompleteBlock.innerHTML = `No Image(s) found`;
    }
    autocompleteBlock.style.display = 'block';
  });
}
