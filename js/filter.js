// Инициализация всех обработчиков фильтра
document.addEventListener('DOMContentLoaded', function() {
    initFilterRemoveButtons();
    initFilterCheckboxes();
    initCategorySearch();
    resetAllFilters();
    syncSelectedFilters();
	initPriceRangeDisplay();

	// filter actions
	const filterButtonOpen = document.querySelector('.js-filter-open');
	const filterButtonClose = document.querySelector('.js-filter-close');
	if (filterButtonOpen) {
		filterButtonOpen.addEventListener("click", function(event) {
				document.body.classList.add("filter-show");
				event.preventDefault();
		})
	}
	if (filterButtonClose) {
		filterButtonClose.addEventListener("click", function(event) {
				document.body.classList.remove("filter-show");
				event.preventDefault();
		})
	}
});

//range PRICE slider
const sliderRangePrice = document.getElementById('range-price-slider');
const minInputPrice = document.getElementById('range-price-slider-min');
const maxInputPrice = document.getElementById('range-price-slider-max');

const minRangePrice = 0;
const maxRangePrice = 2000;

if (sliderRangePrice) {
    noUiSlider.create(sliderRangePrice, {
        start: [50, 1200],
        connect: true,
        step: 50,
        range: {
            'min': [minRangePrice],
            'max': [maxRangePrice]
        },
        tooltips: true,
        format: {
            to: function (value) {
                return Math.round(value).toString();
            },
            from: function (value) {
                return Number(value);
            }
        },
    });
    
    sliderRangePrice.noUiSlider.on('update', (values, handle) => {
        const value = values[handle];
        
        if (handle === 0) {
            minInputPrice.value = Math.round(value);
        } else {
            maxInputPrice.value = Math.round(value);
        }
        
        // Обновляем отображение цены в selected
        updatePriceSelected(values);
    });
    
    minInputPrice.addEventListener('change', () => {
        sliderRangePrice.noUiSlider.set([minInputPrice.value, null]);
    });
    maxInputPrice.addEventListener('change', () => {
        sliderRangePrice.noUiSlider.set([null, maxInputPrice.value]);
    });
    
    // Функция для вывода цены в блок selected
    function updatePriceSelected(values) {
        const selectedWrap = document.querySelector('.filter-selected-wrap');
        if (!selectedWrap) return;
        
        const min = Math.round(values[0]);
        const max = Math.round(values[1]);
        const priceTitle = `от ${min} до ${max} р`;
        
        // Ищем или создаем элемент цены
        let priceEl = selectedWrap.querySelector('.elm-panel-selected[data-filter-type="price"]');
        
        if (priceEl) {
            priceEl.querySelector('.panel-title').textContent = priceTitle;
        } else {
            priceEl = document.createElement('div');
            priceEl.className = 'elm-panel-selected';
            priceEl.setAttribute('data-filter-type', 'price');
            priceEl.innerHTML = `
                <div class="panel-title">${priceTitle}</div>
                <a href="" class="panel-button btn-action-ico ico-del"></a>
            `;
            selectedWrap.appendChild(priceEl);
        }
    }
    
    // Обработчик удаления цены
    const selectedWrap = document.querySelector('.filter-selected-wrap');
    if (selectedWrap) {
        selectedWrap.addEventListener('click', function(e) {
            const removeBtn = e.target.closest('.ico-del');
            if (!removeBtn) return;
            
            const filterItem = removeBtn.closest('.elm-panel-selected');
            if (filterItem && filterItem.getAttribute('data-filter-type') === 'price') {
                e.preventDefault();
                sliderRangePrice.noUiSlider.set([minRangePrice, maxRangePrice]);
            }
        });
    }
    
    // Инициализация при загрузке
    updatePriceSelected(sliderRangePrice.noUiSlider.get());
}





// Удаление фильтра по клику на крестик
function initFilterRemoveButtons() {
    const selectedWrap = document.querySelector('.js-filter-selected');
    if (!selectedWrap) return;
    
    selectedWrap.addEventListener('click', function(e) {
        const removeBtn = e.target.closest('.js-filter-selected-del');
        if (!removeBtn) return;
        
        e.preventDefault();
        
        const filterItem = removeBtn.closest('.elm-panel-selected');
        const filterTitle = filterItem.querySelector('.panel-title').textContent.trim();
        
        // Снимаем галочку с соответствующего чекбокса
        document.querySelectorAll('.frm-select').forEach(wrapper => {
            const label = wrapper.querySelector('label');
            const checkbox = wrapper.querySelector('input[type="checkbox"]');
            
            if (label && checkbox && label.textContent.trim() === filterTitle) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        filterItem.remove();
    });
}

// Обработка изменения чекбоксов
function initFilterCheckboxes() {
    document.querySelectorAll('.filter-section-wrap input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.frm-select').querySelector('label');
            if (!label) return;
            
            const title = label.textContent.trim();
            
            if (this.checked) {
                addSelectedFilter(title);
            } else {
                removeSelectedFilter(title);
            }
        });
    });
}

// Добавление фильтра в блок выбранных
function addSelectedFilter(title) {
    const selectedWrap = document.querySelector('.js-filter-selected');
    if (!selectedWrap) return;
    
    // Проверка на дубликаты
    const exists = [...selectedWrap.querySelectorAll('.panel-title')]
        .some(el => el.textContent.trim() === title);
    if (exists) return;
    
    const filterEl = document.createElement('div');
    filterEl.className = 'elm-panel-selected';
    filterEl.innerHTML = `
        <div class="panel-title">${title}</div>
        <a href="" class="panel-button btn-action-ico ico-del js-filter-selected-del"></a>
    `;
    
    selectedWrap.appendChild(filterEl);
}

// Удаление фильтра из блока выбранных по названию
function removeSelectedFilter(title) {
    const selectedWrap = document.querySelector('.js-filter-selected');
    if (!selectedWrap) return;
    
    selectedWrap.querySelectorAll('.elm-panel-selected').forEach(item => {
        if (item.querySelector('.panel-title').textContent.trim() === title) {
            item.remove();
        }
    });
}

// Сброс всех фильтров
function resetAllFilters() {
    const resetBtn = document.querySelector('button[type="reset"]');
    if (!resetBtn) return;
    
    resetBtn.addEventListener('click', function() {
        setTimeout(() => {
            const selectedWrap = document.querySelector('.js-filter-selected');
            if (selectedWrap) {
                selectedWrap.querySelectorAll('.elm-panel-selected').forEach(item => item.remove());
            }
        }, 100);
    });
}

// Поиск по категориям
function initCategorySearch() {
    const searchInput = document.querySelector('.filter-section-search .form-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const term = this.value.toLowerCase().trim();
        const items = document.querySelectorAll('.filter-section-wrap:first-child .frm-select');
        
        items.forEach(item => {
            const label = item.querySelector('label');
            if (!label) return;
            item.style.display = !term || label.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    });
}

// Синхронизация выбранных фильтров при загрузке
function syncSelectedFilters() {
    document.querySelectorAll('.filter-section-wrap input[type="checkbox"]:checked').forEach(checkbox => {
        const label = checkbox.closest('.frm-select').querySelector('label');
        if (label) addSelectedFilter(label.textContent.trim());
    });
}