// NOTES:
//
// StorageCtrl
//    + storeItem(item)
//    + getItemsFromStorage
//    + updateItemStorage(updatedItem)
//    + deleteItemFromStorage(id)
//    + clearAllItemsFromStorage
//
//  ItemCtrl
//    + getItems
//    + addItem(name, calories)
//    + updateItem(name, calories)
//    + deleteItem(id)
//    + clearAllItems
//    + getItemById(id)
//    + setCurrentItem(id)
//    + getCurrentItem
//    + getTotalCalories
//    + logData
//
//  UICtrl
//    = UI Selectors
//    + populateItemList(items)
//    + getItemInput
//    + addListItem(item)
//    + showTotalCalories(totalCalories)
//    + clearEditState
//    + showEditState
//    + updateListItem
//    + deleteListItem
//    + removeItems
//    + clearInput
//    + focusOnName
//    + addItemToForm
//    + hideList
//    + getSelectors
//
//  App
//    - loadEventListeners
//    - itemAddSubmit
//    - itemEditClick
//    - itemUpdateSubmit
//    - itemDeleteSubmit
//    - clearAllItemsClick
//    + init (getItems, populateItemList, loadEventListeners)


// Storage Controller
const StorageCtrl = (function() {
  // Private Parameters

  // Private Methods

  // Public methods

  const storeItem = function(item) {
    let items = [];
    // Check if any itesms
    if (localStorage.getItem('items') === null) {
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    } else {
      items = JSON.parse(localStorage.getItem('items'));
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    }
  }

  const getItemsFromStorage = function() {
    let items;
    if (localStorage.getItem('items') === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
  }

  const updateItemStorage =  function(updatedItem) {
    let items = JSON.parse(localStorage.getItem('items'));
    items.forEach(function(item, index) {
      if (updatedItem.id === item.id) {
        items.splice(index, 1, updatedItem);
      }
    });
    localStorage.setItem('items', JSON.stringify(items));
  }

  const deleteItemFromStorage = function(id) {
    let items = JSON.parse(localStorage.getItem('items'));
    items.forEach(function(item, index) {
      if (id === item.id) {
        items.splice(index, 1);
      }
    });
    localStorage.setItem('items', JSON.stringify(items));
  }

  const clearAllItemsFromStorage = function() {
    localStorage.removeItem('items');
  }

  // Returns
  return {
    storeItem:                storeItem,
    getItemsFromStorage:      getItemsFromStorage,
    updateItemStorage:        updateItemStorage,
    deleteItemFromStorage:    deleteItemFromStorage,
    clearAllItemsFromStorage: clearAllItemsFromStorage
  }
})();

// Item Controller
const ItemCtrl = (function() {
  
  // PRIVATE PARAMETERS

  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    // items: [
    //   {id: 0, name: 'Steak Dinner', calories: 1200},
    //   ...
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // PRIVATE METHODS

  // PUBLIC METHODS
  const getItems =  function() {
    return data.items;
  }

  const addItem = function(name, calories) {
    let id = 0;
    // Create ID
    if (data.items.length > 0) {
      id = data.items[data.items.length - 1].id + 1;
    }
    // calories to number
    calories = parseInt(calories);
    // Create new item
    const newItem = new Item(id, name, calories);
    // Add to items array
    data.items.push(newItem);

    return newItem;
  }

  const updateItem = function(name, calories) {
    // Convert to number
    calories = parseInt(calories);
    let found = null;
    data.items.forEach(function(item) {
      if (item.id == data.currentItem.id) {
        item.name = name;
        item.calories = calories;
        found = item;
      }
    });
    return found;
  }

  const deleteItem = function(id) {
    // Get ids
    ids = data.items.map(function(item) {
      return item.id;
    })
    // Get Index 
    const index = ids.indexOf(id);

    // Remove item by slicing
    data.items.splice(index, 1);
  }

  const clearAllItems = function() {
    data.items = [];
  }

  const getItemById = function(id) {
    let found = null;
    data.items.forEach(function(item) {
      if (item.id === id) {
        found = item;
      }
    });
    return found;
  }

  const setCurrentItem = function (item) {
    data.currentItem = item;
  }

  const getCurrentItem = function () {
    return data.currentItem;
  }

  const getTotalCalories = function() {
    let total = 0;
    data.items.forEach(function(item) {
      total += item.calories;
    });
    data.totalCalories = total;
    return total;
  }

  const logData = function() {
    return data;
  }

  // RETURNS
  return {
    getItems:         getItems,
    addItem:          addItem,
    updateItem:       updateItem,
    deleteItem:       deleteItem,
    clearAllItems:    clearAllItems,
    getItemById:      getItemById,
    setCurrentItem:   setCurrentItem,
    getCurrentItem:   getCurrentItem,
    getTotalCalories: getTotalCalories,
    logData:          logData
  }

})();


// UI Controller
const UICtrl = (function(){

  // Private parameter
  const UISelectors = {
    itemList:           '#item-list',
    addBtn:             '.add-btn',
    updateBtn:          '.update-btn',
    deleteBtn:          '.delete-btn',
    backBtn:            '.back-btn',
    itemNameInput:      '#item-name',
    itemCaloriesInput:  '#item-calories',
    totalCalories:      '.total-calories',
    collectionItems:    '.collection-item',
    clearBtn:           '.clear-btn'
  }

  // PUBLIC METHODS
  const populateItemList = function(items) {
    let html = '';
    // Create list items
    items.forEach(function(item) {
      html += `
      <li class="collection-item" id="item-${item.id}">
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
      </li>`;
    });
    // Populare the list items
    document.querySelector(UISelectors.itemList).innerHTML = html;
  }

  const getItemInput = function() {
    return {
      name: document.querySelector(UISelectors.itemNameInput).value,
      calories: document.querySelector(UISelectors.itemCaloriesInput).value
    }
  }

  const addListItem = function(item) {
    // Show the list
    document.querySelector(UISelectors.itemList).style.display = 'block';
    // Create li element
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.id = `item-${item.id}`;
    
    // Add HTML
    li.innerHTML = `
    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
    <a href="#" class="secondary-content">
      <i class="edit-item fa fa-pencil"></i>
    </a>`;
    document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
  }

  const showTotalCalories = function(totalCalories) {
    document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
  }

  const clearEditState = function() {
    UICtrl.clearInput();
    document.querySelector(UISelectors.addBtn).style.display = 'inline';
    document.querySelector(UISelectors.updateBtn).style.display = 'none';
    document.querySelector(UISelectors.deleteBtn).style.display = 'none';
    document.querySelector(UISelectors.backBtn).style.display = 'none';
  }

  const showEditState = function() {
    document.querySelector(UISelectors.addBtn).style.display = 'none';
    document.querySelector(UISelectors.updateBtn).style.display = 'inline';
    document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
    document.querySelector(UISelectors.backBtn).style.display = 'inline';
  }

  const updateListItem = function (item) {
    // Returns a Node List -> no for Each
    let listItems = document.querySelectorAll(UISelectors.collectionItems);

    // Convert to array
    listItems = Array.from(listItems);

    listItems.forEach(function(listItem) {
      const itemId = listItem.getAttribute('id');
      if (itemId === `item-${item.id}`) {
        document.querySelector(`#${itemId}`).innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      }
    });
  }

  const deleteListItem = function(id) {
    const itemId = `#item-${id}`;
    const item = document.querySelector(itemId);
    item.remove();
  }

  const removeItems = function() {
    let listItems = document.querySelectorAll(UISelectors.collectionItems);

    // Turn Node list into array
    listItems = Array.from(listItems);

    listItems.forEach(function(item) {
      item.remove();
    });
  }

  const clearInput = function() {
    document.querySelector(UISelectors.itemNameInput).value = '';
    document.querySelector(UISelectors.itemCaloriesInput).value = '';
  }

  const focusOnName = function() {
    document.querySelector(UISelectors.itemNameInput).focus();
  }

  const addItemToForm = function(item) {
    document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
    document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    UICtrl.showEditState();
  }
  
  const hideList = function() {
    document.querySelector(UISelectors.itemList).style.display = 'none';
  }

  const getSelectors = function() {
    return UISelectors;
  }

  // RETURN
  return {
    populateItemList:   populateItemList,
    getItemInput:       getItemInput,
    addListItem:        addListItem,
    showTotalCalories:  showTotalCalories,
    clearEditState:     clearEditState,
    showEditState:      showEditState,
    updateListItem:     updateListItem,
    deleteListItem:     deleteListItem,
    removeItems:        removeItems,
    clearInput:         clearInput,
    focusOnName:        focusOnName,
    addItemToForm:      addItemToForm,
    hideList:           hideList,
    getSelectors:       getSelectors
  }

})();


// Main App controller (Everything meets, evt listerner)
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
  
  // PRIVATE METHODS

  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable enter key when in edit state
    document.addEventListener('keypress', function(e) {
      if (e.keyCode == 13 || e.which === 13) { // ENTER key
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Back button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Add item submit event handler
  const itemAddSubmit = function(e) {
    //Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Move cursor back to Name input
      UICtrl.focusOnName();
      // Add item to UI list
      UICtrl.addListItem(newItem);
      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);
      // Clear fields
      UICtrl.clearInput();
      // Persist Data
      StorageCtrl.storeItem(newItem);
    }
  }

  const itemEditClick = function(e) {
    if (e.target.classList.contains('edit-item')) {
      const listId = e.target.parentElement.parentElement.id;

      // Break into an array
      const listIdArr = listId.split('-');
      
      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm(itemToEdit);
    }

    e.preventDefault();
  }

  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item in data structure
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
    // Reflect changes in UI
    UICtrl.updateListItem(updatedItem);
    
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories)
    
    StorageCtrl.updateItemStorage(updatedItem);

    // Clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Reflect deletion from UI
    UICtrl.deleteListItem(currentItem.id);

    // Clear edit state
    UICtrl.clearEditState();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories)

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);


    // Fetch items from data structure
    const items = ItemCtrl.getItems();

    // Hide list
    if (items.length === 0) {
      UICtrl.hideList();
    } else {
      // Populate items with lists
      UICtrl.populateItemList(items);
    }

    e.preventDefault();
  }

  const clearAllItemsClick = function(e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems()

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories)

    // Remove from UI
    UICtrl.removeItems()

    StorageCtrl.clearAllItemsFromStorage();

    // Fetch items from data structure
    const items = ItemCtrl.getItems();

    // Hide the list
    UICtrl.hideList();
  }


  // PUBLIC METHODS
  const init = function() {
    // Clear edit state / set initial state
    UICtrl.clearEditState();

    // Fetch items from data structure
    const items = ItemCtrl.getItems();

    // Hide list
    if (items.length === 0) {
      UICtrl.hideList();
    } else {
      // Populate items with lists
      UICtrl.populateItemList(items);
    }

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories)

    // Load event listeners
    loadEventListeners();
  }

  // RETURN
  return {
    init: init
  }

})(ItemCtrl, UICtrl, StorageCtrl);

App.init();