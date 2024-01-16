// V2



/**
 * applyDynamicStyle Function
 * 
 * Dynamically adds a background image behind a specified character within a text block.
 * It identifies the target character in a div with a given class, wraps it in a span, and places a styled div
 * with the background image right after the parent div. This function also ensures that the background image
 * is positioned such that its center aligns with the target character, considering any specified offsets and opacity.
 * 
 * Parameters:
 * uniqueId (String) - A unique identifier for the span and background image div.
 * parentClass (String) - The class name of the parent div containing the target text.
 * targetCharIndex (Integer) - The zero-based index of the target character in the text block.
 * bgImageUrl (String) - The URL of the background image.
 * bgImageSize (Integer) - The size of the square background image in pixels.
 * offsetX (Integer) - The horizontal offset for the background image positioning in pixels.
 * offsetY (Integer) - The vertical offset for the background image positioning in pixels.
 * opacity (Float) - The opacity of the background image (between 0 and 1).
 */
function applyDynamicStyle(uniqueId, parentClass, targetCharIndex, bgImageUrl, bgImageSize, offsetX, offsetY, opacity) {
    // Select the first div element with the specified class name.
    const parentDiv = document.querySelector(`.${parentClass}`);
    
    // If no element is found with the specified class, exit the function early.
    if (!parentDiv) return;
  
    // Set the CSS position of the parent div to 'relative'.
    parentDiv.style.position = 'relative';
    // Set the z-index of the parent div to 2.
    parentDiv.style.zIndex = 2;
  
    // Recursive function to locate the deepest text node containing the target character.
    const findDeepestNode = (node, index) => {
      // If the node has no child nodes, it's the deepest node.
      if (!node.hasChildNodes()) return { node, index };
  
      // Initialize cumulative length to count characters.
      let cumulativeLength = 0;
      // Iterate over child nodes.
      for (const child of node.childNodes) {
        // Calculate length of the child node.
        const childLength = child.nodeType === Node.TEXT_NODE ? child.length : child.textContent.length;
  
        // Check if the target character is within this child node.
        if (cumulativeLength + childLength > index) {
          // If it's a text node, return this node and the adjusted index.
          if (child.nodeType === Node.TEXT_NODE) {
            return { node: child, index: index - cumulativeLength };
          } else {
            // If it's an element node, recurse into it.
            return findDeepestNode(child, index - cumulativeLength);
          }
        }
  
        // Add this child's length to the cumulative length.
        cumulativeLength += childLength;
      }
    };
  
    // Use the findDeepestNode function to locate the target character.
    const { node: targetNode, index: adjustedIndex } = findDeepestNode(parentDiv, targetCharIndex);
    // Extract the specific target character.
    const targetChar = targetNode.textContent.charAt(adjustedIndex);
  
    // Create a new span element.
    const span = document.createElement('span');
    // Set the ID of the span.
    span.id = uniqueId;
    // Set the inner HTML of the span to the target character.
    span.innerHTML = targetChar;
  
    // Extract text before the target character.
    const beforeChar = targetNode.textContent.slice(0, adjustedIndex);
    // Extract text after the target character.
    const afterChar = targetNode.textContent.slice(adjustedIndex + 1);
    // Set the target node text to the text before the target character.
    targetNode.textContent = beforeChar;
  
    // Insert the span after the target node.
    targetNode.parentNode.insertBefore(span, targetNode.nextSibling);
    // Insert the text after the target character after the span.
    span.parentNode.insertBefore(document.createTextNode(afterChar), span.nextSibling);
  
    // Create a new div for the background image.
    const bgDiv = document.createElement('div');
    // Set CSS for the background div.
    bgDiv.style.cssText = `position: absolute; opacity: ${opacity}; top: 0; left: 0; height: ${bgImageSize}px; width: ${bgImageSize}px; background-image: url('${bgImageUrl}'); background-size: contain; background-position: center; background-repeat: no-repeat; z-index: 1;`;
    // Set the ID of the background div.
    bgDiv.id = `${uniqueId}-bg`;
  
    // Insert the background div after the parent div.
    parentDiv.insertAdjacentElement('afterend', bgDiv);
  
    // Function to update the position of the background image.
    const updateBgPosition = () => {
      // Get the bounding rectangle of the span.
      const spanRect = span.getBoundingClientRect();
      // Get the bounding rectangle of the parent div.
      const parentRect = parentDiv.getBoundingClientRect();
      // Calculate and set the position of the background div.
      bgDiv.style.left = `${spanRect.left - parentRect.left + offsetX - (bgImageSize / 2)}px`;
      bgDiv.style.top = `${spanRect.top - parentRect.top + offsetY - (bgImageSize / 2)}px`;
    };
  
    // Add event listeners for window load and resize.
    window.addEventListener('load', updateBgPosition);
    window.addEventListener('resize', updateBgPosition);
  
    // Initial call to position the background image.
    updateBgPosition();
  }
