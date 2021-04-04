'use strict'

const sidebar = document.getElementById('sidebar')
const content = document.getElementById('content-wrapper')
const nav = document.getElementById('nav')

// The navbar contents are always shown by default,
// when we can execute JS, make sure to hide them off. Otherwise it will always be shown.
{
  const stylesheet = document.createElement('style')
  stylesheet.innerText = 'ul:not(:first-child):not(.active) { visibility: hidden; } li > ul:not(.active) { display: none; }'
  document.head.appendChild(stylesheet)
}

// Get the actual elements the anchors refers to
const elements = []
const anchors = Array.from(nav.getElementsByTagName('a'))
for (const e of anchors) {
  elements.push(document.getElementById(e.hash.slice(1)))
}
elements.reverse()

function iterParents (elm, cb) {
  while (elm) {
    if (cb.call(cb, elm) === false) break
    elm = elm.parentElement
  }
}

function resetContent () {
  contentScroll = 0
  content.style.position = ''
  content.style.bottom = ''
}

// Scroll-spy
let contentScroll = 0
let ignoreScroll = false
let selected, lastAnchor

const scrollSpy = (() => {

  return () => {
    const current = elements.find((elm) => window.scrollY + (contentScroll > 0 ? contentScroll - 300 : 0) >= elm.offsetTop - 75)

    if (current === selected) return
    if (!current) {
      iterParents(lastAnchor, (elm) => { elm.nodeName === 'UL' && elm.classList.remove('active') })
      lastAnchor?.parentElement.classList.remove('selected')
      selected = undefined
      history?.replaceState(null, null, document.location.pathname)
      return
    }
    selected = current

    const anchor = anchors.find((elm) => elm.hash === '#' + current.id)
    if (!anchor) return

    // Scroll the sidebar if necessary
    if (sidebar.scrollTop + sidebar.offsetHeight <= anchor.offsetTop + anchor.offsetHeight) {
      sidebar.scrollTo(0, anchor.offsetTop - sidebar.offsetHeight / 1.2)
    } else if (sidebar.scrollTop > anchor.offsetTop) {
      sidebar.scrollTo(0, anchor.offsetTop - anchor.offsetHeight * 1.2)
    }

    // Sync the URL href with the selected anchor
    history?.replaceState(null, null, document.location.pathname + '#' + current.id);

    // Deactivate previous anchors
    iterParents(lastAnchor, (elm) => {
      if (elm === anchor.parentElement.parentElement) return false
      if (elm.nodeName === 'UL') elm.classList.remove('active')
    })
    lastAnchor?.parentElement.classList.remove('selected')

    // Activate new anchor
    iterParents(anchor, (elm) => {
      if (elm.classList.contains('active')) return false
      if (elm.nodeName === 'UL') elm.classList.add('active')
    })
    anchor.parentElement.classList.add('selected')

    lastAnchor = anchor
  }
})()

// Sidebar sticky positioning
// The difference between this and the CSS implementation is that CSS's static <=> fixed
// when this is absolute <=> fixed. This helps with keeping the main content wrapper position good.
// Shouldn't be that bad on performance... I think.
const positionSpy = (() => {
  const originalTop = sidebar.offsetTop
  const originalMargin = getComputedStyle(sidebar).marginTop

  return () => {
    if (window.scrollY < originalTop) {
      sidebar.style.position = 'absolute'
      sidebar.style.top = 'initial'
    } else {
      sidebar.style.position = 'fixed'
      sidebar.style.top = '-' + originalMargin
    }
  }
})()

function fakeScroll (e) {
  if (e.deltaY > 0 && window.scrollY + window.innerHeight >= document.body.offsetHeight && contentScroll < window.innerHeight - 280) {
    content.style.position = 'relative'
    contentScroll += 30
  } else if (contentScroll > 0 && e.deltaY <= 0) {
    contentScroll -= 30
    if (contentScroll <= 0) content.style.position = 'initial'
  } else {
    return
  }
  
  e.preventDefault()
  content.style.bottom = contentScroll + 'px'
  scrollSpy()
}

function jumpAnchor () {
  const elm = elements.find(elm => elm.id === window.location.hash?.slice(1))
  if (!elm) return

  // Do we need to do a fake scroll or not?
  if (document.body.offsetHeight - elm.offsetTop >= window.innerHeight) return

  content.style.position = 'relative'
  contentScroll = (Math.round(elm.getBoundingClientRect().top / 30) - 2) * 30 + contentScroll
  content.style.bottom = contentScroll + 'px'

  scrollSpy()
}

// Initial positioning
positionSpy()
scrollSpy()
jumpAnchor()

// TODO: Unassign the listeners if the navigator is hidden (e.g on phone screens)

let lastHash, originalScroll
this.addEventListener('click', (e) => {
  if (e.target.nodeName !== "A") return

  originalScroll = contentScroll
  ignoreScroll = contentScroll === 0 ? true : false

  if (lastHash !== e.target.href || originalScroll !== contentScroll) resetContent()
  lastHash = e.target.href
})

this.addEventListener('hashchange', jumpAnchor)

this.addEventListener('wheel', fakeScroll, { passive: false })

this.addEventListener('scroll', () => {
  window.requestAnimationFrame(() => {
    // If the user manages to bypass the `wheel` event, make sure to reset the fake scrolled content
    // So it doesn't affect the actual scroll positioning.
    if (contentScroll > 0 && !ignoreScroll) resetContent()
    ignoreScroll = false

    positionSpy()
    scrollSpy()
  })
})
