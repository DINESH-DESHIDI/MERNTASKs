import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  return (
    <div>
      <h1>Students Data</h1>

      {students.map((student) => (
        <div key={student.id}>
          <h3>{student.name}</h3>
          <p>{student.course}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;