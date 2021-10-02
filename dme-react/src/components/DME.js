import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import Zoom from 'react-medium-image-zoom'
import axios from 'axios'


import './DME.scss'
import 'react-medium-image-zoom/dist/styles.css'
import { useState } from 'react';

const DME = () => {
    const [userInput, setUserInput] = useState("Input win conditions here")
    const [domainModelImg, setDomainModelImg] = useState("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg");
    const [detectionResult, setDetectionResult] = useState("happy");

    const getDetectionResult = () => {
        const user = {
            name: "happy"
        };
        axios
            .post("/detect", {
                userInput: userInput
            })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                } else {
                    alert("Get Model Image Failed!");
                    console.error(response)
                }
            })
    }

    const getModelImge = () => {
        axios
            .post("/model", {
                userInput: userInput
            })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    setDomainModelImg(response.data.img)
                } else {
                    alert("Get Model Image Failed!");
                    console.error(response)
                }
            })
    }

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
                            value={userInput}
                            minHeight="500px"
                            theme="dark"
                            autoFocus={true}
                            onChange={(value, viewUpdate) => {
                                console.log('CodeMirror value:', value);
                                setUserInput(value)
                            }}
                        />
                    </div>

                    <div className="row control-row text-center">
                        <div className="col">
                            <button id="misspellingDetectButton" className="btn btn-sm btn-primary" onClick={getDetectionResult}>
                                Check Win Conditions
                            </button>
                        </div>
                        <div className="col">
                            <button id="domainGenerateButton" className="btn btn-sm btn-success" onClick={getModelImge}>
                                Generate Domain Model
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="row output-row DetectionResultWrapper">
                        <div className="DMEHeaer">Detection Result</div>
                        <textarea id="output_area" className="DetectionResultTextArea" />
                    </div>
                    <div className="row image-row  ModelWrapper">
                        <div className="DMEHeaer">Domain Model</div>
                        <Zoom zoomMargin={40}>
                            <img
                                src={domainModelImg}
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