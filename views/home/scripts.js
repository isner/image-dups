  // Text input field
var targetDir = document.getElementById('targetDir');

if (targetDir) {
    // Grows on focus
  targetDir.addEventListener('focus', function () {
    targetDir.classList.remove('small');
    targetDir.classList.add('large');
  });
    // Shrinks on blur
  targetDir.addEventListener('blur', function () {
    targetDir.classList.remove('large');
    targetDir.classList.add('small');
  });
}