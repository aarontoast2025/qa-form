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
            width: 320px;
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
        .body { padding: 16px; color: #3c4043; max-height: 400px; overflow-y: auto; }
        .footer {
            padding: 12px 16px;
            border-top: 1px solid #eee;
            text-align: right;
            background: #fff;
        }
        .expandable {
            border: 1px solid #dadce0;
            border-radius: 8px;
            margin-bottom: 12px;
            overflow: hidden;
        }
        .expandable-header {
            background: #f8f9fa;
            padding: 10px 12px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #dadce0;
        }
        .expandable-content {
            padding: 12px;
        }
        .btn-group {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }
        .btn-group button {
            flex: 1;
        }
        button {
            background: #fff;
            border: 1px solid #dadce0;
            color: #3c4043;
            padding: 6px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin-left: 8px;
        }
        .btn-group button {
            margin-left: 0;
        }
        button:hover { background: #f8f9fa; border-color: #dadce0; }
        button.primary { background: #1a73e8; color: #fff; border: none; }
        button.primary:hover { background: #1557b0; }
        button.active-yes { background: #e6f4ea; color: #137333; border-color: #ceead6; }
        button.active-no { background: #fce8e6; color: #c5221f; border-color: #fad2cf; }
        
        textarea {
            width: 100%;
            border: 1px solid #dadce0;
            border-radius: 4px;
            padding: 8px;
            font-size: 13px;
            resize: vertical;
            min-height: 44px;
            outline: none;
        }
        textarea:focus { border-color: #1a73e8; }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
        }
        .header-checkbox {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

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
    title.textContent = 'QA Form';
    const closeIcon = document.createElement('span');
    closeIcon.className = 'close-btn';
    closeIcon.textContent = '×';
    header.appendChild(title);
    header.appendChild(closeIcon);

    // Body
    const body = document.createElement('div');
    body.className = 'body';

    // --- DATA CONFIGURATION ---
    const QUESTIONS = [
        { id: 1, label: '1. Greeting (Branding + Name)' },
        { id: 2, label: '2. Confirm Customer Name' },
        { id: 3, label: '3. Confirm Business Name' },
        { id: 4, label: '4. Confirm Callback Number' },
        { id: 5, label: '5. Appropriate Closing' }
    ];

    // --- GENERIC SYNC LOGIC ---
    const syncItem = (id, type, value) => {
        const pageItem = document.querySelector(`.qa-question[data-idx="${id}"]`);
        if (!pageItem) return;

        if (type === 'status') {
            const pageButtons = pageItem.querySelectorAll('button[role="radio"]');
            pageButtons.forEach(btn => {
                if (btn.textContent.trim() === value) {
                    btn.click();
                }
            });
        } else if (type === 'text') {
            const pageTextarea = pageItem.querySelector('textarea');
            if (pageTextarea) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(pageTextarea, value);
                } else {
                    pageTextarea.value = value;
                }
                pageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                pageTextarea.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };

    // --- BUILD LOOP ---
    QUESTIONS.forEach(q => {
        const expandable = document.createElement('div');
        expandable.className = 'expandable';

        const expHeader = document.createElement('div');
        expHeader.className = 'expandable-header';
        
        const expTitle = document.createElement('span');
        expTitle.textContent = q.label;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'header-checkbox';
        checkbox.onclick = (e) => e.stopPropagation();

        expHeader.appendChild(expTitle);
        expHeader.appendChild(checkbox);
        
        const expContent = document.createElement('div');
        expContent.className = 'expandable-content';
        expContent.style.display = 'none';

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        
        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'Yes';
        yesBtn.className = 'active-yes';

        const noBtn = document.createElement('button');
        noBtn.textContent = 'No';
        
        btnGroup.appendChild(yesBtn);
        btnGroup.appendChild(noBtn);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Add context here...';

        expContent.appendChild(btnGroup);
        expContent.appendChild(textarea);
        expandable.appendChild(expHeader);
        expandable.appendChild(expContent);
        body.appendChild(expandable);

        // Events
        yesBtn.onclick = () => {
            yesBtn.className = 'active-yes';
            noBtn.className = '';
            syncItem(q.id, 'status', 'Yes');
        };
        noBtn.onclick = () => {
            noBtn.className = 'active-no';
            yesBtn.className = '';
            syncItem(q.id, 'status', 'No');
        };
        textarea.oninput = () => {
            syncItem(q.id, 'text', textarea.value);
        };
        expHeader.onclick = () => {
            const isHidden = expContent.style.display === 'none';
            expContent.style.display = isHidden ? 'block' : 'none';
        };

        // Initial Sync
        setTimeout(() => syncItem(q.id, 'status', 'Yes'), 0);
    });

    // Footer
    const footer = document.createElement('div');
    footer.className = 'footer';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    const generateBtn = document.createElement('button');
    generateBtn.className = 'primary';
    generateBtn.textContent = 'Generate';
    
    // Generate Button re-syncs all (safety net)
    generateBtn.onclick = () => {
        QUESTIONS.forEach(q => {
             // In a real scenario we'd track state, but for now we rely on the realtime interactions
             // This button can just remain as a placeholder or final "Commit" indicator
        });
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(generateBtn);

    // Assemble
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    shadow.appendChild(modal);

    // 4. Logic
    const remove = () => host.remove();
    closeIcon.onclick = remove;
    cancelBtn.onclick = remove;

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
