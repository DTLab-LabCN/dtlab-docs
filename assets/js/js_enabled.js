'use strict'

// This script is used to add stylesheet only when JS is enabled
// the script doesn't need to check for that, since if it gets executed then JS is indeed enabled otherwise it isn't
{
  const stylesheet = document.createElement('style')
  stylesheet.innerText = `
    #content-wrapper .heading-anchor {
      color: #606060;
    }
    ul:not(:first-child):not(.active) {
      visibility: hidden;
    }
    li > ul:not(.active) {
      display: none;
    }
  `
  document.head.appendChild(stylesheet)
}
