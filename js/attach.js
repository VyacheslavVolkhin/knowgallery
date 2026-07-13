document.addEventListener('DOMContentLoaded', function() {
    const fileFields = document.querySelectorAll('.js-field-file');
    
    fileFields.forEach(function(fieldBlock) {
        const fileInput = fieldBlock.querySelector('.js-field-input');
        const attachButton = fieldBlock.querySelector('.js-field-file-photo-button-attach');
        const infoBlock = fieldBlock.querySelector('.field-file-info');
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        
        const fileListContainer = document.createElement('div');
        fileListContainer.className = 'field-file-list';
        infoBlock.parentNode.insertBefore(fileListContainer, infoBlock.nextSibling);
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'field-file-error';
        infoBlock.parentNode.insertBefore(errorContainer, infoBlock.nextSibling);
        
        attachButton.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            errorContainer.textContent = '';
            const files = e.target.files;
            
            if (files.length === 0) return;
            
            let hasError = false;
            const validFiles = [];
            
            Array.from(files).forEach(function(file) {
                if (file.size > MAX_FILE_SIZE) {
                    hasError = true;
                    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    errorContainer.textContent = `Ошибка: Файл "${file.name}" (${fileSizeMB} МБ) превышает максимальный размер 5 МБ`;
                } else {
                    validFiles.push(file);
                }
            });
            
            if (!hasError) {
                displaySelectedFiles(validFiles, fileListContainer, fileInput, errorContainer);
            } else {
                fileInput.value = '';
                fileListContainer.innerHTML = '';
            }
        });
        
        fieldBlock.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        fieldBlock.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        fieldBlock.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    });
    
    function displaySelectedFiles(files, container, fileInput, errorContainer) {
        container.innerHTML = '';
        
        files.forEach(function(file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-item-info';
            
            const fileIcon = document.createElement('span');
            fileIcon.className = 'file-item-icon';
            fileIcon.textContent = file.type.startsWith('image/') ? '🖼️' : '🎬';
            
            const fileDetails = document.createElement('div');
            fileDetails.className = 'file-item-details';
            
            const fileName = document.createElement('div');
            fileName.className = 'file-item-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-item-size';
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
            fileSize.textContent = `Размер: ${sizeInMB} МБ`;
            
            fileDetails.appendChild(fileName);
            fileDetails.appendChild(fileSize);
            
            fileInfo.appendChild(fileIcon);
            fileInfo.appendChild(fileDetails);
            
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'file-item-remove btn-action-ico ico-del';
            removeButton.innerHTML = '✕';
            
            removeButton.addEventListener('click', function() {
                fileItem.remove();
                
                if (container.children.length === 0) {
                    fileInput.value = '';
                    errorContainer.textContent = '';
                }
            });
            
            if (file.type.startsWith('image/')) {
                const preview = document.createElement('img');
                preview.className = 'file-item-preview';
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
                
                fileInfo.appendChild(preview);
            }
            
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeButton);
            container.appendChild(fileItem);
        });
    }
});