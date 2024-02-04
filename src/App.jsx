import { useEffect, useState } from "react";
import "./App.css";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit, FaCheck, FaReacteurope } from "react-icons/fa";

function App() {
  const localStorageItems = () => {
    let list = localStorage.getItem("mytodo");
    // if(list){
    //   return JSON.parse(localStorage.getItem('mytodo'))
    // }else{
    //   []
    // }
    // ternary operator is also working in one line only
    return !list ? [] : JSON.parse(localStorage.getItem("mytodo"));
  };

  const [isCompleted, setIsCompleted] = useState(false);
  const [myAllTodos, setMyTodos] = useState(localStorageItems());
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [toggleForEdit, setToggleForEdit] = useState(true);
  const [editItemId, setEditItemId] = useState(null);
  const [timeIs, setTimeIs] = useState("");
  const myCompletedTodo = () => {
    let completedList = localStorage.getItem("completedTodo");
    return !completedList
      ? []
      : JSON.parse(localStorage.getItem("completedTodo"));
  };
  const [completedTodos, setCompletedTodos] = useState(myCompletedTodo());


  
  const handleAddTodo = () => {
    if (!todoTitle || !todoDescription) {
    } else if (todoTitle && todoDescription && !toggleForEdit) {
      const editedItem = myAllTodos.map((elem) => {
        if (elem.id === editItemId) {
          return { ...elem, titleIs: todoTitle, descIs: todoDescription };
        }
        return elem;
      });
      console.log(editedItem);
      setToggleForEdit(true);
      setTodoTitle("");
      setTodoDescription("");
      setEditItemId(null);
      return setMyTodos(editedItem);
    } else {
      let todoItemIs = {
        id: new Date().getTime().toString(),
        titleIs: todoTitle,
        descIs: todoDescription,
      };
      // timer start

      let creationTime = new Date();
      let dd = creationTime.getDate();
      let mm = creationTime.getMonth() + 1;
      let yyyy = creationTime.getFullYear();
      let h = creationTime.getHours();
      let m = creationTime.getMinutes();
      let sec = creationTime.getSeconds();

      // Convert 24hr clock to 12hr clock
      if (h > 12) {
        h = h - 12;
      }
      // add zero before single digit Number;
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      sec = sec < 10 ? "0" + sec : sec;
      let createdOn =
        dd + "-" + mm + "-" + yyyy + " At " + h + ":" + m + ":" + sec;
      // setTimeIs(createdOn)
      todoItemIs.timeCreation = createdOn;

      // timer End

      let updatedArrIs = [...myAllTodos, todoItemIs];

      // updatedArrIs.push(todoItemIs); this is alsow valid

      setMyTodos(updatedArrIs);
      setTodoTitle("");
      setTodoDescription("");
      setToggleForEdit(true);
    }
  };



  useEffect(() => {
    localStorage.setItem("mytodo", JSON.stringify(myAllTodos));
    localStorage.setItem("completedTodo", JSON.stringify(completedTodos));
  }, [myAllTodos, completedTodos]);

  // delete the items

  const handleDelete = (index) => {
    let deletedItem = [...myAllTodos];
    deletedItem.splice(index, 1);
    localStorage.setItem("myTodo", JSON.stringify(deletedItem));
    setMyTodos(deletedItem);
  };

  // edit the items

  const editMeAll = (id) => {
    let newEditItemIs = myAllTodos.find((elem) => {
      return elem.id === id;
    });
    // newEditItemIs.timeCreation= ''
    setTodoTitle(newEditItemIs.titleIs);
    setTodoDescription(newEditItemIs.descIs);
    document.getElementById("title-text").focus();
    setEditItemId(id);
    setToggleForEdit(false);
  };

  const handleComplete = (index) => {
    let filteredTodos = { ...myAllTodos[index] };
    let completedArray = [...completedTodos];
    completedArray.push(filteredTodos);
    setCompletedTodos(completedArray);
    handleDelete(index);
  };

  const handledeletionForComplete = (index) => {
    let deletedItem = [...completedTodos];
    deletedItem.splice(index, 1);
    localStorage.setItem("completedTodo", JSON.stringify(deletedItem));
    setCompletedTodos(deletedItem);
  };

  return (
    <>
      <div className="my-app">
        <h1>My Todos</h1>
        <div className="todo-wrapper">
          <div className="todo-inputs">
            <div className="todo-input-item">
              <label>Title</label>
              <input
                type="text"
                id="title-text"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                placeholder="What's the task title"
              />
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input
                type="text"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
                placeholder="What's the task description"
              />
            </div>
            <div className="todo-input-item">
              {toggleForEdit ? (
                <button
                  onClick={handleAddTodo}
                  className="primary-btn"
                  type="button"
                  title="Add Todo"
                >
                  Add
                </button>
              ) : (
                <button
                  onClick={handleAddTodo}
                  className="primary-btn"
                  type="button"
                  title="Edit Todo"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="btn-area">
            <button
              className={`secondaryBtn ${isCompleted === false && "active"}`}
              onClick={() => setIsCompleted(false)}
            >
              Todos
            </button>
            <button
              className={`secondaryBtn ${isCompleted === true && "active"}`}
              onClick={() => setIsCompleted(true)}
            >
              Completed
            </button>
          </div>

          <div className="todo-list">
            {isCompleted === false &&
              myAllTodos.map((item, index) => {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.titleIs}</h3>
                      <p>{item.descIs}</p>
                      <h5>Created On : {item.timeCreation}</h5>
                    </div>

                    <div>
                      <FaRegEdit
                        className="icon edit-icon"
                        onClick={() => editMeAll(item.id)}
                      />
                      <MdOutlineDelete
                        className="icon"
                        onClick={() => handleDelete(index)}
                      />
                      <FaCheck
                        onClick={() => handleComplete(index)}
                        className="check-icon"
                      />
                    </div>
                  </div>
                );
              })}
            {isCompleted === true &&
              completedTodos.map((item, index) => {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.titleIs}</h3>
                      <p>{item.descIs}</p>
                      <h1>You are in completed</h1>
                    </div>

                    <div>
                      <MdOutlineDelete
                        className="icon"
                        onClick={() => handledeletionForComplete(index)}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
