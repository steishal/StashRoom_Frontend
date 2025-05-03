import { useDrop } from 'react-dnd';

const FileDropZone = () => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FILE',
    drop: () => ({ name: 'FileDropZone' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`drop-zone ${isOver ? 'active' : ''}`}
    >
      <div className="drop-content">
        <i className="icon-upload"></i>
        <p>Drop files here to open them</p>
      </div>
    </div>
  );
};
