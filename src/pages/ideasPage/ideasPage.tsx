import './ideasPage.css';

const IdeasPage = () => {
    return (
        <div>
            <div className="text-center">
                <h1 style={{textAlign: 'center'}}>Here are some black and white pictures you can try to recreate</h1>
                <h1 style={{textAlign: 'center'}}><a href="/">Home</a></h1>
            </div>

            <div className="ideas">

                <div className="ryan-gossling">
                    <div className="idea">
                        <img src="https://i.pinimg.com/originals/be/1a/dd/be1add52a129e10ecb8283e62d3413d2.jpg" alt="idea" />
                    </div>
                    <div className="idea">
                        <img src="https://w0.peakpx.com/wallpaper/1001/382/HD-wallpaper-ryan-gosling-hey-girl-i-m-home-hollywood-oscars-ryan-gosling-black-and-white-actor.jpg" alt="idea" />
                    </div>
                </div>
                
                <div className="taxi-driver">
                    <div className="idea">
                        <img src="https://api.time.com/wp-content/uploads/2016/02/taxi-driver.jpeg" alt="idea" />
                    </div>
                    <div className="idea">
                        <img src="https://people.com/thmb/M587Bge2X5gk_5pjDOYzpp5v5ng=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(511x0:513x2)/taxi-driver-1024-c17ee860e8e24dfcbe257c2ef8d05194.jpg" alt="idea" />
                    </div>
                </div>

                <div className="fight-club">

                    <div className="idea">
                        <img src="https://miro.medium.com/v2/resize:fit:475/1*sKdz6jOdHuax1oPugpam3g.jpeg" alt="idea" />
                    </div>

                    <div className="idea">
                        <img src="https://i.pinimg.com/474x/28/a3/da/28a3daa4fac278f67d1d9972ba4646c1.jpg" alt="idea" />
                    </div>

                </div>

                <div className="american-psycho">

                    <div className="idea">
                        <img src="https://i1.sndcdn.com/artworks-i1HipgDlHrjOHipm-taM4Fg-t500x500.jpg" alt="idea" />
                    </div>

                    <div className="idea">
                        <img src="https://i.pinimg.com/564x/63/1a/66/631a663da9bd4b52422b953db91ccfe5.jpg" alt="idea" />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default IdeasPage;