import Title from "./Title";
import Images from "./Images";
import Text from "./Text";

const Tutor = () => {
  return (
    <div className="bg-white h-auto w-full pb-20">
      <div className="bg-white max-w-screen-lg mx-auto  p-4 h-auto w-full mb-10">
        
        <Title/>

        <div className="flex flex-col items-center">
         <Images />
         <Text/>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
