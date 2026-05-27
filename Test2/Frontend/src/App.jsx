import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);
      if (!res.ok) {
        throw new Error("Failed to load students.");
      }
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      setErrorMessage(err.message || "Could not load students.");
    }
  };

  const handleSave = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    setStatusMessage("");
    setErrorMessage("");

    const student = {
      name,
      course,
    };

    try {
      const res = await fetch(`${API_URL}/students${editId ? `/${editId}` : ""}`, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Unable to save student.");
      }

      setStatusMessage(editId ? "Student updated successfully." : "Student added successfully.");
      setEditId(null);
      setName("");
      setCourse("");
      getStudents();
    } catch (err) {
      setErrorMessage(err.message || "Unable to save student.");
    }
  };

  const handleUpdate = async () => {
    if (!editId) {
      setErrorMessage("Select a student to update first.");
      return;
    }
    await handleSave();
  };

  const handleDeleteSelected = async () => {
    if (!editId) {
      setErrorMessage("Select a student to delete first.");
      return;
    }
    setStatusMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_URL}/students/${editId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Unable to delete student.");
      }

      setStatusMessage("Student deleted successfully.");
      setEditId(null);
      setName("");
      setCourse("");
      getStudents();
    } catch (err) {
      setErrorMessage(err.message || "Unable to delete student.");
    }
  };

  const handleDelete = async (id) => {
    const studentId = id?._id || id || "";
    setStatusMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_URL}/students/${studentId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Unable to delete student.");
      }

      setStatusMessage("Student deleted successfully.");
      if (editId === studentId) {
        setEditId(null);
        setName("");
        setCourse("");
      }
      getStudents();
    } catch (err) {
      setErrorMessage(err.message || "Unable to delete student.");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setCourse("");
    setStatusMessage("");
    setErrorMessage("");
  };

  const handleEdit = (student) => {
    setStatusMessage("");
    setErrorMessage("");
    setName(student.name || "");
    setCourse(student.course || "");
    setEditId(student._id || student.id || null);
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Enter Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <br /><br />

          <button type="submit">
          {editId ? "Update" : "Add"}
        </button>

        <button type="button" onClick={handleUpdate} disabled={!editId} style={{ marginLeft: "8px" }}>
          Update
        </button>

        <button type="button" onClick={handleDeleteSelected} disabled={!editId} style={{ marginLeft: "8px" }}>
          Delete
        </button>

        <button type="button" onClick={handleCancel} disabled={!editId} style={{ marginLeft: "8px" }}>
          Cancel
        </button>
      </form>

      {statusMessage && <p style={{ color: "green" }}>{statusMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <hr />

      <h2>Students List</h2>

      {students.map((student) => {
        const studentId = student._id || student.id;
        return (
          <div key={studentId}>
            <h3>{student.name}</h3>
            <p>{student.course}</p>

            <button type="button" onClick={() => handleEdit(student)}>
              Edit
            </button>

            <button type="button" onClick={() => handleDelete(studentId)}>
              Delete
            </button>

            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default App;
