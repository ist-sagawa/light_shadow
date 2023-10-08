export const qs = (selector, scope = document) => {
  return scope.querySelector(selector);
}

export const qsa = (selector, scope = document) => {
  return scope.querySelectorAll(selector);
}

export const addClass = (target, className) => {
  target.classList.add(className);
}

export const removeClass = (target, className) => {
  target.classList.remove(className);
}

export const toggleClass = (target, className) => {
  target.classList.toggle(className);
}

export const hasClass = (target, className) => {
  return target.classList.contains(className);
}

export const addEvent = (target, type, callback, capture = false) => {
  if (target.length) {
    target.forEach((el) => {
      el.addEventListener(type, callback, capture);
    });
    return;
  } else if (typeof target === 'string') {
    target = document.querySelectorAll(target);
    target.forEach((el) => {
      el.addEventListener(type, callback, capture);
    });
    return;
  } else if (typeof target === 'object') {
    target.addEventListener(type, callback, capture);
    return;
  } else {
    console.log('target is not found');
    return;
  }
}

export const removeEvent = (target, type, callback, capture = false) => {
  if (target.length) {
    target.forEach((el) => {
      el.removeEventListener(type, callback, capture);
    });
    return;
  } else if (typeof target === 'string') {
    target = document.querySelectorAll(target);
    target.forEach((el) => {
      el.removeEventListener(type, callback, capture);
    });
    return;
  } else if (typeof target === 'object') {
    target.removeEventListener(type, callback, capture);
    return;
  } else {
    console.log('target is not found');
    return;
  }
}
