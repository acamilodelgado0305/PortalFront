/*
   npm i tldraw
   npm i @tldraw/sync 
   son dos librerias distintas, una es para la pizarrra otra
   para la sincronización 

   http://localhost:5173/whiteboard

*/
import { Tldraw } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync'; 
import 'tldraw/tldraw.css';
import Header from '../Header.jsx';

function WhiteBoard() {
  const store = useSyncDemo({ roomId: 'myapp-abc123' });

  return (
    <>
      <Header />
      <div className="flex justify-center w-full h-full fixed bg-[#7066e0]">
        <div className="w-4/5 h-[85%] pt-[3rem]"> 
          <Tldraw store={store} />
        </div>
      </div>
    </>
  );
}

export default WhiteBoard;
