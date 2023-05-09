(function() {
    // установить атрибут disabled, если поле ввода пустое
    function addAttributeDisabled(button, valueInput) {
        (valueInput == '') ?  button.setAttribute('disabled', '')  : button.removeAttribute('disabled', '')
    }

    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title
        return appTitle
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form'),
            input = document.createElement('input'),
            buttonWrapper = document.createElement('div'),
            button = document.createElement('button')
        
        form.classList.add('input-group', 'mb-3')
        input.classList.add('form-control')
        input.placeholder = 'Введите название нового дела'
        buttonWrapper.classList.add('input-group-append')
        button.classList.add('btn', 'btn-primary')
        button.textContent = 'Добавить дело'

        buttonWrapper.append(button)
        form.append(input)
        form.append(buttonWrapper)

        return {
            form,
            input,
            button
        }

    }

    // создаём свойство в localStorage
    function createItemLocalStorage(keyObject, valueItem) {
        let storageItem = JSON.parse(localStorage.getItem(keyObject)),
            objectItem = {}
            objectItem[valueItem] = 'Not ready'
        if(storageItem) {
            Object.assign(storageItem, objectItem)
            localStorage.setItem(keyObject, JSON.stringify(storageItem))
        }
        else {
            localStorage.setItem(keyObject, JSON.stringify(objectItem))
        }
    }

    // получить ключ к loclStorage
    function getTextArrayElement(arrayEl = [], element = '') {
        switch(element) {
            case arrayEl[0]:
                return 'MyCase';
            case arrayEl[1]:
                return 'DadCase';
            case arrayEl[2]:
                return 'MamCase';
            default:
                return '';
        }
    }

    // создаем элемент списка с кнопками
    function createTodoItem (name) {
        let item = document.createElement('li'),
            buttonGroup = document.createElement('div'),
            doneButton = document.createElement('button'),
            deleteButton = document.createElement('button')

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
        item.textContent = name
        buttonGroup.classList.add('btn-group', 'btn-group-sm')
        doneButton.classList.add('btn', 'btn-success')
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить'

        buttonGroup.append(doneButton)
        buttonGroup.append(deleteButton)
        item.append(buttonGroup)

        return {
            item,
            doneButton,
            deleteButton
        }
    }

    // создаем и возвращаем список дел
    function createTodoList() {
        let list = document.createElement('ul')
        list.classList.add('list-group')
        return list
    }

    function createTodoApp(container, title = 'Список дел') {
        let todoAppTitle = createAppTitle(title),
            todoItemForm = createTodoItemForm(),
            todoList = createTodoList(),
            nameTitle = ['Мои дела', 'Дела папы', 'Дела мамы'],
            nameCase = getTextArrayElement(nameTitle, title),
            myStorage = window.localStorage,
            itemStorage = JSON.parse(myStorage.getItem(nameCase))

        container.append(todoAppTitle)
        container.append(todoItemForm.form)
        container.append(todoList)
        addAttributeDisabled(todoItemForm.button, todoItemForm.button.value)

        for(item in itemStorage) {
            let elementList = createTodoItem(item)
            if(itemStorage[item] == 'Ready') {
                elementList.item.classList.add('list-group-item-success')
            }
            todoList.append(elementList.item)

            elementList.doneButton.addEventListener('click', function() {
                elementList.item.classList.toggle('list-group-item-success')
                if(elementList.item.classList.contains('list-group-item-success')) {
                     itemStorage[elementList.item.firstChild.textContent] = 'Ready'
                }
                else {
                    itemStorage[elementList.item.firstChild.textContent] = 'Not Ready'
                }
                myStorage.setItem(nameCase, JSON.stringify(itemStorage))
            })
            elementList.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены?')) {
                    elementList.item.remove()
                    delete itemStorage[elementList.item.firstChild.textContent]
                    myStorage.setItem(nameCase, JSON.stringify(itemStorage))
                }
            })
        }
        
        //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e){
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данно случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault()

            if(!todoItemForm.input.value) {
                return
            }

            let todoItem = createTodoItem(todoItemForm.input.value),
                nameTitle = ['Мои дела', 'Дела папы', 'Дела мамы'],
                nameCase = getTextArrayElement(nameTitle, title)

                createItemLocalStorage(nameCase,  todoItemForm.input.value)

            // добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success')
            })
            todoItem.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены?')) {
                    todoItem.item.remove()
                }
            })

            // создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item)

            // обнуляем значение поля, чтобы непришлось стирать его вручную
            todoItemForm.input.value = ''
            addAttributeDisabled(todoItemForm.button, todoItemForm.input.value)

        })

        todoItemForm.input.addEventListener('input', function() {
            addAttributeDisabled(todoItemForm.button, this.value)
        })
    }
    window.createTodoApp = createTodoApp
})()