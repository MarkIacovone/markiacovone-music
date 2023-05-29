let pointerFrom = 0;
let elementFrom = 0;

const scrollable = document.querySelector('.track-list');

scrollable.addEventListener('wheel', event => {
  const toLeft  = event.deltaY < 0 && scrollable.scrollLeft > 0
  const toRight = event.deltaY > 0 && scrollable.scrollLeft < scrollable.scrollWidth - scrollable.clientWidth

  if (toLeft || toRight) {
    event.preventDefault()
    scrollable.scrollBy({left: event.deltaY})
  }
})

// let scrollingHorizontally = true;

// scrollable.addEventListener("wheel", (event) => {
//   if (scrollingHorizontally) {
//     scrollable.scrollBy({
//       left: event.deltaY < 0 ? -70 : 70,
//       behavior: 'smooth'
//     });
//     event.preventDefault();
//     event.stopPropagation();

//     // check if the user has reached the end of the slider
//     if (scrollable.scrollLeft <= scrollable.scrollWidth 
//       || scrollable.scrollRight >= scrollable.scrollWidth
//       - scrollable.clientWidth) {
//       scrollingHorizontally = false;
//       scrollable.style.overflowY = "auto";
//     }
//   } else {
//     // (scroll the page up/down)
//     return true;
//   }
// });

const onDrag = (event) => {
  // Ensure we only do this for pointers that don't have native
  // drag-scrolling behavior and when the pointer is down.
  if (event.pointerType == 'mouse') {
    scrollable.scrollLeft = elementFrom - event.clientX + pointerFrom;
  }
};

scrollable.addEventListener('pointerdown', (event) => {
  // Ensure we only do this for pointers that don't have native
  // drag-scrolling behavior.
  if (event.pointerType == 'mouse') {
    pointerDown = true;
    // Set the position where the mouse is starting to drag from.
    pointerFrom = event.clientX;
    // Set the position of the element is scrolled from.
    elementFrom = scrollable.scrollLeft;
    // React on pointer move.
    document.addEventListener('pointermove', onDrag);
  } 
});

// Stop reacting on pointer move when pointer is no longer clicked.
document.addEventListener('pointerup', (event) => {
  // Ensure we only do this for pointers that don't have native
  // drag-scrolling behavior.
  if (event.pointerType == 'mouse') {
    document.removeEventListener('pointermove', onDrag);
  }
});
    