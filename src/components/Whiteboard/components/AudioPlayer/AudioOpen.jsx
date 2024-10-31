import { Component, createRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Controlls from './Controlls';
import ProgressBar from './ProgressBar';

class AudioOpen extends Component {
    constructor(props) {
        super(props);
        this.audioRef = createRef();
        this.state = {
            currentTime: 0,
            duration: 0,
        };
    }

    componentDidMount() {
        const audio = this.audioRef.current;
        const { file } = this.props;
        this.url = file.url;

        if (audio) {
            audio.addEventListener('loadedmetadata', this.handleLoadedMetadata);
            audio.addEventListener('timeupdate', this.handleTimeUpdate);
        }
    }

    componentWillUnmount() {
        const audio = this.audioRef.current;
        if (audio) {
            audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
            audio.removeEventListener('timeupdate', this.handleTimeUpdate);
        }
        URL.revokeObjectURL(this.url); 
    }

    handleLoadedMetadata = () => {
        const audio = this.audioRef.current;
        this.setState({ duration: audio.duration });
        console.log('Duration ', audio.duration);
    };

    handleTimeUpdate = () => {
        const audio = this.audioRef.current;
        this.setState({ currentTime: audio.currentTime });
        console.log('Current time ', audio.currentTime);
    };

    handleSeek = (seconds) => {
        const audio = this.audioRef.current;
        const { duration } = this.state;
        if (audio) {
            const newTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration);
            audio.currentTime = newTime;
            this.setState({ currentTime: newTime });
        }
    };

    handleTimeChange = (newTime) => {
        const audio = this.audioRef.current;
        if (audio) {
            audio.currentTime = newTime;
            this.setState({ currentTime: newTime });
        }
    };

    // New function to update currentTime in the parent
    setCurrentTime = (time) => {
        this.setState({ currentTime: time });
        this.handleTimeChange(time); // Update the audio currentTime
    };

    render() {
        const { toggleAudioPlayer, setToggleAudioPlayer, file } = this.props;
        const { currentTime, duration } = this.state;

        return (
            <div
                className="animate-audioOpen absolute w-[350px]  md:w-[700px] h-[100px] border-2 border-[#7066E0] backdrop-blur-[10px] bg-[#7066E0]/50 rounded-[15px] top-[50px] left-[5px]  md:left-[50px] z-[9999] overflow-hidden"
            
            >
                <CloseOutlined
                    className="absolute top-2 right-2 text-white hover:text-gray transition duration-200"
                    onClick={() => {
                        setToggleAudioPlayer(!toggleAudioPlayer);
                    }}
                    onTouchStart={() => {
                        setToggleAudioPlayer(!toggleAudioPlayer);
                    }}
                />

                <Controlls
                    audioRef={this.audioRef}
                    handleSeek={this.handleSeek}
                    currentTime={currentTime}
                    duration={duration}
                    setCurrentTime={this.setCurrentTime} 
                />

                <ProgressBar currentTime={currentTime} duration={duration} setCurrentTime={this.handleTimeChange} />

                {file && (
                    <audio ref={this.audioRef} src={this.url} />
                )}
            </div>
        );
    }
}

export default AudioOpen;
