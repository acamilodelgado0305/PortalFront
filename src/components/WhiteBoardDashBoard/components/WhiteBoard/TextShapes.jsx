import { Text } from 'react-konva';

function TextShapes({ context }) {

  return (
    <>
    {context.isWriting && (
      <div 
        style={{ 
          position: 'absolute', 
          zIndex: '9999', 
          top: context.currentTextPosition.y,  
          left: context.currentTextPosition.x, 
          transform: 'translate(-50%, -50%)'  
        }}
      >
        <input
          type="text"
          value={context.currentText}
          onChange={(e) => context.handleSetCurrentText(e.target.value)}
          placeholder="Enter text"
          style={{ padding: '5px', fontSize: '16px', color:'red' }}
          autoFocus  
        />
        <button 
          onClick={context.handleSetTextInListOfTexts} 
          style={{ padding: '5px 10px', marginLeft: '5px' }}
        >
          Add Text
        </button>
      </div>
    )}
      {context.texts.map((item, index) => (
          <Text
            key={index}
            x={item.position.x}
            y={item.position.y}
            text={item.text}
            fontSize={20}
            fill="black"
          />
        ))}
  </>
  );
}

export default TextShapes;



