function applyDynamicStyling(uniqueId, parentClass, targetCharIndex, bgImageUrl, bgImageSize, rotationAngle, offsetX, offsetY, opacity) {
    const parentDiv = document.querySelector('.' + parentClass);
    if (!parentDiv) return;
    parentDiv.style.position = 'relative';
    parentDiv.style.zIndex = 2;
  
    const findDeepestNode = (node, index) => {
      if (!node.hasChildNodes()) return { node, index };
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          if (index < child.length) return { node: child, index };
          index -= child.length;
        } else {
          const result = findDeepestNode(child, index);
          if (result) return result;
          index -= child.textContent.length;
        }
      }
    };
  
    const { node: targetNode, index: adjustedIndex } = findDeepestNode(parentDiv, targetCharIndex);
    const targetChar = targetNode.textContent.charAt(adjustedIndex);
  
    const span = document.createElement('span');
    span.id = uniqueId;
    span.innerHTML = targetChar;
  
    const beforeChar = targetNode.textContent.slice(0, adjustedIndex);
    const afterChar = targetNode.textContent.slice(adjustedIndex + 1);
  
    targetNode.textContent = beforeChar;
    targetNode.parentNode.insertBefore(span, targetNode.nextSibling);
    span.parentNode.insertBefore(document.createTextNode(afterChar), span.nextSibling);
  
    const bgDiv = document.createElement('div');
    bgDiv.style.cssText = 'position: absolute; opacity: ' + opacity + '; top: 0; left: 0; height: ' + bgImageSize + 'px; transform: rotate('+ rotationAngle +'deg); width: ' + bgImageSize + 'px; background-image: url(\'' + bgImageUrl + '\'); background-size: contain; background-position: center; background-repeat: no-repeat; z-index: 1;';
    bgDiv.id = uniqueId + '-bg';
  
    parentDiv.insertAdjacentElement('afterend', bgDiv);
  
    const updateBgPosition = () => {
      const spanRect = span.getBoundingClientRect();
      const parentRect = parentDiv.getBoundingClientRect();
      bgDiv.style.left = (spanRect.left - parentRect.left + offsetX - (bgImageSize / 2)) + 'px';
      bgDiv.style.top = (spanRect.top - parentRect.top + offsetY - (bgImageSize / 2)) + 'px';
    };
  
    window.addEventListener('load', updateBgPosition);
    window.addEventListener('resize', updateBgPosition);
    updateBgPosition();
  }
