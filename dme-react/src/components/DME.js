import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import Zoom from 'react-medium-image-zoom'

import './DME.scss'
import 'react-medium-image-zoom/dist/styles.css'

const DME = () => {

    return (<>
        <div className="DMEWrapper">
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Domain Model Extractor
                        <span className="fw-lighter">&nbsp;	beta</span></a>
                </div>
            </nav>
            <div className="row align-items-start">
                <div className="col">
                    <div className="DMEHeaer">Enter win conditions here:</div>
                    <div className="CodeMirrorWrapper">
                        <CodeMirror
                            value="win conditions here "
                            minHeight="500px"
                            theme="dark"
                            autoFocus={true}
                            onChange={(value, viewUpdate) => {
                                console.log('CodeMirror value:', value);
                            }}
                        />
                    </div>


                    <div className="row control-row text-center">
                        <div className="col">
                            <button id="misspellingDetectButton" className="btn btn-sm btn-primary">
                                Check Win Conditions
                            </button>
                        </div>
                        <div className="col">
                            <button id="domainGenerateButton" className="btn btn-sm btn-success">
                                Generate Domain Model
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="row output-row h-50">
                        <div className="DMEHeaer">Detection Result</div>
                        <textarea id="output_area" readOnly> </textarea>
                    </div>
                    <div className="row image-row h-50 ModelWrapper">
                        <div className="DMEHeaer">Domain Model</div>
                        <Zoom zoomMargin={40}>
                            <img
                                src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                                alt="Golden Gate Bridge"
                                className="img"
                                style={{ width: '100%' }}
                            />
                        </Zoom>

                    </div>
                </div>

            </div>
        </div>
    </>
    )
}

export default DME