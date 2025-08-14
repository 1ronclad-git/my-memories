import { useState } from "react";

const initialMemories = [];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [memories, setMemories] = useState(initialMemories);
  const [showAddMemories, setShowAddMemories] = useState(false);

  const [selectedMemories, setSelectedMemories] = useState(null);

  function handleShowAddMemories() {
    setShowAddMemories((show) => !show);
  }

  function handleAddMemories(memory) {
    setMemories((memories) => [...memories, memory]);
    setShowAddMemories(false);
  }

  function handleSelected(memory) {
    setSelectedMemories((cur) => (cur && cur.id === memory.id ? null : memory));
    setShowAddMemories(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <MemoriesList
          memories={memories}
          onSelectedMemories={handleSelected}
          selectedMemories={selectedMemories}
        />

        <Button onClick={handleShowAddMemories}>
          {showAddMemories ? "Close" : "Add memories"}
        </Button>
        {showAddMemories && <AddMemories onAddMemories={handleAddMemories} />}
      </div>

      {selectedMemories && (
        <ViewMemories memories={memories} selectedMemories={selectedMemories} />
      )}
    </div>
  );
}

function MemoriesList({ memories, onSelectedMemories, selectedMemories }) {
  return (
    <div>
      <div>
        <h1>Memories</h1>
        <ul>
          {memories.map((memories) => (
            <Memories
              memories={memories}
              key={memories.id}
              selectedMemories={selectedMemories}
              onSelectedMemories={onSelectedMemories}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Memories({ memories, onSelectedMemories, selectedMemories }) {
  const isSelected = selectedMemories?.id === memories.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <h4>{memories.name}</h4>

      <Button onClick={() => onSelectedMemories(memories)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddMemories({ onAddMemories }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    const newMemories = {
      id,
      name,
      image,
    };

    onAddMemories(newMemories);
    // console.log(image);

    setName("");
    setImage("");
  }

  return (
    <form className="form-add-memory" onSubmit={handleSubmit}>
      <label>Title</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image</label>
      <input type="file" multiple onChange={(e) => setImage(e.target.files)} />

      <Button>Add</Button>
    </form>
  );
}

function ViewMemories({ selectedMemories }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imagesArray = Array.from(selectedMemories.image);
  const totalImages = imagesArray.length;

  function handlePrevious() {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  }

  function handleNext() {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  }

  return (
    <div className="div-view-memory">
      <h4>{selectedMemories.name}</h4>
      <img
        src={URL.createObjectURL(imagesArray[currentIndex])}
        alt={`Memory ${currentIndex}`}
      />
      <div>
        <Button onClick={handlePrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
      <p>
        Viewing image {currentIndex + 1} of {totalImages}
      </p>
    </div>
  );
}
