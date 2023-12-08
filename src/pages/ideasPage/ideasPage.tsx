import './ideasPage.css';

const IdeasPage = () => {
    return (
        <div>
            <h1>Here are some black and white pictures you can try to recreate</h1>

            <div className="ideas">

                <div className="ryan-gossling">
                    <div className="idea">
                        <img src="/bw1.jpg" alt="idea" />
                    </div>
                    <div className="idea">
                        <img src="/bw2.jpg" alt="idea" />
                    </div>
                </div>
                
                <div className="taxi-driver">
                    <div className="idea">
                        <img src="/bw3.jpg" alt="idea" />
                    </div>
                    <div className="idea">
                        <img src="/bw4.jpg" alt="idea" />
                    </div>
                </div>

                <div className="fight-club">

                    <div className="idea">
                        <img src="/bw5.jpg" alt="idea" />
                    </div>

                    <div className="idea">
                        <img src="/bw6.jpg" alt="idea" />
                    </div>

                </div>

                <div className="american-psycho">

                    <div className="idea">
                        <img src="/bw7.jpg" alt="idea" />
                    </div>

                    <div className="idea">
                        <img src="/bw8.jpg" alt="idea" />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default IdeasPage;