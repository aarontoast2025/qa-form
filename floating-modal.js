// This is the code that will run when you click the bookmarklet

(function() {
    // 1. Check if the modal already exists to prevent opening it twice
    if (document.getElementById('my-floating-modal')) {
        alert('Modal is already open!');
        return;
    }

    // 2. Create the modal container
    const modal = document.createElement('div');
    modal.id = 'my-floating-modal';
    
    // 3. Style the modal to be floating and "non-blocking"
    // We use inline styles here so everything is self-contained
    modal.style.position = 'fixed';
    modal.style.bottom = '20px';
    modal.style.right = '20px';
    modal.style.width = '300px';
    modal.style.padding = '20px';
    modal.style.backgroundColor = 'white';
    modal.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    modal.style.borderRadius = '8px';
    modal.style.zIndex = '10000'; // Ensure it is on top
    modal.style.fontFamily = 'Arial, sans-serif';
    modal.style.border = '1px solid #ccc';
    modal.style.color = '#333333'; // Force dark text color
    modal.style.textAlign = 'left'; // Force left align
    
    // 4. Add content
    const title = document.createElement('h3');
    title.innerText = 'Hello World';
    title.style.marginTop = '0';
    modal.appendChild(title);

    const text = document.createElement('p');
    text.innerText = 'This is your floating modal. You can still interact with the page behind me!';
    modal.appendChild(text);

    // 5. Add a close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.marginTop = '10px';
    closeBtn.style.padding = '5px 10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function() {
        modal.remove();
    };
    modal.appendChild(closeBtn);

    // 6. Add to the page
    document.body.appendChild(modal);
})();
