/**
 * applyDynamicStyling Function
 * 
 * This JavaScript function dynamically adds a background image behind a specified character within a text block.
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

function applyDynamicStyling(uniqueId, parentClass, targetCharIndex, bgImageUrl, bgImageSize, offsetX, offsetY, opacity) {
  // Select the first div element with the specified class name.
  // This div is the parent container of the text where the target character is located.
  const parentDiv = document.querySelector(`.${parentClass}`);
  // If no element is found with the specified class, exit the function early.
  // This check prevents errors if the specified class doesn't exist in the document.
  if (!parentDiv) return;

  // Set the CSS position of the parent div to 'relative'. This is necessary because
  // the background image div will be positioned absolutely relative to this parent div.
  // Also, set the z-index to 2 to ensure it appears above the background image.
  parentDiv.style.position = 'relative';
  parentDiv.style.zIndex = 2;

  // Define a recursive function to locate the deepest text node containing the target character.
  // This is important to avoid breaking the structure of any nested HTML elements like <span> or <em>.
  const findDeepestNode = (node, index) => {
      // Check if the node has child nodes. If not, it's the deepest node that can contain the text.
      if (!node.hasChildNodes()) return { node, index };
      // Iterate over child nodes to find the one containing the target character.
      for (const child of node.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
              // If it's a text node, check if the target character is within this node.
              if (index < child.length) return { node: child, index };
              // Reduce the index by the length of the text node as we move through the text.
              index -= child.length;
          } else {
              // If it's not a text node (like an element node), recursively call the function.
              const result = findDeepestNode(child, index);
              if (result) return result;
              // Reduce the index by the length of the text content of the node.
              index -= child.textContent.length;
          }
      }
  };

  // Use the findDeepestNode function to get the deepest node containing the target character
  // and the adjusted index of the character within that node.
  const { node: targetNode, index: adjustedIndex } = findDeepestNode(parentDiv, targetCharIndex);
  // Extract the specific target character from the text node.
  const targetChar = targetNode.textContent.charAt(adjustedIndex);
  
  // Create a new span element. This span will be used to wrap the target character.
  const span = document.createElement('span');
  // Assign a unique ID to the span for potential future reference and styling.
  span.id = uniqueId;
  // Set the inner HTML of the span to the target character, effectively wrapping it.
  span.innerHTML = targetChar;
  // Extract the text before and after the target character in the node.
  const beforeChar = targetNode.textContent.slice(0, adjustedIndex);
  const afterChar = targetNode.textContent.slice(adjustedIndex + 1);
  // Update the text of the target node to only include the text before the target character.
  // This is necessary to correctly insert the span at the right location.
  targetNode.textContent = beforeChar;
  // Insert the span right after the modified text node.
  targetNode.parentNode.insertBefore(span, targetNode.nextSibling);
  // Also insert the text after the target character right after the new span.
  span.parentNode.insertBefore(document.createTextNode(afterChar), span.nextSibling);

  // Create a new div element for the background image.
  const bgDiv = document.createElement('div');
  // Set various CSS properties for the div. It includes positioning, size, background image,
  // and other background properties. Opacity is set as per the function parameter.
  bgDiv.style.cssText = `position: absolute; opacity: ${opacity}; top: 0; left: 0; height: ${bgImageSize}px; width: ${bgImageSize}px; background-image: url('${bgImageUrl}'); background-size: contain; background-position: center; background-repeat: no-repeat; z-index: 1;`;
  // Assign a unique ID to the background div.
  bgDiv.id = `${uniqueId}-bg`;

  // Insert the new div right after the parent div in the document.
  // This is crucial for maintaining the correct layout and functionality.
  parentDiv.insertAdjacentElement('afterend', bgDiv);

  // Define a function to update the position of the background image.
  // This function will be called on window load and resize events.
  const updateBgPosition = () => {
      // Get the bounding rectangle of the span. This provides the position and size of the span.
      const spanRect = span.getBoundingClientRect();
      // Get the bounding rectangle of the parent div to use as a reference point.
      const parentRect = parentDiv.getBoundingClientRect();
      // Calculate and set the left and top properties of the background div.
      // This positions the background image so that its center aligns with the target character.
      bgDiv.style.left = `${spanRect.left - parentRect.left + offsetX - (bgImageSize / 2)}px`;
      bgDiv.style.top = `${spanRect.top - parentRect.top + offsetY - (bgImageSize / 2)}px`;
  };

  // Add event listeners to the window to call updateBgPosition on load and resize events.
  // This ensures that the background image remains correctly positioned even if the window size changes.
  window.addEventListener('load', updateBgPosition);
  window.addEventListener('resize', updateBgPosition);

  // Make an initial call to updateBgPosition to set the correct position from the start.
  updateBgPosition();
}
