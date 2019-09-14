(function () {
  class ToDoList extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const container = document.createElement('div');
      const title = this.title;
      this.items = this.getInitialItems();

      container.innerHTML = `
        <h2>${title}</h2>
        <ul class="list"></ul>
        <input type="text" class="input" />
        <button class="add-item">Add</button>
      `;

      this.addItem = this.addItem.bind(this);
      this.deleteItem = this.deleteItem.bind(this);

      shadow.appendChild(container);
    }

    connectedCallback() {
      this.list = this.shadowRoot.querySelector('.list');
      this.input = this.shadowRoot.querySelector('.input');
      this.recreateList();

      const addItemButton = this.shadowRoot.querySelector('.add-item');
      addItemButton.addEventListener('click', this.addItem, false);
    }

    getInitialItems() {
      return [...this.attributes]
        .filter(attr => attr.name.includes('item'))
        .map(attr => attr.value);
    }

    addItem() {
      const newItemValue = this.input.value;
      if (newItemValue) {
        this.items.push(newItemValue);
        this.recreateList();
        this.input.value = '';
      }
    }

    deleteItem(event) {
      const itemIndex = [...event.target.parentNode.parentNode.children]
        .indexOf(event.target.parentNode);
      this.items =
        this.items.filter((item, index) => index !== itemIndex);
      this.recreateList();
    }

    recreateList() {
      this.list.innerHTML = `
        ${this.items.map(item =>
          `<li>
            ${item}
            <button class="delete-item">X</button>
          </li>`
        ).join('')}
      `;
      const deleteButtons = [...this.shadowRoot.querySelectorAll('.delete-item')];
      deleteButtons.forEach(button =>
        button.addEventListener('click', this.deleteItem)
      );
    }
  }

  customElements.define('todo-list', ToDoList);
})();
