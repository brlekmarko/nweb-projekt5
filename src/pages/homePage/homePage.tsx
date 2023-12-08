import './homePage.css';
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from 'react';


const HomePage = () => {

    const webcamRef = useRef<Webcam | null>(null);
    const [imageOriginal, setImageOriginal] = useState<string | null>(null);
    const [imageTransformed, setImageTransformed] = useState<string | null>(null);
    const [numberOfPictures, setNumberOfPictures] = useState<number>(0);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = (webcamRef.current as Webcam).getScreenshot() as string;
            setImageOriginal(imageSrc);
            transformImage(imageSrc);
            fetch("/incrementNumberOfPictures", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }).catch();
            setNumberOfPictures(numberOfPictures + 1);
        }
    }, [webcamRef, numberOfPictures]);

    const transformImage = (imageSrc: string) => {
        // adds a black and white filter to the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            if (context) {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }
                context.putImageData(imageData, 0, 0);
                setImageTransformed(canvas.toDataURL('image/jpeg'));
            }
        }
    }

    const retry = () => {
        setImageOriginal(null);
        setImageTransformed(null);
    }

    const download = () => {
        const link = document.createElement('a');
        link.href = imageTransformed as string;
        link.download = 'imageTransformed.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function askForNotificationPermission() {
        // push notifications
        if ("Notification" in window && "serviceWorker" in navigator) {
            Notification.requestPermission(async function(res) {
            if (res === 'granted') {
                console.log('Notification permission granted.');
                setupPushSubscription();
            } else {
                console.log('Unable to get permission to notify.');
            }
            });
        }
    }
        
    async function setupPushSubscription() {
        try{
            let reg= await navigator.serviceWorker.ready;
            let sub= await reg.pushManager.getSubscription();
        
            if (sub === null) {
        
            // ask server for public key
            let result = await fetch("/publicVapidKey", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let vapidPublicKey = await result.json();
        
            sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey.publicKey,
            });

            let subscription = await fetch("/saveSubscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscription: sub }),
            });
            console.log("Subscription saved successfully");
        
            } else { 
            console.log("You are already subscribed"); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetch("/numberOfPictures", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                },
                }).then(res => res.json()).then(res => {
                    setNumberOfPictures(res.numOfPictures);
                }).catch();
    }, []);

    return(
        <div>
            <div className="text-center">
                <h1 style={{textAlign: 'center'}}>Take a picture using your camera and it will be transformed using the black and white filter</h1>
                <h1 style={{textAlign: 'center'}}>You can get some cool ideas from <a href="/ideas">here</a></h1>
                <h2 style={{textAlign: 'center'}}>Number of pictures taken globally: {numberOfPictures}</h2>
                <h2 style={{textAlign: 'center'}}>Subscribe to notifications to get notified when someone takes a picture <button className="button" onClick={askForNotificationPermission}>Subscribe</button></h2>
            </div>
            <div className='bothImages'>

                {imageOriginal ? 

                    <div className='imageDiv'>
                        <img src={imageOriginal} alt="imageOriginal" height={500} width={500} style={{border: '1px solid black'}}/>
                        <button className="button" onClick={retry}>Retry</button>
                    </div> 
                : 
                    <div className='imageDiv'>
                        <Webcam height={500} width={500} ref={webcamRef} screenshotFormat="image/jpeg" style={{border: '1px solid black', backgroundColor: 'white'}}/> 
                        <button className="button" onClick={capture}>Capture photo</button>
                    </div>
                }

                {imageTransformed ? 

                    <div className='imageDiv'>
                        <img src={imageTransformed} alt="imageTransformed" height={500} width={500} style={{border: '1px solid black'}}/> 
                        <button className="button" onClick={download}>Download</button>
                    </div>
                : 
                    <div className='imageDiv'>
                        <div style={{border: '1px solid black', height: '500px', width: '500px', backgroundColor: 'white'}}><h1>Image will be transformed here</h1></div>
                        <button className="button" onClick={download} disabled>Download</button>
                    </div>
                }

            </div>

        </div>
    )
}


export default HomePage;