import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

export default function App() {
  const [habitInput, setHabitInput] = useState("");
  const [habits, setHabits] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addHabit = () => {
    if (!habitInput.trim()) return;
    setHabits([
      ...habits,
      {
        id: Date.now().toString(),
        text: habitInput,
        completed: false,
        monthly: new Array(31).fill(false),
      },
    ]);
    setHabitInput("");
  };

  const toggleDaily = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  const toggleMonthly = (id, index) => {
    setHabits(
      habits.map((h) =>
        h.id === id
          ? { ...h, monthly: h.monthly.map((v, i) => (i === index ? !v : v)) }
          : h
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newHabits = Array.from(habits);
    const [moved] = newHabits.splice(result.source.index, 1);
    newHabits.splice(result.destination.index, 0, moved);
    setHabits(newHabits);
  };

  return (
    <div className="app">
      {/* 🌸 Date and Time */}
      <div className="date-time">
        {currentTime.toLocaleString("en-AU", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>

      <h1>🌸Habit Tracker🌸</h1>

      <div className="input-area">
        <input
          value={habitInput}
          onChange={(e) => setHabitInput(e.target.value)}
          placeholder="Add a habit..."
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="habit-list">
          {(provided) => (
            <div
              className="habit-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {habits.map((habit, index) => (
                <Draggable key={habit.id} draggableId={habit.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        className={`habit ${snapshot.isDragging ? "dragging" : ""}`}
                      >
                        <div className="habit-header">
                          <label>
                            <input
                              type="checkbox"
                              checked={habit.completed}
                              onChange={() => toggleDaily(habit.id)}
                            />
                            <span
                              className={
                                habit.completed ? "completed-text" : ""
                              }
                            >
                              {habit.text}
                            </span>
                          </label>
                          <button
                            className="delete-btn"
                            onClick={() => deleteHabit(habit.id)}
                          >
                            Delete
                          </button>
                        </div>

                        <div className="monthly-grid">
                          {habit.monthly.map((day, i) => (
                            <div
                              key={i}
                              className={`day ${day ? "checked" : ""}`}
                              onClick={() => toggleMonthly(habit.id, i)}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
