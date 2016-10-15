var sourceWrapper     = document.getElementById('sourceWrapper');
var sourceDialog      = document.getElementById('sourceDialog');
var markupSource      = document.getElementById('markupSource');
var styleSource       = document.getElementById('styleSource');

var activeNum;
var markupType = 'html';
var styleType = 'scss';


function renderMarkupSource() {
  markupSource.innerHTML = markupType == 'html' ? '<div class="spinner-' + activeNum + '"></div>' : '.spinner-' + activeNum;
}

function renderStyleSource() {
  styleSource.innerHTML = source[activeNum][styleType];
}


function changeMarkupType(type) {
  markupType = type;
  renderMarkupSource();
  sourceDialog.setAttribute('data-markup-type', type);
}

function changeStyleType(type) {
  styleType = type;
  renderStyleSource();
  sourceDialog.setAttribute('data-style-type', type);
}


function openSourceDialog(num) {
  activeNum = num;

  renderMarkupSource();
  renderStyleSource();

  sourceWrapper.style.display = 'block';
}


sourceWrapper.addEventListener('click', function() {
  sourceWrapper.style.display = 'none';
});

sourceDialog.addEventListener('click', function(event) {
  event.stopPropagation();
});
