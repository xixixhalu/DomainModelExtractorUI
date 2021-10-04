import React from 'react'
// import CodeMirror from '@uiw/react-codemirror';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import {Redirect} from 'react-router-dom'
import Zoom from 'react-medium-image-zoom'
import axios from 'axios'


import './DME.scss'
import 'react-medium-image-zoom/dist/styles.css'
import 'codemirror/lib/codemirror.css'
import { useState } from 'react';

const DMEWrapper = () => {
    const [userInput, setUserInput] = useState("As a user, I can input win conditions here.")
    const [domainModelImg, setDomainModelImg] = useState(""); //https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg
    const [detectionResult, setDetectionResult] = useState("");

    const [disableCheck, setCheckDisable] = useState(false);
    const [disableGenerate, setGenerateDisable] = useState(false);

    const getDetectionResult = () => {
        setCheckDisable(true)
        setDetectionResult("")
        axios
            .post("/detect", {
                userInput: userInput
            })
            .then(response => {
                if (response.status === 200) {
                    setDetectionResult(response.data.option)
                } else {
                    alert("Get Model Image Failed!");
                    console.error(response)
                }
                setCheckDisable(false)
            })
    }

    const getModelImge = () => {
        setGenerateDisable(true)
        setDomainModelImg("")
        axios
            .post("/model", {
                userInput: userInput
            })
            .then(response => {
                if (response.status === 200) {
        		    let format = response.data.format;
        		    let content = response.data.content;
                    setDomainModelImg('data:image/'+format+';base64,'+content)
                } else {
                    alert("Get Model Image Failed!");
                    console.error(response)
                }
                setGenerateDisable(false)
            })
    }

    return (<>
        <div className="DMEWrapper">
            {/* <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Domain Model Extractor
                        <span className="fw-lighter version">&nbsp;	beta</span></a>
                </div>
            </nav> */}
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col">
                        <div className="row input-row">
                            <div className="DMEHeaer">Input win conditions here:</div>
                            <div className="CodeMirrorWrapper">
                                <CodeMirror
                                    value={userInput}
                                    options={{
                                        lineNumbers: true,
                                        lineWrapping: true
                                      }}
                                    onChange={(editor, data, value) => {
                                        //console.log('CodeMirror value:', value);
                                        setUserInput(value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row"></div>
                        <div className="row control-row">
                            <div className="col text-center">
                                <button id="misspellingDetectButton" className="btn btn-sm btn-primary" onClick={getDetectionResult} disabled={disableCheck} >
                                    Check Win Conditions
                                </button>
                            </div>
                            <div className="col text-center">
                                <button id="domainGenerateButton" className="btn btn-sm btn-success" onClick={getModelImge} disabled={disableGenerate} >
                                    Generate Domain Model
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row output-row DetectionResultWrapper">
                            <div className="DMEHeaer">Detection Result</div>

                            <div className="spinner-border" role="status" style={{display: disableCheck ? 'block' : 'none' }}/>
                            <textarea
                                id="output_area"
                                className="DetectionResultTextArea"
                                value={detectionResult}
                                readOnly
                            />
                        </div>
                        <div className="row"></div>
                        <div className="row image-row ModelWrapper">
                            <div className="DMEHeaer">Domain Model</div>
                            <div className="img_area text-center">
                                <div className="spinner-border" role="status" style={{display: disableGenerate ? 'block' : 'none' }}/>
                                <Zoom zoomMargin={40}>
                                    <img
                                        src={domainModelImg}
                                        alt=""
                                        className="img"
                                        style={{ height: '100%' }}
                                    />
                                </Zoom>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

const DME = () => {
    return (
        <>
            {localStorage.usertoken ? <DMEWrapper /> : <Redirect to='/login' />}
        </>
    )
}

export default DME
