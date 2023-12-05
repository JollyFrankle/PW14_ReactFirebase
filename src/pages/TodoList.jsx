import { useEffect, useState } from "react";
import { db, DB_TODO_KEY } from "../../firebaseConfig"
import { ref, onValue, set, off } from "firebase/database";
import { useNavigate } from "react-router-dom";

import "./TodoList.css";

export default function TodoList() {
    const [list, setList] = useState([]);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Get user dari localStorage
        const userLocalStorage = localStorage.getItem("userfb");
        if (!userLocalStorage) {
            navigate("/");
        } else {
            const userLocalStorageObject = JSON.parse(userLocalStorage);
            setUser(userLocalStorageObject);

            // Get data dari database dengan key=DB_TODO_KEY
            const dataRef = ref(db, DB_TODO_KEY);

            // Ketika ada perubahan data, maka akan mengambil data dari database
            const onDataChange = (snapshot) => {
                const newData = snapshot.val();
                if (!Array.isArray(newData)) {
                    setList([]);
                } else {
                    setList(newData);
                    console.log("newData", newData);
                }
            }

            onValue(dataRef, onDataChange);

            return () => {
                // Ketika halaman ditutup, maka akan menghapus listener
                off(dataRef, onDataChange);
            }
        }
    }, []);

    const addItem = () => {
        // newDAta adalah data yang akan diupdate ke database
        const newData = list || [];

        // Tambahkan item baru ke newData
        const isiTodo = prompt("Masukkan isi ToDo:");
        if (isiTodo.trim()) {
            const newItem = {
                id: Date.now(),
                todo: isiTodo,
                user: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }
            }; // Replace this with your actual item
            newData.push(newItem);

            // Update the data in the database
            const dataRef = ref(db, DB_TODO_KEY);
            set(dataRef, newData);
        }
    };

    const deleteItem = (id) => {
        const newData = list || [];

        // Hapus item dengan id tertentu dari newData
        const index = newData.findIndex((item) => item.id === id);
        if (index !== -1) {
            newData.splice(index, 1);
        }

        // Update the data in the database
        const dataRef = ref(db, DB_TODO_KEY);
        set(dataRef, newData);
        console.log("newData", newData);
    }

    return (
        <div>
            <h1>Todo List</h1>
            <ul className="todoList">
                {list.length > 0 ? list.map((item) => (
                    <li key={item.id}>
                        <div className="todoList-user">
                            <img src={item.user.photoURL} alt={item.user.displayName} className="todoList-user-img" referrerPolicy="no-referrer" />
                            <div className="todoList-user-field">
                                <p className="todoList-user-name">{item.user.displayName}</p>
                                <p className="todoList-user-email">{item.user.email}</p>
                            </div>
                            <button className="todoList-user-delete" onClick={() => deleteItem(item.id)}>×</button>
                        </div>
                        <p>{item.todo}</p>
                    </li>
                )) : (
                    <p className="todoList-empty">Belum ada Todo</p>
                )}
            </ul>
            <button onClick={addItem}>Add Item</button>
        </div>
    );
}