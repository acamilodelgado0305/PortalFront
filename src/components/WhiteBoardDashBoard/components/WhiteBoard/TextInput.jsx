function TextInput({ context }) {
if(context.drawingMode != 'text') return null 
const emitToSocket = true;
  return (
    context?.isWriting && (
      <div 
        style={{ 
          position: 'absolute', 
          zIndex: 9999, 
          top: context.currentTextPosition.y,  
          left: context.currentTextPosition.x, 
        }}
      >
        <input
          type="text"
          value={context.currentText}
          onChange={(e) => context.updateTextContent(e.target.value, emitToSocket)}
          placeholder="Enter text"
          style={{ padding: '5px', fontSize: '16px', color:context.currentColor }}
          autoFocus  
        />
        <button 
          onClick={()=>context.addTextToList(emitToSocket)} 
          style={{ padding: '5px 10px', marginLeft: '5px' }}
        >
          Add Text
        </button>
      </div>
    )
  );
}

export default TextInput;


