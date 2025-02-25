import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import LoaderAnimation from '../Animation/Loading_File.json'; 
import './Loading_Animation.css'

function Loading_Animation() { 
    const [showAnimation, setShowAnimation] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimation(false);
        }, 1300);

        return () => clearTimeout(timer); 
    }, []);

    return (
        <div>
            {showAnimation && (
                <>
                    <div className='loading_animation'>
                        <Lottie 
                            animationData={LoaderAnimation} 
                            loop={true}
                            style={{ width: '110px', height: '110px' }} 
                        /> 
                    </div>
                </>
                
            )}
        </div>
    );
}

export default Loading_Animation;
