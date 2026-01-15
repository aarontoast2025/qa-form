// This code uses Shadow DOM to protect styles and adds drag-and-drop capability

(function() {
    // 1. Check if it exists
    const ID = 'qa-form-floating-host';
    if (document.getElementById(ID)) {
        alert('Modal is already open!');
        return;
    }

    // 2. Create the Host Element (The shell)
    const host = document.createElement('div');
    host.id = ID;
    // We attach it to body, but the content lives in the "Shadow"
    document.body.appendChild(host);

    // 3. Create Shadow DOM (The protective bubble)
    const shadow = host.attachShadow({ mode: 'open' });

    // 4. Define Styles (Inside the bubble, these only affect our modal)
    const style = document.createElement('style');
    style.textContent = `
        /* Reset all inheritance */
        :host {
            all: initial; 
            z-index: 2147483647; /* Max z-index */
        }
        
        .modal-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            background-color: #ffffff;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            border-radius: 12px;
            border: 1px solid #e0e0e0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #333333;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Draggable Header */
        .modal-header {
            background-color: #f8f9fa;
            padding: 12px 16px;
            border-bottom: 1px solid #eee;
            cursor: move; /* Shows drag cursor */
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }

        .modal-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #202124;
        }

        .modal-body {
            padding: 16px;
            font-size: 14px;
            line-height: 1.5;
            color: #4a4a4a;
        }

        .modal-footer {
            padding: 12px 16px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            border-top: 1px solid #eee;
        }

        /* Custom Button Styles - won't be affected by the page */
        button {
            appearance: none;
            background: #fff;
            border: 1px solid #dadce0;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            color: #3c4043;
            cursor: pointer;
            transition: background 0.1s;
        }

        button:hover {
            background-color: #f1f3f4;
            border-color: #dadce0;
        }

        button.primary {
            background-color: #1a73e8;
            color: white;
            border: none;
        }

        button.primary:hover {
            background-color: #1557b0;
        }

        /* Close X button in header */
        .close-icon {
            cursor: pointer;
            color: #5f6368;
            font-size: 20px;
            line-height: 1;
            padding: 4px;
            border-radius: 50%;
        }
        .close-icon:hover {
            background-color: rgba(0,0,0,0.05);
            color: #202124;
        }
    `;
    shadow.appendChild(style);

    // 5. Build the UI
    const container = document.createElement('div');
    container.className = 'modal-container';
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <h3 class="modal-title">QA Helper</h3>
        <span class="close-icon">&times;</span>
    `;
    container.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = `
        <p style="margin-top:0">Drag me by the header!</p>
        <p style="margin-bottom:0">I am completely isolated from the page styles.</p>
    `;
    container.appendChild(body);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancel';
    cancelBtn.onclick = removeModal;
    
    const okBtn = document.createElement('button');
    okBtn.className = 'primary';
    okBtn.innerText = 'Action';
    okBtn.onclick = () => alert('Clicked Action!');

    footer.appendChild(cancelBtn);
    footer.appendChild(okBtn);
    container.appendChild(footer);

    shadow.appendChild(container);

    // 6. Logic functions

    function removeModal() {
        host.remove();
    }

    // Bind the close icon
    header.querySelector('.close-icon').onclick = removeModal;

    // 7. Drag Logic
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener('mousedown', dragStart);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target.closest('.close-icon')) return; // Don't drag if clicking close

        isDragging = true;
        
        // Listen to document for move so we don't lose it if mouse moves fast
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, container);
        }
    }

    function setTranslate(xPos, yPos, el) {
        // We use transform for performance
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        // Since we are overriding the slideIn animation transform, we might need to handle that,
        // but for now, simple translation works after animation.
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
    }

})();