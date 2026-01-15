// Version 4: Trusted Types Compatible
// We avoid innerHTML entirely to work on Google Docs/Sheets

(function() {
    const ID = 'qa-helper-v4-trusted';
    if (document.getElementById(ID)) return;

    // 1. Create Host
    const host = document.createElement('div');
    host.id = ID;
    Object.assign(host.style, {
        all: 'initial',
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0
    });
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // 2. Add Styles (textContent is usually safe)
    const style = document.createElement('style');
    style.textContent = `
        :host { all: initial; z-index: 2147483647; }
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .modal {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            color: #333;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
            border-radius: 12px;
            border: 1px solid #ccc;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-size: 14px;
            line-height: 1.5;
        }
        .header {
            background: #f1f3f4;
            padding: 12px 16px;
            cursor: move;
            border-bottom: 1px solid #dadce0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            font-weight: 600;
            color: #202124;
        }
        .body { padding: 16px; color: #3c4043; }
        .footer {
            padding: 12px 16px;
            border-top: 1px solid #eee;
            text-align: right;
            background: #fff;
        }
        button {
            background: #fff;
            border: 1px solid #dadce0;
            color: #3c4043;
            padding: 6px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 8px;
            font-weight: 500;
        }
        button:hover { background: #f8f9fa; border-color: #dadce0; }
        button.primary { background: #1a73e8; color: #fff; border: none; }
        button.primary:hover { background: #1557b0; }
        .close-btn {
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            padding: 4px;
            border-radius: 50%;
            color: #5f6368;
        }
        .close-btn:hover { background: rgba(0,0,0,0.1); color: #202124; }
    `;
    shadow.appendChild(style);

    // 3. Build UI using createElement (Safe for Google Docs)
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Header
    const header = document.createElement('div');
    header.className = 'header';
    const title = document.createElement('span');
    title.textContent = 'QA Helper v4';
    const closeIcon = document.createElement('span');
    closeIcon.className = 'close-btn';
    closeIcon.textContent = '×';
    header.appendChild(title);
    header.appendChild(closeIcon);

    // Body
    const body = document.createElement('div');
    body.className = 'body';
    const p1 = document.createElement('p');
    p1.textContent = 'I work in Google Docs!';
    p1.style.marginTop = '0';
    const p2 = document.createElement('p');
    p2.textContent = 'I am Trusted Types safe.';
    p2.style.marginBottom = '0';
    body.appendChild(p1);
    body.appendChild(p2);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'footer';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary';
    saveBtn.textContent = 'Save';
    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

    // Assemble
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    shadow.appendChild(modal);

    // 4. Logic
    const remove = () => host.remove();
    closeIcon.onclick = remove;
    cancelBtn.onclick = remove;
    saveBtn.onclick = () => alert('Action saved!');

    // 5. Drag Logic
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.addEventListener('mousedown', e => {
        isDragging = true;
        const rect = modal.getBoundingClientRect();
        
        // Lock to current position to prepare for drag
        modal.style.bottom = 'auto';
        modal.style.right = 'auto';
        modal.style.left = rect.left + 'px';
        modal.style.top = rect.top + 'px';

        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        modal.style.left = (initialLeft + dx) + 'px';
        modal.style.top = (initialTop + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

})();
